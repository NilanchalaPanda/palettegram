"use client";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { PostInstanceType, PostInitStateType } from "@/types/index.d";

const initialState: PostInitStateType = {
  posts: [],
  error: false,
  loading: true,
};

const postsReducer = createSlice({
  name: "posts",
  initialState,

  reducers: {
    getPosts: (state, action: PayloadAction<PostInstanceType[]>) => {
      state.loading = false;
      state.posts = action.payload;
      state.error = false;
    },
    addPost: (state, action: PayloadAction<PostInstanceType>) => {
      state.posts.unshift(action.payload);
      state.error = false;
    },
    addLikesToAPost: (state, action: PayloadAction<{ postId: string; userId: string }>) => {
      const { postId, userId } = action.payload;
      const post = state.posts.find((post) => post.$id === postId);

      if (post) {
        const liked = post.likes.includes(userId);
        if (liked) {
          post.likes = post.likes.filter((id) => id !== userId); // Dislike
        } else {
          post.likes.push(userId); // Like
        }
      }
    },
    removeUserPost: (state, action: PayloadAction<string>) => {
      state.posts = state.posts.filter((post) => post.$id !== action.payload);
      state.error = false;
    },
  },
});

// Actions
export const { getPosts, addPost, addLikesToAPost, removeUserPost } = postsReducer.actions;

// Reducer
export default postsReducer.reducer;
