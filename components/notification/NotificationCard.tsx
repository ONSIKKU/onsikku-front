
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

export interface Notification {
  id: string;
  type: "comment" | "reaction" | "answer" | "all_answered" | "new_question";
  actor: string;
  actorAvatar: string;
  message: string;
  time: string;
  isRead: boolean;
}

const typeDetails = {
  comment: { title: "새로운 댓글", icon: "chatbubble-ellipses-outline" },
  reaction: { title: "새로운 반응", icon: "heart-outline" },
  answer: { title: "새로운 답변", icon: "pencil-outline" },
  all_answered: { title: "모든 답변 완료", icon: "star-outline" },
  new_question: { title: "새로운 질문", icon: "chatbox-outline" },
};

export default function NotificationCard({ item }: { item: Notification }) {
  const details = typeDetails[item.type];
  const borderColor = item.isRead
    ? "border-transparent"
    : item.type === "comment"
    ? "border-green-300"
    : "border-red-300";

  return (
    <View
      className={`w-full p-5 rounded-2xl shadow-sm bg-white border ${borderColor}`}
    >
      <View className="flex-row justify-between items-start">
        <View className="flex-row items-center flex-1">
          <Text style={{ fontSize: 24 }}>{item.actorAvatar}</Text>
          <Text className="text-base font-bold text-gray-800 ml-3">
            {details.title}
          </Text>
          {!item.isRead && (
            <View className="w-2 h-2 bg-red-500 rounded-full ml-2" />
          )}
        </View>
        <TouchableOpacity>
          <Ionicons name="trash-outline" size={20} color="gray" />
        </TouchableOpacity>
      </View>

      <View className="mt-3 ml-10">
        <Text className="text-sm text-gray-700">{item.message}</Text>
        <Text className="text-xs text-gray-400 mt-2">{item.time}</Text>
      </View>
    </View>
  );
}
