///Imports

import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { FIREBASE_AUTH, FIRESTORE_DB } from "../firebaseConfig";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import {
  User,
  UserSchema,
  UserWithInteractionsSchema,
} from "../types/DataTypes";
import "react-native-get-random-values";
import { v4 as uuidv4 } from "uuid";
import { DrawerNavigationProp } from "@react-navigation/drawer";
import { DrawerNavigationProps } from "../components/DrawerNavigation";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const userService = {
  login,
  register,
  logout,
  getUpdatedUser,
  getOtherUser,
  updateUser,
  submitReview,
  deleteReview,
  getAllUsers,
  checkIfSignedInAlready,
};

///Login service

async function login(
  email: string,
  password: string
): Promise<User | null | boolean> {
  try {
    await signInWithEmailAndPassword(FIREBASE_AUTH, email, password);
    const uid = JSON.stringify(FIREBASE_AUTH.currentUser?.uid);
    if (!FIREBASE_AUTH.currentUser?.emailVerified) {
      signOut(FIREBASE_AUTH);
      return false;
    }
    if (uid) {
      const userDocRef = doc(FIRESTORE_DB, "users", uid);
      const userWithInteractionsDocRef = doc(
        FIRESTORE_DB,
        "users",
        uid,
        "interactions",
        uid
      );
      const userDocSnapShot = await getDoc(userDocRef);
      const userWithInteractionsDocSnapShot = await getDoc(
        userWithInteractionsDocRef
      );

      if (
        userDocSnapShot.exists() &&
        userWithInteractionsDocSnapShot.exists()
      ) {
        const userPrivateDetails = UserSchema.parse(userDocSnapShot.data());
        const user = {
          private: userPrivateDetails,
          public: {
            Reviews: userWithInteractionsDocSnapShot.data().Reviews,
            likes: userWithInteractionsDocSnapShot.data().likes,
          },
        };
        try {
          //console.log(UserWithInteractionsSchema.parse(user));
        } catch (error) {
          console.error(error);
        }
        AsyncStorage.setItem("email", email);
        AsyncStorage.setItem("password", password);
        return user;
      } else {
        return null;
      }
    } else {
      return null;
    }
  } catch (error) {
    return null;
  }
}

///Register service

async function register(
  firstName: string,
  lastName: string,
  username: string,
  email: string,
  phoneNumber: string,
  country: string,
  city: string,
  password: string,
  checkPassword: string
): Promise<boolean | string> {
  const nowDate = new Date();
  const date =
    nowDate.getFullYear() +
    "-" +
    (nowDate.getMonth() + 1) +
    "-" +
    nowDate.getDate();

  const UserRegister: User = {
    private: {
      id: uuidv4(),
      firstName: firstName,
      lastName: lastName,
      username: username,
      email: email,
      phoneNumber: phoneNumber,
      creationDate: date,
      country: country,
      city: city,
    },
    public: {
      Reviews: [],
      likes: [],
    },
  };

  const q = query(
    collection(FIRESTORE_DB, "users"),
    where("username", "==", UserRegister.private.username)
  );

  const querySnapshot = await getDocs(q);

  try {
    UserWithInteractionsSchema.parse(UserRegister);
  } catch (error) {
    return "Please complete all the fields correctly";
  }

  if (
    password == checkPassword &&
    querySnapshot.size == 0 &&
    password.length > 5
  ) {
    try {
      await createUserWithEmailAndPassword(
        FIREBASE_AUTH,
        UserRegister.private.email,
        password
      );
    } catch (error) {
      console.error(error);
      return "Registration failed! Complete all the required fields";
    }
    if (FIREBASE_AUTH.currentUser?.uid) {
      UserRegister.private.id = JSON.stringify(FIREBASE_AUTH.currentUser.uid);

      await setDoc(
        doc(FIRESTORE_DB, "users", UserRegister.private.id),
        UserRegister.private
      );
      const interactionsCollectionRef = collection(
        FIRESTORE_DB,
        "users",
        UserRegister.private.id,
        "interactions"
      );
      const interactionsDocRef = doc(
        interactionsCollectionRef,
        UserRegister.private.id
      );
      await setDoc(interactionsDocRef, {
        Reviews: UserRegister.public.Reviews,
        likes: UserRegister.public.likes,
      });
      await sendEmail();
      signOut(FIREBASE_AUTH);
    }
  } else if (password != checkPassword) {
    return "Passwords don't match";
  } else if (querySnapshot.size > 0) {
    return "Username already taken";
  } else if (password.length < 6) {
    return "Password must be 6 characters long at least";
  }
  return false;
}

///Logout service

async function logout(): Promise<boolean> {
  try {
    FIREBASE_AUTH.signOut();
    AsyncStorage.removeItem("email");
    AsyncStorage.removeItem("password");
    return true;
  } catch (error) {
    return false;
  }
}

///Retrieve user data from Firebase utilizing the Firebase User ID

async function getUpdatedUser(): Promise<User | null> {
  try {
    const uid = JSON.stringify(FIREBASE_AUTH.currentUser?.uid);
    if (uid) {
      const userPrivateDocRef = doc(FIRESTORE_DB, "users", uid);
      const userWithInteractionsDocRef = doc(
        FIRESTORE_DB,
        "users",
        uid,
        "interactions",
        uid
      );
      const userWithInteractionsDocSnapShot = await getDoc(
        userWithInteractionsDocRef
      );
      const userPrivateDocSnapShot = await getDoc(userPrivateDocRef);

      if (
        userPrivateDocSnapShot.exists() &&
        userWithInteractionsDocSnapShot.exists()
      ) {
        const userPrivateDetails = UserSchema.parse(
          userPrivateDocSnapShot.data()
        );
        const updUser = {
          private: userPrivateDetails,
          public: {
            Reviews: userWithInteractionsDocSnapShot.data().Reviews,
            likes: userWithInteractionsDocSnapShot.data().likes,
          },
        };
        return updUser;
      } else {
        return null;
      }
    } else {
      return null;
    }
  } catch (error) {
    console.error(error);
    return null;
  }
}

