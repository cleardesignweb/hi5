import { Image, ImageBackground, StyleSheet, Text, View, Dimensions, TouchableOpacity, ScrollView,Platform,ActivityIndicator, Modal} from 'react-native'
import React, {useEffect} from 'react'
import { Ionicons } from '@expo/vector-icons';
import ImageVideoNav from '../components/ImageVideoNav/ImageVideoNav';
import UserPhoto from '../components/ImageVideoNav/UserPhoto';
import { getAuth, signOut, onAuthStateChanged } from "firebase/auth";
import {collection , where, query, getDocs, getDoc, doc, orderBy, collectionGroup, } from "firebase/firestore";
 import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../auth/AuthContext';
import { useState } from 'react';
import { auth, db } from '../data/Firebase';
import Settings from './Setttings'; 
const Profile = () => {
  const { width, } = Dimensions.get('window');
  const height = Dimensions.get('window').height;
  const navigation=useNavigation();
  const [updateData, setUpdateData] = useState([]);
  const [profile, setProfile] = useState([])
  const [userPostsCount, setUserPostsCount] = useState(0);
  const [loading, setIsLoading] = useState(null)  
  const [load, setLoad]= useState(null)
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const {user} = useAuth(); 
  // fetching Personal Data
  useEffect(() => {
    onAuthStateChanged(auth, (user)=>{
      if (user){
        const uid =  user.uid;
         const fetchData = async () => {
          const timestamp = ('timestamp', 'desc')
            const citiesRef = collection(db, 'posts');
          const querySnapshot = query(citiesRef, 
            where("uid", "==", uid));             
          orderBy(timestamp);
          const snapshot = await getDocs(querySnapshot);
          // console.log(snapshot)
          const documents = snapshot.docs.map((doc) => ({
           id: doc.id,
              ...doc.data(),
             }));
             setProfile(documents);
             setIsLoading(false)
        };            
        fetchData();
      }      
    })    
  },[])  
// Fetching user's follower/following data from firebase
useEffect(() => {
  const fetchUserData = async () => {
    try {
      const auth = getAuth();
      const currentUser = auth.currentUser;

       const userDocRef = doc(db, 'users', currentUser.uid);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        const userData = userDoc.data();
        setFollowers(userData.followers || []);
        setFollowing(userData.following || []);
      } else {
        console.error('User document not found.');
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };
  fetchUserData();
}, []); 
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
             setIsLoading(false)
        };    
        fetchEditedProfile();
      }
    })    
  },[]) 
  const fetchUserPosts = async (userId) => {
    const postsRef = collection(db, 'posts');
    const userPostsQuery = query(postsRef, where('uid', '==', userId));
    const userPostsSnapshot = await getDocs(userPostsQuery);
    const userPosts = userPostsSnapshot.docs.map((doc) => doc.data());
    return userPosts;
  };
  const getUserPostsCount = async (userId) => {
    const userPosts = await fetchUserPosts(userId);
    return userPosts.length;
  };
  useEffect(() => {
    const fetchUserPostsCount = async () => {
      if (user) {
        const userId = user.uid;
        const postsCount = await getUserPostsCount(userId);
        setUserPostsCount(postsCount);
      }
    };
    fetchUserPostsCount();
  }, [user]);


     const [modalVisible, setModalVisible] = useState(false);
  
    const openModal = () => {
      setModalVisible(true);
    };
  
    const closeModal = () => {
      setModalVisible(false);
    };
  
  if (load) {
    return <View>
        <View style={[styles.container, styles.horizontal]}>    
         <ActivityIndicator size="large" color="tomato" />
</View>
    </View> // You can replace this with a loading spinner or any other UI indication.
  }
  return (
     <>
     <View style={styles.profileContainer}>
       <ScrollView  >
        <View>
         {updateData.map((updataProf, index)=>(
          <View key={index}>
            <ImageBackground  source={{uri: updataProf.editedBackimage}} alt='backimage' style={styles.backimage}>

<View style={styles.headerIcons}>
  <TouchableOpacity style={styles.arrowBackIcon}
  onPress={()=>navigation.navigate('Home')}>
  <Ionicons name="arrow-back-outline" size={30} color="#000"/>
  </TouchableOpacity>

 <View>
 <TouchableOpacity style={styles.dotsIcon}  
  // onPress={loggOff} 
  onPress={()=>navigation.navigate('Settings')}
  >
    <Text style={{fontWeight: 'bold'}}>
      {/* Logo off {' '} */}
      </Text>
  <Ionicons name="settings-outline" size={24} color="#000" />
  {/* <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeModal}
      >
        <Settings closeModal={closeModal} />
      </Modal> */}
  </TouchableOpacity>
 </View>
 </View>
  
  <Image source={{uri: updataProf.editedProfileImage}} alt='profileimage' style={styles.profileimage} />
  {/* <TouchableOpacity  style={styles.editProfileIcon}
  onPress={()=>navigation.navigate('editprofile')}
  >
  <Ionicons name='add' size={30} color={"white"}  />
  </TouchableOpacity> */}
</ImageBackground> 
          </View>
         ))}                 
      </View>
 <View style={styles.profileContents}>
  
      
 <View style={styles.profileNames}>
  <TouchableOpacity 
  onPress={()=>navigation.navigate('editprofile')} style={styles.editProfileButton}>
  <Text style={styles.editProfile}>Edit Profile</Text>
  </TouchableOpacity>
           
          {/* <Text style={styles.displayName}>{user.uid}</Text> */}
           {updateData.map((update,index)=>(
             <View key={index}>
              <Text style={styles.displayName}>{update.displayName} {update.lastName}</Text>
      <Text style={styles.username}>{update.username}</Text>
            </View>
           ))}
         </View>
         
        
         {/* Bio */}
<View style={styles.bioContainer}>
    <Text style={styles.bio}>Bio</Text>
    {updateData.map((bioUpdate,index)=>(
             <View key={index}>
      <Text style={styles.username}>{bioUpdate.bio}</Text>
            </View>
           ))}
  </View>
<View style={styles.userAudience}> 
{/* <View>
<Text style={styles.follower}>{userPostsCount}</Text>
<Text style={styles.followerNunber}>Posts</Text> 
</View> */}
  <View style={styles.followerContainer}>
     <View style={styles.followerConent}>
    <Text style={styles.follower}> {followers.length || 0}</Text>
    <Text style={styles.followerNunber}>Followers</Text>
    </View>
  </View>
  <View style={styles.followerContainer}>
     <View style={styles.followerConent}>
    <Text style={styles.follower}>{following.length || 0}</Text>
    <Text style={styles.followerNunber}>Folowing</Text>
    </View>
  </View> 
</View>
 
{/* Collection of user's posts and videos */}
<View style={styles.userPhotos}>
  <Text style={styles.photosLenghts}>{userPostsCount}</Text>
  <Text style={styles.photosText}> Photos</Text>
</View>
 </View>
 <UserPhoto/>

 
       </ScrollView>
    </View>
    {/* <ImageVideoNav/> */}
     </>
  )
}

