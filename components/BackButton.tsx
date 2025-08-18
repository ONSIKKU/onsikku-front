import { router } from "expo-router";
import { ArrowLeft } from "lucide-react-native";
import { Pressable, View } from "react-native";

export default function BackButton() {
  return (
    <View className="w-full">
      <Pressable
        onPress={() => router.back()}
        className="w-10 h-10 items-center justify-center"
      >
        <ArrowLeft size={30} color="#1F2937" />
      </Pressable>
    </View>
  );
}
