import RecentAnswers from "@/components/RecentAnswers";
import TodayQuestion from "@/components/TodayQuestion";
import TodayRespondent from "@/components/TodayRespondent";
import { useState } from "react";
import { Dimensions, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const mockHistories = [
  {
    roleName: "아빠",
    date: "07/31",
    content:
      "오늘의 추천곡adssssssssssssassssssssssassssssssssassssssssssassssssssssassssssssssassssssssssassssssssssassssssssssassssssssssassssssssssassssssssssassssssssssassssssssssassssssssssassssssssssasdddd...",
  },
  {
    roleName: "엄마",
    date: "01/16",
    content: "고마워요!",
  },
  {
    roleName: "동생",
    date: "03/21",
    content: "잘 지내?",
  },
];

const { width } = Dimensions.get("window");
// SafeAreaView (px-4 -> 16*2=32) + Container View (p-4 -> 16*2=32) = 64
const ITEM_WIDTH = width - 64;

export default function Page() {
  const [activeIndex, setActiveIndex] = useState(0);

  const handleScroll = (event: any) => {
    const scrollPosition = event.nativeEvent.contentOffset.x;
    const index = Math.round(scrollPosition / ITEM_WIDTH);
    setActiveIndex(index);
  };

  return (
    <SafeAreaView className="flex-1 w-full px-4 gap-6 bg-onsikku-main-orange justify-start items-center">
      <TodayRespondent />
      <TodayQuestion
        question={`오늘 하루 어떠셨나요?\n위로받고 싶은 일이 있었나요?`}
      />
      <View className="bg-white w-full p-4 gap-2 rounded-xl flex-1/2">
        <View className="flex flex-col items-center gap-2 w-full">
          <View className="flex flex-row justify-between w-full">
            <Text className="font-bold text-xl">지난 답변 둘러보기</Text>
            <Text className="font-bold text-xl text-onsikku-dark-orange">
              더보기
            </Text>
          </View>

          <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onScroll={handleScroll}
            scrollEventThrottle={16}
            style={{ width: ITEM_WIDTH }}
          >
            {mockHistories.map((item, index) => (
              <View
                style={{ width: ITEM_WIDTH, paddingHorizontal: 8 }}
                key={index}
              >
                <RecentAnswers {...item} />
              </View>
            ))}
          </ScrollView>

          <View className="flex-row justify-center items-center gap-2">
            {mockHistories.map((_, index) => (
              <View
                key={index}
                className={`h-2 w-2 rounded-full ${
                  activeIndex === index
                    ? "bg-onsikku-dark-orange"
                    : "bg-onsikku-main-orange"
                }`}
              />
            ))}
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}
