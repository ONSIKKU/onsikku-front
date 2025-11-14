import RecentAnswers from "@/components/RecentAnswers";
import TodayQuestion from "@/components/TodayQuestion";
import TodayRespondent from "@/components/TodayRespondent";
import { getTodayQuestions, QuestionAssignment, setAccessToken } from "@/utils/api";
import { getItem } from "@/utils/AsyncStorage";
import { useFocusEffect } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, Dimensions, ScrollView, Text, View } from "react-native";
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
  const [loading, setLoading] = useState(true);
  const [questions, setQuestions] = useState<QuestionAssignment[]>([]);
  const [error, setError] = useState<string>("");

  const fetchTodayQuestions = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const token = await getItem("accessToken");
      console.log("[액세스 토큰]", token || "토큰 없음");
      if (token) {
        setAccessToken(token);
        const data = await getTodayQuestions();
        setQuestions(data || []);
      } else {
        setError("로그인이 필요합니다");
      }
    } catch (e: any) {
      console.error("[오늘의 질문 조회 에러]", e);
      setError(e?.message || "질문을 불러오지 못했습니다");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTodayQuestions();
  }, [fetchTodayQuestions]);

  useFocusEffect(
    useCallback(() => {
      fetchTodayQuestions();
    }, [fetchTodayQuestions])
  );

  const handleScroll = (event: any) => {
    const scrollPosition = event.nativeEvent.contentOffset.x;
    const index = Math.round(scrollPosition / ITEM_WIDTH);
    setActiveIndex(index);
  };

  // 첫 번째 질문 가져오기 (가장 오래된 미답변 또는 최신 질문)
  const currentQuestion = questions[0];
  const questionContent = currentQuestion?.questionInstance?.content || "오늘 하루 어떠셨나요?\n위로받고 싶은 일이 있었나요?";
  
  // 답변 대기 중인 사람 수 (SENT 상태이고 아직 답변 안 한 경우)
  const pendingCount = questions.filter(
    (q) => q.state === "SENT" && !q.answeredAt
  ).length;

  // 질문 대상 (subject)
  const questionSubject = currentQuestion?.questionInstance?.subject;

  // 디버깅: 질문 정보 확인
  console.log("[홈 화면] 질문 개수:", questions.length);
  console.log("[홈 화면] 현재 질문 ID:", currentQuestion?.id);
  console.log("[홈 화면] 현재 질문:", currentQuestion);

  if (loading) {
    return (
      <SafeAreaView className="flex-1 w-full px-4 gap-6 bg-onsikku-main-orange justify-center items-center">
        <ActivityIndicator size="large" color="#FB923C" />
        <Text className="text-gray-600">질문을 불러오는 중...</Text>
      </SafeAreaView>
    );
  }

  if (error && questions.length === 0) {
    return (
      <SafeAreaView className="flex-1 w-full px-4 gap-6 bg-onsikku-main-orange justify-center items-center">
        <Text className="text-red-500 text-center">{error}</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 w-full px-4 gap-6 bg-onsikku-main-orange justify-start items-center">
      <TodayRespondent 
        subject={questionSubject}
        pendingCount={pendingCount}
      />
      <TodayQuestion 
        question={questionContent}
        questionAssignmentId={currentQuestion?.id}
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
