import { Image, StyleSheet, Text, TouchableOpacity, View,ActivityIndicator, TextInput, ScrollView, Platform } from 'react-native';
import React, { useState, useEffect } from 'react';
import { CommonActions, useNavigation, useRoute } from '@react-navigation/native';
 import { auth, db } from '../data/Firebase';
 import {collection , where, query, getDocs, getDoc, doc, orderBy, arrayUnion, addDoc, update, updateDoc,arrayRemove } from "firebase/firestore";
import userCollectionFech from '../components/userCollectionFech';
import { Ionicons } from '@expo/vector-icons';
// import Divider from '../components/Divider';
import { onAuthStateChanged } from 'firebase/auth';
import { useAuth } from '../auth/AuthContext';
    const PostDetails = () => {
  const route = useRoute();
  const { id,post } = route.params;
  
 
  const [postDetails, setPostDetails] = useState(null);
  const navigation = useNavigation()
  const [profile, setProfile] = useState([])
  const { document, loading } = userCollectionFech('posts', id);  
   const [comment, setComment] = useState()
  const [userInfoProfileFetch, setUserProfileFetch] = useState(null)
  const navigateToProfile = (userId) => {
    console.log('Navigating to Profile screen with user ID:', userId);
    navigation.dispatch(
      CommonActions.navigate({
        name: 'UserProfileScreen',
        params: { uid: userId },
      })
    );
  }; 
  const {user} = useAuth()
  // console.log(document)
   useEffect(() => {
    setPostDetails(document);
  }, [document]);


  useEffect(() => {
    onAuthStateChanged(auth, (user)=>{
      if (user){
        const uid =  user.uid;
         const fetchData = async () => {
          const timestamp = ('timestamp', 'desc')
            const citiesRef = collection(db, 'profileUpdate');
          const querySnapshot = query(citiesRef, 
            where("uid", "==", uid));             
          orderBy(timestamp);
          const snapshot = await getDocs(querySnapshot);
           const documents = snapshot.docs.map((doc) => {            
            setUserProfileFetch({
            displayName: doc.data().displayName,
            editedProfileImage: doc.data().editedProfileImage,
            lastName:doc.data().lastName,
           })              
             });
          };    
        fetchData();
      }
    })    
  },[])  

  useEffect(() => {
    onAuthStateChanged(auth, (user)=>{
      if (user){
        const uid =  user.uid;
         const fetchProfData = async () => {
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
             setProfile(documents);
            //  setIsLoading(false)
        };            
        fetchProfData();
      }      
    })    
  },[]) 

  const CommentsToFirebase = async (post, comment) => {
    const today = new Date();
    const date = today.toDateString();
    const Hours = today.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const time = today.toLocaleDateString();
    const postRef = doc(db, 'posts', postDetails.id);  
    try {
      await updateDoc(postRef, {
        comments: arrayUnion({
          date: date,
          Hours: Hours,
          time: time,
          displayName: userInfoProfileFetch.displayName,
          editedProfileImage: userInfoProfileFetch.editedProfileImage,
          lastName: userInfoProfileFetch.lastName,
          comment: comment,
        }),
      });  
      console.log('Comment added successfully!');
    } catch (error) {
      console.error('Error adding comment: ', error);
    }
  };

  const [savedPosts, setSavedPosts] = useState([]);
   const SavedPost = async () => {
    const postRef = doc(db, 'posts', post.id);
    try {
      // Check if the post is already saved
      const isPostSaved = savedPosts.some(savedPost => savedPost.id === post.id);
  
      if (!isPostSaved) {
        // If not saved, add it to the saved posts list
        await updateDoc(postRef, {
          saved_by_user: arrayUnion(user.uid),
        });  
        // Update the local state with the saved post
        setSavedPosts([...savedPosts, post]);
      } else {
        // Remove the post from the saved posts list
        await updateDoc(postRef, {
          saved_by_user: arrayRemove(user.uid),
        });
  
        // Update the local state without the removed post
        setSavedPosts(savedPosts.filter(savedPost => savedPost.id !== post.id));
      }  
      console.log('Post saved/unsaved successfully!');
    } catch (error) {
      console.error('Error saving/unsaving post', error);
    }
  };

  const handleLike = async () => {
    const currentUserEmail = auth.currentUser?.email;      
    if (!currentUserEmail) {
      console.error('Current user email is undefined.');
      return;
    }        
    const currentLikeStatus = !postDetails?.likes_by_user || !postDetails?.likes_by_user.includes(currentUserEmail);
    const postRef = doc(db, 'posts', postDetails?.id);          
    try {
      await updateDoc(postRef, {
        likes_by_user: currentLikeStatus
          ? arrayUnion(currentUserEmail)
          : arrayRemove(currentUserEmail),
      });    
      // Fetch the updated post data after the like operation
      const updatedPostDoc = await getDoc(postRef);
      const updatedPostData = updatedPostDoc.data();  
      if (updatedPostData) {
        // Update the local state with the updated post data
        setPostDetails(updatedPostData);
      }        
      console.log('Post has been liked successfully by a user');
    } catch (error) {
      console.error('Error updating document', error);
    }
  };    
  const likesCount = postDetails?.likes_by_user ? postDetails?.likes_by_user.length : 0;
  const [imageDimensions, setImageDimensions] = React.useState({ width: 1, height: 1 });
  useEffect(() => {
    if (postDetails?.image) {
      Image.getSize(postDetails.image, (width, height) => {
        setImageDimensions({ width, height });
      }, (error) => {
        console.error('Error getting image size:', error);
      });
    }
  }, [postDetails?.image]);

   

  return (
    <View style={styles.CommentSectionContainer}>
        <ScrollView>
        <View style={styles.topHeader}>
        <View style={styles.topHeaderIcons}>
          <TouchableOpacity
          onPress={()=>navigation.navigate('Feed')}
          >
            <Ionicons name="arrow-back-outline" color="white" size={24} style={styles.leftArrowIcon} />
          </TouchableOpacity>
          {/* <Text style={styles.uploadTopText}>Upload photo</Text>            */}
        </View>
      </View>

      {loading ? (
        <View>
        <View style={[styles.container, styles.horizontal]}>    
         <ActivityIndicator size="large" color="#000000" />
</View>
    </View> 
      ): (
          <>
          <View   style={styles.postContainer}>
         <TouchableOpacity onPress={() => navigateToProfile(postDetails.uid)} >
         <View style={styles.profileContainer}>
        <Image
        source={{uri : postDetails?.editedProfileImage}}
        style={styles.profileImage}
        />
        <View style={styles.profileDetails}>
        <Text style={styles.displayName}>{postDetails?.displayName} {postDetails?.lastName}</Text>
        <Text style={styles.timetemp}>{postDetails?.postTime}</Text>
        </View>
       </View>
         </TouchableOpacity>
      {/* Post */}       
       <View style={styles}>       
        <Text style={styles.caption}>{postDetails?.caption}</Text>
        <Image 
         source={{ uri: postDetails?.image }}
        style={{
          width: '100%',
          borderRadius:20,
          // aspectRatio: 4 / 5 
          aspectRatio: imageDimensions.width / imageDimensions.height,
        }}
           alt='postimage11'/>                                
    {/* Interactions */}
        {/* <View style={styles.Interactions}>
        <TouchableOpacity onPress={() => handleLike(post)} style={{flexDirection: 'row', alignItems: 'center'}}>
        <Ionicons name='heart-outline' size={24} color={'#000000'} />
        <Text>{likesCount.toLocaleString('en')} likes</Text>
      </TouchableOpacity>
         <TouchableOpacity>
         <Ionicons name="chatbubble-outline" size={24} color="#000000" />
         </TouchableOpacity>
         <TouchableOpacity onPress={SavedPost}>
          <Ionicons
            name={savedPosts.some(savedPost => savedPost.id === post.id) ? 'bookmark' : 'bookmark-outline'}
            size={24}
            color={'#000000'}
          />
        </TouchableOpacity>
        </View> */}
        
         
         {/* <Divider/> */}
     
       </View>
        </View>
        {/* Comment counting */}
         {/* <View style={{ margin:10, marginLeft:10 }}>
    {!!postDetails?.comments && Array.isArray(postDetails?.comments) && postDetails.comments.length > 0 && (
      <TouchableOpacity>
        <Text>
          {postDetails?.comments.length}{' '}
          {postDetails?.comments.length > 1 ? 'comments' : 'comment'}
        </Text>
      </TouchableOpacity>
    )}
  </View> */}
 
    <View
     style={styles.commenterMainContainer}
     >
       {/* onPress={() => navigateToProfile(post.uid)} */}
    {postDetails?.comments && Array.isArray(postDetails?.comments) && postDetails?.comments.length > 0 ? (
      postDetails?.comments.map((comment, index) => (
        <View key={index} style={{ flexDirection: 'row', alignItems: 'center' }}>
          <View style={styles.commenterContainer}>
            <TouchableOpacity onPress={() => navigateToProfile(postDetails.uid)}>
            <Image source={{uri: comment?.editedProfileImage}} style={styles.CommentProfileImage}/>
            </TouchableOpacity>
             <TouchableOpacity style={styles.commentProfileInfo}>
             <View >
             <Text onPress={() => navigateToProfile(postDetails.uid)} style={{ fontWeight: '600' }}>{comment?.displayName} {comment?.lastName}</Text> 
             <Text>{comment.comment}</Text>
             </View>
             </TouchableOpacity>
           </View>
        </View>
      ))
    ) : (
      <Text>No comments yet, be the first</Text>
    )}
  </View>
          </>
      )}         

      
        </ScrollView>

        <View style={styles.commetnSection}>   
        <View>
        {profile.map((prof, index)=>(
          <View key={index}>
          <Image
      source={{uri : prof.editedProfileImage}}
      style={{width:30, height:30, borderRadius:50}}
      />
        </View>
        ))}
        </View>       
         <View>
         <TextInput
         style={styles.comentSectionComent}
         placeholderTextColor={'#444'} 
         placeholder="Add comment"
         autoFocus={false}
         onChangeText={(text)=>setComment(text)}
         value={comment}
        />
         </View>
       <TouchableOpacity onPress={() => CommentsToFirebase(post, comment)}>
        <Ionicons name='send' size={24} color={'#000000'} style={styles.sent} />
      </TouchableOpacity>
         </View>
      </View>
  );
};


 
  
 


