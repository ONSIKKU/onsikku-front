import { Text, View } from "react-native";

interface RoleCardProps {
  icon: string;
  roleName: string;
  isSelected: boolean;
  isPending?: boolean;
}

export default function RoleCard({
  icon,
  roleName,
  isSelected,
  isPending,
}: RoleCardProps) {
  return (
    <View className="flex-1 flex-col justify-start items-center gap-1">
      <View
        className={`w-16 h-16 rounded-full justify-center items-center box-border
        ${
          isSelected
            ? "bg-onsikku-main-orange border border-onsikku-dark-orange"
            : isPending
            ? "bg-white border-2 border-onsikku-main-orange"
            : "bg-onsikku-light-gray"
        }
        `}
      >
        <Text className="font-sans text-xl">{icon}</Text>
      </View>
      <Text
        className={`font-sans ${
          isSelected || isPending ? "text-onsikku-dark-orange" : "text-gray-200"
        }`}
      >
        {roleName}
      </Text>
    </View>
  );
}
