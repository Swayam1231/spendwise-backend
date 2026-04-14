const admin = require('firebase-admin');

const projectId = process.env.project_id || process.env.FIREBASE_PROJECT_ID;
const clientEmail = process.env.client_email || process.env.FIREBASE_CLIENT_EMAIL;
let privateKey = process.env.private_key || process.env.FIREBASE_PRIVATE_KEY;

if (!admin.apps.length) {
  console.log('---- FIREBASE DIAGNOSTICS ----');
  console.log('Project ID found:', !!projectId, `(Length: ${projectId?.length || 0})`);
  console.log('Client Email found:', !!clientEmail, `(Length: ${clientEmail?.length || 0})`);
  console.log('Private Key found:', !!privateKey, `(Length: ${privateKey?.length || 0})`);

  if (projectId && privateKey) {
    const formattedKey = privateKey
      .replace(/^"|"$/g, '')
      .replace(/\\n/g, '\n')
      .trim();

    try {
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId,
          clientEmail,
          privateKey: formattedKey,
        })
      });
      console.log('Firebase init SUCCESS with Env Vars');
    } catch (e) {
      console.error('Firebase init ERROR:', e.message);
    }
  } else {
    // Fallback to local
    console.log('Falling back to local config...');
    try {
      const serviceAccount = require('./serviceAccountKey.json');
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
      });
    } catch (error) {
       console.log('Final fallback init');
       admin.initializeApp();
    }
  }
}

const db = admin.firestore();

module.exports = { admin, db };