export default PostDetails;

const styles = StyleSheet.create({
  CommentSectionContainer: {
    flex: 1,
    justifyContent: 'space-between',
  },
    postContainer:{
        margin: 10,
    },
    profileImage: {
        width:50,
        height: 50,
        borderRadius: 50,
    },
    profileContainer:{
        flexDirection: 'row',
        margin:10
    },
    profileDetails:{
        marginLeft: 10
    },
    displayName: {
        fontWeight:'bold',
        color:'#000000'
    },
    caption: {
       marginTop: 10,
       marginBottom:10,
       marginLeft:10
    },
    Interactions: {
        flexDirection: "row",
        justifyContent: 'space-between',
        alignItems: 'center',
        margin: 10,
    },
    image:{
        width: '100%',
        height: 300,
        objectFit:'contain'
     },
     topHeader: {
        marginTop: Platform.OS === 'ios' ? -9 : 20,
        backgroundColor: '#FFA07A',
        height: 50
      },
    
     topHeaderIcons: {
        margin: 10,
        flexDirection: 'row',
        alignItems: 'center',
        },
       container: {
         justifyContent: 'center',
        alignItems: 'center',
      },
      uploadTopText: {
        color: '#ffffff',
        fontWeight: 'bold',
        marginLeft: 10
      },
      container2: {
        flex: 1,
        justifyContent: 'center',
      },
      horizontal: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        padding: 10,
      },
      
        
       CommentProfileImage:{
        width:40,
        height: 40,
        borderRadius: 50,
       },
      commenterContainer:{
        marginLeft: 10,
        flexDirection: 'row'
      },
      commentProfileInfo: {
        marginLeft: 10,
         marginBottom: 20,
        backgroundColor: '#ECECEC',
        padding:10,
        borderRadius: 10
       },

       timetemp: {
        fontSize: 12
       },
         commentSecionContainer: {
        margin: 10
      },
      commentContant: {
        flexDirection: 'row',
      },
      displayName: {
        fontWeight: 'bold'
      },
      commenterContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
      },
       commenterMainContainer: {
    flex: 1, // Ensures this section takes up available space
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
      
  CommentProfileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
   },
      commenterContainer:{
         flexDirection: 'row',
       },
      
       commenterMainContainer: {
        flex: 1, // Ensures this section takes up available space
        paddingHorizontal: 16,
        paddingVertical: 8,
      },
       commetnSection:{
        flexDirection: 'row',
        justifyContent: 'space-between',
        margin:10,
        // borderBottomWidth:1,
        // borderColor: '#ccc',
        padding:7,
        backgroundColor: '#ECECEC',
        borderRadius:10

       },
       commentSectionComment: {
        flex: 1,
        padding: 8,
        backgroundColor: '#f0f0f0',
        borderRadius: 20,
      },
      sent: {
        marginLeft: 8,
      },
    
});
