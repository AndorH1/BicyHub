import { Box, View, Pressable, Icon, ScrollView, AddIcon } from "@gluestack-ui/themed";
import { useState } from "react";
import { useUserStore } from "../store/UserStore";
import React from "react";
import AddLogModal from "./AddLogModal";
import Timeline from 'react-native-timeline-flatlist'
import { TimeLineStyle } from "../style/TimeLineStyle";
import { Bike } from "../types/DataTypes";
import { BikeDetailsStyle } from "../style/BikeDetailsStyle";
import { config } from "../config/gluestack-ui.config";
import { SafeAreaView } from "react-native";
import { useTranslation } from "react-i18next";


export const ThirdBikeRoute = ({ bike }: { bike: Bike }) => {
    const { user } = useUserStore();
    if (!bike.log) {
        bike.log = [];
    }
    const [modalVisible, setModalVisible] = useState(false);
    const {t} = useTranslation();
    const bikeLogData = bike?.log.map((item) => ({
        time: item.date,
        title: `${item.description} `,
        description: `${t("Cost")}: ${item.cost || t("Unknown")} ${t("Euro")}\n${t("Distance")}: ${item.distance} km`,

    }));

    return (
        <Box style={BikeDetailsStyle.historyBox} //size={"100%"}
        >
            <View alignItems={"flex-end"} margin={2}>
                {user && user.private.username === bike.owner && (
                    <Pressable onPress={() => setModalVisible(true)}>
                        <View
                            borderWidth={1}
                            borderColor={config.tokens.colors.coolGray800}
                            alignItems={"center"}
                            width={"6%"}
                            borderRadius={10}
                        >
                            <Icon as={AddIcon} m="$2" w="$4" h="$4" />
                        </View>
                    </Pressable>
                )}
            </View>
            <ScrollView>
                {/* <SafeAreaView > */}
                <Timeline
                    style={TimeLineStyle.list}
                    data={bikeLogData}
                    isUsingFlatlist={false}
                />
                {/* </SafeAreaView> */}
            </ScrollView>
            {
                modalVisible && (
                    <AddLogModal
                        modalVisible={modalVisible}
                        setModalVisible={setModalVisible}
                        bike={bike}
                    />
                )
            }
        </Box >
    );
};