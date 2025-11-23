import ActivitySummary from "@/components/history/ActivitySummary";
import DateSelector from "@/components/history/DateSelector";
import QuestionList from "@/components/history/QuestionList";
import { useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  getQuestionsByMonth,
  QuestionDetails,
  setAccessToken,
} from "@/utils/api";
import { getItem } from "@/utils/AsyncStorage";

export default function HistoryScreen() {
  const router = useRouter();
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [questions, setQuestions] = useState<QuestionDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchQuestions = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const token = await getItem("accessToken");
      if (token) {
        setAccessToken(token);
      }

      const data = await getQuestionsByMonth(selectedYear, selectedMonth);
      setQuestions(data.questionDetails || []);
    } catch (e: any) {
      console.error("[월별 질문 조회 에러]", e);
      setError(e?.message || "질문을 불러오는데 실패했습니다.");
    } finally {
      setLoading(false);
    }
  }, [selectedYear, selectedMonth]);

  useEffect(() => {
    fetchQuestions();
  }, [fetchQuestions]);

  const handlePrevMonth = () => {
    if (selectedMonth === 1) {
      setSelectedYear(selectedYear - 1);
      setSelectedMonth(12);
    } else {
      setSelectedMonth(selectedMonth - 1);
    }
  };

  const handleNextMonth = () => {
    const now = new Date();
    const maxYear = now.getFullYear();
    const maxMonth = now.getMonth() + 1;

    if (
      selectedYear > maxYear ||
      (selectedYear === maxYear && selectedMonth >= maxMonth)
    ) {
      return; // 미래로 이동 불가
    }

    if (selectedMonth === 12) {
      setSelectedYear(selectedYear + 1);
      setSelectedMonth(1);
    } else {
      setSelectedMonth(selectedMonth + 1);
    }
  };

  const handleQuestionPress = (questionAssignmentId: string, question: string, questionInstanceId?: string) => {
    router.push({
      pathname: "/reply-detail",
      params: {
        questionAssignmentId,
        question,
        questionInstanceId: questionInstanceId || "",
      },
    });
  };

  return (
    <SafeAreaView className="flex-1 bg-orange-50">
      <ScrollView>
        <View className="gap-5 px-5 pb-10">
          <DateSelector
            selectedYear={selectedYear}
            selectedMonth={selectedMonth}
            onPrevMonth={handlePrevMonth}
            onNextMonth={handleNextMonth}
          />
          <ActivitySummary
            questions={questions}
            year={selectedYear}
            month={selectedMonth}
          />
          {/* The QuestionList component has its own title */}
          <QuestionList
            questions={questions}
            loading={loading}
            error={error}
            onQuestionPress={handleQuestionPress}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
