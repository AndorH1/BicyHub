import { Button, ButtonText, Image, View } from "@gluestack-ui/themed";
import * as ImagePicker from "expo-image-picker";
import { EditBikeStyle } from "../style/EditBikeStyle";
import { Dimensions, StyleSheet } from "react-native";
import React from "react";
import { useTranslation } from "react-i18next";
import PagerView from "react-native-pager-view";

interface ImagePickerForAddProps {
  newPictures: string[];
  setNewPictures: React.Dispatch<React.SetStateAction<string[]>>;
}

const ImagePickerForAdd: React.FC<ImagePickerForAddProps> = ({
  newPictures: newBikePictures,
  setNewPictures: setNewBikePictures,
}) => {
  const width = Dimensions.get("window").width;
  const height = Dimensions.get("window").height;
  const { t } = useTranslation();

  const pickImages = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      quality: 1,
    });

    if (!result.canceled) {
      const newArray = [
        ...newBikePictures,
        ...result.assets.map((asset) => asset.uri),
      ];
      setNewBikePictures(newArray);
    }
  };

  const deleteCurrentPicture = (index: number) => {
    const updatedPictures = newBikePictures.filter((_, i) => i !== index);
    setNewBikePictures(updatedPictures);
  };

  return (
    <View style={{ alignItems: "center" }}>
      <Button margin={2} onPress={() => pickImages()}>
        <ButtonText>{t("Pick images")}</ButtonText>
      </Button>
      <View style={EditBikeStyle.card}>
        <PagerView
          style={{ height: height / 3, width: width / 2, borderRadius: 10 }}
          initialPage={0}
        >
          {newBikePictures.map((picture, index) => (
            <View key={index} style={styles.page}>
              <Button onPress={() => deleteCurrentPicture(index)}>
                <ButtonText>{t("Delete this picture")}</ButtonText>
              </Button>
              <View
                style={{
                  borderWidth: 1,
                  justifyContent: "center",
                }}
              >
                <Image
                  resizeMode="cover"
                  style={{
                    width: "100%",
                    height: height / 4,
                    aspectRatio: 1,
                  }}
                  source={{ uri: picture }}
                  alt="bike"
                />
              </View>
            </View>
          ))}
        </PagerView>
      </View>
    </View>
  );
};

export default ImagePickerForAdd;

const styles = StyleSheet.create({
  page: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
  },
});
