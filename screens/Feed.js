import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
  import MaterialCommunityIcons from 'react-native-vector-icons/MaterialIcons';
  import Ionicons from '@expo/vector-icons/Ionicons';
  import { Image, View} from 'react-native'

 import HomeScreen from '../screens/HomeScreen'
import Profile from '../screens/Profile'
import AddPost from '../components/AddPost';
import {onAuthStateChanged } from "firebase/auth";
import {collection , where, query, getDocs, getDoc, doc, orderBy, collectionGroup, } from "firebase/firestore";
import  { useState, useEffect } from 'react';
import { auth, db } from '../data/Firebase';
import Search from '../components/Search';
const Tab = createMaterialBottomTabNavigator();
  

function MyTabs() {
  const [updateData, setUpdateData] = useState([]); 
  const profileThumnail = 'https://cdn-icons-png.flaticon.com/512/3106/3106773.png'
  // Feching Updated profile data
 useEffect(() => {
  onAuthStateChanged(auth, (user)=>{
    if (user){
      const uid =  user.uid;
       const fetchEditedProfile = async () => {
        const timestamp = ('timestamp', 'desc')
          const citiesRef = collection(db, 'profileUpdate');
        const querySnapshot = query(citiesRef, 
          where("uid", "==", uid));             
        orderBy(timestamp);
        const snapshot = await getDocs(querySnapshot);
        // console.log(snapshot)
        const documents = snapshot.docs.map((doc) => ({
         id: doc.id,
            ...doc.data(),
           }));
           setUpdateData(documents);
       };    
      fetchEditedProfile();
    }
  })    
},[]) 

  return (
    <Tab.Navigator
    activeColor="#FFA07A"
    inactiveColor="#000"
    barStyle={{ backgroundColor: '#f5f5f5', tabBarShowLabel: false, }}
    >
      <Tab.Screen name="Home" component={HomeScreen} 
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ color }) => (
            <Ionicons name="home" size={24} color={color} />
          )
        }}
      />
      {/* <Tab.Screen name="Video" component={Video}
        options={{
          tabBarLabel: 'Shorts',
          tabBarIcon: ({ color }) => (
            <Ionicons name="play" size={24} color={color} />
          )
        }}
      /> */}
      <Tab.Screen name="Post" component={AddPost}
        options={{
           tabBarLabel:'Add post',  // label for the tab button
           tabBarIcon: ({ color }) => (
            <Ionicons name="add-circle-outline" size={24} color={color} />
          )
        }}
      />

      <Tab.Screen name="Search" component={Search}
        options={{
           tabBarLabel:'Search',  // label for the tab button
           tabBarIcon: ({ color }) => (
            <Ionicons name="search" size={24} color={color} />
          )
        }}
      />
       
      <Tab.Screen name="Profile" component={Profile}
        options={{
          tabBarLabel: 'Profile',
          tabBarShowLabel: false,

           tabBarIcon: ({ color }) => (
            // <Ionicons name="person" size={24} color={color} />
           <View>
             {updateData.map((profileImage, index)=>{
              return (
               <View key={index}>
                 <Image source={{uri: profileImage.editedProfileImage ? profileImage.editedProfileImage: profileThumnail }} alt='profileImage' style={{width:30, height: 30, borderRadius:100, marginBottom:10}}/>
               </View>
              )
             })}
           </View>
          )
        }}
      />
             
    </Tab.Navigator>
  );
}

export default MyTabs;