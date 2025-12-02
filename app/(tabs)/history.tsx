import ActivitySummary from "@/components/history/ActivitySummary";
import DateSelector from "@/components/history/DateSelector";
import QuestionList from "@/components/history/QuestionList";
import {
  getQuestionsByMonth,
  QuestionDetails,
  setAccessToken,
} from "@/utils/api";
import { getItem } from "@/utils/AsyncStorage";
import { Picker } from "@react-native-picker/picker";
import { useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import {
  Modal,
  Pressable,
  RefreshControl,
  ScrollView,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HistoryScreen() {
  const router = useRouter();
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [questions, setQuestions] = useState<QuestionDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [refreshing, setRefreshing] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [tempYear, setTempYear] = useState(selectedYear);
  const [tempMonth, setTempMonth] = useState(selectedMonth);

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

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await fetchQuestions();
    } catch (e) {
      console.error("새로고침 실패", e);
    } finally {
      setRefreshing(false);
    }
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

  const handleQuestionPress = (
    questionAssignmentId: string,
    question: string,
    questionInstanceId?: string
  ) => {
    if (!questionInstanceId) {
      console.warn(
        "[기록 페이지] questionInstanceId가 없어서 상세보기로 이동할 수 없습니다."
      );
      return;
    }
    router.push({
      pathname: "/reply-detail",
      params: {
        questionAssignmentId,
        question,
        questionInstanceId,
      },
    });
  };

  const openDatePicker = () => {
    setTempYear(selectedYear);
    setTempMonth(selectedMonth);
    setShowDatePicker(true);
  };

  const confirmDate = () => {
    setSelectedYear(tempYear);
    setSelectedMonth(tempMonth);
    setShowDatePicker(false);
  };

  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth() + 1;

  // 년도 범위: 2024년부터 현재 년도까지
  const years = Array.from(
    { length: currentYear - 2024 + 1 },
    (_, i) => 2024 + i
  );

  // 월 범위: 선택된 년도가 현재 년도라면 현재 월까지, 아니면 12월까지
  const maxMonth = tempYear === currentYear ? currentMonth : 12;
  const months = Array.from({ length: maxMonth }, (_, i) => i + 1);

  return (
    <SafeAreaView className="flex-1 bg-orange-50" edges={["top"]}>
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#FB923C"]}
            tintColor="#FB923C"
          />
        }
      >
        <View className="gap-5 px-5 pb-10">
          <DateSelector
            selectedYear={selectedYear}
            selectedMonth={selectedMonth}
            onPrevMonth={handlePrevMonth}
            onNextMonth={handleNextMonth}
            onDatePress={openDatePicker}
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

      {/* Date Picker Modal */}
      <Modal
        visible={showDatePicker}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowDatePicker(false)}
      >
        <View className="flex-1 justify-end bg-black/50">
          <View className="bg-white rounded-t-3xl p-6">
            <View className="flex-row justify-between items-center mb-4 border-b border-gray-100 pb-4">
              <Pressable onPress={() => setShowDatePicker(false)}>
                <Text className="text-gray-500 text-base">취소</Text>
              </Pressable>
              <Text className="font-bold text-lg text-gray-800">날짜 선택</Text>
              <Pressable onPress={confirmDate}>
                <Text className="text-orange-500 font-bold text-base">
                  확인
                </Text>
              </Pressable>
            </View>
            <View className="flex-row justify-center items-center">
              <View className="flex-1">
                <Picker
                  selectedValue={tempYear}
                  onValueChange={(itemValue) => {
                    setTempYear(itemValue);
                    if (itemValue === currentYear && tempMonth > currentMonth) {
                      setTempMonth(currentMonth);
                    }
                  }}
                  itemStyle={{ fontSize: 16, height: 150 }}
                >
                  {years.map((year) => (
                    <Picker.Item
                      key={year}
                      label={`${year}년`}
                      value={year}
                      color="#1F2937"
                    />
                  ))}
                </Picker>
              </View>
              <View className="flex-1">
                <Picker
                  selectedValue={tempMonth}
                  onValueChange={(itemValue) => setTempMonth(itemValue)}
                  itemStyle={{ fontSize: 16, height: 150 }}
                >
                  {months.map((month) => (
                    <Picker.Item
                      key={month}
                      label={`${month}월`}
                      value={month}
                      color="#1F2937"
                    />
                  ))}
                </Picker>
              </View>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
