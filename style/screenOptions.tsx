import { DrawerNavigationOptions } from "@react-navigation/drawer";
import { NavigationStyle } from "./NavigationStyle";
import { config } from "../config/gluestack-ui.config";
import React from "react";
import ChatIconOnHeader from "../components/ChatIconOnHeader";
import { HStack } from "@gluestack-ui/themed";
import { StackNavigationOptions } from "@react-navigation/stack";
import ChatHeaderComponent from "../components/ChatHeaderComponent";
import SearchIconOnHeader from "../components/SearchIconOnHeader";

export const guestHeaderOption: DrawerNavigationOptions = {
  headerStyle: NavigationStyle.headerStyle,
  headerTintColor: NavigationStyle.textStyle.color,
}


export const loggedInHeaderOption: DrawerNavigationOptions = {
  headerStyle: NavigationStyle.headerStyle,
  headerTintColor: NavigationStyle.textStyle.color,
  headerRight: () =>
    <HStack space={"md"} marginRight={10}>
      <ChatIconOnHeader />
      <SearchIconOnHeader />
    </HStack>
}

export const stackHeaderOption = {
  headerStyle: {
    backgroundColor: config.tokens.colors.primary900,
  },
  headerTintColor: config.tokens.colors.white,
};

export const chatHeaderOptions: StackNavigationOptions = {
  headerStyle: {
    backgroundColor: config.tokens.colors.primary900,
  },
  headerTintColor: config.tokens.colors.white,
  headerLeft: () => <ChatHeaderComponent />,
  headerTitle: ""
}

export const headerOption: DrawerNavigationOptions = {
  headerStyle: NavigationStyle.headerStyle,
  headerTintColor: NavigationStyle.textStyle.color,
};