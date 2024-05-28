import { StyleSheet, Text, View, Platform, TouchableOpacity, Dimensions, TextInput, Alert, Image, Button } from 'react-native';
import React, { useState, useEffect } from 'react';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
 import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../auth/AuthContext';
import { ref, getStorage, uploadBytes, getDownloadURL } from 'firebase/storage';
import { addDoc, collection, getDocs, orderBy, query, Timestamp, where } from 'firebase/firestore';

import { storage, db, auth } from '../data/Firebase';
import { ResizeMode, Video } from 'expo-av';
import { onAuthStateChanged } from 'firebase/auth';

const AddVideo = () => {
  const { user } = useAuth();
   const [video, setVideo] = useState('')
  const [caption, setCaption] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [gallery, setGallery] = useState('');
  const [status, setStatus] = useState({});
  const videoRef = React.useRef(null);
  const [videoStatus, setVideoStatus] = useState({});
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentLoggedInUser, setCurrentLoggedInUser] = useState(null)

  const navigation = useNavigation();

  useEffect(() => {
    (async () => {
      const galleryStatus = await ImagePicker.requestMediaLibraryPermissionsAsync();
      setGallery(galleryStatus.status === 'granted');
    })();
  }, []);
 
//  Picking video from gallery
const PickVideo = async () => {
  let result = await ImagePicker.launchImageLibraryAsync({
   mediaTypes: ImagePicker.MediaTypeOptions.Videos,
   allowsEditing: true,
   aspect: [4, 3],
   quality: 1,
 });    
 console.log(result);    
 if (!result.canceled) {
   setVideo(result.assets[0].uri);
 }
};
 



// Handleling second 
const handlePlaybackStatusUpdate = (status) => {
  setVideoStatus(status);

  if (status.isLoaded && !status.isPlaying) {
    // Video is not playing, you can control the playback here
  }

  if (status.isLoaded && status.positionMillis >= 60000) {
    // 60,000 milliseconds is 60 seconds (1 minute)
    setIsPlaying(false);

    // Video exceeded the time limit, you can handle it here
    handleTimeLimitExceeded();
  }
};

const handleTimeLimitExceeded = () => {
  // You can perform actions when the video exceeds the time limit
  // For example, show a message to the user or trigger other functions.
  alert('Video time limit exceeded. Please upload a shorter video.');
};

const startVideo = () => {
  setIsPlaying(true);
};

const stopVideo = () => {
  setIsPlaying(false);
};

