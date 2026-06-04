import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI || "mongodb://localhost:27017/mercy-health";

async function migrate() {
  const client = new MongoClient(uri);
  try {
    await client.connect();
    const db = client.db();

    const galleryDoc = await db.collection("content").findOne({ key: "news_gallery" });
    if (!galleryDoc) {
      console.log("No news_gallery document found in content collection.");
      return;
    }

    const images = galleryDoc.images || [];
    console.log(`Found ${images.length} images in content.news_gallery`);

    let migrated = 0;
    for (const url of images) {
      const existing = await db.collection("photos").findOne({ url });
      if (existing) {
        await db.collection("photos").updateOne({ url }, { $set: { inGallery: true } });
        console.log(`  Marked existing: ${url.split("/").pop()}`);
      } else {
        const maxOrder = await db.collection("photos").findOne({}, { sort: { order: -1 }, projection: { order: 1 } });
        await db.collection("photos").insertOne({
          url,
          title: url.split("/").pop() || "Migrated gallery image",
          alt: "",
          description: "",
          hash: "",
          inGallery: true,
          visible: true,
          order: (maxOrder?.order ?? -1) + 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
        console.log(`  Created: ${url.split("/").pop()}`);
        migrated++;
      }
    }

    console.log(`\nMigration complete. ${migrated} new photos created, ${images.length - migrated} already existed.`);
    await client.close();
  } catch (e) {
    console.error("Migration failed:", e);
    await client.close();
  }
}

migrate();
