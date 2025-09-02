import {
  Text,
  TouchableOpacity,
  TouchableOpacityProps,
  View,
} from "react-native";

export default function GeneralButton({
  text,
  isActive,
  onPress,
}: {
  text: string;
  isActive: boolean;
  onPress?: TouchableOpacityProps["onPress"];
}) {
  return (
    <TouchableOpacity
      className="w-full"
      activeOpacity={0.9}
      disabled={!isActive}
      onPress={onPress}
    >
      <View
        className={`justify-center items-center py-4 rounded-xl ${
          isActive ? "bg-onsikku-dark-orange" : "bg-light-orange"
        }`}
      >
        <Text className="font-bold text-xl text-white">{text}</Text>
      </View>
    </TouchableOpacity>
  );
}
