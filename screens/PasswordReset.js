// ResetPasswordScreen.js
import React, { useState } from 'react';
import { View, Text, TextInput, Button, TouchableOpacity,StyleSheet } from 'react-native';
import { auth } from '../data/Firebase';
import { sendPasswordResetEmail } from '@firebase/auth';
 
const PasswordReset = () => {
  const [email, setEmail] = useState('');

  const handleResetPassword = async () => {
    try {
       sendPasswordResetEmail(auth, email);
      console.log('Password reset email sent successfully', email);
    } catch (error) {
      console.error('Error sending password reset email', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.texth1}>Enter your email to reset password:</Text>
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={(text) => setEmail(text)}
        keyboardType='email-address'
        style={styles.input}
       />
      <TouchableOpacity onPress={handleResetPassword} style={styles.button}>
        <Text style={styles.reset}>Reset Password</Text>
      </TouchableOpacity>
     </View>
  );
};

export default PasswordReset;

const styles = StyleSheet.create({
    container: {
        margin:10
    },
    texth1: {
        textAlign: 'center',

    },
    input: {
        marginTop: 10,
        borderBottomWidth: 1,
        borderColor:'tomato',
        backgroundColor: '#ecebe4',
        height: 50,
    },
button: {
     alignItems: 'center',
     marginTop: 20,
     backgroundColor: 'tomato',
     padding:10,
     borderRadius:10
},
reset: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 20
}
})
