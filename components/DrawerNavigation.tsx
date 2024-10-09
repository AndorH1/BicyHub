import {
  DrawerContentScrollView,
  DrawerItem,
  DrawerItemList,
  createDrawerNavigator,
} from "@react-navigation/drawer";
import Home from "../screens/Home";
import MyBikes from "../screens/MyBikes";
import Profile from "../screens/Profile";
import Login from "../screens/Login";
import Register from "../screens/Register";
import { useUserStore } from "../store/UserStore";
import { guestHeaderOption, loggedInHeaderOption } from "../style/screenOptions";
import { userService } from "../service/UserService";
import BikeRepairServiceScreen from "../screens/BikeRepairServiceScreen";
import React, { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { StackNavigatorProps } from "../components/StackNavigator";
import { Button, ButtonIcon, SearchIcon} from "@gluestack-ui/themed";
import { useTranslation } from "react-i18next";
import LanguageChanger from "./LanguageChanger";

export type DrawerNavigationProps = {
  Home: undefined;
  "My Bikes": undefined;
  Login: undefined;
  Register: undefined;
  Profile: { username?: string | undefined };
  BikeRepairServiceScreen: undefined;
};

const Drawer = createDrawerNavigator<DrawerNavigationProps>();

export default function DrawerNavigation() {
  const { user, setUser } = useUserStore();
  const ref = React.useRef(null)
  const navigation =
    useNavigation<NativeStackNavigationProp<StackNavigatorProps>>();
  const [visible, setVisible] = useState(false);
  const { t } = useTranslation();

  return (
    <Drawer.Navigator
      initialRouteName="My Bikes"
      drawerContent={(props) => {
        return user ? (
          <>
            <LanguageChanger visible={visible} onClose={() => setVisible(false)}/>  
            <DrawerContentScrollView {...props}>
              <DrawerItemList {...props} />
              <DrawerItem
                label={t("Language")}
                onPress={() => setVisible(true)}
              />
              <DrawerItem
                label={t("Logout")}
                onPress={async () => {
                  const response = await userService.logout();
                  if (response == true) {
                    setUser(null);
                  } else {
                    alert("Something went wrong!");
                  }
                }}
              />
            </DrawerContentScrollView>
          </>
        ) : (
          <DrawerContentScrollView {...props}>
            <DrawerItemList {...props} />
          </DrawerContentScrollView>
        );
      }}
    >
      {user ? (
        <>
          <Drawer.Screen name={t("Home") as keyof DrawerNavigationProps} component={Home} options={() => ({
            ...loggedInHeaderOption,
            headerRight: () =>
              <>
                <Button onPress={() => navigation.navigate("SearchScreen")} ref={ref}>
                  <ButtonIcon as={SearchIcon} />
                </Button>
              </>
          })} />
          <Drawer.Screen
            name={t("My Bikes") as keyof DrawerNavigationProps}
            component={MyBikes}
            options={loggedInHeaderOption}
          />
          <Drawer.Screen
            name={t("Profile") as keyof DrawerNavigationProps}
            component={Profile}
            options={loggedInHeaderOption}
            initialParams={{ username: user.private.username }}
          />
          <Drawer.Screen
            name="BikeRepairServiceScreen"
            component={BikeRepairServiceScreen}
            options={loggedInHeaderOption} />
        </>
      ) : (
        <>
          <Drawer.Screen
            name={t("Home") as keyof DrawerNavigationProps}
            component={Home}
            options={guestHeaderOption} />
          <Drawer.Screen
            name={t("Login") as keyof DrawerNavigationProps}
            component={Login}
            options={guestHeaderOption}
          />
          <Drawer.Screen
            name={t("Register") as keyof DrawerNavigationProps}
            component={Register}
            options={guestHeaderOption}
          />
        </>
      )}
    </Drawer.Navigator>
  );
}

