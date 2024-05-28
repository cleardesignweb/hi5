import React, { useState, useEffect } from 'react';
import { FlatList, Image, StyleSheet, Text, View, Dimensions, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
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
import { useNavigation } from '@react-navigation/native';
  
const UserPhoto = () => {
  const [userData, setUserData] = useState([]);
  const [loading, setLoading] = useState(null)
  const navigation = useNavigation()
  // Fetching personal user's data
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        const uid = user.uid;
        const fetchUserData = async () => {
          const timestamp = ('timestamp', 'desc');
          const citiesRef = collection(db, 'posts');
          const querySnapshot = query(citiesRef, where('uid', '==', uid));
          orderBy(timestamp);
          const snapshot = await getDocs(querySnapshot);
          const documents = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setUserData(documents);
          setLoading(false)
        };
        fetchUserData();
      }
    });
  }, []);

 

  return (
   (loading ? (
    <View>
      <ActivityIndicator/>
    </View>
   ) : (
    <View style={styles.container}>
    {userData.map((data, index) =>{
      const {id, image} = data
      return (
        <View key={index} style={styles.imageContainer}>
        <TouchableOpacity onPress={() => navigation.navigate('postDetail', { id })}>
        <Image source={{ uri:  image }} alt="userImages" style={styles.userPhotos} />
        </TouchableOpacity>
      </View>
      )
    })}
  </View>
   ))
  );
};

export default UserPhoto;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: '100%',
  },
  imageContainer: {
    width: '30%', // Three images per row
    marginBottom: 10,
     marginLeft: 10
   },
  userPhotos: {
    width: '100%',
    height: 130,
    borderRadius: 20
  },
});
