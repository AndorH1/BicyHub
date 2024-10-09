import { View, Image, Text } from "@gluestack-ui/themed";
import { Dimensions } from "react-native";
import React, { useState, useEffect } from "react";
import PagerView from "react-native-pager-view";
import { StyleSheet } from "react-native";

interface ImageSlideShowProps {
  pictures: string[];
}

const ImageSlideShow: React.FC<ImageSlideShowProps> = ({ pictures }) => {
  const width = Dimensions.get("window").width;
  const height = Dimensions.get("window").height;
  const [picturesToRender, setPicturesToRender] = useState<string[]>([]);

  useEffect(() => {
    setPicturesToRender(pictures);
  }, [pictures])


  if (picturesToRender.length != 0) {
    return (
      //console.log(picturesToRender),
      <View style={{
        margin: 20,
        justifyContent: "center",
        alignItems: "center",
      }}>
        <PagerView
          style={{ height: height / 4, width: (width * 96) / 100, borderRadius: 10 }}
          initialPage={0}
          scrollEnabled={true} 
        >
          {picturesToRender.map((picture, index) => (
            <View key={index} style={styles.page}>
              {typeof picture === 'string' ? (
                <View style={{
                  borderWidth: 1,
                  justifyContent: "center",
                  alignItems: 'center',
                }} key={index}>
                  <Image
                    resizeMode="cover"
                    style={{ width: "100%", height: undefined, aspectRatio: 1 }}
                    source={{ uri: picture }}
                    alt="bike"
                    onError={(error) => console.error(`Error loading image at index: ${index}, ${picture} `, error)}
                  />
                </View>
              ) : (
                <View>
                  <Text>Error: Invalid picture URL</Text>
                </View>
              )}
            </View>
          ))}
        </PagerView>
      </View>
    );
  }

};

export default ImageSlideShow;

const styles = StyleSheet.create({
  page: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
  },
});
