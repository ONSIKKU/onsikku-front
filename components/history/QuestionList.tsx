import React from "react";
import { ActivityIndicator, FlatList, Text, View } from "react-native";
import QuestionCard, { Question } from "./QuestionCard";
import { QuestionDetails } from "@/utils/api";
import { familyRoleToKo } from "@/utils/labels";

interface QuestionListProps {
  questions: QuestionDetails[];
  loading: boolean;
  error: string | null;
  onQuestionPress?: (questionAssignmentId: string, question: string, questionInstanceId?: string) => void;
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  return `${month}/${day}`;
};

const getRoleEmoji = (role: string) => {
  switch (role) {
    case "PARENT":
      return "👨";
    case "CHILD":
      return "👦";
    case "GRANDPARENT":
      return "👴";
    default:
      return "👤";
  }
};

export default function QuestionList({
  questions,
  loading,
  error,
  onQuestionPress,
}: QuestionListProps) {
  const convertedQuestions: Question[] = questions.map((q) => ({
    id: q.questionAssignmentId || "",
    date: formatDate(q.dueAt || q.sentAt || ""),
    author: familyRoleToKo(q.familyRole || "PARENT"),
    authorAvatar: getRoleEmoji(q.familyRole || "PARENT"),
    question: q.questionContent,
    status: q.state === "ANSWERED" ? "answered" : "pending",
    questionAssignmentId: q.questionAssignmentId,
    questionInstanceId: q.questionInstanceId,
  }));

  if (loading) {
    return (
      <View className="w-full">
        <Text className="text-lg font-bold text-gray-800 mb-4">지난 질문들</Text>
        <View className="bg-white p-6 rounded-2xl shadow-sm items-center justify-center">
          <ActivityIndicator size="large" color="#F97315" />
          <Text className="text-gray-500 mt-4">질문을 불러오는 중...</Text>
        </View>
      </View>
    );
  }

  if (error) {
    return (
      <View className="w-full">
        <Text className="text-lg font-bold text-gray-800 mb-4">지난 질문들</Text>
        <View className="bg-white p-6 rounded-2xl shadow-sm">
          <Text className="text-red-500 text-center">{error}</Text>
        </View>
      </View>
    );
  }

  if (convertedQuestions.length === 0) {
    return (
      <View className="w-full">
        <Text className="text-lg font-bold text-gray-800 mb-4">지난 질문들</Text>
        <View className="bg-white p-6 rounded-2xl shadow-sm">
          <Text className="text-gray-500 text-center">
            이 기간에 질문이 없습니다.
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View className="w-full">
      <Text className="text-lg font-bold text-gray-800 mb-4">지난 질문들</Text>
      <FlatList
        data={convertedQuestions}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <QuestionCard
            item={item}
            onPress={
              item.questionAssignmentId && item.questionInstanceId && onQuestionPress
                ? () => onQuestionPress(item.questionAssignmentId!, item.question, item.questionInstanceId)
                : undefined
            }
          />
        )}
        contentContainerStyle={{ gap: 12 }}
        scrollEnabled={false} // Parent ScrollView handles scrolling
      />
    </View>
  );
}
