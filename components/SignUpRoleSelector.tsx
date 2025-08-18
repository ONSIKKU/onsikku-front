import { RoleItem } from "@/features/signup/types";
import { Check } from "lucide-react-native";
import { Pressable, PressableProps, Text, View } from "react-native";

type SignUpRoleSelectorProps = Pick<
  RoleItem,
  "icon" | "role" | "description"
> & {
  selected: boolean;
} & Pick<PressableProps, "onPress">;

export default function SignUpRoleSelector({
  icon,
  role,
  description,
  selected,
  onPress,
}: SignUpRoleSelectorProps) {
  return (
    <Pressable onPress={onPress}>
      <View
        className={`flex-row rounded-xl p-5 justify-start items-center gap-2 ${
          selected ? "bg-button-selected-light-orange" : "bg-white"
        }`}
      >
        <Text className="text-4xl">{icon}</Text>
        <View className="flex-1">
          <Text className="font-bold">{role}</Text>
          <Text className="font-sans">{description}</Text>
        </View>
        <View className={`${selected ? "" : "hidden"} `}>
          <Check size={25} color={"#FB923C"} />
        </View>
      </View>
    </Pressable>
  );
}
