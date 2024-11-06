import Stripe from 'stripe';
import { NextResponse, NextRequest } from 'next/server';
import { stat } from 'fs';
import { redirect } from 'next/navigation';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: NextRequest, res: NextResponse) {
  const payload = await req.text();
  const response = JSON.parse(payload);
  const sig = req.headers.get('Stripe-Signature')!;

  const dateTime = new Date(response?.created * 1000).toLocaleDateString();
  const timeString = new Date(response?.created * 1000).toLocaleDateString();

  const userEmail = response.object.customer_email;
  const planId = response.object.lines.data[0].plan.product;

  try {
    const event = stripe.webhooks.constructEvent(
      payload,
      sig!,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
    console.log('Event:', event.type);
    return NextResponse.json({ status: 'success', event: console.log(`The user email: ${userEmail}`) });
  } catch (error) {
    return NextResponse.json({ status: 'error', error });
  }
}