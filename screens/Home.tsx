import { View, Text } from "@gluestack-ui/themed";
import React, { useEffect, useState } from "react";
import { HomeStyle } from "../style/HomeStyle";

import { useUserStore } from "../store/UserStore";
import { TabBar, TabView } from "react-native-tab-view";
import { ProfileStyle } from "../style/ProfileStyle";
import { Dimensions } from "react-native";
import { FirstHomeRoute } from "../components/FirstHomeRoute";
import { SecondHomeRoute } from "../components/SecondHomeRoute";
import { config } from "../config/gluestack-ui.config";
import { userService } from "../service/UserService";
import { FIREBASE_AUTH } from "../firebaseConfig";
import { useTranslation } from "react-i18next";

const Home = () => {
  const { t } = useTranslation();
  const { user, setUser } = useUserStore();

  useEffect(() => {
    const fetchUser = async () => {
      const response = await userService.checkIfSignedInAlready();
      if (response) {
        setUser(response);
      }
    };
    fetchUser();
  }, []);


  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: "first", title: t("Bikes") },
    { key: "second", title: t("Posts") },
  ]);
  const layout = {
    width: Dimensions.get("window").width,
  };

  const WelcomeMessage = () => {
    return (
      <Text style={HomeStyle.text}>
        {t("Welcome")} {user ? user.private.firstName : t("Guest")}
      </Text>
    );
  };

  return (
    <View style={HomeStyle.background}>
      <View style={HomeStyle.homeView}>
        <WelcomeMessage></WelcomeMessage>
      </View>

      <TabView
        navigationState={{ index, routes }}
        renderScene={({ route }) => {
          switch (route.key) {
            case "first": {
              return <FirstHomeRoute />;
            }
            case "second": {
              return <SecondHomeRoute />;
            }
            default: {
              return null;
            }
          }
        }}
        onIndexChange={setIndex}
        initialLayout={layout}
        renderTabBar={(props) =>
          user ? (
            <TabBar
              {...props}
              activeColor={config.tokens.colors.white}
              inactiveColor={config.tokens.colors.coolGray100}
              style={ProfileStyle.tabBarStyle}
            />
          ) : (
            <TabBar
              {...props}
              inactiveColor={config.tokens.colors.white}
              style={HomeStyle.tabBarStyle}
            />
          )
        }
      />
    </View>
  );
};



export default Home;
