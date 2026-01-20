import { clerkClient } from '@clerk/express';
import InstructorRequest from '../../models/InstructorRequest.js';
import { asyncHandler } from '../../utils/asyncHandler.js';
import { ApiResponse } from '../../utils/ApiResponse.js';
import { transporter } from '../../utils/emailTransporter.js';

const { GMAIL_USER } = process.env;

export const getActiveInstructors = asyncHandler(async (req, res) => {
  const response = await clerkClient.users.getUserList({
    limit: 500,
  });

  // Handle potential pagination structure from Clerk SDK
  const users = response.data || response;

  const instructors = users.filter(
    (user) => user.publicMetadata?.role === 'instructor'
  );

  res
    .status(200)
    .json(new ApiResponse(200, instructors, 'Fetched active instructors'));
});

export const getInstructorRequests = asyncHandler(async (req, res) => {
  const requests = await InstructorRequest.find({ status: 'pending' });
  res
    .status(200)
    .json(new ApiResponse(200, requests, 'Fetched pending requests'));
});

export const requestToBeInstructor = asyncHandler(async (req, res) => {
  const { userId, email, userName, reason } = req.body;

  const existingRequest = await InstructorRequest.findOne({ userId });
  if (existingRequest) {
    return res
      .status(400)
      .json(new ApiResponse(400, null, 'Request already pending'));
  }

  const newRequest = await InstructorRequest.create({
    userId,
    email,
    userName,
    reason,
    status: 'pending',
  });

  res
    .status(201)
    .json(
      new ApiResponse(201, newRequest, 'Application submitted successfully')
    );
});

export const promoteToInstructor = asyncHandler(async (req, res) => {
  const { requestId, userId } = req.body;

  await clerkClient.users.updateUserMetadata(userId, {
    publicMetadata: { role: 'instructor' },
  });

  await InstructorRequest.findByIdAndUpdate(requestId, { status: 'approved' });

  try {
    const user = await clerkClient.users.getUser(userId);
    const userEmail = user.emailAddresses[0]?.emailAddress;

    console.log(userEmail);

    if (userEmail) {
      await transporter.sendMail({
        from: '"PathOS Team" <' + GMAIL_USER + '>',
        to: userEmail,
        subject: 'Instructor Application Approved! - PathOS',
        html: `
          <div style="font-family: sans-serif; line-height: 1.6; color: #333;">
            <h1>Welcome to the Instructor Team! 🎉</h1>
            <p>Hi ${user.firstName || 'there'},</p>
            <p>We are excited to let you know that your account has been upgraded to <strong>Instructor</strong> status.</p>
            <p>You can now:</p>
            <ul>
              <li>Create and publish new courses</li>
              <li>Manage your curriculum</li>
              <li>View student analytics</li>
            </ul>
            <p>Head over to your dashboard to get started:</p>
            <div style="margin: 20px 0;">
              <a href="https://path-os.vercel.app/instructor" 
                 style="background-color: #000; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">
                 Go to Instructor Dashboard
              </a>
            </div>
            <p>Best regards,<br/>The PathOS Team</p>
          </div>
        `,
      });
      console.log('Email sent successfully via Gmail');
    }
  } catch (emailError) {
    console.error('Failed to send promotion email:', emailError);
  }

  res
    .status(200)
    .json(
      new ApiResponse(200, null, 'User promoted to instructor successfully')
    );
});

export const rejectRequest = asyncHandler(async (req, res) => {
  const { requestId } = req.body;
  await InstructorRequest.findByIdAndUpdate(requestId, {
    status: 'rejected',
  });
  res.status(200).json(new ApiResponse(200, null, 'Request rejected'));
});

export const revokeInstructorRole = asyncHandler(async (req, res) => {
  const { userId } = req.body;

  await clerkClient.users.updateUserMetadata(userId, {
    publicMetadata: { role: 'student' },
  });

  try {
    const user = await clerkClient.users.getUser(userId);
    const userEmail = user.emailAddresses[0]?.emailAddress;

    if (userEmail) {
      await transporter.sendMail({
        from: '"PathOS Team" <' + GMAIL_USER + '>',
        to: userEmail,
        subject: 'Important: Instructor Privileges Revoked - PathOS',
        html: `
            <p>Hi ${user.firstName || 'User'},</p>
            <p>Your instructor privileges on PathOS have been revoked by an administrator.</p>
            <p>You can still access your account as a student.</p>
            <p>If you believe this is an error, please contact support.</p>
          `,
      });
    }
  } catch (err) {
    console.error('Email failed:', err);
  }

  res
    .status(200)
    .json(new ApiResponse(200, null, 'Instructor role revoked successfully'));
});

export const sendWarningToInstructor = asyncHandler(async (req, res) => {
  const { userId, reason } = req.body;

  if (!reason) {
    throw new ApiError(400, 'Warning reason is required');
  }

  try {
    const user = await clerkClient.users.getUser(userId);
    const userEmail = user.emailAddresses[0]?.emailAddress;

    if (userEmail) {
      await transporter.sendMail({
        from: '"PathOS Team" <' + GMAIL_USER + '>',
        to: userEmail,
        subject: 'Official Warning - PathOS',
        html: `
            <div style="border: 1px solid #eab308; padding: 20px; border-radius: 8px; background-color: #fffbeb;">
              <h2 style="color: #ca8a04; margin-top: 0;">⚠️ Official Warning</h2>
              <p>Hi ${user.firstName},</p>
              <p>We are writing to bring the following issue to your attention:</p>
              <blockquote style="border-left: 4px solid #ca8a04; padding-left: 15px; margin: 20px 0; color: #444;">
                ${reason}
              </blockquote>
              <p>Please address this issue immediately to maintain your instructor status.</p>
            </div>
          `,
      });
    }
  } catch (err) {
    console.error('Email failed:', err);
    return res
      .status(500)
      .json(new ApiResponse(500, null, 'Failed to send warning email'));
  }

  res.status(200).json(new ApiResponse(200, null, 'Warning sent successfully'));
});
