import { StyleSheet, Text, View, Platform, TouchableOpacity, Dimensions, TextInput, Alert, Image, Button, ActivityIndicator } from 'react-native';
import React, { useState, useEffect } from 'react';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { addDoc, collection, getDocs, orderBy, query, Timestamp, where } from 'firebase/firestore';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../auth/AuthContext';
import { ref, getStorage, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage, db, auth } from '../data/Firebase';
import { onAuthStateChanged } from 'firebase/auth'; 
import { Camera } from 'expo-camera';

const AddPost = () => {
  const { user } = useAuth();
  const [image, setImage] = useState('');
  const [caption, setCaption] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [loading, setIsLoading] = useState(false);
  const [camera, setCamera] = useState('')
  const [gallery, setGallery] = useState('');
  const [profile, setProfile] = useState([])
  const [currentLoggedInUser, setCurrentLoggedInUser] = useState(null)
  const navigation = useNavigation();
  useEffect(() => {
    onAuthStateChanged(auth, (user)=>{
      if (user){
        const uid =  user.uid;
        // console.log(uid)  
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
  useEffect(() => {
    (async () => {
      const galleryStatus = await ImagePicker.requestMediaLibraryPermissionsAsync();
      setGallery(galleryStatus.status === 'granted');
    })();
  }, []);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
     mediaTypes: ImagePicker.MediaTypeOptions.All,
     allowsEditing: false,
     aspect: [4, 3],
     quality: 1,
   });    
  //  console.log(result);    
   if (!result.canceled) {
     setImage(result.assets[0].uri);
   }
 };
 

  const uploadImage = async () => {
    if (!image) {
      return null;
    }
    const filename = image.substring(image.lastIndexOf('/') + 1);
    const extension = filename.split('.').pop();
    const name = filename.split('.').slice(0, -1).join('.');
    const timestampedFilename = `${name}_${Date.now()}.${extension}`;
    const storageRef = ref(getStorage(), `images/${timestampedFilename}`);
    try {
      const response = await fetch(image);
      const blob = await response.blob();
      const snapshot = await uploadBytes(storageRef, blob);
      const downloadURL = await getDownloadURL(storageRef);
      return downloadURL;
    } catch (error) {
      console.error('Error uploading image:', error);
      return null;
    }
  };

  const uploadCamera = async () => {
    if (!camera) {
      return null;
    }
    const filename = camera.substring(camera.lastIndexOf('/') + 1);
    const extension = filename.split('.').pop();
    const name = filename.split('.').slice(0, -1).join('.');
    const timestampedFilename = `${name}_${Date.now()}.${extension}`;
    const storageRef = ref(getStorage(), `images/${timestampedFilename}`);
    try {
      const response = await fetch(camera);
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
      const imageUrl = await uploadImage();
      const cameraUrl =  await uploadCamera();
       const docRef = await addDoc(collection(db, 'posts'), {
        uid: user.uid,
        caption: caption,
        image: imageUrl,
        cameraImage:cameraUrl,
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
      navigation.navigate('Home');
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
          onPress={()=>navigation.navigate('Home')}>
            <Ionicons name="arrow-back-outline" color="black" size={24} style={styles.leftArrowIcon} />
          </TouchableOpacity>
          <Text style={styles.uploadTopText}>Upload photo</Text>          
          <TouchableOpacity onPress={addPost}>
            <Ionicons name="send" color="black" size={24} style={styles.sendIcon} />
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.addPostContainer}>
        <TextInput
          placeholder="Add a caption to this post"
          style={styles.caption}
          value={caption}
          onChangeText={(text) => { setCaption(text);}}
          multiline
          editable
          numberOfLines={3}
          onSubmitEditing={addPost}
          maxLength={250}
        />
        {image && <Image source={{ uri: image }} style={{ width: 330, height: 200, borderRadius: 10 }} />}                     
        <View style={styles.addPost} >
          {loading ? (
            <View>
            <View style={[styles.container2, styles.horizontal]}>    
             <ActivityIndicator size="large" color="tomato" />
    </View>
        </View> 
          ):(
<TouchableOpacity  onPress={pickImage}>
          <Ionicons name="image" color="white" size={24} style={styles.uploadIcons} />
          <Text style={styles.uploadTexts}>Gallery</Text>
          </TouchableOpacity>
          )}
            
           <TouchableOpacity 
          onPress={()=>navigation.navigate('addCamera')}
           >
          <Ionicons name="camera" color="white" size={24} style={styles.uploadIcons} />
          <Text style={styles.uploadTexts}>Open camera</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default AddPost;

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
    borderColor: '#000'
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
    backgroundColor: '#FFA07A',
    height: 50
  },

  topHeaderIcons: {
    margin: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
   },
   container: {
     justifyContent: 'center',
    alignItems: 'center',
  },
  uploadTopText: {
    color: '#ffffff',
    fontWeight: 'bold'
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
  
})