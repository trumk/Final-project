require('dotenv').config();
const admin = require('firebase-admin');
const multer = require('multer');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

// Firebase Admin SDK configuration
admin.initializeApp({
  credential: admin.credential.cert({
    type: 'service_account',
    project_id: process.env.FIREBASE_PROJECT_ID,
    private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
    private_key: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    client_email: process.env.FIREBASE_CLIENT_EMAIL,
    client_id: process.env.FIREBASE_CLIENT_ID,
    auth_uri: process.env.FIREBASE_AUTH_URI,
    token_uri: process.env.FIREBASE_TOKEN_URI,
    auth_provider_x509_cert_url: process.env.FIREBASE_AUTH_PROVIDER_X509_CERT_URL,
    client_x509_cert_url: process.env.FIREBASE_CLIENT_X509_CERT_URL,
  }),
  storageBucket: `${process.env.FIREBASE_PROJECT_ID}.appspot.com`,
});

// Access Firebase Storage Bucket
const bucket = admin.storage().bucket();

// Configure Multer to store files in memory (RAM)
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
}).single('file'); // Handles single file upload

// Function to upload file to Firebase Storage
const uploadFileToFirebase = async (file) => {
  const fileName = Date.now() + '-' + file.originalname;
  const firebaseFile = bucket.file(fileName);
  const downloadToken = uuidv4(); // Tạo một token mới

  try {
    // Upload file lên Firebase Storage cùng với token trong metadata
    await firebaseFile.save(file.buffer, {
      metadata: {
        contentType: file.mimetype,
        metadata: {
          firebaseStorageDownloadTokens: downloadToken, // Thêm token vào metadata
        },
      },
    });
    // Tạo URL với token download
    const publicUrl = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURIComponent(fileName)}?alt=media&token=${downloadToken}`;

    return publicUrl;
  } catch (error) {
    console.error('Error uploading file to Firebase:', error);
    throw new Error('Failed to upload file to Firebase');
  }
};


const verifyFirebaseToken = async (req, res, next) => {
  const idToken = req.headers.authorization?.split(' ')[1]; 

  if (!idToken) {
    // Nếu không có token, kiểm tra người dùng đã đăng nhập thông qua phương pháp khác hay không
    if (req.session && req.session.user) {
      req.user = req.session.user; // Lưu thông tin người dùng từ session (nếu có)
      return next();
    }
    // Nếu không có token và không có session, người dùng không được xác thực
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken); 
    req.user = { uid: decodedToken.uid, ...decodedToken }; 
    next(); 
  } catch (error) {
    console.error('Token verification failed:', error);
    res.status(401).json({ message: 'Unauthorized' });
  }
};

const setCooPHeaders = (req, res, next) => {
  res.setHeader('Cross-Origin-Opener-Policy', 'same-origin-allow-popups');
  next();
};

module.exports = {
  admin,
  bucket,
  upload,
  uploadFileToFirebase,
  verifyFirebaseToken,
  setCooPHeaders,
};
