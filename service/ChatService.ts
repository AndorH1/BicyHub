//Imports

import {
  Timestamp,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  deleteField,
} from "firebase/firestore";
import { FIRESTORE_DB } from "../firebaseConfig";
import {
  MessageSchema,
  MessageType,
  User,
  UserChatSchema,
  UserChatType,
} from "../types/DataTypes";

export const chatService = {
  getUserChats,
  getMessages,
  postMessage,
  createChat,
  deleteMessage,
  deleteUserChat,
};

export type UserChatType = {
  displayName: string;
  profPic: string;
  lastMessage: string;
  username: string;
};

async function getUserChats(
  userName: string
): Promise<Array<Array<string | UserChatType>> | Boolean> {
  const docRef = doc(FIRESTORE_DB, "UserChats", userName);

  try {
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const res = docSnap.data();
      const chats = Object.entries(res);
      for (const chat of chats) {
        if (!UserChatSchema.parse(chat[1]) || typeof chat[0] !== "string") {
          return false;
        }
      }
      chats.sort((e1, e2) => e2[1].date - e1[1].date);
      console.info("Checking:" + chats);
      return chats;
    } else {
      return false;
    }
  } catch (error) {
    console.error("Error getting UserInfo: " + error);
    return false;
  }
}

async function getMessages(
  combinedUserName: string
): Promise<Array<MessageType> | Boolean> {
  const docRef = doc(FIRESTORE_DB, "Chats", combinedUserName);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    const messages = docSnap.data().messages;
    for (const message of messages) {
      if (!MessageSchema.parse(message)) {
        return false;
      }
    }
    return messages;
  } else {
    return false;
  }
}

async function postMessage(
  messages: MessageType[],
  combinedUserName: string,
  username: string,
  user: User,
  userChat: UserChatType
): Promise<Boolean> {
  const messagesDocRef = doc(FIRESTORE_DB, "Chats", combinedUserName);

  try {
    await setDoc(messagesDocRef, { messages });
  } catch (error) {
    console.error("Error posting message: " + error);
    return false;
  }

  const userInfoDocRef = doc(FIRESTORE_DB, "UserChats", username);

  const updateField = {
    [combinedUserName]: {
      UserInfo: {
        displayName: user.private.firstName + " " + user.private.lastName,
        lastMessage: userChat.UserInfo.lastMessage,
        profPic: user.private.profilePic,
        username: user.private.username,
      },
      date: Timestamp.now(),
    },
  };

  const updateField2 = {
    [combinedUserName]: {
      UserInfo: {
        displayName: userChat.UserInfo.displayName,
        lastMessage: userChat.UserInfo.lastMessage,
        profPic: userChat.UserInfo.profPic,
        username: userChat.UserInfo.username,
      },
      date: Timestamp.now(),
    },
  };

  try {
    await updateDoc(userInfoDocRef, updateField);
  } catch (error) {
    console.error("Error updating UserInfo:" + error);
    return false;
  }

  const myUserInfoDocRef = doc(
    FIRESTORE_DB,
    "UserChats",
    user.private.username
  );

  try {
    await updateDoc(myUserInfoDocRef, updateField2);
  } catch (error) {
    console.error("Error updating UserInfo:" + error);
    return false;
  }

  return true;
}

async function createChat(
  userChat: UserChatType,
  user: User
): Promise<Boolean | null> {
  const combinedUserName =
    userChat.UserInfo.username < user.private.username
      ? userChat.UserInfo.username + user.private.username
      : user.private.username + userChat.UserInfo.username;

  const chatDocRef = doc(FIRESTORE_DB, "Chats", combinedUserName);
  const docSnap = await getDoc(chatDocRef);

  if (docSnap.exists()) {
    console.info("Already exists");
    return false;
  } else {
    console.info("It doesn't exist");
    const chatsResponse = await chatService.getUserChats(user.private.username);
    let chats = [];
    if (!(chatsResponse instanceof Boolean)) {
      for (const chat of chatsResponse) {
        const chatHelper = {
          [chat[0].toString()]: {
            UserInfo: chat[1],
          },
        };
        chats.push(chatHelper);
      }
    }
    const presentDate = Timestamp.now();
    const setMyDocument = {
      [combinedUserName]: {
        UserInfo: {
          displayName: userChat.UserInfo.displayName,
          lastMessage: userChat.UserInfo.lastMessage,
          profPic: userChat.UserInfo.profPic,
          username: userChat.UserInfo.username,
        },
        date: presentDate,
      },
    };

    try {
      const myUserInfoDocRef = doc(
        FIRESTORE_DB,
        "UserChats",
        user.private.username
      );
      await updateDoc(myUserInfoDocRef, setMyDocument);
    } catch (error) {
      console.error("Error creating my UserInfo: " + error);
      return null;
    }

    const setOtherDocument = {
      [combinedUserName]: {
        UserInfo: {
          displayName: user.private.firstName + " " + user.private.lastName,
          lastMessage: "",
          profPic: user.private.profilePic,
          username: user.private.username,
        },
        date: presentDate,
      },
    };

    try {
      const userInfoDocRef = doc(
        FIRESTORE_DB,
        "UserChats",
        userChat.UserInfo.username
      );
      await updateDoc(userInfoDocRef, setOtherDocument);
    } catch (error) {
      const userInfoDocRef = doc(
        FIRESTORE_DB,
        "UserChats",
        userChat.UserInfo.username
      );
      await setDoc(userInfoDocRef, setOtherDocument);
      console.error("Error creating other UserInfo: " + error);
    }

    const setChatsDocument = {
      messages: [],
    };

    try {
      const chatsDocRef = doc(FIRESTORE_DB, "Chats", combinedUserName);
      await setDoc(chatsDocRef, setChatsDocument);
    } catch (error) {
      console.error("Error creating chat: " + error);
      return null;
    }
  }
  return true;
}

async function deleteMessage(
  messages: MessageType[],
  combinedUserName: string,
  lastMessageDeleted: boolean,
  user: User,
  userChat: UserChatType
): Promise<Boolean> {
  const docRef = doc(FIRESTORE_DB, "Chats", combinedUserName);

  try {
    await setDoc(docRef, { messages });
    if (lastMessageDeleted === true) {
      console.info("Yes");
      const myDocRef = doc(FIRESTORE_DB, "UserChats", user.private.username);
      const otherDocRef = doc(
        FIRESTORE_DB,
        "UserChats",
        userChat.UserInfo.username
      );
      const presentDate = Timestamp.now();
      const setMyDocument = {
        [combinedUserName]: {
          UserInfo: {
            displayName: userChat.UserInfo.displayName,
            lastMessage: messages[messages.length - 1].text,
            profPic: userChat.UserInfo.profPic,
            username: userChat.UserInfo.username,
          },
          date: presentDate,
        },
      };
      const setOtherDocument = {
        [combinedUserName]: {
          UserInfo: {
            displayName: user.private.firstName + " " + user.private.lastName,
            lastMessage: messages[messages.length - 1].text,
            profPic: user.private.profilePic,
            username: user.private.username,
          },
          date: presentDate,
        },
      };

      await updateDoc(myDocRef, setMyDocument);
      await updateDoc(otherDocRef, setOtherDocument);
    }
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
}

async function deleteUserChat(
  combinedUserName: string,
  username: string
): Promise<boolean> {
  try {
    const docRef = doc(FIRESTORE_DB, "UserChats", username);
    await updateDoc(docRef, {
      [combinedUserName]: deleteField(),
    });
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
}
