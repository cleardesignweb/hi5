// Create a context for managing post data
import React, { createContext, useContext, useState } from 'react';

const PostContext = createContext();

export const usePostContext = () => useContext(PostContext);

export const PostProvider = ({ children }) => {
  const [post, setPost] = useState(null);

  const updatePost = (newPostData) => {
    setPost(newPostData);
  };

  return (
    <PostContext.Provider value={{ post, updatePost }}>
      {children}
    </PostContext.Provider>
  );
};
