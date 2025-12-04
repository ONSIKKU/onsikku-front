import BackButton from "@/components/BackButton";
import GeneralButton from "@/components/GeneralButton";
import SignUpHeader from "@/components/SignUpHeader";
import { useSignupStore } from "@/features/signup/signupStore";
import { getItem, setItem } from "@/utils/AsyncStorage";
import { signup, setAccessToken } from "@/utils/api";
import { HashIcon, Users } from "lucide-react-native";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { Alert } from "react-native";
import {
  Keyboard,
  KeyboardAvoidingView,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SignUpClusterScreen() {
  const [submitting, setSubmitting] = useState(false);
  
  const familyInvitationCode = useSignupStore((c) => c.familyInvitationCode);
  const familyName = useSignupStore((n) => n.familyName);
  const familyMode = useSignupStore((m) => m.familyMode);

  // 회원가입 요청 보낼 데이터들 불러오기
  const role = useSignupStore((r) => r.role);
  const grandParentType = useSignupStore((pt) => pt.grandParentType);
  const gender = useSignupStore((g) => g.gender);
  const birthDate = useSignupStore((b) => b.birthDate);
  const uri = useSignupStore((u) => u.uri);

  const setFamilyInvitationCode = useSignupStore(
    (c) => c.setFamilyInvitationCode
  );
  const setFamilyName = useSignupStore((n) => n.setFamilyName);
  const setFamilyMode = useSignupStore((m) => m.setFamilyMode);

  const handleNext = async () => {
    // 완료 api 보내기
    const registrationToken = await getItem("registrationToken");
    if (!registrationToken) {
      Alert.alert("오류", "회원가입 토큰이 없습니다. 다시 로그인해주세요.");
      return;
    }

    if (!role || !gender || !birthDate || (familyMode === "CREATE" && !familyName)) {
      Alert.alert("확인", "필수 정보가 입력되지 않았습니다.");
      return;
    }

    try {
      setSubmitting(true);
      const signupPayload = {
        registrationToken,
        grandParentType: grandParentType || null,
        familyRole: role,
        gender,
        birthDate,
        profileImageUrl: uri || null,
        familyName: familyMode === "CREATE" ? familyName : "",
        familyInvitationCode:
          familyMode === "JOIN" ? familyInvitationCode : undefined,
        familyMode,
      };
      
      const result = await signup(signupPayload);

      // 에러 처리: accessToken이 없으면 실패로 간주
      if (!result.accessToken) {
        throw new Error((result as any).message || "회원가입에 실패했습니다.");
      }

      // 토큰 저장
      if (result.accessToken) {
        await setItem("accessToken", result.accessToken);
        setAccessToken(result.accessToken);
      }
      if (result.refreshToken) {
        await setItem("refreshToken", result.refreshToken);
      }

      // 회원가입 성공 후 메인 화면으로 이동
      router.replace("/(tabs)/home");
    } catch (err: any) {
      Alert.alert("회원가입 실패", err?.message || "회원가입에 실패했습니다.");
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    if (familyMode === "JOIN") {
      // 참여하기니까 우리 가족 이름은 ""으로 존재해야함
      // 만약 가족생성하기 누르고 가족명 입력하고 다시 돌아와서 참여할 수도 있음
      setFamilyName("");
    } else {
      // 이건 가족 생성하기
      // 여기서는 가족 코드를 초기화시키면 됨
      setFamilyInvitationCode("");
    }
  }, [familyMode]);
  return (
    <SafeAreaView className="flex-1 ">
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView
          className="justify-start flex-1 items-center gap-10 px-8"
          behavior="padding"
          keyboardVerticalOffset={30}
        >
          <BackButton />
          <SignUpHeader
            title={`가족과 함께\n시작해보세요`}
            description={`이미 가족이 사용중이라면 코드를 입력하고,\n처음이라면 새로 만들어보세요`}
          />
          {familyMode === "CREATE" ? (
            <View className="w-full items-center gap-6">
              <View className="w-full items-center gap-4">
                <View className="flex-row justify-start w-full gap-4">
                  <Users size={25} color={"#FB923C"} />
                  <Text className="font-bold text-xl">우리 가족 이름</Text>
                </View>
                <View className="w-full gap-1">
                  <TextInput
                    className="bg-white w-full p-4 rounded-xl text-center font-sans text-2xl"
                    value={familyName}
                    maxLength={20}
                    textAlignVertical="center"
                    onChangeText={setFamilyName}
                    placeholder="예 : 승재네 가족"
                    placeholderTextColor={"#9CA3AF"}
                  />
                  <Text className="font-light w-full text-right text-[#6B7280]">
                    {familyName.length}/20자
                  </Text>
                </View>

                <GeneralButton
                  text={submitting ? "처리 중..." : "가족 생성하기"}
                  isActive={familyName !== "" && !submitting}
                  onPress={handleNext}
                />
                <TouchableOpacity
                  className="w-full justify-center items-center py-2"
                  onPress={() => setFamilyMode("JOIN")}
                >
                  <View>
                    <Text className="font-sans">취소</Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <View className="w-full items-center gap-4">
              <View className="flex-row justify-start w-full gap-4">
                <HashIcon size={25} color={"#FB923C"} />
                <Text className="font-bold text-xl">
                  가족 코드가 있으신가요?
                </Text>
              </View>
              <TextInput
                className="bg-white w-full p-4 rounded-xl text-center font-sans text-2xl"
                value={familyInvitationCode}
                maxLength={8}
                onChangeText={setFamilyInvitationCode}
                placeholder="ABCD1234"
                placeholderTextColor={"#9CA3AF"}
              />
              <GeneralButton
                text={submitting ? "처리 중..." : "가족 참여하기"}
                isActive={familyInvitationCode.length === 8 && !submitting}
                onPress={handleNext}
              />
              <View className="flex-row w-full items-center">
                <View className="bg-gray-200 h-[1.5px] flex-1" />
                <Text className="font-sans text-center px-4">또는</Text>
                <View className="bg-gray-200 h-[1.5px] flex-1" />
              </View>

              <View className="flex-row justify-start w-full gap-4">
                <Users size={25} color={"#FB923C"} />
                <Text className="font-bold text-xl">
                  새로운 가족을 생성할까요?
                </Text>
              </View>
              <GeneralButton
                text="새 가족 만들기"
                isActive={true}
                onPress={() => setFamilyMode("CREATE")}
              />
            </View>
          )}
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
}
