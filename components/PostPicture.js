import { Image, StyleSheet, Text, View , Dimensions, TouchableOpacity, TextInput} from 'react-native'
import React,{useState, useEffect} from 'react'
import { auth, db} from '../data/Firebase'
import {   onAuthStateChanged } from 'firebase/auth'
 import {collection , where, query, getDocs, getDoc, doc, orderBy, arrayUnion, updateDoc,arrayRemove } from "firebase/firestore";
 
import { Ionicons,FontAwesome5 } from '@expo/vector-icons';
import Divider from './Divider';
import { CommonActions, useNavigation } from '@react-navigation/native'
import {useAuth} from '../auth/AuthContext'
  const PostPicture = ({post}) => {
 
    const {user} = useAuth()
    const { width, } = Dimensions.get('window');
    const height = Dimensions.get('window').height;
    const [postData, setPostData] = useState([]);
     const [userInfoProfileFetch, setUserProfileFetch] = useState(null)
     const [comment, setComment] = useState('')
     const navigation = useNavigation()        
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
      const handleLike = async () => {
        // const currentUserEmail = auth.currentUser?.email;   
        const uid = user.uid   
        if (!uid) {
          console.error('Current user email is undefined.');
          return;}      
        const currentLikeStatus = !post.likes_by_user || !post.likes_by_user.includes(uid);
        const postRef = doc(db,   'posts', post.id);      
        try {
          await updateDoc(postRef, {
            likes_by_user: currentLikeStatus
              ? arrayUnion(uid)
              : arrayRemove(uid),
          });    
          // Fetch the updated post data after the like operation
          const updatedPostDoc = await getDoc(postRef);
          const updatedPostData = updatedPostDoc.data();
      
          if (updatedPostData) {
            // Update the local state with the updated post data
            setPostData(updatedPostData);
          }      
          console.log('Post has been liked successfully by a user');
        } catch (error) {
          console.error('Error updating document', error);
        }
      };      
     // once the comment has been submitted, the comment is added to the database
    //  const CommentsToFirebase = async (post, comment) => {
    //   const today = new Date();
    //   const date = today.toDateString();
    //   const Hours = today.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    //   const time = today.toLocaleDateString();
    //   const postRef = doc(db, 'posts', post.id);    
    //   try {
    //     await updateDoc(postRef, {
    //       comments: arrayUnion({
    //         date: date,
    //         Hours: Hours,
    //         time: time,
    //         displayName: userInfoProfileFetch.displayName,
    //         editedProfileImage: userInfoProfileFetch.editedProfileImage,
    //         lastName: userInfoProfileFetch.lastName,
    //         comment: comment,
    //       }),
    //     });    
    //     console.log('Comment added successfully!');
    //   } catch (error) {
    //     console.error('Error adding comment: ', error);
    //   }
    // };
  return (
    <View>         
        <View style={styles.postmainheader}>
         <PostHeader post={post}/>
         <PostDetails post={post}/>
         <Interactions post={post} handleLike={handleLike} />
         <CommentSection post={post}/>
          {/* <ShowAllComments post={post} /> */}

         {/* <Comments post={post}/> */}
          {/* <View style={styles.commentContent}>
         <TextInput
         style={styles.comment}
         placeholderTextColor={'#444'} 
         placeholder="Leave a comment"
          autoFocus={true}
         onChangeText={(text)=>setComment(text)}
         value={comment}
        />
       <TouchableOpacity onPress={() => CommentsToFirebase(post, comment)}>
      <Ionicons name='send' size={24} color={'#000000'}/>
    </TouchableOpacity>
         </View> */}
         {/* <Divider/> */}

         </View>        
    </View>
  )
}
const PostHeader = ({post})=>{
  const navigation = useNavigation()
  const navigateToProfile = (userId) => {
    console.log('Navigating to Profile screen with user ID:', userId);
    navigation.dispatch(
      CommonActions.navigate({
        name: 'UserProfileScreen',
        params: { uid: userId },
      })
    );
  }; 
  return (     
    <View style={styles.postContainer} >
        <TouchableOpacity onPress={() => navigateToProfile(post.uid)} >
        <Image source={{uri : post.editedProfileImage}} style={styles.profileImage}/>
        </TouchableOpacity>
        <View style={styles.profileDetails}>
        <TouchableOpacity  
        onPress={() => navigateToProfile(post.uid)}>
        <Text style={styles.displayName}>{post.displayName} {post.lastName}</Text>
        </TouchableOpacity>
        <Text style={styles.timetemp}>{post.postTime}</Text>
        </View>
       </View>
  )
}
const PostDetails = ({post})=>{
  const [imageDimensions, setImageDimensions] = React.useState({ width: 1, height: 1 });
  React.useEffect(() => {
    // Fetch image dimensions (you may need to implement your own logic)
    Image.getSize(post.image, (width, height) => {
      setImageDimensions({ width, height });
    });
  }, [post.image]);
  const navigation = useNavigation()
  return (
    <View style={styles}>       
        <Text style={styles.caption}>{post.caption}</Text>
        <TouchableOpacity
        onPress={()=>navigation.navigate('postDetail', {id: post.id})}>
        <Image 
        source={{ uri: post.image }}
        style={{
          borderRadius:20,
          aspectRatio: 4 / 5 
          // aspectRatio: imageDimensions.width / imageDimensions.height,
        }}
        // resizeMode="cover"
        alt='postimage11'/>    
        </TouchableOpacity>                                      
        {/* <Divider/> */}
       </View>
  )
}
const Interactions = ({ post, handleLike }) => {
  const {user} = useAuth()
  const uid = user.uid
   const likesCount = post.likes_by_user ? post.likes_by_user.length : 0;
   const isLikedByCurrentUser = uid && post.likes_by_user?.includes(uid);

  const navigation = useNavigation();
  const [savedPosts, setSavedPosts] = useState([]);
  const [likedPosts, setLikedPosts] = useState([])
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
    
  return (
    <View>
      <View style={styles.Interactions}>
      <TouchableOpacity onPress={() => handleLike(post) } style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Ionicons name={isLikedByCurrentUser ? 'heart' : 'heart-outline'} size={24} color={isLikedByCurrentUser ? '#000' : '#000000'} />
        <Text>{' '}{likesCount.toLocaleString('en')}{' '}likes</Text>
      </TouchableOpacity> 

      <View style={{ marginTop: 5 }}>
           <TouchableOpacity onPress={()=>navigation.navigate('postDetail', {id: post.id})}>
           {/* onPress={() => navigation.navigate('AllComments', { post })} */}
            <Ionicons name="chatbubble-outline" size={24} color="#000000" />
          </TouchableOpacity>
           
      </View>
      {/* Icon to save posts */}
      <TouchableOpacity onPress={SavedPost}>
  <Ionicons
    name={savedPosts.some(savedPost => savedPost.id === post.id) ? 'bookmark' : 'bookmark-outline'}
    size={24}
    color={'#000000'}
  />
</TouchableOpacity>
     </View>
 
    </View>
  );
};

  
const CommentSection = ({ post }) => {
  const navigation = useNavigation()
  return(
    <View style={{ marginTop: 5 }}>
    {!!post.comments && Array.isArray(post.comments) && post.comments.length > 0 && (
      <TouchableOpacity onPress={() => navigation.navigate('AllComments', { post })}>
        <Text style={{marginLeft:10}}>
          View {post.comments.length > 1 ? 'all' : ''} {post.comments.length}{' '}
          {post.comments.length > 1 ? 'comments' : 'comment'}
        </Text>
      </TouchableOpacity>
    )}
  </View>
  )
    };

