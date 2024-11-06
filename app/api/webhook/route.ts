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

    // Log entire event for debugging
    console.log('Webhook event:', JSON.stringify(event, null, 2));

    // Safely access properties using optional chaining
    const session = event.data.object as Stripe.Checkout.Session;
    const userEmail = session?.customer_email;
    const planId = session.line_items?.data?.[0]?.price?.product;
    
    // If you need the date/time
    const dateTime = event.created ? new Date(event.created * 1000).toLocaleDateString() : '';

    return NextResponse.json({ 
      status: 'success',
      data: {
        userEmail,
        planId,
        dateTime,
        eventType: event.type
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