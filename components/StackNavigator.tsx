import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import BikeDetails from "../screens/BikeDetails";
import DrawerNavigation from "./DrawerNavigation";
import { Bike } from "../types/DataTypes";
import AddEditBike from "../screens/AddEditBike";
import { NavigationStyle } from "../style/NavigationStyle";
import Edit from "../screens/Edit";
import Profile from "../screens/Profile";
import { chatHeaderOptions, stackHeaderOption } from "../style/screenOptions";
import Chats from "../screens/Chats";
import Chat from "../screens/Chat";
import SearchScreen from "../screens/SearchScreen";
import BikeRepairServicesDetailsScreen from "../screens/BikeRepairServicesDetailsScreen";
import { useTranslation } from "react-i18next";
import AddBikeRepairService from "../screens/AddBikeRepairService";
import EditBikeRepairService from "../screens/EditBikeRepairService";

export type StackNavigatorProps = {
  Root: {};
  BikeDetails: { bikeId: string };
  AddEditBike: { bike: Bike | null };
  Edit: undefined;
  "Other Profiles": { username: string | undefined };
  Chats: undefined;
  Chat: { username: string };
  SearchScreen: undefined;
  BikeRepairServicesDetailsScreen: {owner: string};
  AddBikeRepairService: undefined;
  EditBikeRepairService: {owner: string};
};

const Stack = createStackNavigator<StackNavigatorProps>();

const StackNavigator = () => {

  const { t } = useTranslation();

  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Root"
        component={DrawerNavigation}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="BikeDetails"
        component={BikeDetails}
        options={{
          headerStyle: {
            backgroundColor: NavigationStyle.headerStyle.backgroundColor,
          },
          headerTintColor: NavigationStyle.textStyle.color,
          title: t('BikeDetails')
        }}
      />
      <Stack.Screen
        name="BikeRepairServicesDetailsScreen"
        component={BikeRepairServicesDetailsScreen}
        options={{
          headerStyle: {
            backgroundColor: NavigationStyle.headerStyle.backgroundColor,
          },
          headerTintColor: NavigationStyle.textStyle.color,
        }} />
      <Stack.Screen
        name="AddEditBike"
        component={AddEditBike}
        options={{
          headerStyle: {
            backgroundColor: NavigationStyle.headerStyle.backgroundColor,
          },
          headerTintColor: NavigationStyle.textStyle.color,
        }}
      />
      <Stack.Screen
        name="Edit"
        component={Edit}
        options={{
          ...stackHeaderOption,
          title: t('Edit'),
        }}
      />
      <Stack.Screen
        name="Other Profiles"
        component={Profile}
        options={{
          ...stackHeaderOption,
          title: t('Other Profiles'),
        }}
      />
      <Stack.Screen name="Chats" component={Chats} options={stackHeaderOption} />
      <Stack.Screen name="Chat" component={Chat} options={chatHeaderOptions} />
      <Stack.Screen
        name="SearchScreen"
        component={SearchScreen}
        options={{
          headerStyle: {
            backgroundColor: NavigationStyle.headerStyle.backgroundColor,
          },
          headerTintColor: NavigationStyle.textStyle.color,
          title: t("SearchScreen")
        }}
      />
      <Stack.Screen
        name="AddBikeRepairService"
        component={AddBikeRepairService}
        options={{
          headerStyle: {
            backgroundColor: NavigationStyle.headerStyle.backgroundColor,
          },
          headerTintColor: NavigationStyle.textStyle.color,
        }}
      />
      <Stack.Screen
        name="EditBikeRepairService"
        component={EditBikeRepairService}
        options={{
          headerStyle: {
            backgroundColor: NavigationStyle.headerStyle.backgroundColor,
          },
          headerTintColor: NavigationStyle.textStyle.color,
        }}
      />
    </Stack.Navigator>
  );
};

export default StackNavigator;
