import Stripe from 'stripe';

// kubectl create secret generic stripe-secret --from-literal STRIPE_KEY=sk_test_51MRFkBSAFdVQFI9TgHQNB9GMLPsenkyP6pSZmfwfIcId1TMIwMUDwz4WOWblSP5gEGoaUp7ONW7yCmTtHq9Dk9Bz002Cibv3KQ
// kubectl create secret generic stripe-secret-us --from-literal STRIPE_KEY_US=sk_test_51MRfMCJiMX8ZhNGDAyfFKeBkSPXwdf9QPHNIR3juAm2UBbBibVKfiFjXKSzMbrHf7dzAVHdZrlwhGJKywzBrEAkJ00CmM2ICJi

export const stripe = new Stripe(process.env.STRIPE_KEY_US!, {
  apiVersion: '2022-11-15',
});
