import { StatusBar } from "expo-status-bar";
import { Button, StyleSheet, Text, View } from "react-native";
import { NavigationContainer, StackActions } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React, { FC } from "react";
import ProgramScreen from "./src/screens/ProgramScreen";

const defaultUser = {
  name: "Neosh",
  weight: 60,
  height: 180,
  streak: 0,
};

interface UserDetailsContextState {
  // set the type of state you want to handle with context e.g.
  name: string | null;
  weight: number;
  height: number;
  streak: number;
}

const UserDetailsContext = React.createContext({} as UserDetailsContextState);
const Stack = createNativeStackNavigator();

const HomeScreen = ({ navigation }: any) => {
  const user = React.useContext(UserDetailsContext);
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Text>Hi {user.name}</Text>
      <Button
        title="Start Program"
        onPress={() => navigation.navigate("Program")}
      />
      <Button
        title="Edit Details"
        onPress={() => navigation.navigate("Details")}
      />
    </View>
  );
};

const DetailsScreen = ({ navigation }: any) => {
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Text>Details Screen</Text>
      <Button
        title="Update the title"
        onPress={() => navigation.setOptions({ title: "Updated!" })}
      />
    </View>
  );
};

const App = () => {
  return (
    <UserDetailsContext.Provider value={defaultUser}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Home">
          <Stack.Screen name="Details" component={DetailsScreen} />
          <Stack.Screen
            name="Home"
            component={HomeScreen}
            options={{ title: "Welcome!" }}
          />
          <Stack.Screen
            name="Program"
            component={ProgramScreen}
            options={{ title: "Program" }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </UserDetailsContext.Provider>
  );
};

export default App;
