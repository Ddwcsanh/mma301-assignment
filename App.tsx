import { NavigationContainer, useNavigation } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import DetailsScreen from "./src/screens/DetailsScreen";
import HomeNavigation from "./src/screens/HomeNavigation";
import { NativeBaseProvider, Pressable, Text } from "native-base";
import { GestureHandlerRootView } from "react-native-gesture-handler";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NativeBaseProvider>
        <NavigationContainer>
          <Stack.Navigator
            screenOptions={{
              headerTintColor: "black",
            }}
          >
            <Stack.Screen
              options={{
                headerTitle: () => {
                  const navigation = useNavigation();
                  return (
                    <Pressable
                      onPress={() => {
                        navigation.navigate("Home");
                        navigation.setOptions({
                          scrollToTopEnabled: true,
                        });
                      }}
                    >
                      <Text
                        fontSize={"2xl"}
                        fontWeight={"bold"}
                        color={"tomato"}
                        padding={2}
                      >
                        Watchap
                      </Text>
                    </Pressable>
                  );
                },
                headerShadowVisible: false,
              }}
              name="HomeNavigation"
              component={HomeNavigation}
            />
            <Stack.Screen
              name="Details"
              component={DetailsScreen}
              options={{
                headerShadowVisible: false,
                headerBackTitleVisible: false,
              }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </NativeBaseProvider>
    </GestureHandlerRootView>
  );
}
