
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  Image,
  Keyboard,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const QUESTION = "오늘 하루 어떠셨나요?\n위로받고 싶은 일이 있었나요?";

const QuestionDisplay = () => (
  <View className="bg-white p-6 rounded-2xl shadow-sm">
    <View className="flex-row items-center mb-4">
      <Ionicons name="chatbubble-outline" size={24} color="#F97315" />
      <Text className="text-lg font-bold text-gray-800 ml-2">오늘의 질문</Text>
    </View>
    <View className="bg-orange-50 p-4 rounded-lg">
      <Text className="text-base text-gray-700 leading-6">{QUESTION}</Text>
    </View>
  </View>
);

const ReactionButton = ({ icon, count, selected }: any) => (
  <TouchableOpacity
    className={`border rounded-2xl p-3 items-center flex-1 ${selected ? "border-blue-500" : "border-gray-200"}`}
  >
    <Text style={{ fontSize: 24 }}>{icon}</Text>
    <Text className="text-sm text-gray-600 mt-1">{count}</Text>
  </TouchableOpacity>
);

const AuthorReply = () => (
  <View className="bg-white p-6 rounded-2xl shadow-sm">
    <View className="flex-row items-center mb-4">
      <Text style={{ fontSize: 32 }}>👴</Text>
      <View className="ml-3">
        <Text className="text-base font-bold">아빠</Text>
        <Text className="text-sm text-gray-500">오늘 오후 2시</Text>
      </View>
    </View>
    <View className="bg-gray-100 p-4 rounded-lg mb-4">
      <Text className="text-base text-gray-800 leading-6">
        오늘 회사에서 발표가 있었는데 너무 떨렸어요. 하지만 동료들이 격려해줘서
        용기를 낼 수 있었고, 결과적으로 잘 마무리할 수 있었어요. 가족들의 응원도
        큰 힘이 되었답니다. 감사해요!
      </Text>
    </View>
    <View className="flex-row justify-between gap-3 mb-4">
      <ReactionButton icon="❤️" count={3} />
      <ReactionButton icon="👍" count={5} />
      <ReactionButton icon="😊" count={12} />
      <ReactionButton icon="⭐" count={3} selected />
    </View>
    <Text className="text-sm text-gray-600">
      가족들의 반응: ❤️ 2 👍 1 😊 1 ⭐ 1
    </Text>
  </View>
);

const CommentInput = () => {
  const [comment, setComment] = useState("");
  return (
    <View className="bg-white p-6 rounded-2xl shadow-sm">
      <Text className="text-lg font-bold text-gray-800 mb-4">
        응원 메시지 남기기 💬
      </Text>
      <View className="flex-row items-start">
        <Text style={{ fontSize: 24 }}>👤</Text>
        <View className="flex-1 ml-3">
          <TextInput
            className="bg-orange-50 p-4 rounded-lg text-base h-24"
            multiline
            textAlignVertical="top"
            placeholder="따뜻한 응원 메시지를 남겨주세요..."
            value={comment}
            onChangeText={setComment}
            maxLength={200}
          />
          <View className="flex-row justify-between items-center mt-2">
            <Text className="text-gray-500">
              {comment.length}/200자
            </Text>
            <TouchableOpacity className="bg-orange-400 px-4 py-2 rounded-lg">
              <Text className="text-white font-bold">전송</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

const comments = [
  { id: "1", author: "나", time: "방금 전", text: "ㄴㅇㅁㅇㅎㅁ", avatar: "👤" },
  { id: "2", author: "나", time: "방금 전", text: "ㄴㅇㄹ", avatar: "👤" },
  { id: "3", author: "엄마", time: "방금 전", text: "예구 고생했네!👏", avatar: "👩" },
  { id: "4", author: "아들", time: "5분 전", text: "역시 우리 아빠! 짱이에요✨", avatar: "👦" },
];

const CommentList = () => (
  <View className="bg-white p-6 rounded-2xl shadow-sm">
    <Text className="text-lg font-bold text-gray-800 mb-4">가족들의 응원 (4)</Text>
    <View className="gap-5">
      {comments.map((c) => (
        <View key={c.id} className="flex-row items-start">
          <Text style={{ fontSize: 24 }}>{c.avatar}</Text>
          <View className="ml-3">
            <View className="flex-row items-center">
              <Text className="font-bold">{c.author}</Text>
              <Text className="text-xs text-gray-400 ml-2">{c.time}</Text>
            </View>
            <Text className="text-base text-gray-700 mt-1">{c.text}</Text>
          </View>
        </View>
      ))}
    </View>
  </View>
);

export default function ReplyDetailScreen() {
  return (
    <SafeAreaView edges={["bottom"]} className="flex-1 bg-orange-50">
      <ScrollView>
        <View className="p-5 gap-5">
          <QuestionDisplay />
          <AuthorReply />
          <CommentInput />
          <CommentList />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
