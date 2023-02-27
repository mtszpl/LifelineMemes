import { FirebaseApp } from "firebase/app";
import { Firestore, getFirestore, collection, query, CollectionReference, DocumentData, Query, addDoc, updateDoc, doc, where, getDocs, getDoc, QueryDocumentSnapshot } from "firebase/firestore"
import React, { useContext, useState } from "react";
import { collectionData } from "rxfire/firestore"
import { deleteImageFromProfileImageStore, FirebaseContext, getImageFromProfileImgStore, pushImageToProfileImgStore } from "./Firebase";

export const UserContext = React.createContext({ id: "", username: "", profileImg: "", role: "UNLOGGED" })
//UNLOGGED

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

    const checkUser = async (username: string, password: string) => {
        if (!username)
            return
        const q: Query<DocumentData> = query(userData, where("username", "==", username))
        return getDocs(q).then(async documents => {
            let user: any = undefined
            let tmp: any
            let i: number = 0
            documents.forEach(document => {
                if (i++ === 0)
                    user = document.data()
            })
            if (i > 1) {
                alert(`Username ${username}, ${password} not found`)
                return
            }
            else
                await hash(password).then(passwordHash => {
                    if (user.password === passwordHash) {
                        setUserRole(user.Role)
                        return tmp = user
                    }
                    else{
                        alert("Incorrect password")
                        return tmp
                    }
                })
            return tmp
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
                    let newData = {
                        id: Date.now(),
                        username: newUserName,
                        password: newUserPassword,
                        role: newUserRole !== undefined ? newUserRole : "USER",
                        profileImg: "defaultAvatar.png"
                    }
                    await hash(newUserPassword).then(passwordHash => {
                        newData.password = passwordHash
                        addDoc(collection(firestore, "Users"), newData)
                    })
                    return newData
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
                if (users.length === 0)
                    return 0
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

export const useGetUserByDocumentId = () => {
    const firebase: FirebaseApp = useContext(FirebaseContext)
    const [firestore] = useState<Firestore>(getFirestore(firebase))
    const [gotUser, setGotUser] = useState({ username: undefined, profileImg: undefined })

    const updateGotUser = (id: string, callback?: Function) => {
        return getDoc(doc(firestore, "Users", id)).then(async (data) => {
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

    const updateUser = async (oldUserName: string, newUserName?: string, newUserPassword?: string, newProfileImg?: File, newUserRole?: string,) => {
        const userData: CollectionReference<DocumentData> = collection(firestore, "/Users")
        const q: Query<DocumentData> = query(userData, where("username", "==", oldUserName))
        let firstDoc: QueryDocumentSnapshot<DocumentData>
        await getDocs(q).then(documents => {
            let i = 0
            documents.forEach(document => {
                if (i === 0)
                    firstDoc = document
            })
        })
        return hash(newUserPassword === undefined ? "" : newUserPassword).then(async passwordHash => {
            let tmpPassword: string
            let newestUserData: any
            if (newUserPassword === "" || newUserPassword === undefined)
                tmpPassword = firstDoc.data().password
            else
                tmpPassword = passwordHash
            if (newProfileImg !== undefined)
                await updateProfileImg(newProfileImg, firstDoc.data().profileImg
                ).then(result => {
                    let newUserData = {
                        username: newUserName !== (undefined || "") ? newUserName : firstDoc.data().username,
                        password: tmpPassword,
                        role: newUserRole !== (undefined && "") ? newUserRole : firstDoc.data().role,
                        profileImg: newProfileImg !== undefined ? result.ref.name : firstDoc.data().profileImg
                    }
                    updateDoc(doc(firestore, "Users", firstDoc.id), newUserData)
                    newestUserData = newUserData
                })
            else {
                let newUserData = {
                    username: newUserName !== (undefined || "") ? newUserName : firstDoc.data().username,
                    password: tmpPassword,
                    role: newUserRole !== (undefined && "") ? newUserRole : firstDoc.data().role,
                    profileImg: firstDoc.data().profileImg
                }
                updateDoc(doc(firestore, "Users", firstDoc.id), newUserData)
                newestUserData = newUserData
            }
            return newestUserData
        })
    }
    return updateUser
}

export const useGetUserDocID = () => {
    const firebase: FirebaseApp = useContext(FirebaseContext)
    const [firestore] = useState<Firestore>(getFirestore(firebase))

    const getUser = (userName: string) => {
        const userData: CollectionReference<DocumentData> = collection(firestore, "/Users")
        const q: Query<DocumentData> = query(userData, where("username", "==", userName))
        return getDocs(q).then(documents => {
            let id: string | undefined = undefined
            let i = 0
            documents.forEach((document) => {
                if (i < 1)
                    id = document.id
                i++
            })
            return id
        })
    }
    return getUser
}

export const updateProfileImg = (newImg: File, oldImageUrl: string) => {
    if (oldImageUrl !== "")
        deleteImageFromProfileImageStore(oldImageUrl)
    return pushImageToProfileImgStore(newImg)
}