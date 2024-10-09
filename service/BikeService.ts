///Imports

import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { Bike, BikeSchema, BikeType, LogType, User } from "../types/DataTypes";
import {
  FIREBASE_AUTH,
  FIRESTORE_DB,
  FIRESTORE_STORAGE,
} from "../firebaseConfig";
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytes,
} from "firebase/storage";
import { v4 as uuidv4 } from "uuid";
import { ZodError } from "zod";

export const bikeService = {
  getBikes,
  showOwners,
  getRandomBikes,
  ownerChangeCheck,
  getBikeData,
  deleteBike,
  saveChanges,
};

///Get bikes by owner

async function getBikes(userHelperuserName: string): Promise<Bike[]> {
  try {
    let dataHelper: Bike[] = [];
    const q = query(
      collection(FIRESTORE_DB, "testBikes"),
      where("owner", "==", userHelperuserName)
    );
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      const bike = BikeSchema.parse(doc.data());
      dataHelper.push(bike);
    });
    return dataHelper;
  } catch (error) {
    console.error(error);
    return [];
  }
}

///Get owners

export interface ownersDataType {
  username: string;
  profilePicture: string;
}

async function showOwners(bike: Bike): Promise<ownersDataType[]> {
  const ownerDataArray: Array<ownersDataType> = [];
  const usersCollectionRef = collection(FIRESTORE_DB, "users");
  if (bike.prevOwners) {
    for (const owner of bike.prevOwners) {
      const q = query(usersCollectionRef, where("username", "==", owner));
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        const userData = doc.data();
        const ownerData = {
          username: userData.username,
          profilePicture: userData.profilePic,
        };
        ownerDataArray.push(ownerData);
      });
    }
    return ownerDataArray;
  } else return [];
}

///Get 10 random bikes

export function shuffleArray<T>(array: T[]): T[] {
  const shuffledArray = [...array];
  for (let i = shuffledArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
  }
  return shuffledArray;
}

async function getRandomBikes(): Promise<Bike[]> {
  const bikes: Bike[] = [];

  try {
    const querySnapShot = await getDocs(collection(FIRESTORE_DB, "testBikes"));

    querySnapShot.forEach((doc) => {
      bikes.push(BikeSchema.parse(doc.data()));
    });
    if (bikes) {
      const shuffledBikes = shuffleArray(bikes);
      return shuffledBikes;
    } else {
      return [];
    }
  } catch (error) {
    console.error(error);
    return [];
  }
}

///Modify bike owner

async function ownerChangeCheck(
  bikeSecretKey: string,
  secretKey: string,
  newOwner: string,
  user: User
): Promise<boolean> {
  if (bikeSecretKey === secretKey) {
    const q = query(
      collection(FIRESTORE_DB, "testBikes"),
      where("secretKey", "==", secretKey)
    );
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach(async (document) => {
      const bike = BikeSchema.parse(document.data());
      if (!bike.prevOwners) {
        bike.prevOwners = [];
      }
      const docRef = doc(FIRESTORE_DB, "testBikes", bike.id);
      const prevOwners = bike.prevOwners;
      const searchedObj = prevOwners.find((element) => {
        if (element === bike.owner) {
          return true;
        } else {
          return false;
        }
      });
      if (!searchedObj) {
        prevOwners.push(bike.owner);
      }
      if (user) {
        await updateDoc(docRef, {
          ownerUid: user.private.id,
          owner: newOwner,
          prevOwners: prevOwners,
          secretKey: secretKey,
        });
      }
    });
    return true;
  } else {
    return false;
  }
}

///Get bike by id

async function getBikeData(bikeId: string): Promise<Bike | null> {
  const docRef = collection(FIRESTORE_DB, "testBikes");

  const q = query(docRef, where("id", "==", bikeId));

  const querySnapshot = await getDocs(q);
  if (!querySnapshot.empty) {
    const doc = querySnapshot.docs[0];
    const bike = BikeSchema.parse(doc.data());
    return bike;
  } else {
    return null;
  }
}

///Delete bike by id

