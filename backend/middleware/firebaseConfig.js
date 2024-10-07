require('dotenv').config();
const admin = require('firebase-admin');
const multer = require('multer');
const path = require('path');

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
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|gif|mp4|avi|mov|mkv/; // Allowed file types
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      return cb(new Error('Only images and videos are allowed!'));
    }
  },
}).single('file'); // Handles single file upload

// Function to upload file to Firebase Storage
const uploadFileToFirebase = async (file) => {
  const fileName = Date.now() + '-' + file.originalname;
  const firebaseFile = bucket.file(fileName);

  try {
    await firebaseFile.save(file.buffer, {
      metadata: {
        contentType: file.mimetype,
      },
    });

    const publicUrl = `https://storage.googleapis.com/${bucket.name}/${fileName}`;
    return publicUrl;
  } catch (error) {
    console.error('Error uploading file to Firebase:', error);
    throw new Error('Failed to upload file to Firebase');
  }
};

// Middleware to verify Firebase Auth Token
const verifyFirebaseToken = async (req, res, next) => {
  const idToken = req.headers.authorization?.split(' ')[1]; // Token from Authorization header
  if (!idToken) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken); // Verifying token
    req.user = decodedToken; // Attach user info to request object
    next(); // Proceed to the next middleware
  } catch (error) {
    console.error('Token verification failed:', error);
    res.status(401).json({ message: 'Unauthorized' });
  }
};

// Setting Cross-Origin-Opener-Policy to handle popups properly
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
