import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import "../global.css";

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    Pretendard: require("../assets/fonts/Pretendard-Regular.otf"),
    PretendardBold: require("../assets/fonts/Pretendard-Bold.otf"),
    PretendardLight: require("../assets/fonts/Pretendard-Light.otf"),
  });

  if (!fontsLoaded) return null;

  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
    </Stack>
  );
}
