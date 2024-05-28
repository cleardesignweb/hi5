// UserSearchScreen.js

import React, { useState, useEffect } from 'react';
import { View, TextInput, FlatList, Text, TouchableOpacity, StyleSheet, Image, Dimensions, ActivityIndicator } from 'react-native';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../data/Firebase'; // Import your Firebase configuration
import { Ionicons } from '@expo/vector-icons';
import { CommonActions, useNavigation } from '@react-navigation/native';
import { useAuth } from '../auth/AuthContext';
import Divider from './Divider';
  const Search = () => {
    const [loading, setIsLoading] = useState(null)
    const {user} = useAuth()
    const uid =  user.uid;
    const navigateToProfile = (userId) => {
        // console.log('Navigating to Profile screen with user ID:', userId);
        navigation.dispatch(
          CommonActions.navigate({
            name: 'UserProfileScreen',
            params: { uid: userId },
          })
        );
      }; 
   const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const navigation = useNavigation()
  const handleSearch = async () => {
    try {
      // Perform a Firestore query to search for users
      const q = query(collection(db, 'profileUpdate'), where('displayName',  '>=', searchQuery));
      const querySnapshot = await getDocs(q);

      const results = [];
      querySnapshot.forEach((doc) => {
        const user = doc.data();
        results.push(user);
      });

      setSearchResults(results);
      setIsLoading(false)
    } catch (error) {
      console.error('Error searching users:', error);
    }
  };

  // Optional: Trigger the search when the component mounts
  // useEffect(() => {
  //   handleSearch();
  // }, []);

  return (
    <View style={styles.searchContainer}>
   
 <View style={styles.searchContentInfos}>
<TouchableOpacity onPress={()=>navigation.navigate('Home')} style={styles.searchIcon}>
<Ionicons name='arrow-back-outline' color={'#000000'} size={30}  />
</TouchableOpacity>
 <View style={styles.searchContent}> 
 <TextInput
        placeholder="Search users..."
        value={searchQuery}
        onChangeText={(text) => setSearchQuery(text)}
        onSubmitEditing={handleSearch}
        style={styles.searchBar}
      />
    <TouchableOpacity onPress={handleSearch}>
        <Ionicons name='search' color={'#000000'} size={24}/>
    </TouchableOpacity> 
</View>
 </View>
{loading ? (
  <View style={[styles.container, styles.horizontal]}>
  <ActivityIndicator size="large" color="tomato" />
</View>
) : (
  <FlatList
  data={searchResults}
  keyExtractor={(item, index) => (item.userId ? item.userId.toString() : index.toString())}
  renderItem={({ item }) => (
    <TouchableOpacity key={item.userId || item.username || item.email}>
      <View style={styles.searchInfo}>       
      <TouchableOpacity onPress={() => navigateToProfile(item.uid)}>
      <Image source={{ uri: item.editedProfileImage }} style={styles.profileImage} />
      </TouchableOpacity>
        <View>
          <Text style={styles.displayName}>{item.displayName}</Text>
          <Text style={styles.username}>{item.username}</Text>
        </View>
      </View>
      <Divider/>

    </TouchableOpacity>
    
  )}
/>
)}
     </View>
  );
};

export default Search;

const styles = StyleSheet.create({
    searchContent: {
        marginTop: 40,
        flexDirection: 'row',
        justifyContent:'space-between',
        backgroundColor: '#ECECEC',
        margin: 10,
        height: 50,
        borderRadius:20, 
        padding:7,
        alignItems: 'center',
        width: Dimensions.get('window').width * .85,
     },    
    searchContentInfos:{
        flexDirection: 'row',
        alignItems: 'center', 
    },
    searchBar: {
        color: '#000'
    },
    profileImage: {
        width: 50,
        height:50,
        borderRadius: 50,
    },
    searchInfo:{
        flexDirection: 'row',
        margin: 10,
     },
    displayName: {
        marginLeft: 10,
        fontWeight: 'bold',
        fontSize: 20,
    },
    username: {
        marginLeft: 10
    },
    searchIcon: {
        marginTop:20,
       marginLeft:10
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
 
})

