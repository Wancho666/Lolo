import "react-native-gesture-handler";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";

// Screens
import SplashScreen from "./screens/SplashScreen";
import GetStartedScreen from "./screens/GetStartedScreen";
import PhoneKnowledgeScreen from "./screens/PhoneKnowledgeScreen";
import HomeScreen from "./screens/HomeScreen";
import Screen2 from "./screens/Screen2";
import SocialMedia from "./screens/SocialMedia";
import MessagingAndCommunication from "./screens/MessagingAndCommunication";
import ScamAwareness from "./screens/ScamAwareness";
import SmartPhoneBasicsScreen from "./screens/SmartPhoneBasicsScreen";
import LiveNewsScreen from "./screens/LiveNewsScreen";
import InternetBrowsingScreen from "./screens/InternetBrowsingScreen";
import MiniGamesScreen from "./screens/MiniGamesScreen";
import EGovScreen from "./screens/E-Gov";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          animationEnabled: true,
          contentStyle: { backgroundColor: "#F8FAFC" },
          gestureEnabled: true,
        }}
      >
        {/* Onboarding flow */}
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="GetStarted" component={GetStartedScreen} />
        <Stack.Screen name="PhoneKnowledge" component={PhoneKnowledgeScreen} />
        <Stack.Screen name="Screen2" component={Screen2} />
        <Stack.Screen name="SocialMedia" component={SocialMedia} />
        <Stack.Screen name="MessagingAndCommunication" component={MessagingAndCommunication} />
        <Stack.Screen name="ScamAwareness" component={ScamAwareness} />

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
        <Stack.Screen name="E-Gov" component={EGovScreen} />
      </Stack.Navigator>
      
    </NavigationContainer>
  );
}