import { Client, Account, Databases, Storage, Avatars } from "appwrite";

export const appwriteConfig = {
  projectId: import.meta.env.VITE_APPWRITE_PROJECT_ID,
  url: import.meta.env.VITE_APPWRITE_URL,
  databaseId: import.meta.env.VITE_APPWRITE_DATABASE_ID,
  storageId: import.meta.env.VITE_APPWRITE_STORAGE_ID,
  usersCollectionId: import.meta.env.VITE_APPWRITE_USERS_COLLECTION_ID,
  postsCollectionId: import.meta.env.VITE_APPWRITE_POSTS_COLLECTION_ID,
  savesCollectionId: import.meta.env.VITE_APPWRITE_SAVES_COLLECTION_ID,
};

export const appwrite = new Client();

appwrite.setProject(appwriteConfig.projectId);
appwrite.setEndpoint(appwriteConfig.url);

export const appwriteAccount = new Account(appwrite);
export const appwriteDatabases = new Databases(appwrite);
export const appwriteStorage = new Storage(appwrite);
export const appwriteAvatars = new Avatars(appwrite);
