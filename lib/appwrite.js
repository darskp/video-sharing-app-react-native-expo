import { Client, ID, Account, Avatars, Databases, Query, Storage } from 'react-native-appwrite';



export const config = {
    endpoint: 'https://cloud.appwrite.io/v1',
    platform: "com.aora",
    projectId: process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID,
    storageId: process.env.EXPO_PUBLIC_APPWRITE_STORAGE_ID,
    databaseId: process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID,
    userCollectionId: process.env.EXPO_PUBLIC_APPWRITE_USER_COLLECTION_ID,
    videoCollectionId: process.env.EXPO_PUBLIC_APPWRITE_VIDEO_COLLECTION_ID,
}

const { endpoint, platform, projectId, databaseId, userCollectionId, videoCollectionId, storageId } = config

const client = new Client();
client
    .setEndpoint(config.endpoint)
    .setProject(config.projectId)
    .setPlatform(config.platform)
    ;

const account = new Account(client);
const avatar = new Avatars(client);
const databases = new Databases(client);
const storage = new Storage(client);


export const createUser = async (email, username, password) => {
    try {
        const newAccount = await account.create(
            ID.unique(), email, password, username
        )
        if (!newAccount) throw Error;

        const avatarUrl = avatar.getInitials(username);
        await signin(email, password)
        const newUser = await databases.createDocument(
            config.databaseId,
            config.userCollectionId,
            ID.unique(),
            {
                accountId: newAccount.$id,
                avatar: avatarUrl,
                email,
                username
            }
        )
        return newUser;
    } catch (error) {
        console.log(error);
        throw new Error(error)
    }
}

export const signin = async (email, password) => {
    try {
        const session = account.createEmailSession(email, password);
        return session;
    } catch (error) {
        console.log(error);
        throw new Error(error)
    }
}

export const getCurrentUser = async () => {
    try {
        const currentAccount = await account.get();
        if (!currentAccount) throw Error;

        const currentUser = await databases.listDocuments(
            config.databaseId,
            config.userCollectionId,
            [Query.equal('accountId', currentAccount.$id)]
        )
        if (!currentUser) throw Error;
        return currentUser.documents[0];
    } catch (error) {
        console.log(error);
        throw new Error(error)
    }
}

export const getAllPost = async () => {
    try {
        const posts = await databases.listDocuments(
            config.databaseId,
            config.videoCollectionId,
            [Query.orderDesc('$createdAt')]
        )
        console.log("posts",posts);
        return posts.documents;
    }
    catch (error) {
        console.log(error);
        throw new Error(error)
    }

}

export const updateLiked = async ($id, user) => {
    try {
       const existingLiked = user.liked;
        const existLikedItemIndex = existingLiked.indexOf($id);

        if (existLikedItemIndex === -1) {
            existingLiked.push($id);
        } else {
            existingLiked.splice(existLikedItemIndex, 1);
        }
        await databases.updateDocument(
            user.$databaseId,
            user.$collectionId,
            user.$id,
            {
                "$id": user.$id,
                "liked": existingLiked,
            }
        );
    }
    catch (error) {
        throw new Error(error)
    }
}


export const getLatestPosts = async () => {
    try {
        const posts = await databases.listDocuments(
            config.databaseId,
            config.videoCollectionId,
            [Query.orderDesc('$createdAt', Query.limit(7))]
        )
        return posts.documents;
    }
    catch (error) {
        console.log(error);
        throw new Error(error)
    }
}

export const searchPosts = async (query) => {
    try {
        const posts = await databases.listDocuments(
            config.databaseId,
            config.videoCollectionId,
            [Query.search('title', query)]
        )
        return posts.documents;
    }
    catch (error) {
        console.log(error);
        throw new Error(error)
    }

}

export const getUserPosts = async (userId) => {
    try {
        const posts = await databases.listDocuments(
            config.databaseId,
            config.videoCollectionId,
            [Query.equal('creator', userId), Query.orderDesc('$createdAt')]
        )
        console.log("6624eca6745ef68af6e5", posts);
        return posts.documents;
    }
    catch (error) {
        console.log(error);
        throw new Error(error)
    }

}

export const signOut = async () => {
    try {
        const session = await account.deleteSession('current')
        return session;
    }
    catch (error) {
        throw new Error(error)
    }

}


export async function getFilePreview(fileId, type) {
    let fileUrl;

    try {
        if (type === "video") {
            fileUrl = storage.getFileView(config.storageId, fileId);
        } else if (type === "image") {
            fileUrl = storage.getFilePreview(
                config.storageId,
                fileId,
                2000,
                2000,
                "top",
                100
            );
        } else {
            throw new Error("Invalid file type");
        }

        if (!fileUrl) throw Error;

        return fileUrl;
    } catch (error) {
        throw new Error(error);
    }
}

export async function uploadFile(file, type) {
    console.log("file", file);

    const asset = {
        name: file.fileName,
        type: file.mimeType,
        size: file.filesize,
        uri: file.uri,
    }

    try {
        const uploadedFile = await storage.createFile(
            config.storageId,
            ID.unique(),
            asset
        );
        console.log("uploadedFile", uploadedFile);

        const fileUrl = await getFilePreview(uploadedFile.$id, type);
        return fileUrl;
    } catch (error) {
        throw new Error(error);
    }
}

export async function createVideoPost(form) {
    try {
        const [thumbnailUrl, videoUrl] = await Promise.all([
            uploadFile(form.thumbnail, "image"),
            uploadFile(form.video, "video"),
        ]);

        const newPost = await databases.createDocument(
            config.databaseId,
            config.videoCollectionId,
            ID.unique(),
            {
                title: form.title,
                thumbnail: thumbnailUrl,
                video: videoUrl,
                prompt: form.prompt,
                creator: form.userId,
            }
        );

        return newPost;
    } catch (error) {
        console.log("error", error);
        throw new Error(error);
    }
}