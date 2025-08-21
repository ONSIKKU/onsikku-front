import GeneralButton from "@/components/GeneralButton";
import GrandParentSelector from "@/components/GrandParentSelector";
import SignUpHeader from "@/components/SignUpHeader";
import RoleSelector from "@/components/SignUpRoleSelector";
import { SignupRole, useSignupStore } from "@/features/signup/signupStore";
import { RoleItem } from "@/features/signup/types";
import { router } from "expo-router";
import { useEffect } from "react";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const roles: RoleItem[] = [
  {
    role: "PARENT",
    icon: "👩🏻👨🏻",
    description: "엄마 또는 아빠예요",
    value: "부모",
  },
  {
    role: "CHILD",
    icon: "👧🏻👦🏻",
    description: "아들 또는 딸이예요",
    value: "자녀",
  },
  {
    role: "GRANDPARENT",
    icon: "👴🏻👵🏻",
    description: "할아버지 또는 할머니예요",
    value: "조부모",
  },
];

export default function SignUpSelectRole() {
  const role = useSignupStore((s) => s.role);
  const setRole = useSignupStore((s) => s.setRole);
  const grandParentType = useSignupStore((pt) => pt.grandParentType);
  const setGrandParentType = useSignupStore((pt) => pt.setGrandParentType);

  const handleButtonPress = (roleItem: SignupRole) => {
    setRole(roleItem);
  };

  const handleNext = () => {
    if (!role) return;
    // 다음 스텝으로
    router.push("/signup/birthAndGender");
  };

  useEffect(() => {
    if (role !== "GRANDPARENT") setGrandParentType(null);
  }, [role]);

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
        <View
          className={`flex-col gap-4 ${
            role === "GRANDPARENT" ? "" : "invisible"
          }`}
        >
          <Text className="font-bold text-2xl text-center">
            어느 쪽 조부모님이신가요?
          </Text>
          <View className="flex-row gap-4 py-2">
            <GrandParentSelector
              parentType="PATERNAL"
              selected={grandParentType === "PATERNAL"}
              onPress={() => setGrandParentType("PATERNAL")}
            />
            <GrandParentSelector
              parentType="MATERNAL"
              selected={grandParentType === "MATERNAL"}
              onPress={() => setGrandParentType("MATERNAL")}
            />
          </View>
        </View>
        <GeneralButton
          text={"다음 단계로 ->"}
          isActive={
            role !== "GRANDPARENT"
              ? role !== null
              : role !== null && grandParentType !== null
          }
          onPress={handleNext}
        />
      </View>
    </SafeAreaView>
  );
}
