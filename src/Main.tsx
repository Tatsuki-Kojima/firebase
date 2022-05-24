import { Button, TextField } from "@mui/material";
import React from "react";
import { useEffect, useState } from "react";
import { UserObject, SetUserDocument, SetSnapshot, DeleteUserDocument, LogoutUser, LoginUser } from "./firebase";

// UserNameからUserObjectを取得する
function GetUserObjectFromUserName(userName: string, userList: UserObject[]): UserObject | undefined {
    const users = userList;
    const user = users.find(user => user.name === userName)

    return user;
}

interface IRequireUserObject {
    userObjects: UserObject[],
}

// UserObjectをもとに、Userを表示する
function UserInfoViewr(props: IRequireUserObject) {
    interface IUserInfoInterface {
        userid: string,
        name: string,
        age: number,
    }

    function UserInfomain(data: IUserInfoInterface) {
        return (
            <div className="UserInfomation">
                <div>name: {data.name}</div>
                <div>age : {data.age}</div>
            </div>
        );
    }

    return (
        <div className="UserInfoViewr">
            <div> User List </div>
            {
                // nullなら <></> これを返す
                props == null ? <></> :
                    props.userObjects.map((user) => {
                        return (<UserInfomain userid={user.id} name={user.name} age={user.age} key={user.id} />);
                    })
            }
        </div>
    );
}

// Userを追加する機能を表示するコンポーネント
function AddUser(props: ILoginUser) {
    const addButtonOnClicked = () => {
        // ログイン中はアカウント作成を行えない
        if (name == "" || age < 0 || props.loginedUser)
            return;

        const createName = name; // 作成するアカウントの名前(idとは一致しない場合あり)

        const obj = GetUserObjectFromUserName(createName, props.userObjects)

        // すでに名前が使われているなら、拒否する
        if (obj != null)
            return;

        const userObject = {
            id: name,
            name: name,
            age: age,
            lastWritter: ""
        };

        SetUserDocument(userObject, false); // UserIdを使用してuidを更新を行わない(新規作成する)
        setName("");
        setAge(0);

        // 作成したアカウントでログインする
        props.setLoginedUser(userObject.name);
        LoginUser(userObject);
    }

    const [name, setName] = useState("");
    const [age, setAge] = useState(0);

    return (
        <div className="AddUserContainer">
            <TextField
                required
                id="standard-required"
                label="Name"
                variant="standard"
                size="small"
                value={name}
                onChange={(e) => { setName(e.target.value); }}
                helperText="user name here"
            />
            <TextField
                required
                id="standard-required-number"
                label="Age"
                type="number"
                InputLabelProps={{
                    shrink: true,
                }}
                variant="standard"
                size="small"
                value={age}
                onChange={(e) => { setAge(Number(e.target.value)); }}
                helperText="user age here"
            />

            <Button variant="outlined" onClick={addButtonOnClicked}>Add User</Button>
        </div>
    );
}

// ログインする
function UserLogin(userName: string, userObjects: UserObject[], setLoginedUser: React.Dispatch<React.SetStateAction<string | undefined>>) {
    const user = GetUserObjectFromUserName(userName, userObjects)
    if (user) {
        setLoginedUser(user.name);
        LoginUser(user);
    }
}

// 更新用のインターフェース
interface IUpdateUser {
    loginedUser: string | undefined,
    userObjects: UserObject[],
}

// User情報を更新するコンポーネント
function UpdateUser(props: IUpdateUser) {
    const addButtonOnClicked = () => {
        // ログインしていない場合を弾く(firestoreのルールでも弾いている)
        if (name == "" || age < 0 || !props.loginedUser || props.loginedUser == "")
            return;

        const loginedName = props.loginedUser;

        const obj = GetUserObjectFromUserName(loginedName, props.userObjects)

        if (obj == null) // 存在しないユーザーを更新しようとするのをはじく
            return;

        const userObject = {
            id: obj.id,
            name: name,
            age: age,
            lastWritter: props.loginedUser
        };

        SetUserDocument(userObject, true);
        setName("");
        setAge(0);
    }

    const [name, setName] = useState(""); // TextField用のstate
    const [age, setAge] = useState(0);

    return (
        <div className="AddUserContainer">
            <TextField
                required
                id="standard-required"
                label="Name"
                variant="standard"
                size="small"
                value={name}
                onChange={(e) => { setName(e.target.value); }}
                helperText="user name here"
            />
            <TextField
                required
                id="standard-required-number"
                label="Age"
                type="number"
                InputLabelProps={{
                    shrink: true,
                }}
                variant="standard"
                size="small"
                value={age}
                onChange={(e) => { setAge(Number(e.target.value)); }}
                helperText="user age here"
            />

            <Button variant="outlined" onClick={addButtonOnClicked}>Update User</Button>
        </div>
    );
}

