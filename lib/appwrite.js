import { Client, ID, Account, Avatars, Databases, Query } from 'react-native-appwrite';

export const config = {
    endpoint: 'https://cloud.appwrite.io/v1',
    platform: "com.aora",
    projectId: '66215ca7a4ee80fa4265',
    databaseId: '6621635a90769043d2b7',
    userCollectionId: '6621638f4a1cd35b6912',
    videoCollectionId: '662163ad4d74578905a0',
    storageId: '66216555ea5f4aad567f'
}

const client = new Client();
client
    .setEndpoint(config.endpoint)
    .setProject(config.projectId)
    .setPlatform(config.platform)
    ;

const account = new Account(client);
const avatar = new Avatars(client);
const databases = new Databases(client);


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
    }
}


export const getAllPost = async () => {
    try {
        const posts = await databases.listDocuments(
            config.databaseId,
            config.videoCollectionId
        )
        return posts.documents;
    }
    catch (error) {
    }

}

export const getLatestPosts = async () => {
    try {
        const posts = await databases.listDocuments(
            config.databaseId,
            config.videoCollectionId,
            [Query.orderDesc('$createdAt',Query.limit(7))]
        )
        return posts.documents;
    }
    catch (error) {
    }

}

export const searchPosts = async (query) => {
    try {
        const posts = await databases.listDocuments(
            config.databaseId,
            config.videoCollectionId,
            [Query.search('title',query)]
        )
        return posts.documents;
    }
    catch (error) {
    }

}