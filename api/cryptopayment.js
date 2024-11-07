// api/cryptopayment.js

import { Client } from 'coinbase-commerce-node';
import { Charge } from 'coinbase-commerce-node/resources';

// Initialize Coinbase Commerce with your API key
Client.init('1dd3497d-21b0-4d95-ad1a-a2a101d37901'); // Replace with your actual Coinbase API key

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { amount, product, currency } = req.body; // Get data from the request

    try {
      // Create a charge for the payment
      const chargeData = {
        name: product,
        description: `Payment for ${product}`,
        local_price: {
          amount: amount.toString(), // Amount in smallest unit of currency (e.g., USD cents)
          currency: currency, // Currency (USD, EUR, etc.)
        },
        pricing_type: 'fixed_price',
        redirect_url: 'https://your-website.com/success',  // Replace with your success URL
        cancel_url: 'https://your-website.com/cancel',    // Replace with your cancel URL
      };

      // Create the charge using Coinbase API
      const charge = await Charge.create(chargeData);

      // Return the payment URL
      res.status(200).json({ paymentUrl: charge.hosted_url });
    } catch (error) {
      console.error('Error creating charge:', error);
      res.status(500).json({ error: 'Payment creation failed' });
    }
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}
