import React, { useState, useEffect } from 'react';
import { FlatList, Image, StyleSheet, Text, View, Dimensions, ScrollView } from 'react-native';
import { getAuth, signOut, onAuthStateChanged } from 'firebase/auth';
import {
  collection,
  where,
  query,
  getDocs,
  getDoc,
  doc,
  orderBy,
  collectionGroup,
} from 'firebase/firestore';
import { auth, db } from '../../data/Firebase';
import { Video } from 'expo-av';

const UserVideo = () => {
  const [userData, setUserData] = useState([]);

  // Fetching personal user's data
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        const uid = user.uid;
        const fetchUserData = async () => {
          const timestamp = ('timestamp', 'desc');
          const citiesRef = collection(db, 'videos');
          const querySnapshot = query(citiesRef, where('uid', '==', uid));
          orderBy(timestamp);
          const snapshot = await getDocs(querySnapshot);
          const documents = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setUserData(documents);
        };
        fetchUserData();
      }
    });
  }, []);

 

  return (
    <View style={styles.container}>
    {userData.map((data, index) => (
      <View key={index} style={styles.imageContainer}>
         <Video
        source={{ uri:  data.video }}
        rate={1.0}  
        volume={1.0}  
        isMuted={false}  
        resizeMode="cover" 
        shouldPlay={false}  
         isLooping={false}  
        useNativeControls  
         style={styles.video}
      />
      </View>
    ))}
  </View>
  );
};

export default UserVideo;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: '100%',
  },
  imageContainer: {
    width: '45%', // Three images per row
    marginBottom: 10,
    marginLeft: 10
  },
  video: {
    width: '100%',
    height: 200,
  },
});
 