import { initializeApp } from "firebase/app"
import { deleteObject, getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import React from "react"

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

export const FirebaseContext = React.createContext(initializeApp({
    apiKey: "AIzaSyA84C6tEcpeWFQh1pkED5yOTVc04d6WsFo",

    authDomain: "memepageproject-5dadd.firebaseapp.com",

    projectId: "memepageproject-5dadd",

    storageBucket: "memepageproject-5dadd.appspot.com",

    messagingSenderId: "909484227053",

    appId: "1:909484227053:web:ff223b51726b0542ec4fe4"
}))

export const getImageFromMemeStore = async (url: string, imageSetterCallback?: Function) => {
    const storage = getStorage()
    return getDownloadURL(ref(storage, "/memes/" + url))
        .then((url) => {
            imageSetterCallback !== undefined && imageSetterCallback(url)
            return url
        })
}

export const pushImageToMemeStore = async (image: File, callback?: Function) => {
    const storage = getStorage()
    const storageRef = ref(storage, "/memes/" + image.name)
    return uploadBytes(storageRef, image)
}

export const getImageFromProfileImgStore = async (url: string, imageSetterCallback?: Function) => {
    if(url === (undefined || "")){
        imageSetterCallback !== undefined && imageSetterCallback("")
        return
    }
    const storage = getStorage()
    return getDownloadURL(ref(storage, "profileImg/" + url))
        .then((url) => {
            imageSetterCallback !== undefined && imageSetterCallback(url)
            return url
        }).catch(e => console.log(e.message))
}

export const pushImageToProfileImgStore = async (image: File, callback?: Function) => {
    const storage = getStorage()
    const storageRef = ref(storage, "profileImg/" + image.name)
    return uploadBytes(storageRef, image).then(snapshot => {
        callback !== undefined && callback(snapshot.ref.name)
        return snapshot
    })
}

export const deleteImageFromProfileImageStore = async (url: string) => {
    const storage = getStorage()
    const storageRef = ref(storage, "profileImg/" + url)
    return deleteObject(storageRef)
}