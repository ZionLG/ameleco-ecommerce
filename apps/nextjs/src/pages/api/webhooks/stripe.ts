import type { NextApiRequest, NextApiResponse } from "next";
import Cors from "cors";
import { buffer } from "micro";
import Stripe from "stripe";

import { prisma } from "@ameleco/db";

import { env } from "~/env.mjs";

const cors = Cors({
  methods: ["POST"],
});
const stripe = new Stripe(env.STRIPE_SECRET_KEY, {
  // https://github.com/stripe/stripe-node#configuration
});

const webhookSecret: string = env.STRIPE_WEBHOOK_SECRET;
const webhookSecretTest: string = env.STRIPE_WEBHOOK_SECRET_TEST;

function runMiddleware(
  req: NextApiRequest,
  res: NextApiResponse,
  fn: Function,
) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result: any) => {
      if (result instanceof Error) {
        return reject(result);
      }

      return resolve(result);
    });
  });
}
export const config = {
  api: {
    bodyParser: false,
  },
};
const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    await runMiddleware(req, res, cors);
    const signature = req.headers["stripe-signature"] as string;

    const rawBody = await buffer(req);

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(
        rawBody,
        signature,
        webhookSecretTest,
      );
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      // On error, log and return the error message.
      if (err instanceof Error) console.log(err);
      console.log(`❌ Error message: ${errorMessage}`);
      res.status(500).json({ error: errorMessage });

      return undefined;
    }

    // Successfully constructed event.
    console.log("✅ Success:", event.id);

    // getting to the data we want from the event
    console.log(event);

    switch (event.type) {
      case "checkout.session.completed":
        console.log("IN!!");

        console.table(event.data.object.customer_details);
        if (event.data.object.customer) {
          console.log("id", event.data.object.customer);

          const userId = (event.data.object.customer as string).split("_")[1];
          console.log("GOTID!!", userId);
          if (userId) {
            const userCart = await prisma.cart.findUnique({
              where: { userId },
            });
            await prisma.cartItem.deleteMany({
              where: { cartId: userCart?.id },
            });
            await prisma.order.create({
              data: {
                paymentId: event.data.object.payment_intent as string,
                sessionId: event.data.object.id,
                userId: userId,
              },
            });
          }
        }

        break;
      case "checkout.session.expired":
        break;

      case "invoice.finalized": {
        const order = await prisma.order.update({
          where: {
            paymentId: event.data.object.payment_intent as string,
          },
          data: {
            invoiceId: event.data.object.id,
          },
        });
        console.log(order);
        break;
      }

      default:
        console.warn(`🤷‍♀️ Unhandled event type: ${event.type}`);
        break;
    }

    // Return a response to acknowledge receipt of the event.
    res.status(200).json({ received: true });
  } catch (err) {
    console.log(err);
    res.status(405).end();
  }
};

export default handler;
