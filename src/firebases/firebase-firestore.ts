// Import the functions you need from the SDKs you need
import { async } from "@firebase/util";
import { collection, Firestore, getFirestore, doc, addDoc, setDoc, deleteDoc, onSnapshot, getDocs } from "firebase/firestore";
import { PrintToConsole, firebaseApp } from "./firebase-common"

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional

const firestore: Firestore = getFirestore();

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
export function GetUserDocuments(): UserObject[] {
    const userCollection = collection(firestore, CollectionName);

    let userList = Array<UserObject>();

    getDocs(userCollection)
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
export function SetSnapshot(onShapFunction: (users: UserObject[]) => void) {
    const userCollection = collection(firestore, CollectionName);

    onSnapshot(userCollection, (users) => {
        const datas: UserObject[] = [];
        users.forEach((user) => {
            const data = user.data();
            datas.push({ id: user.id, name: data.name, age: data.age, lastWritter: data.lastWritter });
        });

        PrintToConsole(`Get Users: ${datas}`);
        onShapFunction(datas);
    })
}

// UserObjectを変更(追加)する
export function SetUserDocument(user: UserObject, useUserId: boolean) {
    const userCollection = collection(firestore, CollectionName);
    const setData = {
        name: user.name,
        age: user.age,
        lastWritter: user.lastWritter ? "" : user.lastWritter,
    };

    if (useUserId)
        // IDを指定して編集(データの更新で使用)
        setDoc(doc(userCollection, user.id), setData)
            .then(() => { PrintToConsole(`Update User, name : ${user.name}`); })
            .catch((e) => { PrintToConsole(e, user) });
    else
        // IDをランダム生成する(アカウント作成時に使用)
        addDoc(userCollection, setData)
            .then(() => { PrintToConsole("Add User, name : ", user.name); })
            .catch((e) => { PrintToConsole(e, user) });
}

async function AddUserDoc() {
    const userCollection = collection(firestore, CollectionName);
    const result = await addDoc(userCollection, {});
}

// UserObjectを削除する
export function DeleteUserDocument(user: UserObject) {
    const userCollection = collection(firestore, CollectionName);

    // deleteに引数を持たすことができないため、firebaseのルールからは何もわからない...
    //  => firebaseに渡す前に条件分岐を行い、削除できるかを考えなければならない
    deleteDoc(doc(userCollection, user.id))
        .then(() => { PrintToConsole("Delete User, name : ", user.name); })
        .catch((e) => { PrintToConsole(e, user) });

}

// ログインを行う
export function LoginUser(user: UserObject) {
    const loginCollection = collection(firestore, LoginCollection);
    const setData = {
        name: user.name,
        age: user.age,
        lastWritter: user.lastWritter ? "" : user.lastWritter,
    };

    setDoc(doc(loginCollection, user.id), setData)
        .then(() => { PrintToConsole("Logined User, name : ", user.name); })
        .catch((e) => { PrintToConsole(e) });
}

// ログアウトを行う
export function LogoutUser(user: UserObject) {
    const loginCollection = collection(firestore, LoginCollection);

    deleteDoc(doc(loginCollection, user.id))
        .then(() => { PrintToConsole("Logout User, name : ", user.name); })
        .catch((e) => { PrintToConsole(e); });
}