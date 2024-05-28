import { Ionicons,Entypo } from '@expo/vector-icons';
import React, {  useState } from 'react';
import { View, Text, TouchableOpacity,StyleSheet, Modal,Platform, ScrollView } from 'react-native';
import DarkMode from './DarkMode';
import { ThemeProvider } from '../components/ThemeContext';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import {collection , where, query, getDocs, getDoc, doc, orderBy, collectionGroup, } from "firebase/firestore";
import { auth, db } from '../data/Firebase';
import { useAuth } from '../auth/AuthContext';
import { useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import About from './About';
  const Settings = ({ closeModal}) => {  
    const {user} = useAuth()
    const navigation = useNavigation()

  const [DarkModeModalVisible, setDarkModeModalVisible] = useState(false);  
  const [aboutModalVisible, setAboutModalVisible] = useState(false);  

  const DarkModeOpenModule = () => {
    setDarkModeModalVisible(true);
  };
  const DarkModeCloseModal = () => {
    setDarkModeModalVisible(false);
};
  
const AboutOpenModule = () => {
    setAboutModalVisible(true);
  };
  const AboutCloseModal = () => {
    setAboutModalVisible(false);
};
const loggOff = ()=>{
    const auth = getAuth(); 
  signOut(auth).then(() => {
    console.log("User logged out successful")
    navigation.navigate('login') 
  }).catch((error) => {
    console.log(error, "User logged out unsuccessful")
  });
    }
 
  return (
    <ScrollView>
       <View 
    // style={{ flex: 1, justifyContent: 'flex-end', margin: 0 }}
    >
      {/* <View style={styles.topHeader}>
        <View style={styles.topHeaderIcons}>
          <TouchableOpacity
          onPress={()=>navigation.navigate('Profile')}>
            <Ionicons name="arrow-back-outline" color="white" size={24} style={styles.leftArrowIcon} />
          </TouchableOpacity>
          <Text style={styles.uploadTopText}>Settings</Text>          
          
        </View>
      </View> */}
      <View
        style={{
          backgroundColor: 'white',
          padding: 16,
          // borderTopLeftRadius: 16,
          // borderTopRightRadius: 16,
        }}
      >
         
       {/* <TouchableOpacity onPress={closeModal}>
       <Text style={styles.topLine}></Text>
       </TouchableOpacity> */}
          {/* <Text style={styles.settingsText}>Settings</Text> */}
         <View style={styles.settingsAttributes}>
        {/* <TouchableOpacity style={styles.settingsButtons}>
             <Ionicons name='person-outline' color={'black'} size={24}/>
          <Text style={styles.settingsLinksText}>Profile details</Text>
        </TouchableOpacity> */}
        <Text style={styles.text}>Interactions</Text>
        <TouchableOpacity style={styles.settingsButtons}  
        onPress={()=>navigation.navigate('Saved posts')}>
          <Ionicons name='bookmark-outline' color={'black'} size={24}/>
          <Text style={styles.settingsLinksText}>Saved</Text>           
        </TouchableOpacity>
        <TouchableOpacity style={styles.settingsButtons}  
        onPress={()=>navigation.navigate('Liked posts')}>
          <Ionicons name='heart-outline' color={'black'} size={24}/>
          <Text style={styles.settingsLinksText}>Liked</Text>           
        </TouchableOpacity>
        <Text style={styles.text}>Legal Policies</Text>
        
        <TouchableOpacity style={styles.settingsButtons}
        onPress={()=>navigation.navigate('Terms of Service')}
        >
            <Entypo name='book' color={'black'} size={24}/>
          <Text style={styles.settingsLinksText}>Terms of service</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.settingsButtons}
        onPress={()=>navigation.navigate('Privacy Policy')}
        >
            <Ionicons name='shield-outline' color={'black'} size={24}/>
          <Text style={styles.settingsLinksText}>Privacy Policy</Text>
        </TouchableOpacity>
        <Text style={styles.text}>Info & Support</Text>

        <TouchableOpacity style={styles.settingsButtons}>
            <Ionicons name='help-buoy-outline' color={'black'} size={24}/>
          <Text style={styles.settingsLinksText}>Help</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.settingsButtons} onPress={AboutOpenModule}>
            <Ionicons name='information-circle-outline' color={'black'} size={24}/>
          <Text style={styles.settingsLinksText}>About</Text>
          <Modal
        animationType="slide"
        transparent={true}
        visible={aboutModalVisible}
        onRequestClose={AboutCloseModal}>
       <ThemeProvider>
       <About AboutCloseModal={AboutCloseModal} />
       </ThemeProvider>
      </Modal>
        </TouchableOpacity>
        <Text style={styles.text}>Account</Text>
        <TouchableOpacity style={styles.settingsButtons} onPress={()=>navigation.navigate('signup')}>
            <Ionicons name='add' color={'black'} size={24}/>
          <Text style={styles.settingsLinksText}>Add account</Text>
        </TouchableOpacity>
        <View>
           <TouchableOpacity style={[styles.settingsButtons, styles.loggout]} onPress={loggOff}>
           <Ionicons name='log-out-outline' color={'white'} size={24}/>                   
            <Text style={[styles.settingsLinksText, styles.loggoutText]}>Log out as: 
            {' '}{user.email}
            </Text>                   
           </TouchableOpacity>
        </View>
        </View>
      </View>
    </View>
    </ScrollView>
  );
};

export default Settings;
const styles = StyleSheet.create({
    settingsText: {
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center'
    },
    topLine: {
        borderTopWidth: 5,
        width: 50,
        alignSelf: 'center',
        borderColor: '#ECECEC'
    },
    settingsButtons: {
      marginTop: 10,
      backgroundColor: '#ECECEC',
      borderRadius:10,
      flexDirection: 'row',
      alignItems: 'center',
      padding: 15,
    },
    settingsLinksText: {
        marginLeft: 10,
     },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
      },
      darkContainer: {
        backgroundColor: 'black',
      },
      text: {
        fontSize: 24,
        color: 'black',
      },
      darkText: {
        color: 'white',
      },
      text: {
        marginTop: 10
      },
      loggout: {
        backgroundColor: 'red'
      },
      loggoutText: {
        color: '#fff',
        fontWeight: 'bold'
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
        },
       uploadTopText: {
        color: '#ffffff',
        fontWeight: 'bold',
        textAlign: 'center',
        marginLeft: 10
      },
})