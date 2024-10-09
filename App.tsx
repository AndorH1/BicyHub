import { NavigationContainer } from "@react-navigation/native";
import StackNavigator from "./components/StackNavigator";
import React from "react";
import { GluestackUIProvider } from "@gluestack-ui/themed";
import { config } from "@gluestack-ui/config";

export default function App() {
  return (
    <GluestackUIProvider config={config}>
      <NavigationContainer>
        <StackNavigator />
      </NavigationContainer>
    </GluestackUIProvider>
  );
}
