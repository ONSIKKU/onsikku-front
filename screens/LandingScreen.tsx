import { Image, Text, View } from "react-native";
import kakaoLogin from "../assets/images/kakao_login_large_wide.png";
import mainLogo from "../assets/images/onsikku-main-logo.png";

export default function LandingScreen() {
  return (
    <View className="bg-background-orange flex-1 gap-4 justify-center items-center">
      <View className="px-2 flex-row gap-2 items-center justify-between ">
        <Image source={mainLogo} className="w-24 h-24" resizeMode="contain" />
        <Text className="text-6xl text-gray-700 font-bold">온식구</Text>
      </View>
      <Text className="text-center text-base text-black">
        매일 5분,{"\n"}가족과 더 가까워지는 시간
      </Text>

      <Image source={kakaoLogin} className="w-full px-6" resizeMode="contain" />
      <Text className="text-center text-base text-black">
        카카오톡 계정으로 간편하게 {"\n"}가족과의 소중한 시간을 시작해보세요
      </Text>
    </View>
  );
}
