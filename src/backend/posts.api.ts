import {
  db,
  storage,
  ID,
  Query,
  palettegramDB,
  postsCollection,
  postBucketStorage,
} from "./appwrite.config";

type PostData = any; // Replace 'any' with a specific type for post data if available
type CommentData = any; // Replace 'any' with a specific type for comments if available

/**
 * @description Save a single post to the database
 * @param data - Post data to be saved
 * @returns Saved post document or null if error
 */
const savePostToDb = async (data: PostData) => {
  try {
    const post = await db.createDocument(palettegramDB, postsCollection, ID.unique(), data);
    return post || null; // Return null if post creation fails
  } catch (error) {
    console.error("Error saving post to database:", error);
    return null; // Return null in case of error
  }
};

/**
 * @description Get all posts from the database
 * @returns List of posts or null if error
 */
const getAllPosts = async () => {
  try {
    if (!palettegramDB || !postsCollection) {
      throw new Error("Database ID or collection ID is not provided");
    }

    const posts = await db.listDocuments(palettegramDB, postsCollection, [
      Query.orderDesc("$createdAt"),
    ]);

    return posts?.documents || null; // Return null if no posts found
  } catch (error) {
    console.error("Error fetching all posts:", error);
    return null;
  }
};

/**
 * @description Get a single document by ID
 * @param id - Document ID
 * @returns Document or null if not found or error
 */
const getSinglePost = async (id: string) => {
  try {
    return await db.getDocument(palettegramDB, postsCollection, id) || null;
  } catch (error) {
    console.error(`Error fetching post with ID ${id}:`, error);
    return null;
  }
};

/**
 * @description Get all posts by a specific user
 * @param userId - User ID to filter posts
 * @returns List of user posts or null if error
 */
const getAllUserPosts = async (userId: string) => {
  try {
    const allPosts = await db.listDocuments(palettegramDB, postsCollection, [
      Query.equal("userId", userId),
      Query.orderDesc("$createdAt"),
    ]);

    return allPosts?.documents || null; // Return null if no posts found
  } catch (error) {
    console.error(`Error fetching posts for user ${userId}:`, error);
    return null;
  }
};

/**
 * @description Remove a post by setting isActive to false
 * @param id - Document ID
 * @returns Updated document or null if error
 */
const removePost = async (id: string) => {
  try {
    return await db.updateDocument(palettegramDB, postsCollection, id, { isActive: false }) || null;
  } catch (error) {
    console.error(`Error removing post with ID ${id}:`, error);
    return null;
  }
};

/**
 * @description Like a post
 * @param tweet - Post data including likes
 * @returns Updated post or null if error
 */
const likeTweet = async (tweet: PostData) => {
  try {
    return await db.updateDocument(palettegramDB, postsCollection, tweet.$id, {
      likes: tweet.likes,
    }) || null;
  } catch (error) {
    console.error(`Error liking tweet with ID ${tweet.$id}:`, error);
    return null;
  }
};

/**
 * @description Add a new image to storage
 * @param image - Image file to be uploaded
 * @returns Uploaded image file or null if error
 */
const addNewImage = async (image: any) => {
  try {
    const resImage = await storage.createFile(postBucketStorage, ID.unique(), image);
    return resImage || null; // Return null if image upload fails
  } catch (error) {
    console.error("Error adding new image:", error);
    return null;
  }
};

/**
 * @description Get image URL from storage
 * @param imageId - Image ID
 * @returns Image URL or null if error
 */
const getImageUrl = (imageId: string) => {
  if (!imageId) {
    console.error("Image ID is required to generate URL");
    return null;
  }

  return `https://cloud.appwrite.io/v1/storage/buckets/${postBucketStorage}/files/${imageId}/view?project=${process.env.NEXT_PUBLIC_PROJECT_ID}`;
};

/**
 * @description Delete an image from storage
 * @param id - Image ID
 * @returns Deletion response or null if error
 */
const deleteImage = async (id: string) => {
  try {
    return await storage.deleteFile(postBucketStorage, id) || null; // Return null if deletion fails
  } catch (error) {
    console.error(`Error deleting image with ID ${id}:`, error);
    return null;
  }
};

/**
 * @description Add a comment to a post
 * @param id - Post ID
 * @param comment - Comment data
 * @returns Updated post or null if error
 */
const addComment = async (id: string, comment: CommentData) => {
  try {
    return await db.updateDocument(palettegramDB, postsCollection, id, {
      comments: comment,
    }) || null; // Return null if comment addition fails
  } catch (error) {
    console.error(`Error adding comment to post with ID ${id}:`, error);
    return null;
  }
};

export {
  savePostToDb,
  getAllPosts,
  getAllUserPosts,
  getSinglePost,
  likeTweet,
  addNewImage,
  deleteImage,
  getImageUrl,
  addComment,
  removePost,
};
