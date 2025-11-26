import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useCallback } from "react";
import {
  StyleSheet,
  Text,
  View, // ScrollView 대신 View 사용
  useColorScheme,
} from "react-native";
import { WebView } from "react-native-webview";

export default function WebViewSample() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  const theme = {
    containerBg: isDark ? "#121212" : "#ffffff",
    text: isDark ? "#ffffff" : "#000000",
    subText: isDark ? "#aaaaaa" : "#666666",
    divider: isDark ? "#333333" : "#eeeeee",
  };

  const queryString = useLocalSearchParams();
  const router = useRouter();

  async function init() {}

  useFocusEffect(
    useCallback(() => {
      init();
    }, [])
  );

  return (
    // 1. ScrollView -> View로 변경
    <View style={[styles.container, { backgroundColor: theme.containerBg }]}>
      <View style={{ padding: 20 }}>
        <Text style={{ color: theme.text }}>웹뷰 샘플</Text>
      </View>

      {/* 2. WebView 영역 */}
      <View style={styles.webviewContainer}>
        <WebView
          source={{ uri: "https://m.naver.com" }}
          style={styles.webview}
        />
      </View>

      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, // 전체 화면 채우기
  },
  // contentContainer 스타일 제거 (View에서는 필요 없음)
  webviewContainer: {
    flex: 1, // 남은 공간을 WebView가 모두 차지하도록 설정
    overflow: "hidden", // 모서리 둥글게 처리 등을 위해 가끔 필요
  },
  webview: {
    flex: 1,
  },
});
