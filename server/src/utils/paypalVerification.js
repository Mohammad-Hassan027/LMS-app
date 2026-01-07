import axios from 'axios';

export const verifyPayPalSignature = async (req) => {
  try {
    const { PAYPAL_CLIENT_ID, PAYPAL_CLIENT_SECRET, PAYPAL_WEBHOOK_ID } =
      process.env;

    // 1. Get an Access Token from PayPal
    const auth = Buffer.from(
      `${PAYPAL_CLIENT_ID}:${PAYPAL_CLIENT_SECRET}`
    ).toString('base64');
    const tokenResponse = await axios.post(
      'https://api-m.sandbox.paypal.com/v1/oauth2/token', // Change to 'api-m.paypal.com' for Live
      'grant_type=client_credentials',
      {
        headers: {
          Authorization: `Basic ${auth}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );
    const accessToken = tokenResponse.data.access_token;

    // 2. Prepare the Verification Payload
    // PayPal expects these specific headers to verify the sender
    const verificationPayload = {
      auth_algo: req.headers['paypal-auth-algo'],
      cert_url: req.headers['paypal-cert-url'],
      transmission_id: req.headers['paypal-transmission-id'],
      transmission_sig: req.headers['paypal-transmission-sig'],
      transmission_time: req.headers['paypal-transmission-time'],
      webhook_id: PAYPAL_WEBHOOK_ID,
      webhook_event: req.body, // The exact body you received
    };

    // 3. Call PayPal to Verify
    const response = await axios.post(
      'https://api-m.sandbox.paypal.com/v1/notifications/verify-webhook-signature', // Change to 'api-m.paypal.com' for Live
      verificationPayload,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    // 4. Return True if PayPal says "SUCCESS"
    return response.data.verification_status === 'SUCCESS';
  } catch (error) {
    console.error(
      'PayPal Signature Verification Failed:',
      error.response ? error.response.data : error.message
    );
    return false;
  }
};
