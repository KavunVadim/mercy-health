import { S3Client, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import crypto from "crypto";

function getConfig() {
  const region = process.env.AWS_REGION;
  const bucket = process.env.AWS_S3_BUCKET;
  if (!region || !bucket) return null;
  return { region, bucket };
}

function getClient() {
  const cfg = getConfig();
  if (!cfg) return null;
  return { client: new S3Client({ region: cfg.region }), cfg };
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
  });
  await c.client.send(command);
  return getS3Url(key);
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
