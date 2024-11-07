// api/cryptopayment.js

import { Client } from 'coinbase-commerce-node';
import { Charge } from 'coinbase-commerce-node/resources';

// Initialize Coinbase Commerce with your API key
Client.init('1dd3497d-21b0-4d95-ad1a-a2a101d37901'); // Replace with your actual Coinbase API key

export default async function handler(req, res) {
  // Set CORS headers to allow requests from your Blogger domain
  res.setHeader('Access-Control-Allow-Origin', '*');  // This allows all origins
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // If it's a preflight request, return early
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'POST') {
    const { amount, product, currency } = req.body;

    try {
      // Validate input
      if (!amount || !product || !currency) {
        return res.status(400).json({ error: 'Missing required parameters' });
      }

      // Create a charge for the payment
      const chargeData = {
        name: product,
        description: `Payment for ${product}`,
        local_price: {
          amount: amount.toString(),
          currency: currency,
        },
        pricing_type: 'fixed_price',
        redirect_url: 'https://your-website.com/success',  // Replace with your success URL
        cancel_url: 'https://your-website.com/cancel',    // Replace with your cancel URL
      };

      const charge = await Charge.create(chargeData);
      res.status(200).json({ paymentUrl: charge.hosted_url });
    } catch (error) {
      console.error('Error creating charge:', error);
      res.status(500).json({ error: 'Payment creation failed' });
    }
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}
