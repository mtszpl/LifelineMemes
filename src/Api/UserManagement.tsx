import { FirebaseApp } from "firebase/app";
import { Firestore, getFirestore, collection, query, CollectionReference, DocumentData, Query, addDoc, updateDoc, doc, where, getDocs, getDoc } from "firebase/firestore"
import React, { useContext, useState } from "react";
import { collectionData } from "rxfire/firestore"
import { deleteImageFromProfileImageStore, FirebaseContext, getImageFromProfileImgStore, pushImageToProfileImgStore } from "./Firebase";

export const UserContext = React.createContext({ username: "", profileImg: "", role: "UNLOGGED" })

const hash = (input: string) => {
    const encoder = new TextEncoder().encode(input)
    return crypto.subtle.digest('SHA-256', encoder).then((hashBuffer) => {
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hashHex = hashArray
            .map((bytes) => bytes.toString(16).padStart(2, '0'))
            .join('');
        return hashHex;
    })
}

export const useLogIn = () => {
    const firebase: FirebaseApp = useContext(FirebaseContext)
    const [firestore] = useState<Firestore>(getFirestore(firebase))
    const [userData] = useState<CollectionReference<DocumentData>>(collection(firestore, "/Users"))
    const [userRole, setUserRole] = useState("UNLOGGED")

    const checkUser = (username: string, password: string, callback: Function) => {
        if (!username)
            return
        const q: Query<DocumentData> = query(userData, where("username", "==", username))
        return collectionData(q)
            .subscribe(users => {
                if (users.length === 0) {
                    alert("Username not found")
                    return
                }
                else
                    hash(password).then(passwordHash => {
                        if (users[0].password === passwordHash) {
                            setUserRole(users[0].Role)
                            callback({ username: users[0].username, profileImg: users[0].profileImg, role: users[0].role })
                            return users[0]
                        }
                        else
                            alert("Incorrect password")
                    })
            })
    }

    return [userRole, checkUser] as const
}

export const useRegisterUser = () => {
    const firebase: FirebaseApp = useContext(FirebaseContext)
    const [firestore] = useState<Firestore>(getFirestore(firebase))

    const registerUser = async (newUserName: string, newUserPassword: string, newUserRole?: string) => {
        const userData: CollectionReference<DocumentData> = collection(firestore, "/Users")
        const q: Query<DocumentData> = query(userData, where("username", "==", newUserName))
        return getDocs(q)
            .then((docRef) => {
                return docRef.empty
            })
            .then(async (userExists) => {
                if (userExists) {
                    await hash(newUserPassword).then(passwordHash => {
                        addDoc(collection(firestore, "Users"), {
                            id: Date.now(),
                            username: newUserName,
                            password: passwordHash,
                            role: newUserRole !== undefined ? newUserRole : "USER",
                            profileImg: "defaultAvatar.png"
                        })
                    })
                    return true
                }
                else {
                    alert("User already exists")
                    return Promise.reject(new Error("User already exists"))
                }
            })
    }
    return registerUser
}

export const useGetUser = () => {
    const firebase: FirebaseApp = useContext(FirebaseContext)
    const [firestore] = useState<Firestore>(getFirestore(firebase))
    const [gotUser, setGotUser] = useState({ username: undefined, profileImg: undefined })

    const updateGotUser = (username: string) => {
        const userData: CollectionReference<DocumentData> = collection(firestore, "/Users")
        const q: Query<DocumentData> = query(userData, where("username", "==", username))
        collectionData(q)
            .subscribe(users => {
                if (users.length === 0) {
                    alert("User not found")
                    return
                }
                else {
                    getImageFromProfileImgStore(users[0].profileImg, (url: any) => {
                        users[0].profileImg = url
                        setGotUser({ username: users[0].username, profileImg: users[0].profileImg })
                    })
                }
            })
    }

    return [gotUser, updateGotUser] as const
}

export const useGetUserById = () => {
    const firebase: FirebaseApp = useContext(FirebaseContext)
    const [firestore] = useState<Firestore>(getFirestore(firebase))
    const [gotUser, setGotUser] = useState({ username: undefined, profileImg: undefined })

    const updateGotUser = (id: string, callback?: Function) => {
        const docRef = doc(firestore, "Users", id)
        return getDoc(docRef).then(async (data) => {
            const newData = data.data()
            if (newData !== undefined) {
                await getImageFromProfileImgStore(newData.profileImg).then(url => {
                    newData.profileImg = url
                    setGotUser({ username: newData.username, profileImg: newData.profileImg })
                    return newData
                }).then((newData) => {
                    callback !== undefined && callback(newData)
                    return newData
                })
            }
            return newData
        })
    }

    return [gotUser, updateGotUser] as const
}

export const useUpdateUser = () => {
    const firebase: FirebaseApp = useContext(FirebaseContext)
    const [firestore] = useState<Firestore>(getFirestore(firebase))

    const updateUser = async (oldUserName: string, newUserName?: string, newUserPassword?: string, newProfileImg?: File, newUserRole?: string,
        callback?: Function) => {
        const userData: CollectionReference<DocumentData> = collection(firestore, "/Users")
        const q: Query<DocumentData> = query(userData, where("username", "==", oldUserName))
        const querySnapshot = await getDocs(q)
        querySnapshot.forEach(document => {
            if (!document.data().empty()) {
                let tmpPassword: string
                if (newUserPassword !== (undefined && ""))
                    tmpPassword = newUserPassword
                else
                    tmpPassword = document.data().password
                hash(tmpPassword).then(passwordHash => {
                    if (newProfileImg !== undefined)
                        updateProfileImg(newProfileImg, document.data().profileImg).then(result => {
                            let newUserData = {
                                username: newUserName !== (undefined || "") ? newUserName : document.data().username,
                                password: passwordHash,
                                role: newUserRole !== (undefined && "") ? newUserRole : document.data().role,
                                profileImg: newProfileImg !== undefined ? result.ref.name : document.data().profileImg
                            }
                            updateDoc(doc(firestore, "Users", document.id), newUserData)
                            callback !== undefined && callback(newUserData)
                            return
                        })
                    else {
                        let newUserData = {
                            username: newUserName !== (undefined || "") ? newUserName : document.data().username,
                            password: passwordHash,
                            role: newUserRole !== (undefined && "") ? newUserRole : document.data().role,
                            profileImg: document.data().profileImg
                        }
                        console.log(newUserData)
                        updateDoc(doc(firestore, "Users", document.id), newUserData)
                        callback !== undefined && callback(newUserData)
                    }
                })
            }

        })
    }
    return updateUser
}

export const updateProfileImg = (newImg: File, oldImageUrl: string) => {
    if (oldImageUrl !== "")
        deleteImageFromProfileImageStore(oldImageUrl)
    return pushImageToProfileImgStore(newImg)
}