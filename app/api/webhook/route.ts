import { db } from '@/lib/firebase';
import { collection, query, where, getDocs, addDoc } from 'firebase/firestore';
import { NextRequest, NextResponse } from 'next/server';
import { useAuth } from '@clerk/nextjs';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
const { userId } = useAuth();
export async function POST(req: NextRequest, res: NextResponse) {
  const payload = await req.text();
  const sig = req.headers.get('Stripe-Signature')!;

  try {
    const event = stripe.webhooks.constructEvent(
      payload,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );

    console.log('Received event type:', event.type);

    // Handle both invoice payment and charge succeeded events
    if (event.type === 'invoice.payment_succeeded' || event.type === 'charge.succeeded') {
      const data = event.data.object;
      let userEmail, planId, amount, clerkUserId;

      if (event.type === 'invoice.payment_succeeded') {
        const invoice = data as Stripe.Invoice;
        userEmail = invoice.customer_email;
        planId = invoice.lines.data[0].plan?.product;
        amount = invoice.amount_due;
      } else {
        // charge.succeeded event
        const charge = data as Stripe.Charge;
        userEmail = charge.billing_details.email;
        planId = charge.metadata.product_id || charge.payment_intent;
        amount = charge.amount;
      }

      // Assuming you have a way to get the Clerk user ID
      clerkUserId = userId;

      if (!userEmail || !planId || !amount || !clerkUserId) {
        throw new Error('Missing required payment data');
      }

      // Check if the user already exists in the "Subscriptions" collection
      const subscriptionsRef = collection(db, 'Subscriptions');
      const q = query(subscriptionsRef, where('userId', '==', clerkUserId));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        // Add new subscription document with correct key names
        await addDoc(subscriptionsRef, {
          email: userEmail,
          planId: planId,
          userId: clerkUserId,
          price: amount,
          createdAt: new Date(),
        });
        console.log('Subscription added to Firebase');
      } else {
        console.log('Subscription already exists for this user');
      }

      return NextResponse.json({
        status: 'success',
        data: {
          email: userEmail,
          planId: planId,
          userId: clerkUserId,
          price: amount
        }
      });
    }
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json({
      status: 'error',
      message: error instanceof Error ? error.message : 'Unknown error',
    }, { status: 400 });
  }
}