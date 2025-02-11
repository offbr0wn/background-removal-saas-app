import { Hono } from "hono";
import { handle } from "hono/vercel";
import { HTTPException } from "hono/http-exception";
import { writeFile } from "fs/promises";
import path from "path";
import fs from "fs";
import { bearerAuth } from "hono/bearer-auth";
import { getProcessedImage, postImage } from "../utils/apiHelper";
import { authMiddleware } from "@/middleware/auth";
export const runtime = "nodejs";
const apiUrl = "https://api.claid.ai/v1-beta1/image/edit/async";
const token = "485b3e54f57b495890069d570b3b3e8f";

const app = new Hono().basePath("/api");

app.use("/api/*", authMiddleware);

app.post("/background-removal", async (c) => {
  try {
    const { image_url } = await c.req.json();
    if (!image_url) {
      throw new HTTPException(401, { message: "No image found" });
    }
console.log(image_url);
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

app.post("/upload", async (c) => {
  const body = await c.req.parseBody();
  const file = body.file as File;

  if (!file) {
    return c.json({ error: "No file uploaded" }, 400);
  }

  // Convert file to Buffer
  const bytes = await file.arrayBuffer();
  const buffer = new Uint8Array(bytes); // ✅ Fix: Use Uint8Array instead of Buffer

  // Define storage details
  const storageName = "local-storage"; // Custom storage name
  const imageFolder = "uploads"; // Folder where images are stored
  const fileName = `${Date.now()}-${file.name.replace(/\s+/g, "_")}`; // Unique filename

  // Ensure the upload directory exists
  const uploadDir = path.join(process.cwd(), "public", imageFolder);
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  // Save file locally
  const filePath = `${uploadDir}/${fileName}`;
  await writeFile(filePath, buffer);

  // Generate Custom Storage URL
  const storagePath = `storage://${storageName}/${imageFolder}/${fileName}`;
  const publicUrl = `/${imageFolder}/${fileName}`;
  // cleanup method
  const cleanup = async () => {
    if (fs.existsSync(filePath)) {
      await fs.promises.unlink(filePath);
    }
  };

  // call the cleanup method after the image has been uploaded and processed
  // postImage(publicUrl)
  //   .then(async () => {
  //     await cleanup();
  //   })
  //   .catch(async (error) => {
  //     console.error(error);
  //     await cleanup();
  //   });

  cleanup();
  return c.json({ storagePath, publicUrl });
});

export const GET = handle(app);
export const POST = handle(app);
