import { Storage } from "@google-cloud/storage";
import path from "path";
import { Readable } from "stream";

const storage = new Storage({
  keyFilename: path.join(__dirname, "../haramawill-storage-secret-key.json"),
});

const BUCKET_NAME = process.env.CONTAINER_NAME || "hamara-will-storage";

const uploadFile = async (userId: string, filename: string, fileStream: Readable):  Promise<{ signedUrl: string; publicUrl: string }> => {
  try {
    const destination = `uploads/${userId}/${filename}`;
    const bucket = storage.bucket(BUCKET_NAME);
    const file = bucket.file(destination);

    const writeStream = file.createWriteStream({
      resumable: false,
      metadata: { contentType: "application/pdf" },
    });

    fileStream.pipe(writeStream);

    await new Promise((resolve, reject) => {
      writeStream.on("finish", resolve);
      writeStream.on("error", reject);
    });

    const [signedUrl] = await file.getSignedUrl({
      action: "read",
      expires: "01-01-2099",
    });
    const publicUrl = `https://storage.googleapis.com/${BUCKET_NAME}/${destination}`;

    return { signedUrl, publicUrl };
  } catch (error) {
    console.error("Error uploading file:", error);
    throw new Error("File upload failed.");
  }
};

export { uploadFile };