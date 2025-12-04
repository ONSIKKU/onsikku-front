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
  rightIcon,
}: {
  text: string;
  isActive: boolean;
  onPress?: TouchableOpacityProps["onPress"];
  rightIcon?: React.ReactNode;
}) {
  return (
    <TouchableOpacity
      className="w-full"
      activeOpacity={0.9}
      disabled={!isActive}
      onPress={onPress}
    >
      <View
        className={`flex-row justify-center items-center py-4 rounded-xl gap-2 ${
          isActive ? "bg-onsikku-dark-orange" : "bg-light-orange"
        }`}
      >
        <Text className="font-bold text-xl text-white">{text}</Text>
        {rightIcon}
      </View>
    </TouchableOpacity>
  );
}
