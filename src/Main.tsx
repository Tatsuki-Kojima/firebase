import { wait } from "@testing-library/user-event/dist/utils";
import { useEffect, useState } from "react";
import { GetUserDocuments, UserObject } from "./firebase.ts";

interface IUserInterface {
    id: string,
    name: string,
    age: number,
}

function UserInfomain(data: IUserInterface) {
    return (
        <div className="UserInfomation">
            <div>name: {data.name}</div>
            <div>age : {data.age}</div>
        </div>
    );
}

function UserInfoContainer() {
    const [promisedUserDocument, setPromisedDocuments] = useState<UserObject[]>(null);

    useEffect(() => {
        if (promisedUserDocument === null) {
            const setDocument = async () => {
                const promiseUserDocs = await GetUserDocuments();

                setPromisedDocuments(promiseUserDocs);
            }

            setDocument();
        }
    }, [promisedUserDocument]);

    return (
        <div className="UserInfoContainer">
            {
                // nullならmap関数は呼び出さない
                promisedUserDocument?.map((user) => {
                    return (<UserInfomain id={user} name={user.name} age={user.age} key={user.id} />)
            })}
        </div>
    );
}

export function MainContainer() {


    return (
        <div>
            <UserInfoContainer />
        </div>
    );
}
