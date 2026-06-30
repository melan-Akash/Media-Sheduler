import Stripe from 'stripe';
import { Response } from 'express';
import { User } from '../models/user.js';
import { AuthRequest } from '../middlewares/authMiddleware.js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '');

// POST /api/payment/create-checkout-session
export const createCheckoutSession = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { plan } = req.body;
    if (!['pro', 'agency'].includes(plan)) {
      res.status(400).json({ message: 'Invalid plan selected' });
      return;
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    // 1. Get or create Stripe customer
    let customerId = user.stripeCustomerId;
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        name: user.name,
        metadata: { userId: user.id.toString() }
      });
      customerId = customer.id;
      user.stripeCustomerId = customerId;
      await user.save();
    }

    // 2. Create the Price dynamically on Stripe
    const planPrice = plan === 'agency' ? 20.00 : 10.00;
    const planName = plan === 'agency' ? 'Agency Plan' : 'Pro Plan';
    
    const price = await stripe.prices.create({
      unit_amount: planPrice * 100, // in cents
      currency: 'usd',
      recurring: { interval: 'month' },
      product_data: {
        name: `Media Scheduler - ${planName}`
      }
    });

    // 3. Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ['card'],
      line_items: [
        {
          price: price.id,
          quantity: 1
        }
      ],
      mode: 'subscription',
      success_url: `http://localhost:5173/dashboard?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `http://localhost:5173/`,
      metadata: {
        userId: user.id.toString(),
        plan: plan
      }
    });

    res.json({ url: session.url });
  } catch (error: any) {
    console.error('Stripe checkout session error:', error);
    res.status(500).json({ message: error.message || 'Payment error' });
  }
};

// POST /api/payment/verify-session
export const verifySession = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { sessionId } = req.body;
    if (!sessionId) {
      res.status(400).json({ message: 'Session ID is required' });
      return;
    }

    // Retrieve the session from Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    if (!session) {
      res.status(400).json({ message: 'Invalid session' });
      return;
    }

    if (session.payment_status === 'paid') {
      const userId = session.metadata?.userId;
      const plan = session.metadata?.plan;
      const subscriptionId = session.subscription as string;

      if (userId && plan) {
        const user = await User.findById(userId);
        if (user) {
          user.subscriptionPlan = plan as any;
          user.subscriptionStatus = 'active';
          user.stripeSubscriptionId = subscriptionId;
          await user.save();

          res.json({
            success: true,
            user: {
              _id: user.id,
              name: user.name,
              email: user.email,
              subscriptionPlan: user.subscriptionPlan,
              subscriptionStatus: user.subscriptionStatus
            }
          });
          return;
        }
      }
    }

    res.status(400).json({ message: 'Session not paid or invalid data' });
  } catch (error: any) {
    console.error('Stripe verification error:', error);
    res.status(500).json({ message: error.message || 'Verification error' });
  }
};
