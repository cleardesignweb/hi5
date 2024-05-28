import { View, Text, TouchableOpacity,StyleSheet } from 'react-native';
import React from 'react'
 const About = ({AboutCloseModal}) => {
   
    return (
        <View style={{ flex: 1, justifyContent: 'flex-end', margin: 0 }}>
          <View
            style={{
              backgroundColor: 'white',
              padding: 16,
              borderTopLeftRadius: 16,
              borderTopRightRadius: 16,
            }}
          >
             <TouchableOpacity onPress={AboutCloseModal}>
                 <Text style={styles.topLine}></Text>
                 </TouchableOpacity>
                 <Text style={styles.abouttexth1}>About</Text>
        <View style={styles.aboutContentCont}>
        <Text style={styles.abouttexth2}>Hi5</Text>
        <Text style={styles.abouttexth3}>From ClearDesign</Text>
        <View style={{marginTop: 20}}>
        <Text style={styles.abouttexth3}>Version</Text>
        <Text style={styles.abouttexth3}>12.8.23</Text>
        </View>
        </View>                     
          </View>
        </View>
      );
}

export default About

const styles = StyleSheet.create({
    aboutContentCont: {
        marginTop: 40
    },  
    abouttexth1:{
        fontWeight: 'bold',
        fontSize: 20,
       textAlign: 'center'
     },
     topLine: {
       borderTopWidth: 5,
       width: 50,
       alignSelf: 'center',
       borderColor: '#ECECEC'
   },
   abouttexth2: {
    textAlign: 'center',
    fontSize: 30,
    fontWeight: 'normal',
    },
    abouttexth3: {
        textAlign: 'center',
         fontWeight: 'normal',
    }
})