
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

export interface Question {
  id: string;
  date: string;
  author: string;
  authorAvatar: string;
  question: string;
  status: "answered" | "pending";
  questionAssignmentId?: string;
  questionInstanceId?: string;
  reactions?: {
    heart: number;
    like: number;
    smile: number;
  };
}

const Reaction = ({ icon, count }: { icon: any; count: number }) => (
  <View className="flex-row items-center mr-3">
    <Text style={{ fontSize: 16 }}>{icon}</Text>
    <Text className="font-sans text-sm text-gray-500 ml-1">{count}</Text>
  </View>
);

export default function QuestionCard({
  item,
  onPress,
}: {
  item: Question;
  onPress?: () => void;
}) {
  const isPending = item.status === "pending";

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={isPending || !onPress}
      className={`w-full p-5 rounded-2xl shadow-sm border border-gray-100 ${
        isPending ? "bg-gray-50" : "bg-white"
      }`}
    >
      <View className="flex-row justify-between items-start">
        <View className="flex-row items-center">
          <Text className="font-sans text-sm font-bold text-orange-500 mr-2">
            {item.date}
          </Text>
          <Text style={{ fontSize: 18 }}>{item.authorAvatar}</Text>
          <Text className="font-sans text-sm text-gray-700 ml-1">{item.author}</Text>
        </View>
        {!isPending && (
          <Ionicons name="chevron-forward-outline" size={20} color="#D1D5DB" />
        )}
      </View>

      <Text className="font-sans text-base text-gray-900 my-3 leading-relaxed">
        {item.question}
      </Text>

      <View className="flex-row items-center justify-between mt-2">
        {isPending ? (
          <Text className="font-sans text-sm text-gray-500">답변 대기 중</Text>
        ) : (
          <Text className="font-sans text-sm font-semibold text-onsikku-dark-orange">답변 완료</Text>
        )}

        {!isPending && (
          <View className="flex-row">
            {item.reactions?.heart! > 0 && (
              <Reaction icon="❤️" count={item.reactions?.heart!} />
            )}
            {item.reactions?.like! > 0 && (
              <Reaction icon="👍" count={item.reactions?.like!} />
            )}
            {item.reactions?.smile! > 0 && (
              <Reaction icon="😀" count={item.reactions?.smile!} />
            )}
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}
