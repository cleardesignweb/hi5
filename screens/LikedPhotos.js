import React, { useEffect, useState } from 'react';
import { View, Text, FlatList } from 'react-native';
import { useAuth } from '../auth/AuthContext';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../data/Firebase';
import PostPicture from '../components/PostPicture';

const LikedPhotos = () => {
  const { user } = useAuth();
  const [savedPosts, setSavedPosts] = useState([]);

  useEffect(() => {
    const retrieveSavedPosts = async () => {
      try {
        const userSavedPostsRef = collection(db, 'posts');
        const querySnapshot = await getDocs(
          query(userSavedPostsRef, where('likes_by_user', 'array-contains', user.uid))
        );

        const userSavedPosts = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));

        setSavedPosts(userSavedPosts);
      } catch (error) {
        console.error('Error retrieving saved posts:', error);
      }
    };

    if (user) {
      retrieveSavedPosts();
    }
  }, [user]);

  return (
    <View>
      {savedPosts.length === 0 ? (
        <Text>No Liked posts yet.</Text>
      ) : (
        <FlatList
          data={savedPosts}
          keyExtractor={item => item.id}
          renderItem={({ item }) => <PostPicture post={item} />}
        />
      )}
    </View>
  );
};

export default LikedPhotos;
