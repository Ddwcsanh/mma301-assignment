import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomeScreen from "./(tabs)/HomeScreen";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import FavoriteScreen from "./(tabs)/FavouriteScreen";

const Tab = createBottomTabNavigator();

const HomeNavigation = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "tomato",
        tabBarStyle: {
          height: 90,
          paddingTop: 7,
          paddingBottom: 30,
        },
        tabBarLabelStyle: { fontSize: 12, fontWeight: "500" },
        tabBarHideOnKeyboard: true,
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon(props: { focused: boolean; color: string; size: number }) {
            return props.focused ? (
              <Ionicons name="home" size={24} color={props.color} />
            ) : (
              <Ionicons name="home-outline" size={24} color={props.color} />
            );
          },
        }}
      />
      <Tab.Screen
        name="Favourite"
        component={FavoriteScreen}
        options={{
          tabBarIcon(props: { focused: boolean; color: string; size: number }) {
            return props.focused ? (
              <AntDesign name="heart" size={24} color={props.color} />
            ) : (
              <AntDesign name="hearto" size={24} color={props.color} />
            );
          },
        }}
      />
    </Tab.Navigator>
  );
};
export default HomeNavigation;
