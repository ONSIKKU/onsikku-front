import { Heart } from "lucide-react-native";
import { Text, View } from "react-native";

interface RecentAnswersProps {
  roleName: string;
  date: string;
  content: string;
  roleIcon: string;
}

export default function RecentAnswers({
  roleName,
  date,
  content,
  roleIcon,
}: RecentAnswersProps) {
  return (
    <View className="bg-white p-5 rounded-2xl shadow-sm border border-orange-100">
      <View className="flex flex-row items-center justify-between mb-3">
        <View className="flex-row items-center gap-2">
          <View className="w-8 h-8 rounded-full bg-orange-100 items-center justify-center">
            <Text className="text-base">{roleIcon}</Text>
          </View>
          <Text className="font-medium text-gray-800">{roleName}</Text>
        </View>
        <Text className="text-xs text-gray-500">{date}</Text>
      </View>
      <Text className="font-sans text-sm text-gray-700 leading-5 mb-3" numberOfLines={2}>
        {content}
      </Text>
      <View className="flex flex-row gap-2 items-center">
        <Heart size={16} fill={"#EB523F"} color={"#EB523F"} />
        <Text className="text-xs text-gray-500">👍</Text>
      </View>
    </View>
  );
}
