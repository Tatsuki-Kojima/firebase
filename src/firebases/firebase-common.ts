import { initializeApp } from "firebase/app";

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

export const firebaseApp = initializeApp(firebaseConfig);

// コンソール出力を行う
export function PrintToConsole(log: any, ...optionalParams: any[]) {
    if (USE_CONSOLE_LOG)
        console.log(log, optionalParams);
} 