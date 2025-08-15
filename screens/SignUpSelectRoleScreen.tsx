import GeneralButton from "@/components/GeneralButton";
import SignUpHeader from "@/components/SignUpHeader";
import RoleSelector from "@/components/SignUpRoleSelector";
import { SignupRole, useSignupStore } from "@/features/signup/signupStore";
import { RoleItem } from "@/features/signup/types";
import { router } from "expo-router";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const roles: RoleItem[] = [
  { role: "아빠", icon: "👨", description: "가족의 든든한 버팀목" },
  { role: "엄마", icon: "👩", description: "가족의 따뜻한 마음" },
  { role: "자녀", icon: "👦", description: "가족의 소중한 보물" },
  { role: "조부모", icon: "👴", description: "가족의 지혜로운 어른" },
  { role: "기타", icon: "👤", description: "소중한 가족 구성원" },
];

export default function SignUpSelectRole() {
  const role = useSignupStore((s) => s.role);
  const setRole = useSignupStore((s) => s.setRole);
  const handleButtonPress = (roleName: SignupRole | null) => {
    setRole(roleName);
  };

  const handleNext = () => {
    if (!role) return;
    // 다음 스텝으로
    router.push("/signup/age");
  };

  return (
    <SafeAreaView className="flex-1 bg-background-orange px-8 pt-16 justify-start items-center gap-10">
      <SignUpHeader
        title={`가족 구성원을\n알려주세요`}
        description={`가족 안에서 어떤 역할이신지\n선택해주세요`}
      />
      <View className="w-full gap-3">
        {roles.map((item) => (
          <RoleSelector
            key={item.role}
            {...item}
            selected={item.role === role}
            onPress={() => handleButtonPress(item.role)}
          />
        ))}
        <GeneralButton
          text={"다음 단계로 ->"}
          isActive={role !== null}
          onPress={handleNext}
        />
      </View>
    </SafeAreaView>
  );
}
