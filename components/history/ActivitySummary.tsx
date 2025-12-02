import React from "react";
import { Text, View } from "react-native";
import { QuestionDetails } from "@/utils/api";

const StatCard = ({ value, label }: { value: number; label: string }) => (
  <View className="bg-orange-50 rounded-lg p-4 flex-1 items-center justify-center">
    <Text className="font-sans text-3xl font-bold text-orange-500">{value}</Text>
    <Text className="font-sans text-sm text-gray-500 mt-1">{label}</Text>
  </View>
);

interface ActivitySummaryProps {
  questions: QuestionDetails[];
  year: number;
  month: number;
}

export default function ActivitySummary({ questions, year, month }: ActivitySummaryProps) {
  // 총 질문 수
  const totalQuestions = questions.length;

  // 답변 완료 수
  const answeredCount = questions.filter((q) => q.state === "ANSWERED").length;

  // 제목 텍스트 (선택된 월 표시)
  const now = new Date();
  const isCurrentMonth = year === now.getFullYear() && month === now.getMonth() + 1;
  const title = isCurrentMonth ? "이번 달 활동" : `${year}년 ${month}월 활동`;

  return (
    <View className="bg-white w-full p-6 rounded-2xl shadow-sm">
      <Text className="font-sans font-bold text-xl text-gray-900 mb-4">{title}</Text>
      <View className="flex-row justify-between gap-3">
        <StatCard value={totalQuestions} label="총 질문" />
        <StatCard value={answeredCount} label="답변 완료" />
      </View>
    </View>
  );
}
