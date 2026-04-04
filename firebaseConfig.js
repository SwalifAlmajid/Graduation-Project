import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyD0W_fy-TVXauyuQ0JHvwp6IxGjApFM1AU',
  authDomain: 'hassad-ae82c.firebaseapp.com',
  projectId: 'hassad-ae82c',
  storageBucket: 'hassad-ae82c.firebasestorage.app',
  messagingSenderId: '449287428718',
  appId: '1:449287428718:web:238c84c786815dcf95e47f',
  measurementId: 'G-13CLVTTS5R',
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

export const auth = firebase.auth();
export const db = firebase.firestore();
export default firebase;
