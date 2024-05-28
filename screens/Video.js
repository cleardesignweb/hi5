import { SafeAreaView, ScrollView, StyleSheet, Text, View,Platform, Image } from 'react-native'
import React from 'react'
 import { StatusBar } from 'expo-status-bar';
import PostVideo from '../components/PostVideo';

const Video = () => {
  
  return (
        <View style={styles.HomeContainer}>
          
       <StatusBar
         backgroundColor="#FFA07A"/>
        <ScrollView>
        <View style={styles.homeHeader}>
            <Image source={require('../assets/Thlorall.png')} style={styles.logo}/>
            {/* <Text  style={styles.logoText}>Thloral</Text>  */}
          </View>
         {/* <PostVideo/> */}
         </ScrollView>
       </View>
   )
}

export default Video

const styles = StyleSheet.create({
  HomeContainer: {
    backgroundColor: '#fff', 
  },
  homeHeader: {
    marginTop: Platform.OS === 'ios' ? -9 :27,
    backgroundColor: '#fff',    
    width: '100%',
   },

   

  logoText:{
    color:'#fff',
    fontWeight:"bold",
    fontSize:36 ,
    alignSelf: 'center'
  },
  logo:{
    width: '50%',
    height: 50,
    // alignItems: "flex-start",
    alignItems: "center",
    alignSelf: 'center'
   },
})