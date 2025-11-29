import React, { useEffect, useState } from "react";
import { ActivityIndicator, Text, View } from "react-native";
import { QuestionDetails } from "@/utils/api";
import { getAnswers, setAccessToken } from "@/utils/api";
import { getItem } from "@/utils/AsyncStorage";

const StatCard = ({ value, label, loading }: { value: number; label: string; loading?: boolean }) => (
  <View className="bg-orange-50 rounded-lg p-4 flex-1 items-center justify-center">
    {loading ? (
      <ActivityIndicator size="small" color="#FB923C" />
    ) : (
      <Text className="text-2xl font-bold text-orange-500">{value}</Text>
    )}
    <Text className="text-xs text-gray-600 mt-1">{label}</Text>
  </View>
);

interface ActivitySummaryProps {
  questions: QuestionDetails[];
  year: number;
  month: number;
}

export default function ActivitySummary({ questions, year, month }: ActivitySummaryProps) {
  const [totalAnswers, setTotalAnswers] = useState(0);
  const [loadingAnswers, setLoadingAnswers] = useState(false);

  // 총 질문 수
  const totalQuestions = questions.length;

  // 답변 완료 수
  const answeredCount = questions.filter((q) => q.state === "ANSWERED").length;

  // 답변 대기 수
  const pendingCount = questions.filter((q) => q.state === "PENDING" || q.state === "SENT").length;

  // 총 답변 수 계산 (각 질문의 답변 수 합산)
  useEffect(() => {
    const fetchTotalAnswers = async () => {
      if (questions.length === 0) {
        setTotalAnswers(0);
        return;
      }

      try {
        setLoadingAnswers(true);
        const token = await getItem("accessToken");
        if (token) {
          setAccessToken(token);
        }

        let total = 0;
        // 답변 완료된 질문들만 조회
        const answeredQuestions = questions.filter((q) => q.state === "ANSWERED");
        
        // 병렬로 답변 조회 (성능 최적화)
        const answerPromises = answeredQuestions.map(async (q) => {
          try {
            if (!q.questionInstanceId) return 0;
            const answers = await getAnswers(q.questionInstanceId);
            return answers.length;
          } catch (e) {
            console.error(`[답변 수 조회 실패] ${q.questionInstanceId}`, e);
            return 0;
          }
        });

        const answerCounts = await Promise.all(answerPromises);
        total = answerCounts.reduce((sum, count) => sum + count, 0);
        setTotalAnswers(total);
      } catch (e) {
        console.error("[총 답변 수 계산 에러]", e);
        setTotalAnswers(0);
      } finally {
        setLoadingAnswers(false);
      }
    };

    fetchTotalAnswers();
  }, [questions]);

  // 제목 텍스트 (선택된 월 표시)
  const now = new Date();
  const isCurrentMonth = year === now.getFullYear() && month === now.getMonth() + 1;
  const title = isCurrentMonth ? "이번 달 활동" : `${year}년 ${month}월 활동`;

  return (
    <View className="bg-white w-full p-6 rounded-2xl shadow-sm">
      <Text className="text-lg font-bold text-gray-800 mb-4">{title}</Text>
      <View className="flex-row justify-between gap-3">
        <StatCard value={totalQuestions} label="총 질문" />
        <StatCard value={answeredCount} label="답변 완료" />
        <StatCard value={totalAnswers} label="총 답변" loading={loadingAnswers} />
      </View>
    </View>
  );
}
