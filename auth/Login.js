import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ImageBackground, Image, ScrollView, Dimensions  } from 'react-native'
import React, { useState } from 'react' 
import * as Yup from 'yup'
 import {useEffect} from 'react'
import { useNavigation } from '@react-navigation/core'
 import {  browserSessionPersistence, getAuth, onAuthStateChanged, setPersistence, signInWithEmailAndPassword } from 'firebase/auth'
 import AsyncStorage from '@react-native-async-storage/async-storage'
import app, { auth } from '../data/Firebase'
import { useAuth } from './AuthContext'
  
  const LoginForm = () => {
    const {user} = useAuth()
      const image = {uri: 'https://images.unsplash.com/photo-1517732306149-e8f829eb588a?q=80&w=1472&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'}
    const navigation = useNavigation()
     const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
     const [loading, setLoading] = useState(null)         
  const handleLogin = ()=>{
    signInWithEmailAndPassword(auth, email, password)
  .then((userCredential) => {
    // Signed in 
    const user = userCredential.user;
    // ...
  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
  });
  }
  
  useEffect(() => {     
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const uid = user.uid
        // console.log('User is signed in:', user.uid);
        await AsyncStorage.setItem('user', user.uid);
        navigation.replace('Feed');
      } else {
        // console.log('User is signed out');
        // checkUser();
      }
    });
  
    return () => unsubscribe();
  }, []);
  
    
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
        onSubmitEditing={handleLogin}
        onChangeText={(text)=>setPassword(text)}
         value={password}
        />
        <TouchableOpacity onPress={()=>navigation.navigate('Password Reset')}>
        <Text style={styles.fogot}>Forgot password?</Text>
        </TouchableOpacity>
       </View>
      {loading ? (
  
<View>
<View style={[styles.container2, styles.horizontal]}>    
 <ActivityIndicator size="large" color="tomato" />
</View>
</View>
      ) :      
      (
   <TouchableOpacity onPress={handleLogin} 
  style={styles.button}>
   <Text style={styles.text}>Login</Text>
 </TouchableOpacity>
      )
      }           
      <View style={styles.dont}>
      <Text style={styles.have}>Don't have an account?</Text>          
      <TouchableOpacity 
      onPress={()=>navigation.navigate('signup')}>
        <Text style={styles.fogot}> Sign up</Text>
      </TouchableOpacity>
      </View>
            </>         
     </View>
    </ImageBackground>
</ScrollView>
    </View>
  )
}

export default LoginForm
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