import "react-native-gesture-handler";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";

// Screens
import SplashScreen from "./screens/SplashScreen";
import GetStartedScreen from "./screens/GetStartedScreen";
import NameInputScreen from "./screens/NameInputScreen";
import HomeScreen from "./screens/HomeScreen";
import SmartPhoneBasicsScreen from "./screens/SmartPhoneBasicsScreen";
import LiveNewsScreen from "./screens/LiveNewsScreen";
import InternetBrowsingScreen from "./screens/InternetBrowsingScreen";
import MiniGamesScreen from "./screens/MiniGamesScreen";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {/* Onboarding flow */}
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="GetStarted" component={GetStartedScreen} />
        <Stack.Screen name="NameInput" component={NameInputScreen} />

        {/* Main app */}
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen
          name="SmartphoneBasics"
          component={SmartPhoneBasicsScreen}
        />
        <Stack.Screen name="LiveNews" component={LiveNewsScreen} />
        <Stack.Screen
          name="InternetBrowsing"
          component={InternetBrowsingScreen}
        />
        <Stack.Screen name="MiniGames" component={MiniGamesScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}