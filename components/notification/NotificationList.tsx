
import React from "react";
import { FlatList, View } from "react-native";
import NotificationCard, { Notification } from "./NotificationCard";

const mockNotifications: Notification[] = [
  {
    id: "1",
    type: "comment",
    actor: "엄마",
    actorAvatar: "👩",
    message: '엄마가 회원님의 답변에 댓글을 남겼어요: "예구 고생했네! 👏"',
    time: "5분 전",
    isRead: false,
  },
  {
    id: "2",
    type: "reaction",
    actor: "아들",
    actorAvatar: "👦",
    message: "아들이 회원님의 답변에 ❤️ 반응을 남겼어요",
    time: "1시간 전",
    isRead: false,
  },
  {
    id: "3",
    type: "answer",
    actor: "딸",
    actorAvatar: "👧",
    message: "딸이 오늘의 질문에 답변을 남겼어요",
    time: "2시간 전",
    isRead: true,
  },
  {
    id: "4",
    type: "all_answered",
    actor: "",
    actorAvatar: "⭐",
    message: "🎉 모든 가족이 오늘의 질문에 답변을 완료했어요!",
    time: "3시간 전",
    isRead: true,
  },
  {
    id: "5",
    type: "new_question",
    actor: "",
    actorAvatar: "💬",
    message: "오늘의 새로운 질문이 도착했어요! 지금 바로 답변해보세요",
    time: "어제",
    isRead: true,
  },
];

export default function NotificationList() {
  return (
    <FlatList
      data={mockNotifications}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => <NotificationCard item={item} />}
      contentContainerStyle={{ gap: 12 }}
      scrollEnabled={false}
    />
  );
}
