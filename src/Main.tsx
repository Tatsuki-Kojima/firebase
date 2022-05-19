import { Button, TextField } from "@mui/material";
import React from "react";
import { useEffect, useState } from "react";
import { GetUserDocuments, UserObject, SetUserDocument, SetSnapshot, DeleteUserDocument } from "./firebase";

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

interface IRequireUserObject {
    promisedUserDocument: UserObject[],
}

function UserInfoViewr(props: IRequireUserObject) {
    return (
        <div className="UserInfoViewr">
            <div> User List </div>
            {
                // nullならmap関数は呼び出さない
                props.promisedUserDocument?.map((user) => {
                    return (<UserInfomain userid={user.id} name={user.name} age={user.age} key={user.id} />);
                })}
        </div>
    );
}

function AddUser() {
    const addButtonOnClicked = () => {
        SetUserDocument({ id: name, name: name, age: age }, false);
    }

    const [name, setName] = useState("");
    const [age, setAge] = useState(0);

    return (
        <>
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
        </>
    );
}

function DeleteUser(props: IRequireUserObject) {
    const deleteButtonOnClicked = () => {
        const users = props.promisedUserDocument;
        const user = users.find(user => user.name === name)
        if (user)
            DeleteUserDocument(user);
    }

    const [name, setName] = useState("");

    return (
        <>
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
        </>
    );
}

function UserInfoContainer() {
    const [promisedUserDocument, setPromisedDocuments] = useState<UserObject[]>([]);

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

        SetSnapshot(setPromisedDocuments);
    }, []);

    function GetUserDocument() { return promisedUserDocument; }

    return (<>
        <UserInfoViewr promisedUserDocument={promisedUserDocument} />
        <AddUser />
        <DeleteUser promisedUserDocument={promisedUserDocument} />
    </>);
}

export function MainContainer() {
    return (
        <div>
            <UserInfoContainer />
        </div>
    );
}
