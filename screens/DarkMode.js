import React from 'react';
import { View, Text, TouchableOpacity ,StyleSheet} from 'react-native';
import { useTheme } from '../components/ThemeContext';
 const DarkMode = ({DarkModeCloseModal}) => {
  const { isDarkMode, toggleTheme } = useTheme();

  return (
   <View style={{ flex: 1, justifyContent: 'flex-end', margin: 0 }} >
      <View  style={{
          backgroundColor: 'white',
          padding: 16,
          borderTopLeftRadius: 16,
          borderTopRightRadius: 16,
        }}>
        <TouchableOpacity onPress={DarkModeCloseModal}>
        <Text style={styles.topLine}></Text>
        </TouchableOpacity>

            <Text style={styles.DarkmodeH1}>Appearance</Text>
      <View style={{backgroundColor: isDarkMode ? 'black' : 'white', alignSelf: 'center' }}>
      {/* <Text style={{ fontSize: 24, color: isDarkMode ? 'white' : 'black' }}>Dark Mode</Text> */}
      <TouchableOpacity onPress={toggleTheme}>
        <Text style={{ color: isDarkMode ? 'white' : 'black' }}>Toggle Theme</Text>
      </TouchableOpacity>
    </View>
      </View>
   </View>
  );
};

 

export default DarkMode

const styles = StyleSheet.create({
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
      DarkmodeH1:{
         fontWeight: 'bold',
        textAlign: 'center'
      },
      topLine: {
        borderTopWidth: 5,
        width: 50,
        alignSelf: 'center',
        borderColor: '#ECECEC'
    },
})