useEffect(() => {
  onAuthStateChanged(auth, (user)=>{
    if (user){
      const uid =  user.uid;
      console.log(uid)  
      const fetchData = async () => {
        const timestamp = ('timestamp', 'desc')
          const citiesRef = collection(db, 'profileUpdate');
        const querySnapshot = query(citiesRef, 
          where("uid", "==", uid));             
        orderBy(timestamp);
        const snapshot = await getDocs(querySnapshot);
         const documents = snapshot.docs.map((doc) => {
      
         setCurrentLoggedInUser({
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

  const handleUploadVideo = async () => {
    if (!video) {
      return null;
    }
    const filename = video.substring(video.lastIndexOf('/') + 1);
    const extension = filename.split('.').pop();
    const name = filename.split('.').slice(0, -1).join('.');
    const timestampedFilename = `${name}_${Date.now()}.${extension}`;
    const storageRef = ref(getStorage(), `videos/${timestampedFilename}`);
    try {
      const response = await fetch(video);
      const blob = await response.blob();
      const snapshot = await uploadBytes(storageRef, blob);
      const downloadURL = await getDownloadURL(storageRef);
      return downloadURL;
    } catch (error) {
      console.error('Error uploading image:', error);
      return null;
    }
  };


  const addPost = async () => {
    setIsLoading(true);
    
    const today = new Date();
    const date = today.toDateString();
    const Hours = today.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const time = today.toLocaleDateString();

    try {
       const videoUrl = await handleUploadVideo();
      const docRef = await addDoc(collection(db, 'videos'), {
        uid: user.uid,
        caption: caption,
        video: videoUrl,
        uploadedDate: date,
        postTime: time,
        Hours: Hours,
        displayName: currentLoggedInUser.displayName,
        editedProfileImage:currentLoggedInUser.editedProfileImage,
        lastName:currentLoggedInUser.lastName,
        createdAt: Timestamp.now(),
      });

      setIsLoading(false);
      setUploadProgress(0);

      console.log('Post added with ID: ', docRef.id);
      navigation.navigate('Video');
    } catch (error) {
      setIsLoading(false);
      console.error('Error adding post:', error);
      Alert.alert('Error Uploading Post', 'Please try again.');
    }
  };

  return (
    <View>
      <View style={styles.topHeader}>
        <View style={styles.topHeaderIcons}>
          <TouchableOpacity 
          onPress={()=>navigation.navigate('Feed')}
          >
            <Ionicons name="arrow-back-outline" color="white" size={24} style={styles.leftArrowIcon} />
          </TouchableOpacity>
          <Text style={styles.uploadvodeoText}> Upload video</Text>
          <TouchableOpacity onPress={addPost}>
            <Ionicons name="send" color="white" size={24} style={styles.sendIcon} />
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.addPostContainer}>
        <TextInput
          placeholder="Add a caption to this video"
          style={styles.caption}
          value={caption}
          onChangeText={(text) => {
            setCaption(text);
          }}
          multiline
          editable
          numberOfLines={3}
          maxLength={250}
        />                   
        <View style={styles.container}>
       {video && <Video
        source={{ uri: video }}
        rate={1.0}  
        volume={1.0}  
        isMuted={false}  
        resizeMode="cover" 
        // shouldPlay={false}  
        shouldPlay={isPlaying}
        isLooping={false}  
        useNativeControls  
        onPlaybackStatusUpdate={handlePlaybackStatusUpdate}
        style={styles.video}
      />}
    </View>

   <View > 
   <Text>For better perfomence, please upload a 60s video.</Text>
    <Text style={styles.statusText}>
        Video Duration: {Math.floor(videoStatus.durationMillis / 1000)} seconds
      </Text>
   </View>
      {/* <Button title="Start Video" onPress={startVideo} disabled={isPlaying} />
      <Button title="Stop Video" onPress={stopVideo} disabled={!isPlaying} /> */}

        <View style={styles.addPost} >           
           <TouchableOpacity onPress={PickVideo}>
          <Ionicons name="camera" color="white" size={24} style={styles.uploadIcons} />
          <Text style={styles.uploadTexts}>Video</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default AddVideo;

const styles = StyleSheet.create({
  addPostContainer: {
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
  },
  addPost: {
    width: Dimensions.get('window').width * 0.85,
     marginTop: 10,
    borderRadius: 30,
    padding: 10,
    textAlign: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderWidth: 1,
    borderColor: 'tomato'
  },
  addPostText: {
    fontWeight: 'bold',
    textAlign: 'center',
    justifyContent: 'center',
    color: '#cc998d',
    color: '#ffffff',
  },
  uploadTexts: {
    fontWeight: 'bold',
    textAlign: 'center',
    justifyContent: 'center',
    color: '#cc998d',
    color: '#000',
  },
  uploadIcons: {
  color: 'tomato',   
  alignSelf: 'center'
  },
  caption: {
    width: Dimensions.get('window').width * 0.85,
    height: 'auto',
    borderRadius: 7,
    marginBottom: 10,
    backgroundColor: '#ecebe4',
    marginTop: 10,
  },
  topHeader: {
    marginTop: Platform.OS === 'ios' ? -9 : 20,
    backgroundColor: 'tomato',
  },

  topHeaderIcons: {
    margin: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 40
   },
   container: {
     justifyContent: 'center',
    alignItems: 'center',
  },
  video: {
    width: Dimensions.get('window').width * 0.85,
    height: 200,  
  },
  uploadvodeoText: {
    fontWeight: 'bold',
    color: '#ffffff',
    fontSize: 20
  }
})