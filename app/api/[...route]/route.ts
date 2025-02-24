import { Hono } from "hono";
import { handle } from "hono/vercel";
import { HTTPException } from "hono/http-exception";

import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";

import { getProcessedImage, postImage } from "../helpers/apiHelper";
import { authMiddleware } from "@/middleware/auth";

import { clerkClient } from "@clerk/nextjs/server";
import Stripe from "stripe";
import { cors } from "hono/cors";
import { ClerkAddMetaData } from "../helpers/clerk-fetch-user";
import dayjs from "dayjs";

export const runtime = "nodejs";

const app = new Hono().basePath("/api");
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);
app.use(
  "*",
  cors({
    origin: `${process.env.NEXT_PUBLIC_API_BASE_URL}`,
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["POST", "GET", "OPTIONS"],
    credentials: true,
  })
);
app.use("/api/*", authMiddleware);

app.post("/background-removal", async (c) => {
  try {
    const { image_url, userId, privateMetadata } = await c.req.json();
    if (!image_url) {
      throw new HTTPException(401, { message: "No image found" });
    }

    const imagePathDownload = await postImage(
      image_url,
      userId,
      privateMetadata
    );
    return c.json({ imagePathDownload });
  } catch (error) {
    return c.json({ error: error }, error || 500);
  }
});

app.get("/retrieve-removed-image/:id", async (c) => {
  try {
    const { id } = c.req.param();

    const data = await getProcessedImage(id);

    return c.json({ data });
  } catch (error) {
    return c.json({ error: error });
  }
});

