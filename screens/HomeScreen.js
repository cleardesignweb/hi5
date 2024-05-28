import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Image, TouchableOpacity, ScrollView, ActivityIndicator, Platform } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { collection, orderBy, query, getDocs } from 'firebase/firestore';
import { db } from '../data/Firebase';
import PostPicture from '../components/PostPicture';
 

   const HomeScreen = () => {
  const [postData, setPostData] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {    
          const FetchPostData = async () => {
           const citiesRef = collection(db, 'posts');           
          const querySnapshot = query(citiesRef, orderBy('createdAt', 'desc'));                        
          const snapshot = await getDocs(querySnapshot);
           const documents = snapshot.docs.map((doc) => ({
           id: doc.id,
              ...doc.data(),
             }));
             setPostData(documents);
             setLoading(false)
        };            
      FetchPostData();
     
  }) 
 
  return (
    <View style={styles.HomeContainer}>      
      <StatusBar backgroundColor="#FFA07A" />
    {/* <Button title="Show Interstitial Ad" onPress={showInterstitial} /> */}  
    
      <ScrollView>
      <View style={styles.homeHeader}>
        {/* <Image source={require('../assets/Thlorall.png')} style={styles.logo} /> */}
      
      </View>
        {loading ? (
          <View style={[styles.container, styles.horizontal]}>
            <ActivityIndicator size="large" color="tomato" />
          </View>
        ) : (
          <View>
            {postData.map((post, index) => (
              <View key={index}>
                <PostPicture post={post} />
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  HomeContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  homeHeader: {
    marginTop: Platform.OS === 'ios' ? -9 : 27,
    backgroundColor: '#fff',
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  logo: {
    width: '40%',
    height: 50,
    alignItems: 'center',
    alignSelf: 'flex-start',
  },
  searchIcon: {
    marginRight: 10,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  horizontal: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10,
  },
});
