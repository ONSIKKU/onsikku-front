
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Keyboard,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const QUESTION = "오늘 하루 어떠셨나요?\n위로받고 싶은 일이 있었나요?";

export default function ReplyScreen() {
  const router = useRouter();
  const [reply, setReply] = useState("");
  const characterLimit = 500;

  const handleSubmit = () => {
    console.log("Submitted reply:", reply);
    // Logic to submit the reply
    router.back();
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView edges={["bottom"]} className="flex-1 bg-orange-50">
        <View className="flex-1 p-5 gap-5">
          {/* Question Section */}
          <View className="bg-white p-6 rounded-2xl shadow-sm">
            <View className="flex-row items-center mb-4">
              <Ionicons name="chatbubble-outline" size={24} color="#F97315" />
              <Text className="text-lg font-bold text-gray-800 ml-2">
                오늘의 질문
              </Text>
            </View>
            <View className="bg-orange-50 p-4 rounded-lg">
              <Text className="text-base text-gray-700 leading-6">
                {QUESTION}
              </Text>
            </View>
          </View>

          {/* Reply Section */}
          <View className="bg-white p-6 rounded-2xl shadow-sm flex-1">
            <Text className="text-lg font-bold text-gray-800 mb-4">
              나의 생각 들려주기 😊
            </Text>
            <TextInput
              className="bg-orange-50 p-4 rounded-lg text-base text-gray-700 leading-6 h-48"
              multiline
              textAlignVertical="top"
              placeholder="오늘 하루 있었던 일이나 느낀 점을 자유롭게 써주세요. 가족들이 따뜻하게 들어줄 거예요."
              value={reply}
              onChangeText={setReply}
              maxLength={characterLimit}
            />
            <Text className="text-right text-gray-500 mt-2">
              {reply.length}/{characterLimit}자
            </Text>
          </View>

          {/* Submit Button */}
          <TouchableOpacity
            onPress={handleSubmit}
            className="bg-orange-400 p-4 rounded-2xl flex-row justify-center items-center shadow-sm"
          >
            <Ionicons name="send-outline" size={20} color="white" />
            <Text className="text-white text-base font-bold ml-2">
              답변 등록하기 💝
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
}
