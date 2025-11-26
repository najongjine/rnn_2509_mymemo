import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import { useCallback } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  useColorScheme,
} from "react-native";

export default function WebViewSample() {
  // 1. 다크모드 감지 및 색상 설정
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  const theme = {
    containerBg: isDark ? "#121212" : "#ffffff", // 전체 배경
    text: isDark ? "#ffffff" : "#000000", // 기본 글자
    subText: isDark ? "#aaaaaa" : "#666666", // 날짜 등 보조 글자
    divider: isDark ? "#333333" : "#eeeeee", // 구분선 색상
  };

  const queryString = useLocalSearchParams();
  const router = useRouter();

  async function init() {}

  useFocusEffect(
    useCallback(() => {
      init();
    }, [])
  );

  /*
  수정 버튼 만들고, MemoEdit 으로 가게하기
   */
  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.containerBg }]}
      contentContainerStyle={styles.contentContainer}
    >
      <View>
        <Text>웹뷰 샘플</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
  },
});
