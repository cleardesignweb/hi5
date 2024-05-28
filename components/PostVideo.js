import { Image, StyleSheet, Text, View , Dimensions, TouchableOpacity} from 'react-native'
import React,{useState, useEffect} from 'react'
import { auth, db} from '../data/Firebase'
import {   onAuthStateChanged } from 'firebase/auth'

import {collection , where, query, getDocs, getDoc, doc, orderBy, collectionGroup, } from "firebase/firestore";

import { Ionicons,FontAwesome5 } from '@expo/vector-icons';
import Divider from './Divider';
import { Video } from 'expo-av';
 const PostVideo = () => {
    const { width, } = Dimensions.get('window');
    const height = Dimensions.get('window').height;
    const [postVideo, setPostVideo] = useState([]);




    useEffect(() => {
        const artistCollectionRef = collectionGroup(db, 'videos');    
         const fetchingVideos = async () => {
          const data = await getDocs(artistCollectionRef);
          setPostVideo(data.docs.map((doc)=>({...doc.data(), id:doc.id})));
        };
        fetchingVideos();
      })


  return (
    <View  >
        {
            postVideo.map((post, index)=>{
                return(
                    <View key={index} style={styles.postContainer}>
        <View style={styles.profileContainer}>
        <Image
        source={{uri : post.editedProfileImage }}
        style={styles.profileImage}
        />
        <View style={styles.profileDetails}>
        <Text style={styles.displayName}>{post.displayName} {post.lastName}</Text>
        <Text style={styles.timetemp}>{post.postTime}</Text>
        </View>
       </View>
       {/* Post */}
        <View style={styles}>       
        <Text style={styles.caption}>{post.caption}</Text>
         <Video
        source={{ uri: post.video }}
        rate={1.0}  
        volume={1.0}  
        isMuted={true}  
        resizeMode="cover" 
        shouldPlay={false}  
         isLooping={false}  
        useNativeControls  
         style={styles.video}
      />                              
    {/* Interactions */}
        <View style={styles.Interactions}>
        <TouchableOpacity>
        <Ionicons name='heart-outline' size={30} color={'tomato'}/>
        </TouchableOpacity>
         <TouchableOpacity>
         <FontAwesome5 name="comment" size={30} color="tomato" />
         </TouchableOpacity>
        <TouchableOpacity>
        <Ionicons name='share-social-outline' size={30} color={'tomato'}/>
        </TouchableOpacity>
        </View>
        <Divider/>
       </View>
        </View>
                )
            })
        }
         
    </View>
  )
}

export default PostVideo

const styles = StyleSheet.create({
    postContainer:{
        margin: 10,
    },
    profileImage: {
        width:50,
        height: 50,
        borderRadius: 50,
    },
    profileContainer:{
        flexDirection: 'row'
    },
    profileDetails:{
        marginLeft: 10
    },
    displayName: {
        fontWeight:'bold',
        color:'tomato'
    },
    caption: {
       marginTop: 10,
       marginBottom:10
    },
    Interactions: {
        flexDirection: "row",
        justifyContent: 'space-between',
        alignItems: 'center',
        margin: 10,
    },
    video:{
        width: '100%',
        height: 400,
        objectFit:'contain'
     }
})