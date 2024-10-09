import { View, VStack, Text,} from "@gluestack-ui/themed";
import React from "react";
import { Bike } from "../types/DataTypes";
import { useTranslation } from "react-i18next";

export const SecondBikeRoute = ({ bike }: { bike: Bike }) => {

  const {t} = useTranslation();

    return (
      <View height={"100%"}>
        <VStack>
          <View paddingLeft={4}>
            <Text fontSize={18}>
              {"\u2022"} {t("Name")}: {bike.name}
            </Text>
            <Text fontSize={18}>
              {"\u2022"} {t("Model year")}: {bike.modelYear}
            </Text>
            <Text fontSize={18}>
              {"\u2022"} {t("Type")}: {bike.type}
            </Text>
            <Text fontSize={18}>
              {"\u2022"} {t("Current value")}: {bike.value}
            </Text>
            <Text fontSize={18}>{"\u2022"} {t("Components")}:</Text>
            {Object.entries(bike.components).map(
              ([componentName, componentValue], index) => (
                <View key={index}>
                  <Text fontSize={18}>
                    {"\t\t\t\t"}
                    {"\u2022"}
                    {componentName + ": " + componentValue}
                  </Text>
                </View>
              )
            )}
          </View>
        </VStack>
      </View>
    );
  };