import { Text, View } from "react-native";

export default function SignUpHeader({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <View className="justify-center items-center gap-10">
      <Text className="font-bold text-4xl text-center">{title}</Text>
      <Text className="font-sans text-center">{description}</Text>
    </View>
  );
}
