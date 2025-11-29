import { Text, TouchableOpacity, View } from "react-native";

interface RecentAnswersProps {
  roleName: string;
  date: string;
  content: string;
  roleIcon: string;
  onPress?: () => void;
}

export default function RecentAnswers({
  roleName,
  date,
  content,
  roleIcon,
  onPress,
}: RecentAnswersProps) {
  return (
    <TouchableOpacity 
      className="bg-white p-5 rounded-2xl shadow-sm border border-orange-100"
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View className="flex flex-row items-center justify-between mb-3">
        <View className="flex-row items-center gap-2">
          <View className="w-8 h-8 rounded-full bg-orange-100 items-center justify-center">
            <Text className="text-base">{roleIcon}</Text>
          </View>
          <Text className="font-medium text-gray-800">{roleName}</Text>
        </View>
        <Text className="text-xs text-gray-500">{date}</Text>
      </View>
      <Text className="font-sans text-sm text-gray-700 leading-5" numberOfLines={3}>
        {content}
      </Text>
    </TouchableOpacity>
  );
}
