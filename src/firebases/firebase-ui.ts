import firebaseui from "firebaseui";

const firebase = require("firebase");
const firebaseUi = require("firebaseui");

var ui = new firebaseui.auth.AuthUI(firebase.auth());

ui.start('#firebaseui-auth-container', {
    signInOptions: [
        {
            provider: firebase.auth.EmailAuthProvider.PROVIDER_ID,
            requireDisplayName: false
        }
    ]
});

export default {}