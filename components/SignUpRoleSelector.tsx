import { Pressable, PressableProps, Text, View } from "react-native";

export default function SignUpRoleSelector({
  icon,
  role,
  description,
  selected,
  onPress,
}: {
  icon: string;
  role: string;
  description: string;
  selected: boolean;
  onPress?: PressableProps["onPress"];
}) {
  return (
    <Pressable onPress={onPress}>
      <View
        className={`flex-row  rounded-xl p-5 justify-start items-center gap-2 ${
          selected ? "bg-[#FFEDD0]" : "bg-white"
        }`}
      >
        <Text className="text-4xl">{icon}</Text>
        <View className="flex-1">
          <Text className="font-bold">{role}</Text>
          <Text className="font-sans">{description}</Text>
        </View>
        <Text className={`${selected ? "" : "hidden"} `}>✔</Text>
      </View>
    </Pressable>
  );
}
