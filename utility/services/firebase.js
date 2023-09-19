import { initializeApp, getApps } from 'firebase/app';
import { getFirestore } from 'firebase/firestore/lite';

const config = {
    apiKey: "AIzaSyCpenpS67MUjcNdVInUsbUta3T9omKQz8c",
    authDomain: "carmed-f6927.firebaseapp.com",
    projectId: "carmed-f6927",
    storageBucket: "carmed-f6927.appspot.com",
    messagingSenderId: "712612218795",
    appId: "1:712612218795:web:21d9c16aaa4bf1240b34ee",
    measurementId: "G-3ZL44F73YH"
}

export class FirebaseService {
    
    static initApp = () => {
        if (!getApps().length) {
            const db = initializeApp(config);
            this.firestore = getFirestore(db);
        }
    }

    static getFireStore = () => {
        return this.firestore;
    }
}

export default FirebaseService;