// Import the functions you need from the SDKs you need
import firebase from "firebase/app";
import "firebase/firestore"

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyAeIZTexnO19wykQv9IWddjbiC9JMZj5r8",
    authDomain: "fir-demo-ad96f.firebaseapp.com",
    projectId: "fir-demo-ad96f",
    storageBucket: "fir-demo-ad96f.appspot.com",
    messagingSenderId: "337566520460",
    appId: "1:337566520460:web:10932cc114547b6efb97a9",
    measurementId: "G-ZCZC8761NL"
};

firebase.initializeApp(firebaseConfig);

const FireStore: firebase.firestore.Firestore = firebase.firestore();

export type UserObject = {
    id: string,
    name: string,
    age: number,
}

function UnPromised<T>(promise: Promise<T>): T | null {
    let result = null;

    if (!promise)
        return result;

    promise
        .then((unpack) => {
            result = unpack;
        })
        .catch((e) => { throw new Error(e) });

    return result;
}

export async function GetUserDocuments() {
    const CollectionName = "dev-user";

    const userCollection = FireStore.collection(CollectionName);

    let userList = Array<UserObject>();

    await userCollection.get()
        .then((users) => {
            users.forEach((user) => {
                const data = user.data();
                console.log(user.id, "=>", data);
                userList.push({ id: user.id, name: data.name, age: data.age })
            });
        })
        .catch((e) => { throw new Error(e); });

    return userList;
}
