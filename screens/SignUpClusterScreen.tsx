import GeneralButton from "@/components/GeneralButton";
import SignUpHeader from "@/components/SignUpHeader";
import { useState } from "react";
import {
  KeyboardAvoidingView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function SignUpClusterScreen() {
  const [code, onChangeCode] = useState("");
  const [generateFamily, setGenerateFamily] = useState(false);
  const [familyName, onChangeFamilyName] = useState("");
  return (
    <KeyboardAvoidingView
      className="flex-1 bg-background-orange justify-center items-center gap-10"
      behavior="padding"
      keyboardVerticalOffset={30}
    >
      <SignUpHeader
        title={`가족과 함께\n시작해보세요`}
        description={`이미 가족이 사용중이라면 코드를 입력하고,\n처음이라면 새로 만들어보세요`}
      />
      <View className="w-full px-8 items-center gap-4">
        <Text className="font-bold text-xl">가족 코드가 있으신가요?</Text>
        <TextInput
          className="bg-white w-full p-4 rounded-xl text-center font-sans text-2xl"
          value={code}
          maxLength={8}
          onChangeText={onChangeCode}
          placeholder="ABCD1234"
          placeholderTextColor={"#9CA3AF"}
        />
        <GeneralButton text="가족 참여하기" isActive={code.length === 8} />
      </View>

      <Text className="font-sans">또는</Text>

      <View className="w-full px-8 items-center gap-6">
        <Text className="font-bold text-xl">새로운 가족을 생성할까요?</Text>
        {generateFamily ? (
          <View className="w-full items-center gap-4">
            <Text className="font-sans w-full text-left">우리 가족 이름</Text>
            <View className="w-full gap-1">
              <TextInput
                className="bg-white w-full p-4 rounded-xl text-center font-sans text-2xl"
                value={familyName}
                maxLength={20}
                textAlignVertical="center"
                onChangeText={onChangeFamilyName}
                placeholder="예 : 승재네 가족"
                placeholderTextColor={"#9CA3AF"}
              />
              <Text className="font-light w-full text-right text-[#6B7280]">
                {familyName.length}/20자
              </Text>
            </View>

            <GeneralButton text="가족 생성하기" isActive={familyName !== ""} />
            <TouchableOpacity
              className="w-full justify-center items-center py-2"
              onPress={() => setGenerateFamily(false)}
            >
              <View>
                <Text className="font-sans">취소</Text>
              </View>
            </TouchableOpacity>
          </View>
        ) : (
          <GeneralButton
            text="새 가족 만들기"
            isActive={true}
            onPress={() => setGenerateFamily(true)}
          />
        )}
      </View>
    </KeyboardAvoidingView>
  );
}
