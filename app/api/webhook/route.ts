import Stripe from 'stripe';
import { NextResponse, NextRequest } from 'next/server';
import { stat } from 'fs';
import { redirect } from 'next/navigation';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

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
      let userEmail, planId, amount;

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

      if (!userEmail || !planId || !amount) {
        throw new Error('Missing required payment data');
      }

      console.log({
        eventType: event.type,
        userEmail,
        planId,
        amount
      });

      return NextResponse.json({
        status: 'success',
        data: {
          userEmail,
          planId,
          amount
        }
      });
    }

    // If we get here, it's an event type we don't handle
    console.log('Unhandled event type:', event.type);
    return NextResponse.json({ status: 'success', message: 'Unhandled event type' });

} catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json({ 
      status: 'error',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 400 });
}
}