// Userを削除する機能を表示するコンポーネント
function DeleteUser(props: ILoginUser) {
    const deleteButtonOnClicked = () => {
        const users = props.userObjects;
        const user = users.find(user => user.name === name)
        // ログインしていない場合、弾く(firestoreのルールでは、deleteは弾けなかった)
        if (user && user.name == props.loginedUser) {
            DeleteUserDocument(user);   // ドキュメントの削除
            LogoutUser(user);           // ログアウト
            props.setLoginedUser(undefined); // UIの更新
            setName("");
        }
    }

    const [name, setName] = useState("");

    return (
        <div className="DeleteUserContainer">
            <TextField
                required
                id="standard-required"
                label="Name"
                variant="standard"
                size="small"
                value={name}
                onChange={(e) => { setName(e.target.value); }}
                helperText="user name here"
            />

            <Button variant="outlined" onClick={deleteButtonOnClicked}>Delete User</Button>
        </div>
    );
}

// ログイン処理が絡むコンポーネント用のinterface
interface ILoginUser {
    userObjects: UserObject[],
    loginedUser: string | undefined,
    setLoginedUser: React.Dispatch<React.SetStateAction<string | undefined>>
}

// ログインする機能を表示するコンポーネント
function LoginUserComponent(props: ILoginUser) {
    const [textFieldValue, setFieldValue] = useState("");

    const LoginBottonOnClicked = () => {
        if (props.loginedUser)
            return;

        // ログインする
        UserLogin(textFieldValue, props.userObjects, props.setLoginedUser)
    }

    const LogoutButtonOnLClicked = () => {
        if (!props.loginedUser)
            return;

        const user = GetUserObjectFromUserName(props.loginedUser, props.userObjects);
        if (!user)
            return;

        // ログアウトする
        LogoutUser(user);
        props.setLoginedUser(undefined);
    }

    return (
        <div>
            {props.loginedUser ? <div>Logined, {props.loginedUser}</div> : <div>Not Logined</div>}

            <TextField
                required
                id="standard-required"
                label="Name"
                variant="standard"
                size="small"
                value={textFieldValue}
                onChange={(e) => setFieldValue(e.target.value)}
                helperText="user name here"
            />

            <Button variant="outlined" onClick={() => { LoginBottonOnClicked() }}>LOGIN</Button>
            <Button variant="outlined" onClick={() => { LogoutButtonOnLClicked() }}>LOGOUT</Button>
        </div>
    );
}

function UserInfoContainer() {
    // すべてのユーザーの情報
    const [userObjects, setUserObjects] = useState<UserObject[]>([]);
    // ログイン中のユーザー名
    const [LoginedUser, setLoginedUser] = useState<string | undefined>();

    // 始めの1回だけ表示する
    useEffect(() => {
        // get()で取得している snapshotで代用できたので、コメントアウトした
        /*
        if (promisedUserDocument.length === 0) {
            // 1度非同期関数を作らないといけない()
            const setDocument = async () => {
                // FirebaseからUserDocumentを配列形式で取得する
                const promiseUserDocs = await GetUserDocuments();

                setPromisedDocuments(promiseUserDocs);
            }

            setDocument();
        }
        */

        SetSnapshot(setUserObjects);
    }, []);

    return (
        <>
            <UserInfoViewr userObjects={userObjects} />
            <AddUser loginedUser={LoginedUser} userObjects={userObjects} setLoginedUser={setLoginedUser} />
            <UpdateUser loginedUser={LoginedUser} userObjects={userObjects} />
            <DeleteUser loginedUser={LoginedUser} userObjects={userObjects} setLoginedUser={setLoginedUser} />
            <LoginUserComponent userObjects={userObjects} loginedUser={LoginedUser} setLoginedUser={setLoginedUser} />
        </>
    );
}

export function MainContainer() {
    return (
        <div>
            <UserInfoContainer />
        </div>
    );
}
