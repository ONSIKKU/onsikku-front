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
    <View className="bg-onsikku-main-orange w-full p-4 gap-2 rounded-xl flex-1">
      <View className="flex flex-row items-center justify-between gap-2">
        <Text>{roleName}</Text>
        <Text> {date}</Text>
      </View>
    </View>
  );
}
