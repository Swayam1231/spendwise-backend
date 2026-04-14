const jwt = require('jsonwebtoken');
const { admin } = require('../config/firebase');
const { OAuth2Client } = require('google-auth-library');
const googleClient = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET
);

exports.googleLogin = async (req, res) => {
  try {
    const { idToken } = req.body;

    if (!idToken) {
      return res.status(400).json({ error: 'No ID token provided' });
    }

    const acceptedClientIds = [
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_ANDROID_CLIENT_ID,
    ].filter(Boolean);

    const ticket = await googleClient.verifyIdToken({
      idToken: idToken,
      audience: acceptedClientIds,
    });
    
    const decodedToken = ticket.getPayload();
    const uid = decodedToken.sub;

    try {
      await admin.auth().getUser(uid);
    } catch (firebaseAuthError) {
      if (firebaseAuthError.code === 'auth/user-not-found') {
        await admin.auth().createUser({
          uid: uid,
          email: decodedToken.email,
          displayName: decodedToken.name,
          photoURL: decodedToken.picture
        });
      }
    }

    const payload = { uid: uid, email: decodedToken.email };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.status(200).json({ 
      token, 
      user: { 
        uid: uid, 
        email: decodedToken.email,
        name: decodedToken.name,
        picture: decodedToken.picture
      } 
    });
  } catch (error) {
    console.error('Login Error:', error);
    res.status(401).json({ error: error.message || 'Authentication failed' });
  }
};