async function deleteBike(bike: Bike) {
  if (bike.pictures) {
    for (const element of bike.pictures) {
      try {
        const delRef = ref(FIRESTORE_STORAGE, element);
        await deleteObject(delRef);
      } catch (error) {
        console.error(error);
      }
    }
  }
  try {
    await deleteDoc(doc(FIRESTORE_DB, "testBikes", bike?.id!));
  } catch (error) {
    console.error(error);
  }
}

///Post or Modify Bike

async function editImages(
  newBikePictures: string[],
  copyImages: string[]
): Promise<string[]> {
  const toAddUniqueElements: string[] = newBikePictures.filter(
    (item) => !copyImages.includes(item)
  );
  const toDeleteUniqueElements: string[] = copyImages.filter(
    (item) => !newBikePictures.includes(item)
  );

  const arrayToUploadAdd: string[] = [];

  for (const element of toAddUniqueElements) {
    try {
      const fetchResponse = await fetch(element);
      const theBlob = await fetchResponse.blob();
      const imageId = uuidv4();
      const imageRef = ref(
        FIRESTORE_STORAGE,
        `testImgFolder/${FIREBASE_AUTH.currentUser?.email}/${imageId}`
      );
      await uploadBytes(imageRef, theBlob);
      const url = await getDownloadURL(imageRef);
      arrayToUploadAdd.push(url);
    } catch (error) {
      console.error(error);
    }
  }

  for (const element of toDeleteUniqueElements) {
    try {
      const delRef = ref(FIRESTORE_STORAGE, element);
      await deleteObject(delRef);
    } catch (error) {
      console.error(error);
    }
  }

  const combinedArray: string[] = [...copyImages, ...arrayToUploadAdd];
  const resultArray: string[] = combinedArray.filter(
    (item) => !toDeleteUniqueElements.includes(item)
  );

  return resultArray;
}

async function uploadImages(newBikePictures: string[]): Promise<string[]> {
  const arrayToUpload: string[] = [];

  for (const picture of newBikePictures) {
    try {
      const fetchResponse = await fetch(picture);
      const theBlob = await fetchResponse.blob();
      const imageId = uuidv4();
      const imageRef = ref(
        FIRESTORE_STORAGE,
        `testImgFolder/${FIREBASE_AUTH.currentUser?.email}/${imageId}`
      );
      await uploadBytes(imageRef, theBlob);
      const url = await getDownloadURL(imageRef);
      arrayToUpload.push(url);
    } catch (error) {
      console.error(error);
    }
  }

  return arrayToUpload;
}

async function saveChanges(
  newBikeId: string,
  ownerUid: string,
  newBikeName: string,
  newBikeValue: string,
  newBikeDescription: string,
  newBikeModelYear: string,
  newBikeType: BikeType | null,
  newBikePrevOwners: string[] | undefined,
  newBikeComponents: Record<string, string>,
  newBikeLog: LogType,
  owner: string,
  bike: Bike | null,
  newBikePictures: string[] | undefined,
  copyImages: string[]
): Promise<string | boolean> {
  const newBike: Bike = {
    name: newBikeName,
    value: parseFloat(newBikeValue),
    description: newBikeDescription,
    modelYear: parseInt(newBikeModelYear),
    type: newBikeType!,
    prevOwners: newBikePrevOwners!,
    components: newBikeComponents,
    pictures: [],
    log: newBikeLog,
    id: newBikeId,
    owner: owner,
    ownerUid: ownerUid,
    secretKey: uuidv4(),
  };

  try {
    BikeSchema.parse(newBike);
  } catch (error) {
    if (error instanceof ZodError) {
      return error.issues[0].message;
    } else {
      return "Something went wrong,please try again!";
    }
  }

  try {
    if (bike && newBikePictures) {
      const picsUrls = await editImages(newBikePictures, copyImages);
      newBike.pictures = picsUrls;
    } else if (newBikePictures) {
      const picsUrls = await uploadImages(newBikePictures);
      newBike.pictures = picsUrls;
    }

    await setDoc(doc(FIRESTORE_DB, "testBikes", newBike.id), newBike);
    return true;
  } catch (error) {
    return "Something went wrong, please try again!";
  }
}
