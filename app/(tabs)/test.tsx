import { Link } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";

export default function TestScreen() {
  return (
    <View className="flex-1 justify-center items-center bg-orange-50">
      <Link href="/reply-detail" asChild>
        <TouchableOpacity className="bg-orange-400 p-4 rounded-2xl shadow-sm">
          <Text className="text-white font-bold text-lg">
            답변 상세 페이지 보기
          </Text>
        </TouchableOpacity>
      </Link>
    </View>
  );
}