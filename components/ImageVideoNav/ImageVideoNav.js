import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import UserPhoto from './UserPhoto';
import UserVideo from './UserVideo';
import { Ionicons } from '@expo/vector-icons';

const Tab = createMaterialTopTabNavigator();

const  ImageVideoNav = ()=> {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Photo" component={UserPhoto} 
      options={{
        tabBarActiveTintColor: 'tomato',
        tabBarInactiveTintColor: '#000000',
        tabBarShowLabel: false,
        tabBarIndicator: false,
         tabBarIcon: ({ color }) => (
            <Ionicons name="image" size={24} color={color} />
          )
      }}
      />
      <Tab.Screen name="Videos" component={UserVideo}
      
      options={{
        tabBarActiveTintColor: 'tomato',
        tabBarInactiveTintColor: '#000000',
        tabBarShowLabel: false,
         tabBarIcon: ({ color }) => (
            <Ionicons name="play" size={24} color={color} />
          )
      }}/>
    </Tab.Navigator>
  );
}

export default ImageVideoNav