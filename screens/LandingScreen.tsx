import {
  getProfile,
  login,
  loginWithKakaoAccount,
} from "@react-native-seoul/kakao-login";
import { router } from "expo-router";
import { Alert, Image, Text, TouchableOpacity, View } from "react-native";
import kakaoLogin from "../assets/images/kakao_login_large_wide.png";
import mainLogo from "../assets/images/onsikku-main-logo.png";

export default function LandingScreen() {
  const handleKakaoLogin = async () => {
    try {
      // 1) 카카오톡 앱 로그인 시도 → 실패 시 계정 로그인으로 폴백
      let token;
      try {
        token = await login();
      } catch {
        token = await loginWithKakaoAccount();
      }

      // 2) (선택) 프로필 확인
      const profile = await getProfile();
      console.log("kakao token:", token);
      console.log("kakao profile:", profile);

      // 3) 서버에 토큰 전달(우리 세션 발급용)
      const res = await fetch(
        process.env.EXPO_PUBLIC_API_BASE + "/api/auth/kakao",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            accessToken: token.accessToken,
            idToken: token.idToken,
          }),
        }
      );
      const data = await res.json(); // { registered, registrationToken, ... }
      console.log(data);

      // 4) ✅ 여기서 원하는 화면으로 “리다이렉트” (앱 내부 네비게이션)
      // 이미 가입된 사용자라면 홈으로:
      router.replace("/home"); // 또는 "/home"

      // 신규 회원이면 회원가입 플로우로:
      // router.replace({ pathname: "/signup/role", params: { registrationToken: data.registrationToken } });
    } catch (e: any) {
      console.log("Kakao login error:", e);
      Alert.alert("로그인 실패", e?.message ?? "다시 시도해주세요.");
    }
  };

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