export default Profile

const styles = StyleSheet.create({
  profileContainer:{ 
      marginTop: Platform.OS === 'ios' ? -9 :25,
   },
   profileContents: {
    margin: 10
   },
  backimage: {
    width: '100%',
    height: 150,         
     },
  profileimage:{
    width: 100,
    height: 100,
    borderRadius: 100,
    position: 'absolute',
    left: '35%',
    top: '55%',
    borderWidth: 3,
    borderColor: '#FFF'
  },
  profImgBac:{
    position: 'absolute'
  },
  editProfileIcon: {
    position:'absolute',
    left:"46%",top:"107%",
    backgroundColor: 'tomato',
    borderRadius: 20,
    color: '#ffffff'
  },
  profileNames: {
    marginTop: 50,
   
  },
  displayName: {
    fontSize: 28,
    fontWeight: 'bold'
  },
  username: {
    fontSize: 15,
    fontWeight: 'normal'
  },
  followerContainer: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  followerConent: {
    marginLeft: 10
  },
  follower: {
    fontSize: 19,
    fontWeight: "bold",
    color: 'tomato',
    textAlign: 'center'
  },
  editProfile: {
     fontWeight: "normal",
    color: 'black',
    textAlign: 'center',
     

  },
  editProfileButton: {
    borderWidth: 1,
    borderColor: 'tomato',
    width: 100,
    alignSelf: 'center',
    borderRadius: 10,
  },
  followerNunber: {
    fontSize: 15,
    fontWeight: "bold",
    
  },
  followerIcon:{ 
    backgroundColor: '#FFA07A',
    padding: 5,
    borderRadius: 20,
  },
  userAudience: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    borderWidth: 1,
    borderColor: '#000',
    borderRadius: 20,
    padding: 10
  },
  bioContainer: {
    marginTop: 20
  },
  bio:{
    fontSize : 19 ,
    fontWeight: 'normal'
  },
  photosText:{
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10
  },
  photosLenghts: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
    color: 'tomato'
  },
  userPhotos: {
    marginTop: 20,
    flexDirection: 'row',
    alignItems: 'center'
  },
  headerIcons: {
    margin: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
   },

  arrowBackIcon: {
     backgroundColor: '#ffffff',
    borderRadius: 50,
    color: '#ffffff',
    },
   dotsIcon: {
    backgroundColor: '#ffffff',
    borderRadius: 50,
    padding: 5,
    flexDirection: 'row',
    alignItems:'center',
    justifyContent: 'space-between'
     },
   topHeaderIcons: {
    margin: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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