///Obtain user information based on the username

async function getOtherUser(userName: string): Promise<User | null> {
  try {
    const q = query(
      collection(FIRESTORE_DB, "users"),
      where("username", "==", userName)
    );
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      const docSnapShot = querySnapshot.docs[0];
      const userWithInteractionsDocRef = doc(
        FIRESTORE_DB,
        "users",
        JSON.stringify(docSnapShot.data().id),
        "interactions",
        JSON.stringify(docSnapShot.data().id)
      );
      const userWithInteractionsDocSnapShot = await getDoc(
        userWithInteractionsDocRef
      );
      const userPrivateDetails = UserSchema.parse(docSnapShot.data());
      if (docSnapShot.exists() && userWithInteractionsDocSnapShot.exists()) {
        const user = {
          private: userPrivateDetails,
          public: {
            Reviews: userWithInteractionsDocSnapShot.data().Reviews,
            likes: userWithInteractionsDocSnapShot.data().likes,
          },
        };
        return user;
      } else {
        return null;
      }
    } else {
      return null;
    }
  } catch (error) {
    console.error(error);
    return null;
  }
}

export type navigationProp = {
  navigation: DrawerNavigationProp<DrawerNavigationProps, "Profile">;
};

async function updateUser(
  user: User,
  lastName: string,
  firstName: string,
  phoneNumber: string,
  country: string,
  city: string
): Promise<User | string> {
  const UserEdit: User = {
    private: {
      id: user.private.id,
      firstName: firstName || "",
      lastName: lastName || "",
      username: user.private.username,
      email: user.private.email,
      phoneNumber: phoneNumber,
      creationDate: user.private.creationDate,
      country: country,
      city: city,
      profilePic: user.private.profilePic,
    },
    public: {
      Reviews: user.public.Reviews,
      likes: user.public.likes,
    },
  };

  try {
    UserWithInteractionsSchema.parse(UserEdit);
  } catch (error) {
    console.error(error);
    return "Please complete all of the fields correctly (delete text and check placeholders)";
  }
  await setDoc(
    doc(FIRESTORE_DB, "users", JSON.stringify(FIREBASE_AUTH.currentUser?.uid)),
    UserEdit.private
  );
  return UserEdit;
}

///Post review

async function submitReview(
  userName: string,
  review: string,
  profPic: string,
  userHelper: User
): Promise<boolean> {
  try {
    const collectionRef = collection(FIRESTORE_DB, "users");
    const q = query(
      collectionRef,
      where("email", "==", userHelper.private.email)
    );

    const querySnapShot = await getDocs(q);

    if (!querySnapShot.empty) {
      const userHelperDoc = querySnapShot.docs[0];
      const userDocId = userHelperDoc.id;

      const updatedReviews = userHelper.public.Reviews || [];

      updatedReviews.push({
        profPic: profPic,
        review: review,
        userName: userName,
      });

      const docRef = doc(
        FIRESTORE_DB,
        "users",
        userDocId,
        "interactions",
        userDocId
      );
      await updateDoc(docRef, {
        Reviews: updatedReviews,
      });
      return true;
    }
    return false;
  } catch (error) {
    return false;
  }
}

///Delete element of Review field

async function deleteReview(
  userName: string,
  review: string,
  profPic: string,
  userHelper: User | null
): Promise<boolean> {
  try {
    if (userHelper && userHelper.public.Reviews) {
      const updatedReviews = userHelper.public.Reviews.filter(
        (comment) =>
          comment.profPic !== profPic ||
          comment.review !== review ||
          comment.userName !== userName
      );

      const collectionRef = collection(FIRESTORE_DB, "users");
      const q = query(
        collectionRef,
        where("email", "==", userHelper?.private.email)
      );

      const querySnapShot = await getDocs(q);

      if (!querySnapShot.empty) {
        const userHelperDoc = querySnapShot.docs[0];
        const userDocId = userHelperDoc.id;

        userHelper.public.Reviews = updatedReviews;

        const docRef = doc(
          FIRESTORE_DB,
          "users",
          userDocId,
          "interactions",
          userDocId
        );
        await updateDoc(docRef, {
          Reviews: updatedReviews,
        });
        return true;
      }
    }
    return false;
  } catch (error) {
    console.error(error);
    return false;
  }
}

// get all users for search

async function getAllUsers(): Promise<{ username: string; profilePic: string; }[] | null> {
  try {
    const querySnapshot = await getDocs(collection(FIRESTORE_DB, "users"));
    const allUsers = querySnapshot.docs.map((doc) => ({
      username: doc.data().username,
      profilePic: doc.data().profilePic,
    }));
    return allUsers;
  } catch (error) {
    console.error(error);
    return null; 
  }

}
async function checkIfSignedInAlready(): Promise<User | null> {
  const email = await AsyncStorage.getItem("email");
  const password = await AsyncStorage.getItem("password");

  console.info("Email: " + email + "\n" + "Password: " + password);

  if (email && password) {
    const response = await login(email, password);
    if (response !== null && typeof response !== "boolean") {
      return response;
    }
  }
  return null;
}

async function sendEmail() {
  if (FIREBASE_AUTH.currentUser) {
    sendEmailVerification(FIREBASE_AUTH.currentUser);
  }
}
