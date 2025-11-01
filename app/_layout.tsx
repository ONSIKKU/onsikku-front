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
    <View className="flex-1">
      <Stack
        screenOptions={{
          contentStyle: { backgroundColor: "#FFF5E9" },
          headerShown: false,
        }}
      >
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen
          name="KakaoLoginWebView"
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="KakaoLoginRedirect"
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="reply"
          options={{
            title: "🧡 답변 작성",
            headerShown: true,
            headerStyle: { backgroundColor: "#FFF5E9" },
            headerTitleAlign: "center",
            headerShadowVisible: false,
          }}
        />
        <Stack.Screen
          name="reply-detail"
          options={{
            title: "🧡 답변 상세",
            headerShown: true,
            headerStyle: { backgroundColor: "#FFF5E9" },
            headerTitleAlign: "center",
            headerShadowVisible: false,
          }}
        />
        <Stack.Screen
          name="mypage-edit"
          options={{
            title: "내 정보 수정",
            headerShown: true,
            headerStyle: { backgroundColor: "#FFF5E9" },
            headerTitleAlign: "center",
            headerShadowVisible: false,
          }}
        />
      </Stack>
    </View>
  );
}
