import SignUpHeader from "@/components/SignUpHeader";
import { Text, View } from "react-native";

export default function SignUpImageSelectScreen() {
  return (
    <View className="flex-1 justify-center items-center">
      <SignUpHeader
        title={`나를 나타낼 \n사진을 선택해주세요`}
        description={`가족들이 쉽게 알아볼 수 있는 \n프로필 사진을 선택해주세요`}
      />
      <Text className="font-bold">내 사진 업로드</Text>
    </View>
  );
}
