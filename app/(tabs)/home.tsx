import RecentAnswers from "@/components/RecentAnswers";
import TodayQuestion from "@/components/TodayQuestion";
import TodayRespondent from "@/components/TodayRespondent";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const mockHistories = [
  {
    roleName: "아빠",
    date: "07/31",
    content: "오늘의 추천곡...",
  },
  {
    roleName: "엄마",
    date: "01/16",
    content: "고마워요!",
  },
];

export default function Page() {
  return (
    <SafeAreaView className="flex-1 w-full px-10 gap-6 bg-onsikku-main-orange justify-start items-center">
      <TodayRespondent />
      <TodayQuestion question="오늘 하루 어떠셨나요?" />
      <View className="bg-white w-full p-4 gap-2 rounded-xl flex-1">
        <View className="flex flex-col items-center gap-2">
          <Text className="font-bold text-xl">지난 답변 둘러보기</Text>
          <View className="flex flex-row">
            {mockHistories.map((item) => (
              <RecentAnswers {...item} />
            ))}
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}
