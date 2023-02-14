import { FirebaseApp } from "firebase/app"
import { Firestore, getFirestore, CollectionReference, DocumentData, collection, query, addDoc } from "firebase/firestore"
import { useContext, useState } from "react"
import { collectionData } from "rxfire/firestore"
import { FirebaseContext, getImageFromMemeStore, pushImageToMemeStore } from "./Firebase"
import { useGetUserDocID } from "./UserManagement"

export const useGetMemes = () => {
    const firebase: FirebaseApp = useContext(FirebaseContext)
    const [firestore,] = useState<Firestore>(getFirestore(firebase))
    const [memeArray, setMemeArray] = useState<{
        id: number
        title: string
        dataLink: string
        author: string
        timestamp: number
    }[]>([])

    const getUserId = useGetUserDocID()

    const getMemes = (username?: string) => {
        const memeData: CollectionReference<DocumentData> = collection(firestore, "/Memes")
        return collectionData(query(memeData))
        .subscribe(async memes => {
                setMemeArray([])
                if (username !== undefined){
                    await getUserId(username).then((id) => 
                        memes = memes.filter(meme => meme.author === id)
                    )
                }
                if (memes.length === 0) 
                    return                
                else {
                    const newMemeArray: {
                        id: number,
                        title: string,
                        author: string,
                        dataLink: string,
                        timestamp: number
                    }[] = []
                    memes.map(async (meme, i) => {
                        await getImageFromMemeStore(meme.dataLink)
                            .then((dataLinkUrl) => {
                                let tmp = {
                                    id: i,
                                    title: meme.Title,
                                    author: meme.author,
                                    dataLink: dataLinkUrl,
                                    timestamp: meme.timestamp
                                }
                                newMemeArray.push(tmp)
                            })
                        newMemeArray.sort((a, b) => {
                            if (a.timestamp === undefined && b.timestamp === undefined)
                                return 0
                            if (b.timestamp === undefined)
                                return -1
                            if (a.timestamp === undefined)
                                return 1
                            return a.timestamp > b.timestamp ? -1 : b.timestamp > a.timestamp ? 1 : 0
                        })
                        setMemeArray([...newMemeArray])
                    })
                }
            })
    }
    return [memeArray, getMemes] as const
}

export const useGetOneMeme = () => {
    const firebase: FirebaseApp = useContext(FirebaseContext)
    const [firestore, ] = useState<Firestore>(getFirestore(firebase))
    const [meme, setMeme] = useState<{
        id: number
        title: string
        dataLink: string
        author: string
        timestamp: number
    }>()

    const getMemes = (clearTitle: string, callback: Function) => {
        const memeData: CollectionReference<DocumentData> = collection(firestore, "/Memes")
        collectionData(query(memeData))
            .subscribe(memes => {
                if (clearTitle !== undefined) {
                    memes = memes.filter(meme =>
                        meme.clearTitle === clearTitle)
                    if (memes.length === 0) {
                        return
                    }
                    getImageFromMemeStore(memes[0].dataLink, (url: string) => {
                        memes[0].dataLink = url
                        let newMeme = {
                            id: memes[0].timestamp,
                            title: memes[0].Title,
                            dataLink: memes[0].dataLink,
                            author: memes[0].author,
                            timestamp: memes[0].timestamp,
                            clearTitle: memes[0].clearTitle,
                            tags: []
                        }
                        setMeme(newMeme)
                        callback !== undefined &&
                            callback(newMeme)
                    })
                }
            })
    }
    return [meme, getMemes] as const
}

export const useUploadMeme = () => {
    const firebase: FirebaseApp = useContext(FirebaseContext)
    const [firestore,] = useState<Firestore>(getFirestore(firebase))

    const uploadMeme = (
        title: string,
        dataLink: File,
        author: string,
    ) => {
        pushImageToMemeStore(dataLink).then(snapshot => {
            addDoc(collection(firestore, "Memes"), {
                Title: title,
                clearTitle: title.replace(/[^\w\s']|_/g, "")
                    .replace(/\s+/g, "-"),
                dataLink: dataLink.name,
                author: author,
                timestamp: Date.now()
            })            
        })
    }
    return uploadMeme
}