// Upload endpoint to store the file in S3 bucket returns public URL
app.post("/upload", async (c) => {
  const body = await c.req.parseBody();
  const file = body.file as File;

  if (!file) {
    return c.json({ error: "No file uploaded" }, 400);
  }

  // Convert file to Buffer
  const bytes = await file.arrayBuffer();
  // const buffer = new Uint8Array(bytes);
  const buffer = Buffer.from(bytes);

  // Define storage details
  const storageName = "local-storage"; // Custom storage name
  const imageFolder = "uploads"; // Folder where images are stored
  const fileName = `${Date.now()}-${file.name.replace(/\s+/g, "_")}`; // Unique filename
  const key = `uploads/${fileName}`; // S3 key

  // Initialize the S3 client using your environment variables
  const s3 = new S3Client({
    region: process.env.AWS_REGION,

    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
    },
  });

  // Set up the S3 upload parameters
  const params = {
    Bucket: process.env.AWS_S3_BUCKET_NAME, // Your bucket name
    Key: key, // e.g., "uploads/1625234875123-filename.png"
    Body: buffer,
    ContentType: file.type, // e.g., "image/jpeg"
  };

  // cleanup method
  // const cleanup = async () => {
  //   if (fs.existsSync(filePath)) {
  //     await fs.promises.unlink(filePath);
  //   }
  // };

  // const cleanUpImage = setTimeout(() => {
  //   cleanup();
  //   clearTimeout(cleanUpImage);
  // }, 5000);
  try {
    // Upload the file to S3 and wait for the promise to resolve
    await s3.send(new PutObjectCommand(params));
    const publicUrl = `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;

    // uploadResult.Location contains the public URL for the file
    return c.json({ publicUrl: publicUrl, s3Key: key }, 200);
  } catch (error) {
    console.error("Error uploading to S3:", error);
    return c.json({ error: error || "Error uploading to S3" }, 500);
  }
});

// Route to update user metadata
app.post("/created-free-user", async (c) => {
  const props = await c.req.json();
  const client = await clerkClient();

  if (!props.userId) {
    return c.json({ success: false, error: "User not found" }, 401);
  }
  await client.users.updateUserMetadata(props.userId, {
    privateMetadata: {
      ...props,
    },
  });

  return c.json({ success: true }, 200);
});

app.post("/create-stripe-checkout", async (c) => {
  const { lineItems, user, userId } = await c.req.json();

  if (!userId) {
    return c.json({ sessionId: null, sessionError: "User not found" });
  }

  const session = await stripe.checkout.sessions.create({
    line_items: lineItems,
    mode: "subscription",
    success_url: `${process.env.NEXT_PUBLIC_API_BASE_URL}/checkout?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.NEXT_PUBLIC_API_BASE_URL}`,
    customer_email: user?.email,
  });

  return c.json({ sessionId: session.id, sessionError: null });
});

app.post("/retrieve-stripe-session", async (c) => {
  const { sessionId, userId, privateMetadata } = await c.req.json();

  if (!sessionId)
    return c.json({ success: false, error: "Session ID not provided" });

  if (!userId)
    return c.json({ success: false, error: "User needs to sign in" });

  const previousCheckoutSessionIds = Array.isArray(
    privateMetadata?.checkout_session_ids
  )
    ? privateMetadata?.checkout_session_ids
    : [];

  if (previousCheckoutSessionIds.includes(sessionId)) {
    return c.json({
      success: true,
      error: null,
    });
  }

  const session = await stripe.checkout.sessions.retrieve(sessionId, {
    expand: ["subscription"],
  });

  await ClerkAddMetaData({
    subscription_type: "Pro",
    api_call_count: 0,
    checkout_session_ids: [...previousCheckoutSessionIds, session.id],
    stripe_customer_id: session.customer,
    stripe_subscription_id:
      typeof session.subscription === "string"
        ? session?.subscription
        : session?.subscription?.id,
    stripe_current_period_end:
      typeof session.subscription === "string"
        ? undefined
        : session.subscription?.current_period_end,
  });

  return c.json({
    success: true,
    error: null,
    sessionData: session,
  });
});

app.post("/cancel-stripe-subscription", async (c) => {
  const { userId, privateMetadata } = await c.req.json();
  const currentTimestampSeconds = Math.floor(Date.now() / 1000);
  if (!userId)
    return c.json({ success: false, error: "User needs to sign in" });

  if (!privateMetadata?.stripe_subscription_id) {
    return c.json({ success: false, error: "No active subscription" });
  }

  const subscription = await stripe.subscriptions.retrieve(
    privateMetadata?.stripe_subscription_id as string
  );

  if (subscription.status !== "canceled") {
    try {
      await stripe.subscriptions.cancel(
        privateMetadata.stripe_subscription_id as string
      );
      console.log("Subscription has been cancelled.");
      // return c.json({ success: true, error: null,message: "Subscription has been cancelled." });
    } catch (error) {
      console.error("Error cancelling subscription:", error);
      // Optionally, return an error here if cancellation is critical.
    }
  } else {
    console.log(
      "Subscription is already cancelled. You can continue using the service."
    );

    // return c.json({
    //   success: true,
    //   error: null,
    //   message: "Subscription is already cancelled. You can continue using the service.",
    // });
  }

  if (
    (privateMetadata.stripe_current_period_end as number) >=
    currentTimestampSeconds
  ) {
    return c.json({
      success: true,
      error: null,
      message: `Subscription is still active. User can continue using the service until the period ends. ${dayjs
        .unix(privateMetadata?.stripe_current_period_end as number)
        .format("dddd-D-MMMM-YYYY")}`,
    });
  } else {
    // Subscription period has ended.
    // Store the customer ID before updating metadata.
    const stripeCustomerId = privateMetadata?.stripe_customer_id;

    // Optionally delete the customer from Stripe first.
    if (stripeCustomerId) {
      try {
        await stripe.customers.del(stripeCustomerId as string);
        console.log("Customer account deleted from Stripe.");
      } catch (error) {
        console.error("Error deleting customer from Stripe:", error);
        // Optionally, you can return an error here if deletion is critical.
      }
    }

    // Update Clerk metadata to switch the user to the "Free" plan.
    await ClerkAddMetaData({
      subscription_type: "Free",
      api_call_count: 0,
      stripe_customer_id: null,
      checkout_session_ids: null,
      stripe_subscription_id: null,
      created_account_timestamp: null,
      stripe_current_period_end: null,
    });
    console.log("Metadata updated: User is now on the Free plan.");

    return c.json({
      success: true,
      error: null,
      message: "Subscription expired. User has been downgraded to Free.",
    });
  }
});

app.get("/admin", async (c) => {
  return c.json({ message: "Oh wow you found me" });
});

export const GET = handle(app);
export const POST = handle(app);
