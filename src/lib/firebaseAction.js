import {
    doc,
    getDoc,
    setDoc,
    collection,
    getDocs,
    updateDoc,
    deleteDoc, // ✅ Missing import added
    addDoc,
    query,
    where
} from 'firebase/firestore';
import { db } from '@/lib/firebase'; // ✅ Make sure `db` is correctly initialized

// Create or overwrite a document
export const createData = async (_collection, data) => {
    await addDoc(collection(db, _collection), data);
};

// Get a document by ID
export const getDataId = async (_collection, id) => {
    const docRef = doc(db, _collection, id);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? docSnap.data() : null;
};

// Get all documents in a collection
export const getDataList = async (_collection) => {
    const querySnapshot = await getDocs(collection(db, _collection));
    const data = [];
    querySnapshot.forEach((docSnap) => {
        data.push({ id: docSnap.id, ...docSnap.data() }); // 🔍 optionally include doc ID
    });
    return data;
};

// Update a document
export const updateData = async (_collection, id, data) => {
    await updateDoc(doc(db, _collection, id), data);
};

// Delete a document
export const deleteData = async (_collection, id) => {
    await deleteDoc(doc(db, _collection, id));
};

export const getDataByKey = async (id, key, _collection) => {
    const q = query(
        collection(db, _collection),
        where(key, '==', id)
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};