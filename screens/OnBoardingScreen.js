import { StyleSheet, Text, View,Image, TouchableOpacity } from 'react-native'
import React from 'react'
import Onboarding from 'react-native-onboarding-swiper';
import { Ionicons } from '@expo/vector-icons';

const OnBoardingScreen = ({navigation}) => {

  const skip = ()=> {
    return (      
      <View>
        <TouchableOpacity onPress={()=>navigation.replace('login')}>
        <Text style={{fontWeight: 'bold', fontSize:15, color: '#000', marginLeft:20}}>Skip</Text>
        </TouchableOpacity>
      </View>     
     )
  }
  const next = ()=> {
    return (      
      <View style={{marginRight:20, backgroundColor: '#fff', borderRadius: 10, padding:7 }}>
        <TouchableOpacity style={{flexDirection: 'row',alignItems:'center'}} 
         >
        <Text style={{fontWeight: 'bold', fontSize:15, color: '#000', marginLeft:20}}>Next</Text>
        <Ionicons name='arrow-forward-outline' size={24} color={'tomato'}/>
        </TouchableOpacity>
      </View>      
    )
  }


  const done = ()=> {
    return (      
      <View>
       <TouchableOpacity style={{marginRight:20, backgroundColor: 'tomato', padding:10, borderRadius:10}}>
        <Text style={{fontWeight: 'bold', fontSize:15, color: '#fff'}}
        onPress={()=>navigation.replace('login')}
        >Done</Text>
       </TouchableOpacity>
      </View>      
    )
  }


  return (
       <Onboarding
       SkipButtonComponent={skip}
       NextButtonComponent={next}
       DoneButtonComponent={done}
          
  pages={[
    {
      backgroundColor: '#fff',
      image: <Image source={require('../assets/3d1.png')}  />,
      title: 'Welcome to Thlorall',
      subtitle: 'Discover and connect with friends around the world.',
    },
    {
        backgroundColor: '#fff',
        image: <Image source={require('../assets/3d2.png')} styles={styles.image} />,
        title: 'Share Your Moments',
        subtitle: 'Capture and share your favorite moments with ease.',
      },
      {
        backgroundColor: '#fff',
        image: <Image source={require('../assets/3d3.png')} styles={styles.image} />,
        title: 'Connect with Others',
        subtitle: 'Find and connect with friends who share your interests.',
      },
   ]}
/>
   )
}

export default OnBoardingScreen

const styles = StyleSheet.create({    
})