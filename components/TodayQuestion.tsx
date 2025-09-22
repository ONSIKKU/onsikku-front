import { MessageCircle } from "lucide-react-native";
import { Text, View } from "react-native";
import GeneralButton from "./GeneralButton";

export default function TodayQuestion({ question }: { question: string }) {
  return (
    <View className="bg-white w-full p-4 gap-2 rounded-xl flex-1">
      <View className="flex flex-row items-center gap-2">
        <MessageCircle color="#FB923C" size={24} />
        <Text className="font-bold text-xl">오늘의 질문</Text>
      </View>

      <View className="flex flex-row items-center bg-onsikku-main-orange flex-1">
        <Text>{question}</Text>
      </View>
      <GeneralButton text="나의 생각 들려주기" isActive={true} />
    </View>
  );
}
