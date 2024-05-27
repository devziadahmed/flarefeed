import { ID, ImageGravity, Query } from "appwrite";

import { INewPost, INewUser } from "@/types";
import {
  appwriteAccount,
  appwriteAvatars,
  appwriteConfig,
  appwriteDatabases,
  appwriteStorage,
} from "./config";

export async function createUserAccount(user: INewUser) {
  try {
    const newAccount = await appwriteAccount.create(
      ID.unique(),
      user.email,
      user.password,
      user.name
    );

    if (!newAccount) throw Error;

    const avatarUrl = appwriteAvatars.getInitials(user.name);

    const newUser = await saveUserToDB({
      accountId: newAccount.$id,
      name: newAccount.name,
      email: newAccount.email,
      username: user.username,
      imageUrl: avatarUrl,
    });

    return newUser;
  } catch (error) {
    console.error(error);
    return error;
  }
}

export async function saveUserToDB(user: {
  accountId: string;
  email: string;
  name: string;
  imageUrl: URL;
  username?: string;
}) {
  try {
    const newUser = await appwriteDatabases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.usersCollectionId,
      ID.unique(),
      user
    );

    return newUser;
  } catch (error) {
    console.error(error);
  }
}

export async function signInAccount(user: { email: string; password: string }) {
  try {
    const session = await appwriteAccount.createEmailPasswordSession(
      user.email,
      user.password
    );

    return session;
  } catch (error) {
    console.error(error);
  }
}

export async function getCurrentUser() {
  try {
    const currentAccount = await appwriteAccount.get();

    if (!currentAccount) throw Error;

    const currentUser = await appwriteDatabases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.usersCollectionId,
      [Query.equal("accountId", currentAccount.$id)]
    );

    if (!currentUser) throw Error;

    return currentUser.documents[0];
  } catch (error) {
    console.error(error);
  }
}

export async function signOutAccount() {
  try {
    const session = await appwriteAccount.deleteSession("current");

    return session;
  } catch (error) {
    console.error(error);
  }
}

export async function createPost(post: INewPost) {
  try {
    const uploadedFile = await uploadFile(post.file[0]);

    if (!uploadedFile) throw new Error("services/createPost(): couldn't upload file");

    const fileUrl = await getFilePreview(uploadedFile.$id);

    if (!fileUrl) {
      await deleteFile(uploadedFile.$id);
    }

    const tags = post.tags?.replace(/\s/g, "").split(",") || [];

    const newPost = await appwriteDatabases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.postsCollectionId,
      ID.unique(),
      {
        creator: post.userId,
        caption: post.caption,
        imageUrl: fileUrl,
        imageId: uploadedFile.$id,
        location: post.location,
        tags: tags,
      }
    );

    if (!newPost) {
      await deleteFile(uploadedFile.$id);
      throw new Error("services/createPost(): couldn't create new post");
    }

    return newPost;
  } catch (error) {
    console.error(error);
  }
}

export async function uploadFile(file: File) {
  try {
    const uploadedFile = await appwriteStorage.createFile(
      appwriteConfig.storageId,
      ID.unique(),
      file
    );

    return uploadedFile;
  } catch (error) {
    console.error(error);
  }
}

export async function getFilePreview(fileId: string) {
  try {
    const fileUrl = appwriteStorage.getFilePreview(
      appwriteConfig.storageId,
      fileId,
      1920,
      0,
      ImageGravity.Center,
      100
    );

    return fileUrl;
  } catch (error) {
    console.error(error);
  }
}

export async function deleteFile(fileId: string) {
  try {
    await appwriteStorage.deleteFile(appwriteConfig.storageId, fileId);

    if (!deleteFile) throw new Error("services/deleteFile(): couldn't delete file");

    return { status: "ok" };
  } catch (error) {
    console.error(error);
  }
}

export async function getRecentPosts() {
  try {
    const posts = await appwriteDatabases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.postsCollectionId,
      [Query.orderDesc("$createdAt"), Query.limit(20)]
    );

    if (!posts) throw new Error("services/getRecentPosts(): couldn't get recent posts");

    return posts;
  } catch (error) {
    console.error(error);
  }
}
