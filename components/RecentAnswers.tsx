import { Heart } from "lucide-react-native";
import { Text, View } from "react-native";

interface RecentAnswersProps {
  roleName: string;
  date: string;
  content: string;
}

export default function RecentAnswers({
  roleName,
  date,
  content,
}: RecentAnswersProps) {
  return (
    <View className="bg-onsikku-main-orange p-4 gap-2 rounded-xl border border-onsikku-dark-orange">
      <View className="flex flex-row items-center justify-between gap-2">
        <Text>{roleName}</Text>
        <Text className="text-onsikku-dark-orange">{date}</Text>
      </View>
      <Text className="font-sans line-clamp-2">{content}</Text>
      <View className="flex flex-row gap-1">
        <Heart fill={"#EB523F"} />
        <Text> 👍</Text>
      </View>
    </View>
  );
}
