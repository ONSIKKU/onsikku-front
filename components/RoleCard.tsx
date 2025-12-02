import { Crown } from "lucide-react-native";
import { Text, View } from "react-native";

interface RoleCardProps {
  icon: string;
  roleName: string;
  isSelected: boolean;
  isPending?: boolean;
  isProtagonist?: boolean;
}

export default function RoleCard({
  icon,
  roleName,
  isSelected,
  isPending,
  isProtagonist,
}: RoleCardProps) {
  return (
    <View className="flex-1 flex-col justify-start items-center gap-1">
      <View
        className={`w-16 h-16 rounded-full justify-center items-center box-border relative
        ${
          isSelected
            ? "bg-orange-100 border-2 border-orange-500"
            : isPending
            ? "bg-white border-2 border-orange-300"
            : "bg-gray-100"
        }
        `}
      >
        <Text className="font-sans text-2xl">{icon}</Text>
        {isProtagonist && (
          <View className="absolute -top-2 -right-2 bg-white rounded-full p-1 shadow-sm border border-orange-100">
            <Crown size={14} color="#F59E0B" fill="#F59E0B" />
          </View>
        )}
      </View>
      <Text
        className={`font-sans text-xs mt-1 ${
          isSelected || isPending
            ? "text-orange-600 font-bold"
            : "text-gray-400"
        }`}
      >
        {roleName}
      </Text>
    </View>
  );
}
