import ImageUploadBox from "@/components/ImageUploadBox";
import { getItem } from "@/utils/AsyncStorage";
import { getMyPage, MypageResponse, patchMyPage, setAccessToken } from "@/utils/api";
import { familyRoleToKo, genderToKo } from "@/utils/labels";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import { User } from "lucide-react-native";
import { useEffect, useState } from "react";
import { Alert, Image, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function MyPageEdit() {
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [avatarUri, setAvatarUri] = useState<string>("");
  const [gender, setGender] = useState<"MALE" | "FEMALE" | "">("");
  const [birthDate, setBirthDate] = useState<string>("");
  const [familyRole, setFamilyRole] = useState<"PARENT" | "CHILD" | "GRANDPARENT" | "">("");

  useEffect(() => {
    const run = async () => {
      try {
        setLoading(true);
        const token = await getItem("accessToken");
        if (token) setAccessToken(token);
        const res: MypageResponse = await getMyPage();
        setAvatarUri(res.profileImageUrl || "");
        setGender(res.gender || "");
        setBirthDate(res.birthDate || "");
        setFamilyRole(res.familyRole || "");
      } catch (e: any) {
        setError(e?.message || "정보를 불러오지 못했습니다");
      } finally {
        setLoading(false);
      }
    };
    run();
  }, []);

  async function pickFromLibrary() {
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) return;
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
      exif: false,
    });
    if (!result.canceled) setAvatarUri(result.assets[0].uri);
  }

  async function takePhoto() {
    const cam = await ImagePicker.requestCameraPermissionsAsync();
    if (!cam.granted) return;
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 0.8,
    });
    if (!result.canceled) setAvatarUri(result.assets[0].uri);
  }

  const onSave = async () => {
    try {
      setSaving(true);
      const isRemoteUrl = /^https?:\/\//.test(avatarUri);
      // 간단한 날짜 형식 검증 (yyyy-mm-dd)
      const validDate = !birthDate || /^\d{4}-\d{2}-\d{2}$/.test(birthDate);
      if (!validDate) {
        Alert.alert("확인", "생년월일은 yyyy-MM-dd 형식으로 입력해 주세요");
        setSaving(false);
        return;
      }
      await patchMyPage({
        profileImageUrl: isRemoteUrl ? avatarUri : undefined,
        gender: gender || undefined,
        birthDate: birthDate || undefined,
        familyRole: (familyRole as any) || undefined,
      } as any);
      Alert.alert("완료", "프로필이 수정되었습니다", [
        { text: "확인", onPress: () => router.back() },
      ]);
    } catch (e: any) {
      Alert.alert("오류", e?.message || "수정에 실패했습니다");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-orange-50">
        <Text className="text-gray-600">불러오는 중...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-orange-50">
      <View className="p-5 gap-6">
        <Text className="text-lg font-bold">내 정보 수정</Text>

        <View className="bg-white rounded-full justify-center items-center w-40 h-40 self-center">
          {avatarUri ? (
            <View className="w-full h-full rounded-full border-4 border-white shadow-md">
              <Image source={{ uri: avatarUri }} className="w-full h-full rounded-full" />
            </View>
          ) : (
            <View className="rounded-full bg-orange-100 w-full h-full justify-center items-center border-4 border-white shadow-md shadow-gray-200">
              <User size={60} color="#FB923C" />
            </View>
          )}
        </View>

        <View className="gap-4">
          <ImageUploadBox type="camera" onPress={takePhoto} />
          <ImageUploadBox type="album" onPress={pickFromLibrary} />
        </View>

        <View className="bg-white p-4 rounded-xl gap-3">
          <Text className="text-sm text-gray-700">성별</Text>
          <View className="flex-row gap-2">
            {["MALE", "FEMALE"].map((g) => (
              <TouchableOpacity
                key={g}
                className={`px-3 py-2 rounded-lg ${gender === g ? "bg-orange-100" : "bg-gray-100"}`}
                onPress={() => setGender(g as any)}
              >
                <Text className={`${gender === g ? "text-orange-600" : "text-gray-600"}`}>{genderToKo(g)}</Text>
              </TouchableOpacity>
            ))}
          </View>
          {/^file:|^assets:/.test(avatarUri) ? (
            <Text className="text-xs text-gray-500 mt-2">선택한 사진은 로컬 경로입니다. 서버 업로드 기능 연결 후 URL로 저장됩니다.</Text>
          ) : null}
        </View>

        <View className="bg-white p-4 rounded-xl gap-3">
          <Text className="text-sm text-gray-700">생년월일 (yyyy-MM-dd)</Text>
          <TextInput
            className="border border-gray-200 rounded-lg px-3 py-2"
            value={birthDate}
            onChangeText={setBirthDate}
            placeholder="2000-01-01"
            keyboardType="numbers-and-punctuation"
          />
        </View>

        <View className="bg-white p-4 rounded-xl gap-3">
          <Text className="text-sm text-gray-700">가족 내 역할</Text>
          <View className="flex-row gap-2 flex-wrap">
            {["PARENT", "CHILD", "GRANDPARENT"].map((r) => (
              <TouchableOpacity
                key={r}
                className={`px-3 py-2 rounded-lg ${familyRole === r ? "bg-orange-100" : "bg-gray-100"}`}
                onPress={() => setFamilyRole(r as any)}
              >
                <Text className={`${familyRole === r ? "text-orange-600" : "text-gray-600"}`}>{familyRoleToKo(r)}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {error ? <Text className="text-red-500">{error}</Text> : null}

        <TouchableOpacity
          onPress={onSave}
          disabled={saving}
          className="mt-2 bg-orange-500 rounded-xl items-center justify-center py-3"
        >
          <Text className="text-white">{saving ? "저장 중..." : "저장"}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
