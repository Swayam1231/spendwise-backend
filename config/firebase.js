const admin = require('firebase-admin');

const projectId = process.env.project_id || process.env.FIREBASE_PROJECT_ID;
const clientEmail = process.env.client_email || process.env.FIREBASE_CLIENT_EMAIL;
let privateKey = process.env.private_key || process.env.FIREBASE_PRIVATE_KEY;

if (!admin.apps.length) {
  if (projectId && privateKey) {
    // Clean the private key (remove quotes and fix newlines)
    const formattedKey = privateKey
      .replace(/^"|"$/g, '')
      .replace(/\\n/g, '\n');

    admin.initializeApp({
      credential: admin.credential.cert({
        projectId,
        clientEmail,
        privateKey: formattedKey,
      })
    });
    console.log('Firebase initialized with Environment Variables');
  } else {
    try {
      const serviceAccount = require('./serviceAccountKey.json');
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
      });
      console.log('Firebase initialized with JSON file');
    } catch (error) {
      console.log('Firebase fallback initialization');
      admin.initializeApp();
    }
  }
}

const db = admin.firestore();

module.exports = { admin, db };
