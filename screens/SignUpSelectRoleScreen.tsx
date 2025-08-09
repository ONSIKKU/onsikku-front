import GeneralButton from "@/components/GeneralButton";
import RoleSelector from "@/components/SignUpRoleSelector";
import { useState } from "react";
import { Text, View } from "react-native";
const roles = [
  { role: "아빠", icon: "👨", description: "가족의 든든한 버팀목" },
  { role: "엄마", icon: "👩", description: "가족의 따뜻한 마음" },
  { role: "자녀", icon: "👦", description: "가족의 소중한 보물" },
  { role: "조부모", icon: "👴", description: "가족의 지혜로운 어른" },
  { role: "기타", icon: "👤", description: "소중한 가족 구성원" },
];

export default function SignUpSelectRole() {
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const handleButtonPress = (roleName: string) => {
    setSelectedRole(roleName);
  };

  return (
    <View className="flex-1 bg-background-orange justify-center items-center gap-10">
      <Text className="text-4xl font-bold text-center">
        가족 구성원을{"\n"}알려주세요
      </Text>
      <Text className="text-center">
        가족 안에서 어떤 역할이신지{"\n"}선택해주세요
      </Text>
      <View className="w-full px-8 gap-3">
        {roles.map((role) => (
          <RoleSelector
            key={role.role}
            {...role}
            selected={role.role === selectedRole}
            onPress={() => handleButtonPress(role.role)}
          />
        ))}
      </View>
      <GeneralButton text={"다음 단계로 ->"} isActive={selectedRole !== null} />
    </View>
  );
}
