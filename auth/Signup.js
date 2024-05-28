import { StyleSheet, Text, View,Dimensions,TouchableOpacity, TextInput, Image, ScrollView, ImageBackground, ActivityIndicator } from 'react-native'
import React,{useState} from 'react'
import { GoogleAuthProvider,onAuthStateChanged,signInWithPopup } from "firebase/auth";
import { createUserWithEmailAndPassword,  signInWithEmailAndPassword } from "firebase/auth";
import { auth, db} from '../data/Firebase'  
import { useNavigation } from '@react-navigation/core';
import { collection, addDoc, doc, setDoc } from "firebase/firestore"; 
import { useAuth } from './AuthContext';
// import AsyncStorage from '@react-native-async-storage/async-storage';
   const Signup = ( ) => {
  // Data Variable
  const{user} = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState("")
  const [displayName, setDisplayName] = useState('')
  const [lastName, setLastName] =useState('')
  const [loading, setLoading] = useState(null)
  const navigation = useNavigation()
  const image = {uri: 'https://images.unsplash.com/photo-1528642474498-1af0c17fd8c3?q=80&w=1469&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'}
  // Login 
  const handleSignUp = () => {
    setLoading(true);  
    createUserWithEmailAndPassword(auth, email, password)
      .then(async (userCredential) => {
        // Wait for the authentication state to change
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
          if (user) {
            const uid =  user.uid;
            try {
              // Add user document to the 'users' collection
              const docRef = doc(db, 'users', user.uid);  
              await setDoc(docRef, {
                userId:uid,
                email:email
              })  
              setLoading(false);
              console.log("Document written with ID: ", docRef.id);
            } catch (e) {
              console.error("Error adding document: ", e);
            }  
            // Unsubscribe from the auth state changes
            unsubscribe();
          }
        });  
        console.log("Signed In");
        navigation.navigate('Feed');
      })
      .catch((error) => {
        console.log(error.message);
        setLoading(false);
      });
  }; 
  return (
    <View style={styles.mainContainer}>
<ScrollView>
<ImageBackground
        source={image}
    style={styles.header}>
    <View style={styles.container}>
    <Image source={require('../assets/Thlorall.png')} style={styles.logo}/>
 
             <>
        <View style={styles.inputField}>
       <TextInput
       style={styles.email}
        placeholderTextColor={'#444'} 
        placeholder=" Email"
        autoCapitalize='none'
        keyboardType='email-address'
        textContentType='emailAddress'
        autoFocus={true}
        onChangeText={(text)=>setEmail(text)}
        value={email}
        />

        <TextInput
         style={styles.password}
        placeholderTextColor={'#444'}
        placeholder=" Password"
        autoCapitalize='none'
        textContentType='password'
        autoFocus={true}
        secureTextEntry={true}
        onChangeText={(text)=>setPassword(text)}
         value={password}
        />
        <Text style={styles.fogot}>Forgot password?</Text>
       </View>
            {/* Login button */}
            {loading ?
        (<View>
          <View style={[styles.container2, styles.horizontal]}>    
           <ActivityIndicator size="large" color="tomato" />
    </View>
      </View>) : 

(<TouchableOpacity onPress={handleSignUp} 
  style={styles.button}>
   <Text style={styles.text}>Sign up</Text>
  </TouchableOpacity>)
      }
       

      <View style={styles.dont}>
      <Text style={styles.have}>Already have an account?</Text>                   
      <TouchableOpacity 
      onPress={()=>navigation.navigate('login')}>
        <Text style={styles.fogot}> Login</Text>
      </TouchableOpacity>
      </View>
            </>
         
     </View>

    </ImageBackground>
</ScrollView>
    </View>
  )
}

export default Signup

const styles = StyleSheet.create({
  mainContainer: {
    backgroundColor: '#fff',
},
container: {
    marginTop: 200,
    backgroundColor: '#fff',
   borderTopRightRadius: 20,
   borderTopLeftRadius: 20,
},
inputField: {       
   margin: 10,
   marginTop: 20,
   marginBottom: 20,
   padding: 20,
   justifyContent: 'center',
},
password: {
 width: Dimensions.get('window').width * .85,
 height: 50,
 // borderWidth:1,
 // borderColor:'#429ea6',
 borderRadius:7,
 marginBottom:10,
 backgroundColor: '#ecebe4',
 marginTop: 10,

},
email: {
 width: Dimensions.get('window').width * .85,
 height: 50,
 // borderWidth:1,
 // borderColor:'#429ea6',
 borderRadius:7,
 marginBottom:10,
 backgroundColor: '#ecebe4',
 marginTop: 10,

},
button:{
   margin: 20,
   justifyContent: 'center',
   alignItems: 'center',
},
text: {
   // backgroundColor: isValid ? '#ff6347' : '#FFA07A',
   
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
fogot: {
   marginTop: 10,
   fontSize: 15,
   fontWeight: 'bold',
   color: '#1f618d',
},
dont: {
   flexDirection: 'row',
   justifyContent: 'center',
   alignItems: 'center',
   marginBottom: 100,
},
have: {
   marginTop: 10,
},
logo: {
   width: '80%',
   height: 80,
   alignSelf: 'center',                
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