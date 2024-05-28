import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
 import Signup from './auth/Signup';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Feed from './screens/Feed';
import { AuthContextProvider } from './auth/AuthContext';
import Login from './auth/Login';
import EditProfile from './screens/EditProfile';
import AddVideo from './components/AddVideo';
import PostDetails from './screens/PostDetails';
import UserProfileScreen from './screens/UserProfileScreen';
import AllComments from './screens/AllComments';
import Search from './components/Search';
import AddCamera from './components/OpenCamera';
import Settings from './screens/Setttings';
import DarkMode from './screens/DarkMode';
import TermsOfService from './screens/TermsOfService';
import PrivacyPolicy from './screens/PrivacyPolicy';
import OnBoardingScreen from './screens/OnBoardingScreen';
import SavedPosts from './screens/SavedPosts';
import LikedPhotos from './screens/LikedPhotos';
import PasswordReset from './screens/PasswordReset';
import FirstScreen from './screens/FirstScreen';
const Stack = createNativeStackNavigator();
 
export default function App() {
  return (
     <AuthContextProvider>
        <NavigationContainer>
    <Stack.Navigator
    initialRouteName='login'
    >
      <Stack.Screen name="Feed" component={Feed} 
      options={{
        headerShown: false
      }}
      />
       {/* <Stack.Screen name="OnBoarding" component={OnBoardingScreen} 
      // options={{
      //   headerShown: false
      // }}
      /> */}
      <Stack.Screen name="login" component={Login} options={{
         headerShown: false
      }} />
      <Stack.Screen name="Welcome" component={FirstScreen} 
      // options={{headerShown: false}} 
      />
      <Stack.Screen name='UserProfileScreen'component={UserProfileScreen}options={{
         headerShown: false
      }}/>
      <Stack.Screen name="signup" component={Signup} options={{
         headerShown: false
      }}/>
       <Stack.Screen name="Saved posts" component={SavedPosts} 
      //  options={{headerShown: false}}
       />

      <Stack.Screen name="Liked posts" component={LikedPhotos} 
      //  options={{headerShown: false}}
       />

      <Stack.Screen name="Terms of Service" component={TermsOfService} 
      // options={{headerShown: false}}
      />
      <Stack.Screen name="Password Reset" component={PasswordReset} 
      // options={{headerShown: false}}
      />
       <Stack.Screen name="Privacy Policy" component={PrivacyPolicy} 
      // options={{headerShown: false}}
      />
       <Stack.Screen name="darkmode" component={DarkMode} options={{
         headerShown: false
      }}/>
      
       <Stack.Screen name="Settings" component={Settings} options={{
         // headerShown: false
      }}/>
      <Stack.Screen name="postDetail" component={PostDetails} 
      options={{
         headerShown: false
      }}
      />
      <Stack.Screen name="AllComments" component={AllComments}
       options={{ headerShown: false}}
      />
      <Stack.Screen name="addCamera" component={AddCamera}
       options={{ headerShown: false}}
      />
      <Stack.Screen name="Upload Video" component={AddVideo}  options={{
         headerShown: false
      }}/>
      <Stack.Screen name="search" component={Search}  options={{
         headerShown: false
      }}/>
      <Stack.Screen name='editprofile'component={EditProfile}
      options={{
         headerShown: false
      }}
      /> 
     </Stack.Navigator>
  </NavigationContainer>
     </AuthContextProvider>
   );
}
 
