import { Text, View } from "react-native";

export default function LandingScreen() {
  return (
    <View className="bg-background-orange flex-1 justify-center items-center">
      <Text className="text-7xl text-black font-bold">온식구</Text>
      <Text className="text-2xl text-black font-semibold">
        매일 5분, 가족과 더 가까워지는 시간
      </Text>
      <Text className="text-2xl text-black font-bold">카카오톡 넣을거</Text>
      <Text className="text-2xl text-black font-bold">
        카카오톡 계정으로 간편하게
      </Text>
      <Text className="text-2xl text-black font-bold">
        가족과의 소중한 시간을 시작해보세요
      </Text>
    </View>
  );
}
