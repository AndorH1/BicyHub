///Imports

import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import {
  Post,
  PostSchema,
  PostWithInteractionsSchema,
  User,
} from "../types/DataTypes";
import { FIREBASE_AUTH, FIRESTORE_DB } from "../firebaseConfig";
import { v4 as uuidv4 } from "uuid";

export const postService = {
  getRandomPosts,
  postComment,
  deletePost,
  likeManager,
  postData,
};

///Get posts

async function getRandomPosts(): Promise<Post[] | null> {
  const posts: Post[] = [];
  try {
    const querySnapShot = await getDocs(collection(FIRESTORE_DB, "testPosts"));

    await Promise.all(
      querySnapShot.docs.map(async (document) => {
        const docRef = doc(
          FIRESTORE_DB,
          "testPosts",
          document.id,
          "interactions",
          document.id
        );
        const docSnapShot = await getDoc(docRef);
        if (docSnapShot.exists()) {
          const postPublicDetails = docSnapShot.data();
          const postPrivateDetails = PostSchema.parse(document.data());
          const post = {
            post: postPrivateDetails,
            interactions: {
              comments: postPublicDetails.comments,
              likes: postPublicDetails.likes,
            },
          };
          posts.push(PostWithInteractionsSchema.parse(post));
        }
      })
    );

    if (posts) {
      return posts;
    } else {
      return null;
    }
  } catch (error) {
    console.error(error);
    return null;
  }
}

///Updating comments field

export function getCurrentDateTime(): string {
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = String(currentDate.getMonth() + 1).padStart(2, "0");
  const day = String(currentDate.getDate()).padStart(2, "0");
  const hours = String(currentDate.getHours()).padStart(2, "0");
  const minutes = String(currentDate.getMinutes()).padStart(2, "0");

  return `${year}-${month}-${day} ${hours}:${minutes}`;
}

async function postComment(
  post: Post,
  user: User,
  comment: string
): Promise<boolean> {
  const docRef = doc(
    FIRESTORE_DB,
    "testPosts",
    post.post.id,
    "interactions",
    post.post.id
  );
  const newComment = {
    writerUsername: user.private.username,
    date: getCurrentDateTime(),
    text: comment,
    profilePic: user.private.profilePic,
  };
  try {
    const docSnapShot = await getDoc(docRef);

    if (docSnapShot.exists()) {
      const thisPostInteractions = docSnapShot.data();
      if (!thisPostInteractions.comments) {
        thisPostInteractions.comments = [];
      }
      thisPostInteractions.comments.push(newComment);
      await updateDoc(docRef, {
        comments: thisPostInteractions.comments,
      });
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.error(error);
    return false;
  }
}

///Delete post

async function deletePost(post: Post): Promise<boolean> {
  try {
    const db = getFirestore();

    const interactionsCollectionRef = collection(
      db,
      "testPosts",
      post.post.id,
      "interactions"
    );

    const docSnapShot = await getDocs(interactionsCollectionRef);

    const deleteInteractions = docSnapShot.docs.map(async (doc) => {
      await deleteDoc(doc.ref);
    });

    await Promise.all(deleteInteractions);

    await deleteDoc(doc(FIRESTORE_DB, "testPosts", post.post.id));
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
}

///Managing likes

async function likeManager(
  user: User | null,
  post: Post
): Promise<boolean | null> {
  if (user) {
    if (!user.public.likes) {
      user.public.likes = [];
    }
    const userDocRef = doc(
      FIRESTORE_DB,
      "users",
      JSON.stringify(FIREBASE_AUTH.currentUser?.uid),
      "interactions",
      JSON.stringify(FIREBASE_AUTH.currentUser?.uid)
    );
    const postDocRef = doc(
      FIRESTORE_DB,
      "testPosts",
      post.post.id,
      "interactions",
      post.post.id
    );
    const equalIds = (element: string) => element === post.post.id;
    const searchedObj = user.public.likes.findIndex(equalIds);

    if (searchedObj === -1) {
      user.public.likes.push(post.post.id);
      post.interactions.likes++;

      await updateDoc(userDocRef, {
        likes: user.public.likes,
      });

      await updateDoc(postDocRef, {
        likes: post.interactions.likes,
      });
      return true;
    } else {
      user.public.likes.splice(searchedObj, 1);
      post.interactions.likes--;
      await updateDoc(userDocRef, {
        likes: user.public.likes,
      });

      await updateDoc(postDocRef, {
        likes: post.interactions.likes,
      });
      return false;
    }
  } else {
    return null;
  }
}

///Post posts

async function postData(
  username: string,
  profilePic: string,
  text: string
): Promise<boolean> {
  const uid = FIREBASE_AUTH.currentUser?.uid;

  const post = {
    id: uuidv4(),
    ownerUid: uid,
    userName: username,
    profilePic: profilePic,
    date: getCurrentDateTime(),
    text: text,
    likes: 0,
    comments: [],
  };

  const postPrivateDetails = {
    id: post.id,
    ownerUid: post.ownerUid,
    userName: post.userName,
    profilePic: post.profilePic,
    date: post.date,
    text: post.text,
  };
  const postPublicDetails = {
    likes: post.likes,
    comments: post.comments,
  };
  console.log(post);
  try {
    if (PostSchema.parse(post)) {
      await setDoc(
        doc(FIRESTORE_DB, "testPosts", postPrivateDetails.id),
        postPrivateDetails
      );
      const interactionsCollectionRef = collection(
        FIRESTORE_DB,
        "testPosts",
        postPrivateDetails.id,
        "interactions"
      );
      const interactionsDocRef = doc(interactionsCollectionRef, post.id);
      await setDoc(interactionsDocRef, {
        likes: postPublicDetails.likes,
        comments: postPublicDetails.comments,
      });
    }
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
}
