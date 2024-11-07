// api/webhook.js

import { Client } from 'coinbase-commerce-node';
import { Charge } from 'coinbase-commerce-node/resources';

// Coinbase Commerce webhook secret key
const webhookSecret = 'your-webhook-signature-secret';  // Replace with your actual secret key

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const sigHeader = req.headers['x-cc-webhook-signature'];
    const body = req.body;
    
    try {
      // Verify the webhook signature
      const isValid = verifySignature(sigHeader, body, webhookSecret);
      if (!isValid) {
        return res.status(400).json({ error: 'Invalid signature' });
      }
      
      // Parse the webhook event and check the payment status
      const event = JSON.parse(body);
      
      if (event.type === 'charge:confirmed') {
        // Handle confirmed payment
        console.log('Payment confirmed!', event.data);
        // Update your database or notify the user
      }
      
      res.status(200).send('OK');
    } catch (error) {
      console.error('Error handling webhook:', error);
      res.status(500).send('Internal Server Error');
    }
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}

// Helper function to verify the webhook signature
function verifySignature(signature, body, secret) {
  const crypto = require('crypto');
  const hmac = crypto.createHmac('sha256', secret);
  hmac.update(body);
  const computedSignature = hmac.digest('hex');
  
  return computedSignature === signature;
}
