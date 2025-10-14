
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
  reactions?: {
    heart: number;
    like: number;
    smile: number;
  };
}

const Reaction = ({ icon, count }: { icon: any; count: number }) => (
  <View className="flex-row items-center mr-3">
    <Text style={{ fontSize: 16 }}>{icon}</Text>
    <Text className="text-sm text-gray-500 ml-1">{count}</Text>
  </View>
);

export default function QuestionCard({ item }: { item: Question }) {
  const isPending = item.status === "pending";

  return (
    <TouchableOpacity
      className={`w-full p-5 rounded-2xl shadow-sm ${
        isPending ? "bg-gray-100" : "bg-white"
      }`}
    >
      <View className="flex-row justify-between items-start">
        <View className="flex-row items-center">
          <Text className="text-sm font-bold text-orange-500 mr-2">
            {item.date}
          </Text>
          <Text style={{ fontSize: 18 }}>{item.authorAvatar}</Text>
          <Text className="text-sm text-gray-700 ml-1">{item.author}</Text>
        </View>
        {!isPending && (
          <Ionicons name="chevron-forward-outline" size={20} color="gray" />
        )}
      </View>

      <Text className="text-base text-gray-800 my-3">{item.question}</Text>

      {isPending ? (
        <Text className="text-sm text-gray-500">답변 대기 중</Text>
      ) : (
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
    </TouchableOpacity>
  );
}
