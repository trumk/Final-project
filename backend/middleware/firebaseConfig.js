require("dotenv").config();
const admin = require("firebase-admin");
const multer = require("multer");
const path = require("path");
const { v4: uuidv4 } = require("uuid");
const { exec } = require("child_process");
const fs = require("fs");
const BSON = require("bson");
const util = require("util");
const archiver = require("archiver");
const mongoose = require("mongoose");


admin.initializeApp({
  credential: admin.credential.cert({
    type: "service_account",
    project_id: process.env.FIREBASE_PROJECT_ID,
    private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
    private_key: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
    client_email: process.env.FIREBASE_CLIENT_EMAIL,
    client_id: process.env.FIREBASE_CLIENT_ID,
    auth_uri: process.env.FIREBASE_AUTH_URI,
    token_uri: process.env.FIREBASE_TOKEN_URI,
    auth_provider_x509_cert_url:
      process.env.FIREBASE_AUTH_PROVIDER_X509_CERT_URL,
    client_x509_cert_url: process.env.FIREBASE_CLIENT_X509_CERT_URL,
  }),
  storageBucket: `${process.env.FIREBASE_PROJECT_ID}.appspot.com`,
});

const bucket = admin.storage().bucket();

const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, 
  },
}).fields([
  { name: "images", maxCount: 10 }, 
  { name: "reports", maxCount: 10 } 
]);

const uploadFileToFirebase = async (file) => {
  const fileName = Date.now() + "-" + file.originalname;
  const firebaseFile = admin.storage().bucket().file(fileName);
  const downloadToken = uuidv4();

  try {
    await firebaseFile.save(file.buffer, {
      metadata: {
        contentType: file.mimetype,
        metadata: { firebaseStorageDownloadTokens: downloadToken },
      },
    });

    const publicUrl = `https://firebasestorage.googleapis.com/v0/b/${admin.storage().bucket().name}/o/${encodeURIComponent(fileName)}?alt=media&token=${downloadToken}`;
    return publicUrl;
  } catch (error) {
    console.error("Error uploading file to Firebase:", error);
    throw new Error("Failed to upload file to Firebase");
  }
};

// Xác minh token Firebase
const verifyFirebaseToken = async (req, res, next) => {
  const idToken = req.headers.authorization?.split(" ")[1];

  if (!idToken) {
    req.user = null; // Không có req.user nếu không có token
    return next();
  }

  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    req.user = decodedToken; 
    next();
  } catch (error) {
    console.error("Token verification failed:", error);
    res.status(401).json({ message: "Unauthorized" });
  }
};

const backupDatabaseToFirebase = async () => {
  const backupFileName = `backup-${Date.now()}.json`;
  const zipFileName = `backup-${Date.now()}.zip`;
  const zipFilePath = `./${zipFileName}`;

  try {
    const collections = await mongoose.connection.db.listCollections().toArray();
    const data = {};

    for (const collection of collections) {
      const collectionName = collection.name;
      const collectionData = await mongoose.connection.db
        .collection(collectionName)
        .find()
        .toArray();
      data[collectionName] = collectionData;
    }

    // Lưu dữ liệu dưới dạng JSON
    fs.writeFileSync(backupFileName, JSON.stringify(data, null, 2));

    // Nén tệp JSON thành tệp zip
    await new Promise((resolve, reject) => {
      const output = fs.createWriteStream(zipFilePath);
      const archive = archiver("zip", { zlib: { level: 9 } });

      output.on("close", resolve);
      archive.on("error", reject);

      archive.pipe(output);
      archive.file(backupFileName, { name: backupFileName });
      archive.finalize();
    });

    // Tải lên Firebase
    const fileBuffer = fs.readFileSync(zipFilePath);
    const firebaseFile = bucket.file(`backups/${zipFileName}`);
    const downloadToken = uuidv4();

    await firebaseFile.save(fileBuffer, {
      metadata: {
        contentType: "application/zip",
        metadata: {
          firebaseStorageDownloadTokens: downloadToken,
        },
      },
    });

    fs.unlinkSync(backupFileName);
    fs.unlinkSync(zipFilePath);

    const publicUrl = `https://firebasestorage.googleapis.com/v0/b/${
      bucket.name
    }/o/${encodeURIComponent(`backups/${zipFileName}`)}?alt=media&token=${downloadToken}`;

    console.log("Backup successfully created and uploaded to Firebase:", publicUrl);
    return publicUrl;
  } catch (error) {
    console.error("Error during backup and upload to Firebase:", error);
    throw new Error("Backup failed");
  }
};


module.exports = {
  admin,
  bucket,
  upload,
  uploadFileToFirebase,
  verifyFirebaseToken,
  backupDatabaseToFirebase,
};
