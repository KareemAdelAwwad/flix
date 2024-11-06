import { db } from '@/lib/firebase';
import { collection, query, where, getDocs, addDoc } from 'firebase/firestore';
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
      let userEmail, planId, amount;

      if (event.type === 'invoice.payment_succeeded') {
        const invoice = data as Stripe.Invoice;
        userEmail = invoice.customer_email;
        planId = invoice.lines.data[0].plan?.product;
        amount = invoice.amount_due;
      } else {
        const charge = data as Stripe.Charge;
        userEmail = charge.billing_details.email;
        planId = charge.metadata.product_id || charge.payment_intent;
        amount = charge.amount;
      }

      if (!userEmail || !planId || !amount) {
        throw new Error('Missing required payment data');
      }

      // Check if subscription exists using email
      const subscriptionsRef = collection(db, 'Subscriptions');
      const q = query(subscriptionsRef, where('email', '==', userEmail));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        await addDoc(subscriptionsRef, {
          email: userEmail,
          planId: planId,
          price: amount,
          createdAt: new Date()
        });
        console.log('Subscription added to Firebase');
      } else {
        console.log('Subscription already exists for this user');
      }

      return NextResponse.json({
        status: 'success',
        data: { email: userEmail, planId, price: amount }
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