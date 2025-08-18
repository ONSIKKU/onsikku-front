import { router } from "expo-router";
import { Image, Text, TouchableOpacity, View } from "react-native";
import kakaoLogin from "../assets/images/kakao_login_large_wide.png";
import mainLogo from "../assets/images/onsikku-main-logo.png";

export default function LandingScreen() {
  const goToKakaoWebView = () => {
    router.push("/KakaoLoginWebView");
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
      <TouchableOpacity className="w-full px-4" onPress={goToKakaoWebView}>
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
