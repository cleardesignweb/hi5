import { StyleSheet, Text, View,TouchableOpacity, Image,Platform } from 'react-native'
import React from 'react'
import PostHeader from '../components/PostPicture'
import Interactions from '../components/PostPicture'
import { Ionicons } from '@expo/vector-icons';
import { CommonActions, useNavigation } from '@react-navigation/native';
 const AllComments = ({route}) => {
    const { post } = route.params;
    const navigateToProfile = (userId) => {
      console.log('Navigating to Profile screen with user ID:', userId);
      navigation.dispatch(
        CommonActions.navigate({
          name: 'UserProfileScreen',
          params: { uid: userId },
        })
      );
    }; 
    const navigation = useNavigation()
  return (
    <View >
        <View style={styles.topHeader}>
        <View style={styles.topHeaderIcons}>
          <TouchableOpacity
          onPress={()=>navigation.navigate('Home')}
          >
            <Ionicons name="arrow-back-outline" color="white" size={24} style={styles.leftArrowIcon} />
          </TouchableOpacity>
          <Text style={styles.uploadTopText}>The Comment Section</Text>
 
        </View>
      </View>
        {/* <PostHeader post={post}/> */}
        {/* <Interactions post={post}/>  */}
        <View
     style={styles.commenterMainContainer}
     >
       {/* onPress={() => navigateToProfile(post.uid)} */}
    {post.comments && Array.isArray(post.comments) && post.comments.length > 0 ? (
      post.comments.map((comment, index) => (
        <View key={index} style={{ flexDirection: 'row', alignItems: 'center' }}>
          <View style={styles.commenterContainer}>
            <TouchableOpacity onPress={() => navigateToProfile(post.uid)}>
            <Image source={{uri: comment.editedProfileImage}} style={styles.CommentProfileImage}/>
            </TouchableOpacity>
             <TouchableOpacity style={styles.commentProfileInfo}>
             <View >
             <Text onPress={() => navigateToProfile(post.uid)} style={{ fontWeight: '600'  }}>{comment.displayName} {comment?.lastName}</Text> 
             <Text>{comment.comment}</Text>
             </View>
             </TouchableOpacity>
           </View>
        </View>
      ))
    ) : (
      <Text>No comments</Text>
    )}
  </View>
    </View>
  )
}

export default AllComments

const styles = StyleSheet.create({
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
       container: {
         justifyContent: 'center',
        alignItems: 'center',
      },
      uploadTopText: {
        color: '#ffffff',
        fontWeight: 'bold',
        marginLeft: 10,
        fontSize:20
      },
      commentSecionContainer: {
        margin: 10
      },
      commentContant: {
        flexDirection: 'row',
      },
      displayName: {
        fontWeight: 'bold'
      },
       
      commenterContainer: {
        flexDirection: 'row',
        marginTop:10,
        marginLeft: 10
      },
      
       CommentProfileImage:{
        width:40,
        height: 40,
        borderRadius: 50,
       },
      commenterContainer:{
        marginLeft: 10,
        flexDirection: 'row',
       },
      commentProfileInfo: {
        marginLeft: 10,
         marginBottom: 20,
        backgroundColor: '#ECECEC',
        padding:10,
        borderRadius: 10
       },
       commenterMainContainer: {
        marginTop:10
       }
})