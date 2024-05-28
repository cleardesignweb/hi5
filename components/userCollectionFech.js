import { doc, getDoc } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { ToastAndroid } from 'react-native'; // Use ToastAndroid for native Android toast
import { db } from '../data/Firebase';
 
const userCollectionFech = (collectionName, documentID) => {
  const [document, setDocument] = useState(null);
  const [loading, setLoading] = useState(null)
    
  const getDocument = async () => {
    const docRef = doc(db, collectionName, documentID);
    try {
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const obj = {
          id: documentID,
          ...docSnap.data(),
        };
        setLoading(false)
        setDocument(obj);
      } else {
        ToastAndroid.showWithGravity(
          'Document not found',
          ToastAndroid.SHORT,
          ToastAndroid.CENTER
        );
      }
    } catch (error) {
      console.error('Error fetching document:', error);
      ToastAndroid.showWithGravity(
        'Error fetching document',
        ToastAndroid.SHORT,
        ToastAndroid.CENTER
      );
    }
  };

  useEffect(() => {
    getDocument();
  }, []);

  return { document, loading };
};

export default userCollectionFech;
