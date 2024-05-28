import React, { useState, useRef, useEffect } from 'react';
import { View, Text, Platform, TouchableOpacity, StyleSheet, Image, Dimensions,TextInput, Alert, ActivityIndicator } from 'react-native';
import { Camera } from 'expo-camera';
import { Ionicons } from '@expo/vector-icons';
import { addDoc, collection, getDocs, orderBy, query, Timestamp, where } from 'firebase/firestore';
import { ref, getStorage, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage, db, auth } from '../data/Firebase';
import { onAuthStateChanged } from 'firebase/auth'; 
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../auth/AuthContext';
  const OpenCamera = () => {
  const {user} = useAuth()
  const [hasPermission, setHasPermission] = useState(null);
  const [cameraType, setCameraType] = useState(Camera.Constants.Type.back);
  const [capturedPhoto, setCapturedPhoto] = useState(null);
  const cameraRef = useRef(null);
  const [caption, setCaption] = useState('');
  const [loading, setIsLoading] = useState(false);
  const navigation = useNavigation()
  const [currentLoggedInUser, setCurrentLoggedInUser] = useState(null)

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
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const flipCamera = () => {
    setCameraType(
      cameraType === Camera.Constants.Type.back
        ? Camera.Constants.Type.front
        : Camera.Constants.Type.back
    );
  };

  const takePicture = async () => {
    if (cameraRef.current) {
      const photo = await cameraRef.current.takePictureAsync({ quality: 0.5 });
      setCapturedPhoto(photo.uri);
    }
  };

  if (hasPermission === null) {
    return <View />;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }
  

  const uploadCamera = async () => {
    if (!capturedPhoto) {
      return null;
    }
    const filename = capturedPhoto.substring(capturedPhoto.lastIndexOf('/') + 1);
    const extension = filename.split('.').pop();
    const name = filename.split('.').slice(0, -1).join('.');
    const timestampedFilename = `${name}_${Date.now()}.${extension}`;
    const storageRef = ref(getStorage(), `cameraPhotos/${timestampedFilename}`);
    try {
      const response = await fetch(capturedPhoto);
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
       const cameraUrl =  await uploadCamera();
       const docRef = await addDoc(collection(db, 'posts'), {
        uid: user.uid,
        caption: caption,
        image:cameraUrl,
        uploadedDate: date,
        postTime: time,
        Hours: Hours,
        displayName: currentLoggedInUser.displayName,
        editedProfileImage:currentLoggedInUser.editedProfileImage,
        lastName:currentLoggedInUser.lastName,
        createdAt: Timestamp.now(),
      });
      setIsLoading(false);
      console.log('Post added with ID: ', docRef.id);
      navigation.navigate('Home');
    } catch (error) {
      setIsLoading(false);
      console.error('Error adding post:', error);
      Alert.alert('Error Uploading Post', 'Please try again.');
    }
  };




  return (
    <View style={styles.container}>
        <View style={styles.topHeader}>
        <View style={styles.topHeaderIcons}>
          <TouchableOpacity
          onPress={()=>navigation.navigate('Post')}
          >
            <Ionicons name="arrow-back-outline" color="white" size={24} style={styles.leftArrowIcon} />
          </TouchableOpacity>
          <Text style={styles.uploadTopText}>Upload photo</Text>

          
          <TouchableOpacity onPress={addPost}>
            <Ionicons name="send" color="white" size={24} style={styles.sendIcon} />
          </TouchableOpacity>
        </View>
      </View>
      {capturedPhoto ? (
        <>
        <Image source={{ uri: capturedPhoto }} style={styles.capturedImage} />
        <View style={styles.addPostContainer}>
        <TextInput
          placeholder="Add a caption to this post"
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
        {/* {image && <Image source={{ uri: image }} style={{ width: 330, height: 200, borderRadius: 10 }} />}                      */}
        <View style={styles.addPost} >
          {loading ? (
            <View>
            <View style={[styles.container2, styles.horizontal]}>    
             <ActivityIndicator size="large" color="tomato" />
    </View>
        </View> 
          ):(
            <TouchableOpacity 
            onPress={()=>navigation.navigate('addCamera')} >
            <Ionicons name="camera" color="white" size={24} style={styles.uploadIcons} />
            <Text style={styles.uploadTexts}>Open camera</Text>
            </TouchableOpacity>
          )}                       
        </View>
      </View>
        </>
      ) : (         
        <Camera style={styles.camera} type={cameraType} ref={(ref) => (cameraRef.current = ref)}>
          <View style={styles.cameraContainer}>
            <TouchableOpacity style={styles.flipButton} onPress={flipCamera}>
              <Ionicons name="camera-reverse-outline" size={30} color="white" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.captureButton} onPress={takePicture}>
              <View style={styles.captureButtonInner} />
            </TouchableOpacity>
          </View>
        </Camera>
      )} 
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
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
    backgroundColor: '#FFA07A',
    height: 50
  },

  topHeaderIcons: {
    margin: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
   },
   uploadTopText: {
    color: '#ffffff',
    fontWeight: 'bold'
  },
  camera: {
    flex: 1,
  },
  capturedImage: {
    height: 400,
    },
  cameraContainer: {
    flex: 1,
    backgroundColor: 'transparent',
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
  },
  flipButton: {
    alignSelf: 'flex-end',
  },
  captureButton: {
    alignSelf: 'flex-end',
    alignItems: 'center',
    justifyContent: 'center',
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: 'white',
  },
  captureButtonInner: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'white',
  },
});

export default OpenCamera;
