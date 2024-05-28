import { StyleSheet, Text, View, Dimensions} from 'react-native'
import React from 'react'
import { Image } from 'react-native'
import { TouchableOpacity } from 'react-native'
import { useNavigation } from '@react-navigation/native'
 const FirstScreen = () => {
    const navigation = useNavigation()
  return (
    <View>
      <View>
        <Image source={require('../assets/Thlorall.png')} style={styles.logo}/>
      </View>
      <View style={styles.container}>
      <TouchableOpacity  onPress={()=>navigation.navigate('login')}
        style={styles.button}>
        <Text style={styles.text}>Login</Text>
      </TouchableOpacity>
        

      <TouchableOpacity  onPress={()=>navigation.navigate('signup')}
        style={styles.button}>
        <Text style={styles.Loginbutton}>Sign up</Text>
      </TouchableOpacity>
      </View>
    </View>
  )
}

export default FirstScreen

const styles = StyleSheet.create({
    container: {
        marginTop:200
    },
    logo:{
        width: '60%',
        height:80,
        alignSelf:'center'
    },
    Loginbutton: {
        padding: 10,
        width: Dimensions.get('window').width * .85,
        fontSize: 25,
        fontWeight: "bold",
        textAlign: "center",
        justifyContent: 'center' ,
        color: "#ff6347", 
        borderRadius: 30,
        // backgroundColor: '#ff6347''
        borderWidth:1,
        borderColor: '#ff6347'
    },
    button:{
        margin: 20,
        justifyContent: 'center',
        alignItems: 'center',
     },
    text: { 
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
})