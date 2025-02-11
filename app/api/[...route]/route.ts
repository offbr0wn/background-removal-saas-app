import { Hono } from "hono";
import { handle } from "hono/vercel";
import { HTTPException } from "hono/http-exception";

import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";

import { getProcessedImage, postImage } from "../utils/apiHelper";
import { authMiddleware } from "@/middleware/auth";
export const runtime = "nodejs";

const app = new Hono().basePath("/api");

app.use("/api/*", authMiddleware);

app.post("/background-removal", async (c) => {
  try {
    const { image_url } = await c.req.json();
    if (!image_url) {
      throw new HTTPException(401, { message: "No image found" });
    }
    const imagePathDownload = await postImage(image_url);

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

export const GET = handle(app);
export const POST = handle(app);
