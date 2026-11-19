import { db } from '@/lib/firebase';
import { collection, query, where, getDocs, addDoc, updateDoc } from 'firebase/firestore';
import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

let stripeClient: Stripe | null = null;
function getStripe(secretKey: string): Stripe {
  if (!stripeClient) {
    stripeClient = new Stripe(secretKey);
  }
  return stripeClient;
}

export async function POST(req: NextRequest) {
  const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!stripeSecretKey || !webhookSecret) {
    return NextResponse.json(
      {
        status: 'error',
        message: 'Missing required environment variables',
      },
      { status: 500 }
    );
  }

  const stripe = getStripe(stripeSecretKey);
  const payload = await req.text();
  const sig = req.headers.get('Stripe-Signature');

  if (!sig) {
    return NextResponse.json(
      {
        status: 'error',
        message: 'Missing Stripe-Signature header',
      },
      { status: 400 }
    );
  }

  try {
    const event = stripe.webhooks.constructEvent(payload, sig, webhookSecret);

    if (event.type === 'invoice.payment_succeeded' || event.type === 'charge.succeeded') {
      const data = event.data.object;
      let userEmail: string | null = null;
      let amount = 0;

      if (event.type === 'invoice.payment_succeeded') {
        const invoice = data as Stripe.Invoice;
        userEmail = invoice.customer_email;
        amount = (invoice.amount_due ?? 0) / 100;
      } else {
        const charge = data as Stripe.Charge;
        userEmail = charge.billing_details?.email ?? null;
        amount = (charge.amount ?? 0) / 100;
      }

      if (!userEmail || amount <= 0) {
        throw new Error('Missing or invalid payment data');
      }

      const subscriptionsRef = collection(db, 'Subscriptions');
      const q = query(subscriptionsRef, where('email', '==', userEmail));
      const querySnapshot = await getDocs(q);
      const nextExpiration = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

      if (querySnapshot.empty) {
        await addDoc(subscriptionsRef, {
          email: userEmail,
          price: amount,
          createdAt: new Date(),
          status: 'active',
          expirationDate: nextExpiration,
        });
      } else {
        const existingDoc = querySnapshot.docs[0];
        const currentData = existingDoc.data();
        const expirationDate = currentData.expirationDate?.toDate
          ? currentData.expirationDate.toDate()
          : new Date(0);

        if (expirationDate < new Date() || currentData.status === 'cancelled') {
          await updateDoc(existingDoc.ref, {
            price: amount,
            status: 'active',
            expirationDate: nextExpiration,
          });
        }
      }

      return NextResponse.json({
        status: 'success',
        data: { email: userEmail, price: amount },
      });
    }

    return NextResponse.json({ status: 'success', message: 'Unhandled event type' });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      {
        status: 'error',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 400 }
    );
  }
}