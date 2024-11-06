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

    if (event.type !== 'invoice.payment_succeeded') {
      throw new Error('Unexpected event type');
    }
    
    // Extract data from invoice object
    const invoice = event.data.object as Stripe.Invoice;
    const userEmail = invoice.customer_email;
    const planId = invoice.lines.data[0].plan?.product;
    const amount = invoice.amount_due; // Amount in smallest currency unit

    console.log({
      userEmail, // "kareemadel10110@gmail.com"
      planId,    // "prod_RAUddbvqp0D378"
      amount     // 16500
    });

    return NextResponse.json({
      status: 'success',
      data: {
        userEmail,
        planId,
        amount
      }
    });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json({ 
      status: 'error',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 400 });
  }
}