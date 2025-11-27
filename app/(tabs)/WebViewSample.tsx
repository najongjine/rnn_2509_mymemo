import { ActivityIndicator, Platform, StyleSheet, View } from "react-native";
import { WebView } from "react-native-webview";

export default function WebViewSample() {
  const targetUrl = "m.naver.com"; // 띄우고 싶은 웹사이트 주소

  // 구글 로그인을 뚫기 위한 UserAgent 설정 (안드로이드/iOS 구별)
  // "wv"라는 단어를 제거하여 일반 브라우저인 척합니다.
  const userAgent =
    Platform.OS === "android"
      ? "Mozilla/5.0 (Linux; Android 10; Android SDK built for x86) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.120 Mobile Safari/537.36"
      : "Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.0 Mobile/15E148 Safari/604.1";

  return (
    // 1. ScrollView 제거!
    <View style={styles.container}>
      <WebView
        source={{ uri: targetUrl }}
        style={styles.webView}
        startInLoadingState={true}
        renderLoading={() => (
          <ActivityIndicator
            size="large"
            color="#0000ff"
            style={styles.loadingIndicator}
          />
        )}
        // --- [중요] 추가된 설정 ---
        userAgent={userAgent} // 1. 구글이 웹뷰임을 눈치채지 못하게 함
        sharedCookiesEnabled={true} // 2. 안드로이드 쿠키 공유 허용
        thirdPartyCookiesEnabled={true} // 3. 서드파티 쿠키 허용 (구글 로그인 필수)
        domStorageEnabled={true}
        javaScriptEnabled={true}
        // 팝업창 제어 (새 창을 띄우지 않고 현재 창에서 열기 시도)
        setSupportMultipleWindows={false}
        // -----------------------
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, // 화면 전체를 차지하도록 설정
    paddingTop: 40,
  },
  webView: {
    flex: 1, // 컨테이너(container) 전체를 채우도록 설정
  },
  loadingIndicator: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
});
