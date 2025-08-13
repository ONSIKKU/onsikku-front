import { Camera, ImageIcon } from "lucide-react-native";
import { Text, TouchableOpacity, View } from "react-native";

export default function ImageUploadBox({
  type,
  onPress,
}: {
  type: string;
  onPress: () => void;
}) {
  const icon =
    type === "camera" ? (
      <Camera color="#FB923C" size={24} />
    ) : (
      <ImageIcon color="#FB923C" size={24} />
    );
  const title = type === "camera" ? "사진 촬영하기" : "앨범에서 선택";
  const description =
    type === "camera"
      ? "카메라로 새로운 사진을 촬영하세요"
      : "사진첩에서 기존 사진을 선택하세요";
  const buttonText = type === "camera" ? "촬영" : "선택";
  return (
    <View className="w-full flex-row bg-white p-4 rounded-xl items-center gap-3">
      <View className="bg-orange-100 rounded-full p-3">{icon}</View>
      <View className="flex-1">
        <Text className="font-bold">{title}</Text>
        <Text>{description}</Text>
      </View>
      <TouchableOpacity
        onPress={onPress}
        className="bg-dark-orange px-4 py-2 rounded-xl flex justify-center items-center"
      >
        <View>
          <Text className="font-bold text-white">{buttonText}</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
}
