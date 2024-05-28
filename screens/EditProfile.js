import { Image, ImageBackground, StyleSheet, Text, View, Dimensions, TouchableOpacity,ActivityIndicator, ScrollView,Platform, TextInput, Alert } from 'react-native'
import React, { useState, useEffect } from 'react'
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { ref, getStorage, uploadBytes, getDownloadURL} from 'firebase/storage';
import { auth, db } from '../data/Firebase';
import { Timestamp, collection, doc, getDocs, orderBy, query, setDoc, where } from 'firebase/firestore';
 import { useAuth } from '../auth/AuthContext';
import { onAuthStateChanged } from 'firebase/auth';
 const EditProfile = () => {
    const navigation=useNavigation();
    const [userName, SetUserName] = useState('')
    const [backgroundImageBanner, setBackgroundImageBanner] = useState('')
    const [profEditImage, setProfileEditImaege] = useState('')
    const [displayName, setDisplayName] = useState('')
    const [lastName, setLastName] = useState('')
    const [bio, setBio] = useState('')
    const [gallery, setGallery] = useState('')
    const [uploadProgress, setUploadProgress] = useState(0);
    const [userPostInfo, setUserPostInfo] = useState(null)

    const [loading, setIsLoading] = useState(false);

    const {user} = useAuth()
    useEffect(() => {
        (async () => {
          const galleryStatus = await ImagePicker.requestMediaLibraryPermissionsAsync();
          setGallery(galleryStatus.status === 'granted');
        })();
      }, []);
    
      const pickEditProfileImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
         mediaTypes: ImagePicker.MediaTypeOptions.All,
         allowsEditing: true,
         aspect: [4, 3],
         quality: 1,
       });    
       console.log(result);    
       if (!result.canceled) {
        setProfileEditImaege(result.assets[0].uri);
       }
     };
     const pickEditProfileBackImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
         mediaTypes: ImagePicker.MediaTypeOptions.All,
         allowsEditing: true,
         aspect: [4, 3],
         quality: 1,
       });    
       console.log(result);    
       if (!result.canceled) {
        setBackgroundImageBanner(result.assets[0].uri);
       }
     };

     const backImageBanner = "https://plus.unsplash.com/premium_photo-1682308262087-a19aa679649d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTl8fG1vZGVybiUyMGFydHxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60"

     const editImageProf = "https://images.unsplash.com/photo-1541367777708-7905fe3296c0?q=80&w=1495&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"


    //  Updating Profile Background Image and sending it to firebase to be retreaved.
     const uploadBackgroundImage = async () => {
        if (!backgroundImageBanner) {
          return null;
        }    
        const filename = backgroundImageBanner.substring(backgroundImageBanner.lastIndexOf('/') + 1);
        const extension = filename.split('.').pop();
        const name = filename.split('.').slice(0, -1).join('.');
        const timestampedFilename = `${name}_${Date.now()}.${extension}`;    
        const storageRef = ref(getStorage(), `editedBackgroundImages/${timestampedFilename}`);    
        try {
          const response = await fetch(backgroundImageBanner);
          const blob = await response.blob();
    
          const snapshot = await uploadBytes(storageRef, blob);
          const downloadURL = await getDownloadURL(storageRef);
          return downloadURL;
        } catch (error) {
          console.error('Error uploading background image:', error);
          return null;
        }
      };    
      const uploadProfileImage = async () => {
        if (!profEditImage) {
          return null;
        }    
        const filename = profEditImage.substring(profEditImage.lastIndexOf('/') + 1);
        const extension = filename.split('.').pop();
        const name = filename.split('.').slice(0, -1).join('.');
        const timestampedFilename = `${name}_${Date.now()}.${extension}`;    
        const storageRef = ref(getStorage(), `EditedProfileImages/${timestampedFilename}`);    
        try {
          const response = await fetch(profEditImage);
          const blob = await response.blob();    
          const snapshot = await uploadBytes(storageRef, blob);
          const downloadURL = await getDownloadURL(storageRef);
          return downloadURL;
        } catch (error) {
          console.error('Error uploading background image:', error);
          return null;
        }
      };


      useEffect(() => {
        onAuthStateChanged(auth, (user)=>{
          if (user){
            const uid =  user.uid;
            console.log(uid)  
            const fetchData = async () => {
              const timestamp = ('timestamp', 'desc')
                const citiesRef = collection(db, 'posts');
              const querySnapshot = query(citiesRef, 
                where("uid", "==", uid));             
              orderBy(timestamp);
              const snapshot = await getDocs(querySnapshot);
               const documents = snapshot.docs.map((doc) => {        
                setUserPostInfo({
                image: doc.data().image,
                uploadedDate:doc.data().uploadedDate,
                postTime:doc.data().postTime,
                Hours:doc.data().Hours,
                uid:doc.data().uid,
             })              
                 });
              };    
            fetchData();
          }
        })    
      },[])  
      const HandleEditProfile = async () => {
        setIsLoading(true);            
        try {
          const imageBackgroundUrl = await uploadBackgroundImage();
          const imageProfileUrl = await uploadProfileImage();      
           const ref = doc(db, 'profileUpdate', user.uid);      
           await setDoc(ref, {
            uid: user.uid,
            displayName:displayName,
            lastName:lastName,
            editedBackimage: imageBackgroundUrl,
            editedProfileImage: imageProfileUrl,
            username:userName,
            bio:bio,
            // caption: userPostInfo.caption,
            // image: userPostInfo.image,
            // uploadedDate: userPostInfo.uploadedDate,
            // postTime: userPostInfo.postTime,
            // Hours: userPostInfo.Hours,
            // uploadedDate: userPostInfo.uploadedDate,
            // publicUid:userPostInfo.uid,
            createdAt: Timestamp.now(),
           });
      
          setIsLoading(false);
          setUploadProgress(0);    
          navigation.navigate('Profile');
        } catch (error) {
          setIsLoading(false);
          console.error('Error updating profile:', error);
          Alert.alert('Error Updating Profile', 'Please try again.');
        }
      };     

      
  return (
    <View>
        <ScrollView>
        <View>
        <ImageBackground  source={{uri: backgroundImageBanner ? backgroundImageBanner : backImageBanner }} alt='backimage' style={styles.backimage}>

          <View style={styles.headerIcons}>
            <TouchableOpacity style={styles.arrowBackIcon}
            onPress={()=>navigation.navigate('Profile')}
            >
            <Ionicons name="arrow-back-outline" size={30} color="#FF6347"/>
            </TouchableOpacity>

            <TouchableOpacity style={styles.dotsIcon}
            onPress={pickEditProfileBackImage}
            >
            <Ionicons name="add" size={30} color="#FF6347" />
            </TouchableOpacity>
           </View>
            
            <Image source={{uri: profEditImage ? profEditImage : editImageProf}} alt='profileimage' style={styles.profileimage} />
            <TouchableOpacity  style={styles.editProfileIcon}
            onPress={pickEditProfileImage}
            >
            <Ionicons name='add' size={30} color={"white"} 
             />
            </TouchableOpacity>
         </ImageBackground>     

         <View style={styles.EditprofileContents}>
         <View style={styles.profileNames}>
         <Text style={styles.usernameBio}>First name</Text>
          <TextInput
             style={styles.username}
             placeholderTextColor={'#444'} 
             placeholder="First name"
             autoCapitalize='none'
             textContentType= 'givenName'
            //  autoFocus={true}
             onChangeText={(text)=>setDisplayName(text)}
             value={displayName}
           />
           <Text style={styles.usernameBio}>Last name</Text>

           <TextInput
             style={styles.username}
             placeholderTextColor={'#444'} 
             placeholder="Last name"
             autoCapitalize='none'
             textContentType= 'familyName'
            //  autoFocus={true}
             onChangeText={(text)=>setLastName(text)}
             value={lastName}
           />
            {/* username */}
            <Text style={styles.usernameBio}>Username</Text>
          <TextInput
             style={styles.username}
             placeholderTextColor={'#444'} 
             placeholder="Edit username"
             autoCapitalize='none'
             textContentType='username'
            //  autoFocus={true}
             onChangeText={(text)=>SetUserName(text)}
             value={userName}
           />
            {/* Bip */}
            <Text style={styles.usernameBio}>Bio</Text>
            <TextInput
             style={styles.bioInput}
             placeholderTextColor={'#444'} 
             placeholder="Edit bio"
             autoCapitalize='none'
             textContentType='username'
             autoFocus={true}
             editable
             multiline
            //  numberOfLines={4}
             maxLength={200}
             onChangeText={(text)=>setBio(text)}
             
             value={bio}
           />
           </View> 
          {/* <Text>{uploadProgress}%</Text> */}
          {loading ? 
        (<View>
          <View style={[styles.container, styles.horizontal]}>    
           <ActivityIndicator size="large" color="tomato" />
  </View>
      </View>) : 
    
    (<TouchableOpacity style={styles.saveButton}
      onPress={HandleEditProfile}>
       <Text style={styles.saveText}>Save</Text>
      </TouchableOpacity>)
        }
            
         </View>

                       
      </View>
        </ScrollView>
    </View>
  )
}

