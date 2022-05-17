import { useEffect, useState } from "react";
import { GetUserDocuments, UserObject } from "./firebase.ts";

interface IUserInterface {
    id: string,
    name: string,
    age: number,
}

function User(data: IUserInterface) {
    return (
        <div>
            <div>name: {data.name}</div>
            <div>age : {data.age}</div>
        </div>
    );
}

interface IUserContainerInterface {
    users: UserObject[],
}

function UserContainer(props: IUserContainerInterface) {
    const users = props.users;

    console.log("UserContainer", users);

    if (!users)
        return <></>;

    return (
        <div>
            {users.map((user) => {
                return (<User id={user} name={user.name} age={user.age} />)
            })}
        </div>
    );
}

function UnPromised<T>(promise: Promise<T>): T | null {
    let result = null;

    if (!promise)
        return result;

    promise
        .then((unpack) => {
            result = unpack;
        })
        .catch((e) => { throw new Error(e) })

    console.log("unpacked result: ", result);
    return result;
}

export function MainContainer() {
    const [promisedUserDocument, setPromisedDocuments] = useState<UserObject[]>(null);

    useEffect(() => {
        if (promisedUserDocument === null) {
            let promiseUserDocs;
            const getUserDocs = async () => {
                promiseUserDocs = await GetUserDocuments();
            }
            getUserDocs();
            setPromisedDocuments(UnPromised<UserObject[]>(promiseUserDocs));
        }
    }, [promisedUserDocument]);

    console.log(promisedUserDocument);

    return (
        <div>
            <UserContainer users={promisedUserDocument} />
        </div>
    );
}