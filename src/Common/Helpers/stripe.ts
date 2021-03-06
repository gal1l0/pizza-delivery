/* eslint-disable class-methods-use-this */
import StripeInstance from 'stripe';
import env from '../Config/env';

interface ICharge {
  lineItems: {
    priceId: string;
    qty: number;
  }[];
  customer: string | null;
  payment_intent_data: {
    metadata: object
  };
}

interface ICustomer {
  email: string;
  name: string;
}

export default class Stripe {
  private stripeInstance: StripeInstance;

  constructor() {
    this.stripeInstance = new StripeInstance(env.STRIPE_KEY as string, {
      apiVersion: '2020-08-27',
    });
  }

  charge = async (raw: ICharge): Promise<any> => {
    console.log(raw.lineItems);
    const session = await this.stripeInstance.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: raw.lineItems as any,
      cancel_url: 'http://localhost:7000/cancel_url',
      success_url: 'http://localhost:7000/success_url',
      customer: raw.customer as string,
      payment_intent_data: raw.payment_intent_data as any,
    });
    return session;
  };

  createCustomer = async (raw: ICustomer): Promise<any> => {
    const stripeInstance = new StripeInstance(env.STRIPE_KEY as string, {
      apiVersion: '2020-08-27',
    });
    const result = await stripeInstance.customers.create(raw);
    return result;
  };

  createProduct = async (raw: any): Promise<any> => {
    const result = await this.stripeInstance.products.create(raw);
    return result;
  };

  createPrice = async (raw: any): Promise<any> => {
    const result = await this.stripeInstance.prices.create(raw);
    return result;
  };

  constructEvent = (raw: any, signature: string, secret: string): any => {
    const result = this.stripeInstance.webhooks.constructEvent(raw, signature, secret);
    return result;
  };

  getPaymentIntent = async (paymentIntentId: string): Promise<any> => {
    const result = await this.stripeInstance.paymentIntents.retrieve(paymentIntentId);
    return result;
  };
}