export default EditProfile

const styles = StyleSheet.create({
    profileContainer:{ 
        marginTop: Platform.OS === 'ios' ? -9 :25,
     },
     EditprofileContents: {
      margin: 10
     },
    backimage: {
      width: '100%',
      height: 150,
      marginTop: 20,
      },
    profileimage:{
      width: 100,
      height: 100,
      borderRadius: 100,
      position: 'absolute',
      left: '35%',
      top: '55%',
      borderWidth: 3,
      borderColor: '#CCC'
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
        borderBottomWidth: 1,
        borderColor: '#FFa07a',
        width: Dimensions.get('window').width * .85,

    },
    bioInput: {
        borderBottomWidth: 1,
        borderColor: '#FFa07a',
        width: Dimensions.get('window').width * .85,
        height: 'auto',
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
      borderColor: '#FFA07A',
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
      marginBottom: 10
    },
    userPhotos: {
      marginTop: 50,
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
       usernameBio: {
        marginTop: 10,
        marginBottom: 10,
        fontWeight: 'bold'
       },
    saveButton:{
        margin: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
    },
    saveText:{
        padding: 10,
        width: Dimensions.get('window').width * .85,
        fontSize: 25,
        fontWeight: "bold",
        textAlign: "center",
        justifyContent: 'center' ,
        color: "#fff", 
        borderRadius: 30,
        backgroundColor: '#ff6347'
    },
    container: {
      flex: 1,
      justifyContent: 'center',
      marginTop: 5,
    },
    horizontal: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      padding: 10,
    },
    
})