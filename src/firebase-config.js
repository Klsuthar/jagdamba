import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyCDD4bEr2ILayjw6PNJp2k0Hd-q1Lb_Q_8",
    authDomain: "shree-jagdamba.firebaseapp.com",
    projectId: "shree-jagdamba",
    storageBucket: "shree-jagdamba.firebasestorage.app",
    messagingSenderId: "510037364219",
    appId: "1:510037364219:web:f2f60eeea7138b6b0d0f5e"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;
