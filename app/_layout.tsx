import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import { View } from "react-native";
import "../global.css";

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    Pretendard: require("../assets/fonts/Pretendard-Regular.otf"),
    PretendardBold: require("../assets/fonts/Pretendard-Bold.otf"),
    PretendardLight: require("../assets/fonts/Pretendard-Light.otf"),
  });

  if (!fontsLoaded) return null;

  return (
    <View className="flex-1 bg-background-orange">
      <Stack
        screenOptions={{
          contentStyle: { backgroundColor: "transparent" },
        }}
      >
        <Stack.Screen name="index" options={{ headerShown: false }} />
      </Stack>
    </View>
  );
}
