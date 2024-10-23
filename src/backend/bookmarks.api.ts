"use client";

import { account, db, ID, Query, palettegramDB, bookmarksCollection } from "./appwrite.config";

type BookmarkData = {
  userId: string;
  postId: string[];
};

/**
 * @description Remove a postId from an array of bookmarks
 * @param {string[]} bookmarks - Current array of bookmarks
 * @param {string} postId - Post ID to remove
 * @returns {string[]} - Updated array of bookmarks
 */
const removePostIdFromBookmarks = (bookmarks: string[], postId: string): string[] => {
  return bookmarks.filter(id => id !== postId);
};

const getBookmarks = async (userId: string) => {
  try {
    const result = await db.listDocuments(palettegramDB, bookmarksCollection, [
      Query.equal("userId", userId),
    ]);

    return result.documents[0] || null; // Return the first document or null if not found
  } catch (error) {
    console.error("Error fetching bookmarks:", error);
    throw new Error("Failed to fetch bookmarks.");
  }
};

const saveBookmark = async (userId: string, postId: string) => {
  try {
    const bookmarkData = await getBookmarks(userId);
    if (!bookmarkData) {
      return createBookmarkEntry(userId, postId); // Create a new entry if none exists
    }

    const updatedPostIds = [...bookmarkData.postId, postId];
    return await updateBookmark(bookmarkData.$id, updatedPostIds);
  } catch (error) {
    console.error("Error saving bookmark:", error);
    throw new Error("Failed to save bookmark.");
  }
};

const removeBookmark = async (userId: string, postId: string) => {
  try {
    const bookmarkData = await getBookmarks(userId);
    if (!bookmarkData) {
      throw new Error("No bookmarks found for this user.");
    }

    const updatedPostIds = removePostIdFromBookmarks(bookmarkData.postId, postId);
    return await updateBookmark(bookmarkData.$id, updatedPostIds);
  } catch (error) {
    console.error("Error removing bookmark:", error);
    throw new Error("Failed to remove bookmark.");
  }
};

const updateBookmark = async (documentId: string, postIds: string[]) => {
  try {
    return await db.updateDocument(palettegramDB, bookmarksCollection, documentId, { postId: postIds });
  } catch (error) {
    console.error("Error updating bookmark:", error);
    throw new Error("Failed to update bookmark.");
  }
};

const createBookmarkEntry = async (userId: string, postId: string) => {
  try {
    const bookmarkDoc = await db.createDocument(palettegramDB, bookmarksCollection, ID.unique(), {
      userId,
      postId: [postId],
    });

    return bookmarkDoc;
  } catch (error) {
    console.error("Error creating bookmark entry:", error);
    throw new Error("Failed to create bookmark entry.");
  }
};

export { saveBookmark, removeBookmark, createBookmarkEntry, getBookmarks };
