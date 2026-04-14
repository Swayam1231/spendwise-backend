const express = require('express');
const router = express.Router();
const { requireAuth } = require('../middleware/auth');
const { db } = require('../config/firebase');

router.get('/balance', requireAuth, async (req, res) => {
  try {
    const doc = await db.collection('users').doc(req.user.uid).get();
    let balance = 0;
    if (doc.exists && doc.data().baseBalance !== undefined) {
      balance = doc.data().baseBalance;
    }
    res.status(200).json({ baseBalance: balance });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to get balance' });
  }
});

router.post('/balance', requireAuth, async (req, res) => {
  console.log('--- Updating Balance ---');
  console.log('User UID:', req.user.uid);
  console.log('New Balance:', req.body.baseBalance);

  try {
    const { baseBalance } = req.body;
    if (baseBalance === undefined) return res.status(400).json({ error: 'No balance provided' });
    
    const userRef = db.collection('users').doc(req.user.uid);
    await userRef.set({ baseBalance: parseFloat(baseBalance) }, { merge: true });
    
    console.log('Balance Update: SUCCESS');
    res.status(200).json({ baseBalance: parseFloat(baseBalance) });
  } catch (err) {
    console.error('Balance Update: ERROR', err.message);
    res.status(500).json({ error: 'Failed to update balance', details: err.message });
  }
});

module.exports = router;