// If the post has more than one comment, show all comments.
// If the post has only one comment, show the comment.
// If the post has no comments, show 'No comments'.
const Comments = ({ post }) =>  {
  const navigation = useNavigation()
  const navigateToProfile = (userId) => {
    // console.log('Navigating to Profile screen with user ID:', userId);
    navigation.dispatch(
      CommonActions.navigate({
        name: 'UserProfileScreen',
        params: { uid: userId },
      })
    );
  }; 
  return (
    <View>
       {/* onPress={() => navigateToProfile(post.uid)} */}
    {post.comments && Array.isArray(post.comments) && post.comments.length > 0 ? (
      post.comments.map((comment, index) => (
        <View key={index} style={{ flexDirection: 'row', alignItems: 'center' }}>
          <View style={styles.commenterContainer}>
            <TouchableOpacity onPress={() => navigateToProfile(post.uid)}>
            <Image source={{uri: comment.editedProfileImage}}  style={styles.CommentProfileImage}/>
            </TouchableOpacity>
             <View style={{marginLeft: 10}}>
             <Text onPress={() => navigateToProfile(post.uid)} style={{ fontWeight: '600' }}>{comment.displayName} {comment.lastName}</Text> 
             <Text>{comment.comment}</Text>
             </View>
           </View>
        </View>
      ))
    ) : (
      <Text>No comments</Text>
    )}
  </View>
  )
}
 
 


export default PostPicture

const styles = StyleSheet.create({
    postContainer:{
        margin: 10,
         borderRadius: 20,
         flexDirection: 'row',
         
    },
    profileImage: {
        width:50,
        height: 50,
        borderRadius: 50,
    },
    postmainheader:{
      margin: 10,
      borderRadius:20
    },
    profileContainer:{
        flexDirection: 'row'
    },
    profileDetails:{
        marginLeft: 10
    },
    displayName: {
        fontWeight:'bold',
        color:'#000000'
    },
    caption: {
       marginLeft: 10,
       marginBottom:10
     },
    Interactions: {
        flexDirection: "row",
        justifyContent: 'space-between',
        alignItems: 'center',
        margin: 10,
    },
    // image:{
    //     width: '100%',
    //     aspectRatio: 16 / 9,
    //     // objectFit:'contain'
    //  },
     container: {
        flex: 1,
        justifyContent: 'center',
      },
      horizontal: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        padding: 10,
      },
      comment: {         
        marginTop: 10,
        marginBottom: 10,
        width: '100%'
       },
       commentContent: {  
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent:"space-around",
          // width: Dimensions.get('window').width * .88,   
          // marginLeft:10,  
          // borderWidth: 1,
          // borderBottomWidth: 1,
          // backgroundColor: '#ECECEC',
          width: '95%',
          margin:10,
          alignSelf: 'center',
          padding: 7,
          height:50,
          borderRadius:10,

          
        },

       commenterContainer:{
        flexDirection: 'row',
        alignItems:"center",
        marginTop: 5,
        },

       CommentProfileImage:{
        width:30,
        height: 30,
        borderRadius: 50,
       },
       showCommentsContainer: {
        width: Dimensions.get('window').width * .95,      
        height: 500,
        backgroundColor: 'tomato',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1,
       },
       timetemp: {
        fontSize: 11
       }

      })