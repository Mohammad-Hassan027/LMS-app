import { Webhook } from 'svix';
import { clerkClient } from '@clerk/express';

export const handleClerkWebhook = async (req, res) => {
  const SIGNING_SECRET = process.env.CLERK_WEBHOOK_SECRET;

  if (!SIGNING_SECRET) {
    throw new Error(
      'Error: Please add CLERK_WEBHOOK_SECRET from Clerk Dashboard to .env'
    );
  }

  // Create new Svix instance with secret
  const wh = new Webhook(SIGNING_SECRET);

  // Get headers and body
  const headers = req.headers;
  const payload = req.body.toString(); // Convert the raw buffer to a string for verification

  // Verify payload
  let evt;
  try {
    evt = wh.verify(payload, headers);
  } catch (err) {
    return res.status(400).json({
      success: false,
      message: 'Webhook verification failed',
    });
  }

  const { id } = evt.data;
  const eventType = evt.type;

  // HANDLE USER CREATION
  if (eventType === 'user.created') {
    await clerkClient.users.updateUserMetadata(id, {
      publicMetadata: {
        role: 'student',
      },
    });
    console.log(`User ${id} assigned role: student`);
  }

  return res.status(200).json({
    success: true,
    message: 'Webhook received',
  });
};
