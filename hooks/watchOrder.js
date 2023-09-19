import { collection, query, where, doc, getDoc, getFirestore, onSnapshot } from 'firebase/firestore';
import { useState, useEffect } from 'react';
import { useAuth } from "@contexts/auth";
import { firebase } from 'config/firebase';

const firestore = getFirestore(firebase);

export const orderUserPending = (status = 'pending') => {
    const { user } = useAuth();
    const [collectionData, setCollectionData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!user || !user.id) {
            return;
        }

        const orderQuery = query(collection(firestore, 'orders'), where("userId", "==", user.id), where("status", "==", status));

        const unsubscribe = onSnapshot(orderQuery, (querySnapshot) => {
            const data = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
            setCollectionData(data);
            setLoading(false);
        }, (error) => {
            console.error(error);
            setError(error);
        });

        return () => {
            unsubscribe();
        };
    }, [user, firestore, status]);

    return { data: collectionData, loading, error };
}

export const orderUser = (id) => {
    const [data, setCollectionData] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!id) {
            return;
        }

        const ordersCollection = collection(firestore, 'orders');
        const orderDocRef = doc(ordersCollection, id);

        const unsubscribe = onSnapshot(orderDocRef, (docRef) => {
            if (docRef.exists()) {
                setCollectionData({...docRef.data(), id: docRef.id});
            }
            setLoading(false);
        }, (error) => {
            console.error(error);
        });

        return () => {
            unsubscribe();
        };
    }, [firestore, id]);

    return { data, loading };
};

export const orderUserProcess = () => orderUserPending("process")

export const orderUserCompleted = () => orderUserPending("completed")

export const orderVendorPending = () => {
    const { user } = useAuth();
    const [collectionData, setCollectionData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    useEffect(() => {
        if (!user || !user.id || !user.city) {
            return;
        }

        const orderQuery = query(collection(firestore, 'orders'), where("status", "==", "pending"), where("location","==",user.city));

        const unsubscribe = onSnapshot(orderQuery, (querySnapshot) => {
            let data = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
            data = data.map(order => {
                if(order.requests?.find(request => request.vendorId === user.id)){
                    order.alreadyBid = true;
                }
                return order;
            })
            setCollectionData(data);
            setLoading(false);
        }, (error) => {
            console.error(error);
            setError(error);
        });

        return () => {
            unsubscribe();
        };
    }, [user, firestore]);

    return { data: collectionData, loading, error }
}

export const orderVendorProcess = (status = 'process') => {
    const { user } = useAuth();
    const [collectionData, setCollectionData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!user || !user.id) {
            return;
        }

        const orderQuery = query(collection(firestore, 'orders'), where("vendorId", "==", user.id), where("status", "==", status));

        const unsubscribe = onSnapshot(orderQuery, (querySnapshot) => {
            let data = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
            setCollectionData(data);
            setLoading(false);
        }, (error) => {
            console.error(error);
            setError(error);
        });

        return () => {
            unsubscribe();
        };
    }, [user, firestore, status]);

    return { data: collectionData, loading, error };
}

export const orderVendorCompleted = () => orderVendorProcess("completed");