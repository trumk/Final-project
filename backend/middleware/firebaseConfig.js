require("dotenv").config();
const admin = require("firebase-admin");
const multer = require("multer");
const path = require("path");
const { v4: uuidv4 } = require("uuid");
const { exec } = require("child_process");
const fs = require("fs");
const util = require("util");

const execPromise = util.promisify(exec);

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
    fileSize: 5 * 1024 * 1024, // Giới hạn 5MB
  },
}).single("file"); // Xử lý tải lên một file duy nhất

// Hàm tải file lên Firebase Storage
const uploadFileToFirebase = async (file) => {
  const fileName = Date.now() + "-" + file.originalname;
  const firebaseFile = bucket.file(fileName);
  const downloadToken = uuidv4(); // Tạo một token mới

  try {
    // Tải file lên Firebase Storage cùng với token trong metadata
    await firebaseFile.save(file.buffer, {
      metadata: {
        contentType: file.mimetype,
        metadata: {
          firebaseStorageDownloadTokens: downloadToken, // Thêm token vào metadata
        },
      },
    });
    // Tạo URL với token download
    const publicUrl = `https://firebasestorage.googleapis.com/v0/b/${
      bucket.name
    }/o/${encodeURIComponent(fileName)}?alt=media&token=${downloadToken}`;

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
    req.user = decodedToken; // Gán thông tin người dùng từ Firebase token
    next();
  } catch (error) {
    console.error("Token verification failed:", error);
    res.status(401).json({ message: "Unauthorized" });
  }
};

// Thiết lập CORS Headers
const setCooPHeaders = (req, res, next) => {
  res.setHeader("Cross-Origin-Opener-Policy", "same-origin-allow-popups");
  next();
};

const mongodumpPath =
  "C:\\Users\\nguye\\Downloads\\mongodb-database-tools-windows-x86_64-100.10.0\\mongodb-database-tools-windows-x86_64-100.10.0\\bin\\mongodump.exe";

  const backupDatabaseToFirebase = async () => {
    const backupFileName = `backup-${Date.now()}.gz`;
    const backupPath = `./${backupFileName}`;
    const mongoUrl = process.env.MONGO_URL; 
  
    try {
      await execPromise(`${mongodumpPath} --uri="${mongoUrl}" --archive=${backupPath} --gzip`);
  
      const fileBuffer = fs.readFileSync(backupPath);
  
      const firebaseFile = bucket.file(`backups/${backupFileName}`);
      const downloadToken = uuidv4();
  
      await firebaseFile.save(fileBuffer, {
        metadata: {
          contentType: "application/gzip",
          metadata: {
            firebaseStorageDownloadTokens: downloadToken,
          },
        },
      });
  
      fs.unlinkSync(backupPath);
  
      const publicUrl = `https://firebasestorage.googleapis.com/v0/b/${
        bucket.name
      }/o/${encodeURIComponent(
        `backups/${backupFileName}`
      )}?alt=media&token=${downloadToken}`;
  
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
  setCooPHeaders,
  backupDatabaseToFirebase, 
};
