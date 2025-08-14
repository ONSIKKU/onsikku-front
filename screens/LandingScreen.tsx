import * as Linking from "expo-linking";
import * as WebBrowser from "expo-web-browser";
import { Image, Text, TouchableOpacity, View } from "react-native";
import kakaoLogin from "../assets/images/kakao_login_large_wide.png";
import mainLogo from "../assets/images/onsikku-main-logo.png";

export default function LandingScreen() {
  const REST_API_KEY = process.env.EXPO_PUBLIC_KAKAO_REST_API_KEY!;
  const REDIRECT_URI = "onsikku://oauth";
  const API_BASE = process.env.EXPO_PUBLIC_API_BASE!;
  const KAKAO_AUTH_URL =
    "https://kauth.kakao.com/oauth/authorize" +
    `?response_type=code&client_id=${REST_API_KEY}` +
    `&redirect_uri=${encodeURIComponent(REDIRECT_URI)}`;

  async function handleKakaoLogin() {
    const result = await WebBrowser.openAuthSessionAsync(
      KAKAO_AUTH_URL,
      REDIRECT_URI
    );
    console.log("auth result:", result); // type/url 확인용

    if (result.type !== "success" || !result.url) return;

    const { queryParams } = Linking.parse(result.url);
    const code = String(queryParams?.code ?? "");
    console.log("카카오 code:", code); // ✅ 여기 찍히면 성공
  }
  return (
    <View className="flex-1 gap-4 justify-center items-center">
      <View className="px-2 flex-row gap-1 items-center justify-between ">
        <Image source={mainLogo} className="w-24 h-24" resizeMode="contain" />
        <Text className="font-bold text-6xl">온식구</Text>
      </View>
      <Text className="font-sans text-center text-xl text-gray-700">
        매일 5분,{"\n"}가족과 더 가까워지는 시간
      </Text>
      <TouchableOpacity className="w-full px-4" onPress={handleKakaoLogin}>
        <Image
          source={kakaoLogin}
          className="w-full h-14"
          resizeMode="contain"
        />
      </TouchableOpacity>
      <Text className="font-sans text-center text-xl text-gray-700">
        카카오톡 계정으로 간편하게 {"\n"}가족과의 소중한 시간을 시작해보세요
      </Text>
    </View>
  );
}
