# SpendWise Backend API

This is the secure Node.js/Express REST API for the SpendWise application. It manages user authentication, Firestore database interactions, and JWT issuance.

## 🚀 Live Link
**Live API:** [https://spendwise-api-p3c4.onrender.com/api](https://spendwise-api-p3c4.onrender.com/api)

## 🛠 Features
- **Firebase Admin SDK**: Direct, secure server-side management of Firestore and Auth.
- **JWT Authentication**: Industry-standard secure communication between Mobile and API.
- **Express Middleware**: Native authentication and error-handling layers.
- **Production Ready**: Fully configured for deployment on Render.com.

## 📦 Setup & Installation
1. Install dependencies:
   ```bash
   npm install
   ```
2. Create a `.env` file with the following keys:
   - `JWT_SECRET`
   - `FIREBASE_PROJECT_ID`
   - `FIREBASE_CLIENT_EMAIL`
   - `FIREBASE_PRIVATE_KEY`
   - `GOOGLE_CLIENT_ID`
3. Start the server:
   ```bash
   node index.js
   ```

## 📄 API Documentation
For detailed endpoint information, please refer to the `API.md` file in the root directory.
