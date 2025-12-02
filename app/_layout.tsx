import { Ionicons } from "@expo/vector-icons";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import { TouchableOpacity, View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import "../global.css";

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    Pretendard: require("../assets/fonts/Pretendard-Regular.otf"),
    PretendardBold: require("../assets/fonts/Pretendard-Bold.otf"),
    PretendardLight: require("../assets/fonts/Pretendard-Light.otf"),
  });

  if (!fontsLoaded) return null;

  return (
    <SafeAreaProvider>
      <View className="flex-1">
        <Stack
          screenOptions={{
            contentStyle: { backgroundColor: "#FFF5E9" },
            headerShown: false,
          }}
        >
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen
            name="(tabs)"
            options={{
              headerShown: false,
            }}
          />
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
            options={({ navigation }) => ({
              title: "🧡 답변 작성",
              headerShown: true,
              headerStyle: { backgroundColor: "#FFF5E9" },
              headerTitleAlign: "center",
              headerShadowVisible: false,
              headerBackVisible: false,
              headerLeft: () => (
                <TouchableOpacity
                  onPress={() => navigation.goBack()}
                  style={{ marginLeft: 16 }}
                >
                  <Ionicons name="arrow-back" size={24} color="#1F2937" />
                </TouchableOpacity>
              ),
            })}
          />
          <Stack.Screen
            name="reply-detail"
            options={({ navigation }) => ({
              title: "답변 상세",
              headerShown: true,
              headerStyle: { backgroundColor: "#FFF5E9" },
              headerTitleAlign: "center",
              headerShadowVisible: false,
              headerBackVisible: false,
              headerLeft: () => (
                <TouchableOpacity
                  onPress={() => navigation.goBack()}
                  style={{ marginLeft: 16 }}
                >
                  <Ionicons name="arrow-back" size={24} color="#1F2937" />
                </TouchableOpacity>
              ),
            })}
          />
          <Stack.Screen
            name="mypage-edit"
            options={({ navigation }) => ({
              title: "내 정보 수정",
              headerShown: true,
              headerStyle: { backgroundColor: "#FFF5E9" },
              headerTitleAlign: "center",
              headerShadowVisible: false,
              headerBackVisible: false,
              headerLeft: () => (
                <TouchableOpacity
                  onPress={() => navigation.goBack()}
                  style={{ marginLeft: 16 }}
                >
                  <Ionicons name="arrow-back" size={24} color="#1F2937" />
                </TouchableOpacity>
              ),
            })}
          />
        </Stack>
      </View>
    </SafeAreaProvider>
  );
}
