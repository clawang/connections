import { collection, doc, addDoc, setDoc, getDoc, DocumentReference, DocumentData, FirestoreError, QueryDocumentSnapshot, SnapshotOptions, } from 'firebase/firestore';
import { database } from "./config";
import { GameData, GameAuthor } from '../app/types';

const dbInstance = collection(database, 'connections');

export async function addGame(data: GameData): Promise<{ result: DocumentReference, error: FirestoreError | undefined }> {
    let result, error;

    result = await addDoc(dbInstance, data).catch((e) => error = e);

    if (error) {
        console.log(error);
    }
    return { result, error };
}

export async function updateGame(slug: string, data: GameData): Promise<void> {
    await setDoc(doc(database, "connections", slug), data);
}

export async function getDataFromSlug(slug: string): Promise<{ result: GameData | null, error: string }> {
    const ref = doc(database, "connections", slug).withConverter(dataConverter);
    const document = await getDoc(ref);
    const data = document.data();

    if (data) {
        return { result: data, error: "" };
    } else {
        return { result: null, error: "Error." };
    }
}

const dataConverter = {
    toFirestore: (data: GameData): DocumentData => {
        let result: DocumentData = {
            categories: data.categories,
            title: data.title,
        };
        if (data.author) {
            result['author'] = {
                name: data.author.name,
                link: data.author.link
            };
        }
        return result;
    },
    fromFirestore: (snapshot: QueryDocumentSnapshot,
        options: SnapshotOptions) => {
        const data = snapshot.data(options);
        let result = { categories: data.categories, title: data.title, author: data.author } as GameData;
        if (data.author) {
            let author: GameAuthor = { name: data.author.name };
            if (data.author.link) {
                author.link = data.author.link;
            }
            result.author = author;
        }
        return result;
    }
};