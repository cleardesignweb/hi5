import { doc, getDoc } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { ToastAndroid } from 'react-native'; // Use ToastAndroid for native Android toast
import { db } from '../data/Firebase';
import { useAuth } from '../auth/AuthContext';
 const FecthUserProfile = (collectionName, documentID) => {
  const [userprofile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(null)
 const {user} = useAuth()
  const getDocument = async () => { 
    const docRef = doc(db, collectionName, documentID);
    try {
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const obj = {
          id: documentID,
          user:user.uid,
          ...docSnap.data(),
        };
        setLoading(false)
        setUserProfile(obj);
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

  return { userprofile, loading };
};

export default FecthUserProfile;
