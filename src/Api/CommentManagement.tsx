import { FirebaseApp } from "firebase/app"
import { Firestore, getFirestore, addDoc, collection, CollectionReference, DocumentData, query, Query, where, getDocs } from "firebase/firestore"
import { useContext, useState } from "react"
import { collectionData } from "rxfire/firestore"
import { FirebaseContext } from "./Firebase"
import { useGetUserByDocumentId } from "./UserManagement"

export const useUploadComment = () => {
    const firebase: FirebaseApp = useContext(FirebaseContext)
    const [firestore,] = useState<Firestore>(getFirestore(firebase))

    const uploadComment = async (author: string, commentedPost: string, content: string) => {
        const userData: CollectionReference<DocumentData> = collection(firestore, "/Users")
        const q: Query<DocumentData> = query(userData, where("username", "==", author))
        const querySnapshot = await getDocs(q).then()
        querySnapshot.forEach(document => {
            addDoc(collection(firestore, "Comments"), {
                author: document.id,
                commentedPostTitle: commentedPost,
                content: content,
                timestamp: Date.now()
            })
        })
    }
    return uploadComment
}

export const useGetComments = () => {
    const firebase: FirebaseApp = useContext(FirebaseContext)
    const [firestore,] = useState<Firestore>(getFirestore(firebase))
    const [, getAuthor] = useGetUserByDocumentId()
    const [commentArray, setComments] = useState<{
        author: string
        commentedPost: string
        content: string
        timestamp: number
    }[]>([])

    const updateComments = async (post: string, callback?: Function) => {
        const commentData: CollectionReference<DocumentData> = collection(firestore, "/Comments")
        const q: Query<DocumentData> = query(commentData, where("commentedPostTitle", "==", post))
        let newCommentsArray: {
            author: string
            commentedPost: string
            content: string
            timestamp: number
        }[] = []

        return getDocs(q)
            .then(async (docRef) => {
                docRef.forEach(document => {
                    let tmp = {
                        author: document.data().author,
                        commentedPost: document.data().commentedPostTitle,
                        content: document.data().content,
                        timestamp: document.data().timestamp
                    }
                    newCommentsArray.push(tmp)
                    newCommentsArray.sort((a, b) => {
                        if (a.timestamp === undefined && b.timestamp === undefined)
                            return 0
                        if (b.timestamp === undefined)
                            return -1
                        if (a.timestamp === undefined)
                            return 1
                        return a.timestamp > b.timestamp ? -1 : b.timestamp > a.timestamp ? 1 : 0
                    })
                })
                return newCommentsArray
            })
    }

    return [commentArray, updateComments] as const
} 