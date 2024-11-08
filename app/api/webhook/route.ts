import { db } from '@/lib/firebase';
import { collection, query, where, getDocs, addDoc, updateDoc } from 'firebase/firestore';
import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: NextRequest) {
  const payload = await req.text();
  const sig = req.headers.get('Stripe-Signature')!;

  try {
    const event = stripe.webhooks.constructEvent(
      payload,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );

    console.log('Received event type:', event.type);

    if (event.type === 'invoice.payment_succeeded' || event.type === 'charge.succeeded') {
      const data = event.data.object;
      let userEmail, amount;

      if (event.type === 'invoice.payment_succeeded') {
        const invoice = data as Stripe.Invoice;
        userEmail = invoice.customer_email;
        amount = invoice.amount_due;
      } else {
        const charge = data as Stripe.Charge;
        userEmail = charge.billing_details.email;
        amount = charge.amount / 100;
      }

      if (!userEmail || !amount) {
        throw new Error('Missing required payment data');
      }

      if (amount <= 0) {
        throw new Error('Invalid payment amount');
      }

      // Check if subscription exists using email
      const subscriptionsRef = collection(db, 'Subscriptions');
      const q = query(subscriptionsRef, where('email', '==', userEmail));
      const querySnapshot = await getDocs(q);

      try {
        if (querySnapshot.empty) {
          await addDoc(subscriptionsRef, {
            email: userEmail,
            price: amount,
            createdAt: new Date(),
            status: 'active',
            expirationDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
          });
          console.log('Subscription added to Firebase');
        } else {
          const doc = querySnapshot.docs[0];
          const currentData = doc.data();
          const expirationDate = currentData.expirationDate.toDate();

          if (expirationDate < new Date()) {
            await updateDoc(doc.ref, {
              price: amount,
              status: 'active',
              expirationDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
            });
            console.log('Subscription updated in Firebase');
          } else if (currentData.status === 'cancelled') {
            await updateDoc(doc.ref, {
              status: 'active'
            });
            console.log('Subscription reactivated');
          } else {
            console.log('Subscription already exists and is active');
          }
        }
      } catch (error) {
        console.error('Firebase operation failed:', error);
        throw new Error('Failed to update subscription data');
      }

      return NextResponse.json({
        status: 'success',
        data: { email: userEmail, price: amount }
      });
    }

    console.log('Unhandled event type:', event.type);
    return NextResponse.json({ status: 'success', message: 'Unhandled event type' });

  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json({
      status: 'error',
      message: error instanceof Error ? error.message : 'Unknown error',
    }, { status: 400 });
  }
}