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

const USE_CONSOLE_LOG = true; // コンソールログに出力を行うか

firebase.initializeApp(firebaseConfig);

const FireStore: firebase.firestore.Firestore = firebase.firestore();

const CollectionName = "dev-user"; //コレクションの名前
const LoginCollection = "dev-logined";

export type UserObject = {
    id: string,
    name: string,
    age: number,
    lastWritter: string, // 最終更新者(あまり意味をなしていない)
}

// PromiseのオブジェクトのPromiseを解いて返す
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

// UserObjectを取得する
export async function GetUserDocuments(): Promise<UserObject[]> {
    const userCollection = FireStore.collection(CollectionName);

    let userList = Array<UserObject>();

    await userCollection.get()
        .then((users) => {
            users.forEach((user) => {
                const data = user.data();
                userList.push({ id: user.id, name: data.name, age: data.age, lastWritter: data.lastWritter });
            });
        })
        .catch((e) => { throw new Error(e); });

    return userList;
}

// 更新されたタイミングで、引数の関数を実行させる
export function SetSnapshot(onShapFunction: any) {
    const userCollection = FireStore.collection(CollectionName);

    userCollection.onSnapshot((users) => {
        const datas: UserObject[] = [];
        users.forEach((user) => {
            const data = user.data();
            datas.push({ id: user.id, name: data.name, age: data.age, lastWritter: data.lastWritter });
            USE_CONSOLE_LOG && console.log("Get Users: ", datas);
        });

        onShapFunction(datas);

        if (datas)
            USE_CONSOLE_LOG && console.log("Current Users: ", datas.join(", "));
    })
}

// UserObjectを変更(追加)する
export function SetUserDocument(user: UserObject, useUserId: boolean) {
    const userCollection = FireStore.collection(CollectionName);

    if (useUserId)
        userCollection
            // IDを指定して編集(データの更新で使用)
            .doc(user.id)
            .set({
                name: user.name,
                age: user.age,
                lastWritter: user.lastWritter == null ? "" : user.lastWritter
            })
            .then(() => { USE_CONSOLE_LOG && console.log("Update User, name : ", user.name); })
            .catch((e) => { USE_CONSOLE_LOG && console.log(e), user });
    else
        // IDをランダム生成する(アカウント作成時に使用)
        userCollection.add({
            name: user.name,
            age: user.age,
            lastWritter: user.lastWritter == null ? "" : user.lastWritter
        })
            .then(() => { USE_CONSOLE_LOG && console.log("Add User, name : ", user.name); })
            .catch((e) => { USE_CONSOLE_LOG && console.log(e) });
}

// UserObjectを削除する
export function DeleteUserDocument(user: UserObject) {
    const userCollection = FireStore.collection(CollectionName);
    userCollection
        // deleteに引数を持たすことができないため、firebaseのルールからは何もわからない...
        //  => firebaseに渡す前に条件分岐を行い、削除できるかを考えなければならない
        .doc(user.id).delete()
        .then(() => { USE_CONSOLE_LOG && console.log("Delete User, name : ", user.name); })
        .catch((e) => { USE_CONSOLE_LOG && console.log(e); });
}

// ログインを行う
export function LoginUser(user: UserObject) {
    const loginCollection = FireStore.collection(LoginCollection);

    loginCollection.doc(user.id)
        .set({
            name: user.name,
            age: user.age,
            lastWritter: user.lastWritter == null ? "" : user.lastWritter
        })
        .then(() => { USE_CONSOLE_LOG && console.log("Logined User, name : ", user.name); })
        .catch((e) => { USE_CONSOLE_LOG && console.log(e) });
}

// ログアウトを行う
export function LogoutUser(user: UserObject) {
    const loginCollection = FireStore.collection(LoginCollection);

    loginCollection
        .doc(user.id).delete()
        .then(() => { USE_CONSOLE_LOG && console.log("Logout User, name : ", user.name); })
        .catch((e) => { USE_CONSOLE_LOG && console.log(e); });
}