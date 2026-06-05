import { S3Client, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import crypto from "crypto";

function getConfig() {
  const region = process.env.AWS_REGION;
  const bucket = process.env.AWS_S3_BUCKET;
  const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
  const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
  if (!region || !bucket) return null;
  return { region, bucket, accessKeyId, secretAccessKey };
}

let cachedClient: S3Client | null = null;

function getClient() {
  const cfg = getConfig();
  if (!cfg) return null;
  if (!cachedClient) {
    cachedClient = new S3Client({
      region: cfg.region,
      credentials: cfg.accessKeyId && cfg.secretAccessKey
        ? { accessKeyId: cfg.accessKeyId, secretAccessKey: cfg.secretAccessKey }
        : undefined,
    });
  }
  return { client: cachedClient, cfg };
}

export function getS3Url(key: string): string {
  const cfg = getConfig();
  if (!cfg) throw new Error("S3 not configured (AWS_REGION / AWS_S3_BUCKET missing)");
  return `https://${cfg.bucket}.s3.${cfg.region}.amazonaws.com/${key}`;
}

export function extractKeyFromUrl(url: string): string | null {
  const cfg = getConfig();
  if (!cfg) return null;
  const prefix = `https://${cfg.bucket}.s3.${cfg.region}.amazonaws.com/`;
  if (url.startsWith(prefix)) return url.slice(prefix.length);
  return null;
}

export function computeFileHash(buffer: Buffer): string {
  return crypto.createHash("sha256").update(buffer).digest("hex");
}

export async function uploadToS3(
  body: Buffer,
  key: string,
  mime: string
): Promise<string> {
  const c = getClient();
  if (!c) throw new Error("S3 not configured (AWS_REGION / AWS_S3_BUCKET missing)");
  const command = new PutObjectCommand({
    Bucket: c.cfg.bucket,
    Key: key,
    Body: body,
    ContentType: mime,
    CacheControl: "public, max-age=31536000, immutable",
  });
  await c.client.send(command);
  return getS3Url(key);
}

export async function uploadLocally(
  body: Buffer,
  filename: string,
): Promise<string> {
  const fs = await import('fs/promises');
  const path = await import('path');
  const dir = path.join(process.cwd(), 'public', 'uploads');
  await fs.mkdir(dir, { recursive: true });
  const filePath = path.join(dir, filename);
  await fs.writeFile(filePath, body);
  return `/uploads/${filename}`;
}

export async function deleteLocalFile(url: string): Promise<void> {
  try {
    const fs = await import('fs/promises');
    const path = await import('path');
    const filename = url.replace('/uploads/', '');
    const filePath = path.join(process.cwd(), 'public', 'uploads', filename);
    await fs.unlink(filePath);
  } catch (e) {
    console.warn('Local file delete failed:', e);
  }
}

export async function deleteFromS3(key: string): Promise<void> {
  const c = getClient();
  if (!c) return;
  try {
    const command = new DeleteObjectCommand({ Bucket: c.cfg.bucket, Key: key });
    await c.client.send(command);
  } catch (e) {
    console.warn("S3 delete failed:", e);
  }
}
