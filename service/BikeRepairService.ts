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
  import { BikeRepairSchema, BikeRepairType } from "../types/DataTypes";
  import {
    FIREBASE_AUTH,
    FIRESTORE_DB,
    FIRESTORE_STORAGE,
  } from "../firebaseConfig";
import { ZodError } from "zod";
import { v4 as uuidv4 } from "uuid";
import { deleteObject, getDownloadURL, ref, uploadBytes } from "firebase/storage";

  export const bikeRepairService = {
     getAllBikeRepairServices,
     getBikeRepairServiceByOwner,
     saveBikeServiceChanges,
     deleteBikeService
  };


  async function getAllBikeRepairServices(): Promise<{ name: string; image: string[]; owner: string}[] | null> {
    try {
      const querySnapshot = await getDocs(collection(FIRESTORE_DB, "BikeServices"));
      const allBikeRepairServices = querySnapshot.docs.map((doc) => ({
        name: doc.data().name,
        image: doc.data().image,
        owner: doc.data().owner,
      }));

      return allBikeRepairServices;
    } catch (error) {
      console.error(error);
      return null; 
    }
  
  }

  async function getBikeRepairServiceByOwner(owner: string): Promise<BikeRepairType[]> {
    try {
      let dataHelper: BikeRepairType[] = [];
      const q = query(
        collection(FIRESTORE_DB, "BikeServices"),
        where("owner", "==", owner)
      );
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        // const bikeRepairService = BikeRepairSchema.parse(doc.data());
        const bikeRepairService = doc.data();
        dataHelper.push(bikeRepairService as BikeRepairType);
      });
      return dataHelper;
    } catch (error) {
      console.error(error);
      return [];
    }
  }

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
          `serviceImagesFolder/${FIREBASE_AUTH.currentUser?.email}/${imageId}`
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
          `serviceImagesFolder/${FIREBASE_AUTH.currentUser?.email}/${imageId}`
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

  async function saveBikeServiceChanges(
    description: string,
    coordinates: { latitude: number, longitude: number },
    name: string,
    owner: string,
    rating: number,
    bikeService: BikeRepairType | null,
    newBikeServicePictures: string[] | undefined,
    copyImages: string[]
  ): Promise<string | boolean> {
    const newBikeService: BikeRepairType = {
      id : uuidv4(),
      owner: owner,
      name: name,
      rating: rating,
      image: copyImages,
      coordinates: coordinates,
      description: description
    };
  
    try {
      BikeRepairSchema.parse(newBikeService);
      console.log (newBikeService)
    } catch (error) {
      if (error instanceof ZodError) {
        return error.issues[0].message;
      } else {
        return "Something went wrong,please try again!";
      }
    }
  
    try {
      if (bikeService && newBikeServicePictures) {
        const picsUrls = await editImages(newBikeServicePictures, copyImages);
        newBikeService.image = picsUrls;
      } else if (newBikeServicePictures) {
        const picsUrls = await uploadImages(newBikeServicePictures);
        newBikeService.image = picsUrls;
      }
  
      await setDoc(doc(FIRESTORE_DB, "BikeServices", uuidv4()), newBikeService);
      return true;
    } catch (error) {
      console.error("Unexpected error during validation:", error);
      return "Something went wrong, please try again!";
    }
  }

  async function deleteBikeService(bikeService: BikeRepairType) {
    if (bikeService.image) {
      for (const element of bikeService.image) {
        try {
          const delRef = ref(FIRESTORE_STORAGE, element);
          await deleteObject(delRef);
        } catch (error) {
          console.error(error);
        }
      }
    }
    try {
      await deleteDoc(doc(FIRESTORE_DB, "BikeServices", bikeService.owner!));
    } catch (error) {
      console.error(error);
    }
  }