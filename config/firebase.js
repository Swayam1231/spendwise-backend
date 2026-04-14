const admin = require('firebase-admin');

const projectId = process.env.FIREBASE_PROJECT_ID || process.env.project_id;
const clientEmail = process.env.FIREBASE_CLIENT_EMAIL || process.env.client_email;
const privateKey = process.env.FIREBASE_PRIVATE_KEY || process.env.private_key;

if (projectId && privateKey) {
  // Use Environment Variables (Production / Render)
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId,
      clientEmail,
      // Replace literal \n with actual newlines for private key parsing
      privateKey: privateKey.replace(/\\n/g, '\n'),
    })
  });
} else {
  // Fallback to local JSON file for local development
  try {
    const serviceAccount = require('./serviceAccountKey.json');
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    });
  } catch (error) {
    console.log('Firebase initialized without explicit credentials (awaiting setup)');
    admin.initializeApp();
  }
}

const db = admin.firestore();

module.exports = { admin, db };
