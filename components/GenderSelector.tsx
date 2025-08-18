import { Mars, Venus } from "lucide-react-native";
import { Pressable, PressableProps, Text, View } from "react-native";

type GenderSelector = {
  gender: "MALE" | "FEMALE";
  selected: boolean;
} & Pick<PressableProps, "onPress">;

export default function GenderSelector({
  gender,
  selected,
  onPress,
}: GenderSelector) {
  const icon =
    gender === "MALE" ? (
      <Mars size={25} color={"#007bff"} />
    ) : (
      <Venus size={25} color={"#f78da7"} />
    );
  const text = gender === "MALE" ? "남성" : "여성";
  return (
    <Pressable className="flex-1" onPress={onPress}>
      <View
        className={`p-8 rounded-xl justify-center items-center ${
          selected ? "bg-button-selected-light-orange" : "bg-white"
        }`}
      >
        <View>{icon}</View>
        <Text className="font-bold text-xl">{text}</Text>
      </View>
    </Pressable>
  );
}
