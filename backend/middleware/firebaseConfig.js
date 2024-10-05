require('dotenv').config();

const admin = require('firebase-admin');
const multer = require('multer');
const path = require('path');

admin.initializeApp({
  credential: admin.credential.cert({
    type: "service_account",
    project_id: process.env.FIREBASE_PROJECT_ID,
    private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
    private_key: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    client_email: process.env.FIREBASE_CLIENT_EMAIL,
    client_id: process.env.FIREBASE_CLIENT_ID,
    auth_uri: process.env.FIREBASE_AUTH_URI,
    token_uri: process.env.FIREBASE_TOKEN_URI,
    auth_provider_x509_cert_url: process.env.FIREBASE_AUTH_PROVIDER_X509_CERT_URL,
    client_x509_cert_url: process.env.FIREBASE_CLIENT_X509_CERT_URL
  }),
  storageBucket: `${process.env.FIREBASE_PROJECT_ID}.appspot.com` 
});

// Truy cập Firebase Storage Bucket
const bucket = admin.storage().bucket();

// Cấu hình Multer để lưu trữ file trong bộ nhớ (RAM)
const storage = multer.memoryStorage(); 
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // Giới hạn kích thước file (5MB)
  },
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|gif|mp4|avi|mov|mkv/; // Chỉ chấp nhận các định dạng này
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

    if (mimetype && extname) {
      return cb(null, true); // Chấp nhận file
    } else {
      cb(new Error('Only images and videos are allowed!')); // Lỗi khi không đúng định dạng
    }
  },
});

// Hàm upload file lên Firebase Storage
const uploadFileToFirebase = async (file) => {
  const fileName = Date.now() + '-' + file.originalname; // Tạo tên file duy nhất
  
  // Tạo một tệp trên Firebase Storage với buffer
  const firebaseFile = bucket.file(fileName);

  try {
    // Upload tệp từ buffer lên Firebase Storage
    await firebaseFile.save(file.buffer, {
      metadata: {
        contentType: file.mimetype, // Đặt đúng loại tệp (image/jpeg, video/mp4, etc.)
      },
    });

    // Lấy URL công khai của file sau khi upload
    const publicUrl = `https://storage.googleapis.com/${bucket.name}/${fileName}`;
    return publicUrl;
  } catch (error) {
    console.error('Error uploading file to Firebase:', error);
    throw new Error('Failed to upload file to Firebase');
  }
};

module.exports = { admin, bucket, upload, uploadFileToFirebase };
