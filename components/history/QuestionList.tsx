
import React from "react";
import { FlatList, Text, View } from "react-native";
import QuestionCard, { Question } from "./QuestionCard";

const mockQuestions: Question[] = [
  {
    id: "1",
    date: "07/31",
    author: "아빠",
    authorAvatar: "👴",
    question: "오늘의 추억이 될 만한 일이 있었나요?",
    status: "answered",
    reactions: { heart: 2, like: 3, smile: 1 },
  },
  {
    id: "2",
    date: "07/30",
    author: "엄마",
    authorAvatar: "👵",
    question: "가족에게 고마운 마음을 전해보세요",
    status: "answered",
    reactions: { heart: 4, like: 2, smile: 0 },
  },
  {
    id: "3",
    date: "07/29",
    author: "아들",
    authorAvatar: "👦",
    question: "어린 시절 가장 기억에 남는 순간은?",
    status: "answered",
    reactions: { heart: 1, like: 2, smile: 1 },
  },
  {
    id: "4",
    date: "07/28",
    author: "딸",
    authorAvatar: "👧",
    question: "오늘 하루 가장 행복했던 순간은?",
    status: "pending",
  },
];

export default function QuestionList() {
  return (
    <View className="w-full">
      <Text className="text-lg font-bold text-gray-800 mb-4">지난 질문들</Text>
      <FlatList
        data={mockQuestions}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <QuestionCard item={item} />}
        contentContainerStyle={{ gap: 12 }}
        scrollEnabled={false} // Parent ScrollView handles scrolling
      />
    </View>
  );
}
