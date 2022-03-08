import { NextApiRequest, NextApiResponse } from 'next';
import { Readable } from 'stream';
import Stripe from 'stripe';
import { stripe } from '../../services/stripe';
import { saveSubscription } from './_lib/manageSubscription';


async function buffer(readable: Readable) {
  const chucks = [];

  for await (const chunk of readable) {
    chucks.push(
      typeof chunk === 'string' ? Buffer.from(chunk) : chunk
    );
  }

  return Buffer.concat(chucks);
}

export const config = {
  api: {
    bodyParser: false,
  }
}

const relevantsEvents = new Set([
  'checkout.session.completed',
  'customer.subscription.updated',
  'customer.subscription.deleted'
]);

export default async function webHooks(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const buff = await buffer(req)
    const secret = req.headers['stripe-signature']

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(buff, secret, process.env.STRIPE_WEBHOOK_SECRET);
    } catch (e) {
      return res.status(400).send(`Webhook error: ${e.message}`);
    }

    const { type } = event;

    if (relevantsEvents.has(type)) {
      try {
        switch (type) {
          case 'customer.subscription.updated':
          case 'customer.subscription.deleted':
            const subscription = event.data.object as Stripe.Subscription;

            await saveSubscription(
              subscription.id,
              subscription.customer.toString(),
              false
            )

            break;
          case 'checkout.session.completed':

          const checkoutSession = event.data.object as Stripe.Checkout.Session

          await saveSubscription(
            checkoutSession.subscription.toString(),
            checkoutSession.customer.toString(),
            true
          )

            break;
          default:
            throw new Error('Unhandled event: ' + type);
        }
      } catch(err) {
        return res.json({ error: 'Webhook handler failed.' })
      }
    }

    res.json({ receive: true })
  } else {
    res.setHeader('Allow', 'POST')
    res.status(405).end('Method not allowed')
  }
}
