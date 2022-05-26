

// Start writing Firebase Functions
// https://firebase.google.com/docs/functions/typescript

// export const helloWorld = functions.https.onRequest((request, response) => {
//     functions.logger.info("Hello logs!", { structuredData: true });
//     response.send("Hello from Firebase!");
// });

// The Cloud Functions for Firebase SDK to create Cloud Functions and set up triggers.
const functions = require("firebase-functions");

// The Firebase Admin SDK to access Firestore.
const admin = require("firebase-admin");

admin.initializeApp();

// エンドポイント: 特定のリソースに対して与えられた固有の一意なURI
// URI: Uniform Resource Identifier, Web上にあるあらゆるファイル(Resource)を認識するための識別子の総称, URNとURLで構成される
// URN: Uniform Resource Name,       Web上での名前(固有のシリアルナンバーのようなイメージ)
// URL: Uniform Resource Locator,    Web上での住所

/* チュートリアルソースコード */

// 渡されたテキストパラメータをHTTPエンドポイントへ渡し、
// Firestoreの/messages/:documentId/originalというパスに挿入する
exports.addMessage = functions.https.onRequest(async (
    req: { query: { text: string; }; },
    res: { json: (arg0: { result: string; }) => void; }) => {

    // Grab the text parameter.
    const original = req.query.text;
    // Firebase Admin SDKを使用して、新しいメッセージをFirestoreにプッシュする
    // const writeResult = await admin.firestore()
    await admin.firestore()
        .collection("messages")
        .add(
            { original: original }
        );

    // メッセージの書き込みに成功したことをメッセージとして送り返す
    res.json({
        result: "Message with ID: ${writeResult.id} added."
    });
});

// /messages/:documentId/original に追加された新しいメッセージを購読し、
// /messages/:documentId/uppercase にメッセージの大文字版を作成します。
// これは、Firestoreに書き込みが行われると実行される
exports.makeUppercase = functions.firestore.document('/messages/{documentId}')
    .onCreate((
        snap: {
            data: () => { (): any; new(): any; original: any; };
            ref: {
                set: (
                    arg0: { uppercase: any; },
                    arg1: { merge: boolean; }
                ) => any;
            }
        },
        context: { params: { documentId: any; }; }) => {

        // Grab the current value of what was written to Firestore.
        const original = snap.data().original;

        // context.params で "{documentId}" というパラメータにアクセスする
        // {document}はワイルドカード
        functions.logger.log('Uppercasing', context.params.documentId, original);

        const uppercase = original.toUpperCase();

        // Firestoreへの書き込みなど、Functions内部で非同期な処理を行う場合はPromiseを返す必要がある
        // Firestoreドキュメントに'uppercase'フィールドを設定すると、Promiseが返る
        // 購読対象のドキュメントを定義している
        // callback関数は、null, object, Promiseのいづれかを返す必要がある
        // 何も返されない場合、関数はタイムアウトを行い、エラーを通知したのち、再試行される
        return snap.ref.set(
            { uppercase },
            { merge: true });
    });


// Create and Deploy Your First Cloud Functions
// https://firebase.google.com/docs/functions/write-firebase-functions

exports.helloWorld = functions.https.onRequest((request: any, response: { send: (arg0: string) => void; }) => {
    response.send("Hello from Firebase!");
});