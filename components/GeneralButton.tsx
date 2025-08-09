import { Text, TouchableOpacity, View } from "react-native";

export default function GeneralButton({
  text,
  isActive,
}: {
  text: string;
  isActive: boolean;
}) {
  return (
    <TouchableOpacity
      className="w-full px-8"
      activeOpacity={0.9}
      disabled={!isActive}
      onPress={() => console.log("다음 단계로!!")}
    >
      <View
        className={`justify-center items-center py-4 rounded-xl ${
          isActive ? "bg-dark-orange" : "bg-light-orange"
        }`}
      >
        <Text className="font-bold text-xl text-white">{text}</Text>
      </View>
    </TouchableOpacity>
  );
}
