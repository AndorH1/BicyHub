import React, { useState, useEffect } from "react";
import { TouchableOpacity, StyleSheet } from "react-native";
import { Image, View, Text, } from "@gluestack-ui/themed"
import { AntDesign } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import {
  FIREBASE_AUTH,
  FIRESTORE_STORAGE,
  FIRESTORE_DB,
} from "../firebaseConfig";
import { doc, updateDoc } from "firebase/firestore";
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { useUserStore } from "../store/UserStore";
import { config } from "../config/gluestack-ui.config";
import { useTranslation } from "react-i18next";

interface UploadImageProps {
  uriImage: string | undefined;
}

export default function UploadImage(props: UploadImageProps) {
  const [image, setImage] = useState<string | undefined>(props.uriImage);
  const { user } = useUserStore();
  const {t} = useTranslation();

  useEffect(() => {
    addProfPicToDoc();
  }, [image]);

  useEffect(() => {
    if (image !== props.uriImage) {
      setImage(props.uriImage);
    }
  }, [props.uriImage]);

  const addProfPicToDoc = async () => {
    if (image && image !== "") {
      const docref = doc(
        FIRESTORE_DB,
        "users",
        JSON.stringify(FIREBASE_AUTH.currentUser?.uid)
      );
      try {
        await updateDoc(docref, {
          profilePic: image,
        });
      } catch (error) {
        console.error(error);
      }
    }
  };

  const uploadToStorage = async (imageToUpload: string) => {
    if (imageToUpload == null) {
      return;
    }

    try {
      const fetchResponse = await fetch(imageToUpload);

      const theBlob = await fetchResponse.blob();

      const imageRef = ref(FIRESTORE_STORAGE, `ProfilePics/${user?.private.username}`);

      getDownloadURL(imageRef)
        .then(() => {
          deleteObject(imageRef);
        })
        .catch(() => {
          console.info("Nothing to delete");
        });

      const uploadTask = uploadBytesResumable(imageRef, theBlob);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.info("Upload is " + progress + "% done");
          switch (snapshot.state) {
            case "paused":
              console.info("Upload is paused");
              break;
            case "running":
              console.info("Upload is running");
              break;
          }
        },
        (error) => {
          console.error(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
            console.info("File available at", downloadURL);
            setImage(downloadURL);
          });
        }
      );
    } catch (error) {
      console.error(error);
    }
  };

  const addImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    if (!result.canceled) {
      await uploadToStorage(result.assets[0]?.uri);
    }
  };
  return (
    <View style={imageUploaderStyles.container}>
      {image && (
        <Image source={{ uri: image }} style={{ width: 200, height: 200 }} alt="bikeup" />
      )}
      <View style={imageUploaderStyles.uploadBtnContainer}>
        <TouchableOpacity
          onPress={addImage}
          style={imageUploaderStyles.uploadBtn}
        >
          <Text>{image ? "Change" : "Upload"} {t("Image")}</Text>
          <AntDesign name="camera" size={20} color={config.tokens.colors.black} />
        </TouchableOpacity>
      </View>
    </View>
  );
}
const imageUploaderStyles = StyleSheet.create({
  container: {
    elevation: 2,
    height: 200,
    width: 200,
    backgroundColor: "#efefef",
    position: "relative",
    borderRadius: 999,
    overflow: "hidden",
  },
  uploadBtnContainer: {
    opacity: 0.7,
    position: "absolute",
    right: 0,
    bottom: 0,
    backgroundColor: "lightgrey",
    width: "100%",
    height: "25%",
  },
  uploadBtn: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
});
