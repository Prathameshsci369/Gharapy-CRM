import admin from 'firebase-admin';
import * as fs from 'fs';
import * as path from 'path';

// Initialize admin SDK using service-account.json or environment variable
try {
  if (!admin.apps.length) {
    let serviceAccount: admin.ServiceAccount | undefined;

    // Method 1: Try environment variable (for Vercel/cloud deployments)
    if (process.env.FIREBASE_ADMIN_SDK_CREDENTIALS) {
      try {
        const decodedCredentials = Buffer.from(
          process.env.FIREBASE_ADMIN_SDK_CREDENTIALS,
          'base64'
        ).toString('utf-8');
        serviceAccount = JSON.parse(decodedCredentials) as admin.ServiceAccount;
        console.log('✓ Firebase Admin initialized from environment variable');
      } catch (err) {
        console.warn('Could not parse Firebase credentials from environment:', err instanceof Error ? err.message : 'Unknown error');
      }
    }

    // Method 2: Try to load service-account.json from project root (local development)
    if (!serviceAccount) {
      const serviceAccountPath = path.join(process.cwd(), 'service-account.json');
      
      if (fs.existsSync(serviceAccountPath)) {
        try {
          const serviceAccountJson = fs.readFileSync(serviceAccountPath, 'utf-8');
          serviceAccount = JSON.parse(serviceAccountJson) as admin.ServiceAccount;
          console.log('✓ Firebase Admin initialized from service-account.json file');
        } catch (err) {
          console.warn('Could not read or parse service-account.json:', err instanceof Error ? err.message : 'Unknown error');
        }
      }
    }

    // Method 3: Initialize if we have credentials
    if (serviceAccount) {
      try {
        admin.initializeApp({
          credential: admin.credential.cert(serviceAccount),
        });
      } catch (err) {
        console.warn('Firebase Admin app already initialized or initialization failed');
      }
    } else {
      // Fallback: Initialize with application default credentials (works in some environments)
      try {
        admin.initializeApp({
          projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
        });
        console.log('⚠ Firebase Admin initialized with project ID only (limited functionality)');
      } catch (err) {
        console.warn('Could not initialize Firebase Admin with default credentials:', err instanceof Error ? err.message : 'Unknown error');
      }
    }
  }
} catch (err) {
  console.warn('Firebase Admin initialization warning:', err instanceof Error ? err.message : 'Unknown error');
}

// Export a function to get the firestore instance
export const getAdminDb = () => {
  try {
    if (admin.apps.length > 0) {
      return admin.firestore();
    }
  } catch (err) {
    console.error('Error getting admin database:', err);
  }
  return null;
};

// For backward compatibility, also export adminDb
export const adminDb = (() => {
  try {
    if (admin.apps.length > 0) {
      return admin.firestore();
    }
  } catch (err) {
    console.warn('Firebase admin not initialized');
  }
  return null;
})();

export default admin;