import { async } from "@firebase/util";
import { Auth, createUserWithEmailAndPassword, getAuth, onAuthStateChanged, signInWithEmailAndPassword, signOut, Unsubscribe, User, UserCredential } from "firebase/auth"
import { PrintToConsole } from "./firebase-common"

const auth: Auth = getAuth();

/* ~~ Auth MEMO ~~

ユーザーが初めてログインすると、新しいユーザーアカウントが作成され、
ログインの際に使用した認証情報(ユーザー名&パスワード, 電話番号, 認証プロバイダ情報など)がログインしたアカウントに紐づけられる

作成したアカウントは、Firebaseのすべてのプロジェクトでユーザーを識別するために使用できる

Realtime Database, Cloud Strage (Firestoreは?　もしかして使えない?)のセキュリティルールで, Auth情報

Auth: アカウントの認証情報を格納しつつ、Authサービスの呼び出しを行う


*/

// 帰り値として、UserCredentialを持つので、非同期関数としての呼び出しが必要(Promiseがつきまとう)
export async function CreateUserAsync(email: string, password: string): Promise<UserCredential | undefined> {
    try {
        const result = await createUserWithEmailAndPassword(auth, email, password);
        return result;
    }
    catch (e) {
        PrintToConsole(e);
    }

    return undefined;
}

export async function SignInUserAsync(email: string, password: string) {
    const credential = await signInWithEmailAndPassword(auth, email, password);

    return credential;
}

export function ObserveOnAuthStateChangedEvent(func: (user: User) => void): Unsubscribe {
    const unSubscribe = onAuthStateChanged(auth, (user) => {
        if (user != null)
            func(user);
    });

    return unSubscribe;
}

// [非推奨] ObserveOnAuthStateChangedEvent関数を使うことが推奨される
// ObserveOnAuthStateChangedEvent関数では、Auth オブジェクトが中間状態（初期化など）ではないことが確約される
export function GetCurrentUser(): User | null {
    // 誰もログインしていない場合、currentからはnullが返る
    return auth.currentUser;
}


export function SignOut(func: () => void) {
    signOut(auth)
        .then(() => {
            console.log("SignOutUser");
            func();
        })
        .catch((e) => {
            PrintToConsole(e);
        });
}

