import BackButton from "@/components/BackButton";
import GeneralButton from "@/components/GeneralButton";
import ImageUploadBox from "@/components/ImageUploadBox";
import SignUpHeader from "@/components/SignUpHeader";
import { useSignupStore } from "@/features/signup/signupStore";
import { getRoleIconAndText } from "@/utils/labels";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import { View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SignUpImageSelectScreen() {
  const uri = useSignupStore((i) => i.uri);
  const setUri = useSignupStore((i) => i.setUri);
  const role = useSignupStore((i) => i.role);
  const gender = useSignupStore((i) => i.gender);
  
  const { icon, text } = getRoleIconAndText(role, gender);

  function handleNext() {
    router.push("/signup/code");
  }

  async function pickFromLibrary() {
    // 라이브러리 권한
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) return;
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true, // 기본 크롭 UI (플랫폼별 동작 조금씩 다름)
      aspect: [1, 1], // allowsEditing과 함께 사용 시 적용될 수 있음
      quality: 0.8, // 압축
      exif: false,
    });

    if (!result.canceled) setUri(result.assets[0].uri);
  }

  async function takePhoto() {
    // 카메라 권한
    const cam = await ImagePicker.requestCameraPermissionsAsync();
    if (!cam.granted) return;

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 0.8,
    });

    if (!result.canceled) setUri(result.assets[0].uri);
  }

  return (
    <SafeAreaView className="flex-1 justify-start items-center px-8  gap-10">
      <BackButton />
      <SignUpHeader
        title={`나를 나타낼 \n사진을 선택해주세요`}
        description={`가족들이 쉽게 알아볼 수 있는 \n프로필 사진을 선택해주세요`}
      />
      <View className="bg-white rounded-full justify-center items-center w-48 h-48">
        <View className="rounded-full bg-orange-100 w-full h-full justify-center items-center border-4 border-white shadow-md shadow-gray-200">
          <Text className="text-7xl">{icon}</Text>
        </View>
      </View>
      <View className="gap-4">
        <ImageUploadBox type="camera" onPress={takePhoto} />
        <ImageUploadBox type="album" onPress={pickFromLibrary} />
      </View>

      <GeneralButton
        text={uri !== null ? "다음 단계로 ->" : "기본 프로필로 진행"}
        isActive={true}
        onPress={handleNext}
      />
    </SafeAreaView>
  );
}
