import { AgeItem } from "@/features/signup/types";
import { Pressable, PressableProps, Text, View } from "react-native";

type AgeSelector = Pick<AgeItem, "age" | "icon"> & {
  selected: boolean;
} & Pick<PressableProps, "onPress">;

export default function AgeSelector({
  icon,
  age,
  selected,
  onPress,
}: AgeSelector) {
  return (
    <Pressable className="flex-1" onPress={onPress}>
      <View
        className={`flex-1 p-4 rounded-xl justify-center items-center ${
          selected ? "bg-button-selected-light-orange" : "bg-white"
        }`}
      >
        <Text className="font-sans text-3xl">{icon}</Text>
        <Text className="font-bold text-xl">
          {age! >= 60 ? age + `대 이상` : age + "대"}
        </Text>
      </View>
    </Pressable>
  );
}
