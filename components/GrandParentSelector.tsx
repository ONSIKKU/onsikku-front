import { CircleCheckBig } from "lucide-react-native";
import { Pressable, PressableProps, Text, View } from "react-native";

type GrandParentSelector = {
  parentType: "PATERNAL" | "MATERNAL" | null;
  selected: boolean;
} & Pick<PressableProps, "onPress">;

export default function GrandParentSelector({
  parentType,
  selected,
  onPress,
}: GrandParentSelector) {
  const title = parentType === "PATERNAL" ? "친가" : "외가";
  const text = parentType === "PATERNAL" ? "아빠 쪽 조부모" : "엄마 쪽 조부모";
  return (
    <Pressable className="flex-1" onPress={onPress}>
      <View
        className={`p-8 rounded-xl justify-center gap-3 items-center ${
          selected ? "bg-button-selected-light-orange" : "bg-white"
        }`}
      >
        <Text className="font-bold text-xl">{title}</Text>
        <Text className="font-sans">{text}</Text>
        <View className={selected ? "" : "invisible"}>
          <CircleCheckBig size={25} color={"#FB923C"} />
        </View>
      </View>
    </Pressable>
  );
}
