import { Image, ImageBackground, StyleSheet, Text, View, Dimensions, TouchableOpacity, ScrollView, Platform, ActivityIndicator } from 'react-native'
import React from 'react'
import { useAuth } from '../auth/AuthContext'
import FecthUserProfile from '../components/FecthUserProfile'
import { useState,useEffect } from 'react'
import { Ionicons } from '@expo/vector-icons'
import { CommonActions, useNavigation, useRoute } from '@react-navigation/native'
import { collection, getDocs, orderBy, query, where,doc, updateDoc, arrayUnion, arrayRemove, getDoc} from 'firebase/firestore'
import { auth, db } from '../data/Firebase'
import FetchFriendsCollection from '../components/FetchFriendsCollection'
     const UserProfileScreen = ({targetUser}) => {
      const { user } = useAuth();
      const route = useRoute();
      const { uid } = route.params;
      const { id } = route.params;
 
      const navigation = useNavigation();
      const { userprofile } = FecthUserProfile('profileUpdate', uid);
      const {friends} = FetchFriendsCollection('users', uid)
       const [userprofileImages, setUserProfileImages] = useState([]);
      const [loading, setLoading] = useState(true);
      const [publicProfile, setPublicProfile] = useState(null);
      const [fetchFriends, setFetchFriends] = useState(null)
      const [userPostsCount, setUserPostsCount] = useState(0);
      const currentUser = user.uid
       useEffect(()=>{
        setPublicProfile(userprofile)
      },[userprofile])

      useEffect(()=>{
        setFetchFriends(friends)
      },[friends])

      // Follow a user
      const followUser = async (currentUserId, targetUserId) => {
        const currentUserRef = doc(db, 'users', currentUserId);
        const targetUserRef = doc(db, 'users', targetUserId);
    
        try {
          await updateDoc(currentUserRef, {
            following: arrayUnion(targetUserId),
          });
    
          await updateDoc(targetUserRef, {
            followers: arrayUnion(currentUserId),
          });
    
          console.log('User followed successfully');
        } catch (error) {
          console.error('Error following user:', error);
        }
      };
    
      // Unfollow a user
      const unfollowUser = async (currentUserId, targetUserId) => {
        const currentUserRef = doc(db, 'users', currentUserId);
        const targetUserRef = doc(db, 'users', targetUserId);
    
        try {
          await updateDoc(currentUserRef, {
            following: arrayRemove(targetUserId),
          });
    
          await updateDoc(targetUserRef, {
            followers: arrayRemove(currentUserId),
          });
    
          console.log('User unfollowed successfully');
        } catch (error) {
          console.error('Error unfollowing user:', error);
        }
      };
    
      useEffect(() => {
        const fetchEditedProfile = async () => {
          try {
            const citiesRef = collection(db, 'posts');
            const querySnapshot = query(citiesRef, where('uid', '==', uid));
            const snapshot = await getDocs(querySnapshot);
            const documents = snapshot.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
            }));
            setUserProfileImages(documents);
            setLoading(false);
          } catch (error) {
            console.error('Error fetching edited profile:', error);
            setLoading(false);
          }
        };
    
        fetchEditedProfile();
      }, [uid]);
    
      const fetchUserPosts = async () => {
        try {
          const citiesRef = collection(db, 'posts');
          const querySnapshot = query(citiesRef, where('uid', '==', uid));
          const userPostsSnapshot = await getDocs(querySnapshot);
          const userPosts = userPostsSnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          return userPosts;
        } catch (error) {
          console.error('Error fetching user posts:', error);
          return [];
        }
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
    
      // Rest of your component
    
      // Follow/Unfollow handling
      const handleFollow = () => {
        if (!publicProfile || !user) {
          console.error('Public profile object or user is undefined');
          return;
        }
      
        const isFollowing =
          user &&
          user.following &&
          Array.isArray(user.following) &&
          user.following.includes(publicProfile.uid);
      
        if (isFollowing) {
          unfollowUser(user.uid, publicProfile.uid);
        } else {
          followUser(user.uid, publicProfile.uid);
        }
      };
// Conditionally render based on the loading state
if (loading) {
  return <ActivityIndicator />;
}
  return (
    <View style={styles.profileContainer}>
 
    <ScrollView  >
     <View>
        <View>
         <ImageBackground  source={{uri: publicProfile?.editedBackimage}} alt='backimage' style={styles.backimage}>

<View style={styles.headerIcons}>
<TouchableOpacity style={styles.arrowBackIcon}
onPress={()=>navigation.navigate('Home')}
>
<Ionicons name="arrow-back-outline" size={30} color="#000"/>
</TouchableOpacity>

 
</View>
<Image source={{uri: publicProfile?.editedProfileImage}} alt='profileimage' style={styles.profileimage} /> 
</ImageBackground> 
       </View>
    </View>
<View style={styles.profileContents}>   
<View style={styles.profileNames}>              
          <View >
           <Text style={styles.displayName}>{publicProfile?.displayName} {publicProfile?.lastName}</Text>
   <Text style={styles.username}>{publicProfile?.username}</Text>
         </View>
       </View>             
 
{/* Bio */}
<View style={styles.bioContainer}>
 {/* <Text style={styles.bio}>Bio</Text> */}
 
          <View >
   <Text style={styles.username}>{publicProfile?.bio}</Text>
         </View>
 </View>


 <View style={styles.userAudience}> 
<View style={styles.followerContainer}>
 {/* <Ionicons name='person-add-outline' size={24} color={'tomato'} style={styles.followerIcon}/> */}
 <View style={styles.followerConent}>
 <Text style={styles.follower}>{fetchFriends?.followers?.length || 0}</Text>
 <Text style={styles.followerNunber}>Followers</Text>
 </View>
</View>

<View style={styles.followerContainer}>
 {/* <Ionicons name='person-add-outline' size={24} color={'tomato'} style={styles.followerIcon}/> */}
 <View style={styles.followerConent}>
 <Text style={styles.follower}>{fetchFriends?.following?.length || 0}</Text>
 <Text style={styles.followerNunber}>Folowing</Text>
 </View>
</View> 
</View>

<View style={{borderWidth: 1, borderColor: 'tomato',
 marginTop: 30,borderRadius:20,
 backgroundColor:'tomato'
 }}>
  <TouchableOpacity
 onPress={handleFollow}
  >
    <Text style={{textAlign: 'center', fontWeight:'bold',
     padding: 10, fontSize: 20, color:'white'}}>
{user && user.following && user.following.includes(targetUser.uid) ? 'Unfollow' : 'Follow'}
      </Text>
  
  </TouchableOpacity>
</View>

 <View>
  </View>
  <View style={styles.userPhotosLenghts}>
  <Text style={styles.photosLenghts}>{userPostsCount}</Text>
  <Text style={styles.photosText}> Photos</Text>
</View>
</View>
<View style={styles.container}>   
        <View  style={styles.container}>
        {userprofileImages.map((userImage, index)=>{
          return (
            <View key={index} style={styles.imageContainer}>
              <TouchableOpacity 
              onPress={() => navigation.navigate('postDetail', {id: userImage.id })}
              >
        <Image source={{ uri:  userImage.image }} alt="userImages" style={styles.userPhotos}/>
        </TouchableOpacity>
            </View>
          )
        })}
      </View>   
  </View>
    </ScrollView>
 </View>
  )
}
 

export default UserProfileScreen

 
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
      alignItems: 'center',
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
      justifyContent: 'space-around',
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
      fontWeight: 'bold'
    },
    photosText:{
      fontSize: 28,
      fontWeight: 'bold',
      marginBottom: 10,
      marginTop: 20
    },
    photosLenghts: {
      fontSize: 28,
      fontWeight: 'bold',
      marginBottom: 10,
      marginTop: 20,
      color: 'tomato'
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
       },
     topHeaderIcons: {
      margin: 10,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
     },
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
      borderRadius:20,
      
    },
    userPhotosLenghts: {
      marginTop: 20,
      flexDirection: 'row',
      alignItems: 'center'
    },
     
  })