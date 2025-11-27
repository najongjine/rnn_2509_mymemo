import { useRef } from "react";
import {
  ActivityIndicator,
  Button,
  Linking,
  Platform,
  StyleSheet,
  View,
} from "react-native";
import { WebView } from "react-native-webview";

export default function WebViewSample2() {
  const targetUrl = "https://itsec-react-2509.vercel.app/toss_checkout";
  const webviewRef = useRef(null);

  // 구글 로그인을 위한 UserAgent (기존 유지)
  const userAgent =
    Platform.OS === "android"
      ? "Mozilla/5.0 (Linux; Android 10; Android SDK built for x86) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.120 Mobile Safari/537.36"
      : "Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.0 Mobile/15E148 Safari/604.1";

  // [핵심] URL 변경 요청을 가로채서 외부 앱(카카오페이 등)을 실행하는 함수
  const onShouldStartLoadWithRequest = (event: any) => {
    const { url } = event;

    // 1. 일반 http/https 주소는 웹뷰가 로드하도록 허용 (True)
    if (url.startsWith("http://") || url.startsWith("https://")) {
      return true;
    }

    // 2. 안드로이드 Intent 스키마 처리 (카카오페이, 네이버페이 등)
    if (Platform.OS === "android" && url.startsWith("intent:")) {
      try {
        // intent 주소에서 scheme(앱 실행 주소)과 package(앱 미설치 시 마켓 주소) 추출
        // 예: intent://...#Intent;scheme=kakaotalk;package=com.kakao.talk;end;
        const schemeMatch = url.match(/scheme=([^;]+)/);
        const packageMatch = url.match(/package=([^;]+)/);

        const scheme = schemeMatch ? schemeMatch[1] : null;
        const packageName = packageMatch ? packageMatch[1] : null;

        if (!scheme) return false;

        // intent://를 scheme:// 형태로 변환 (예: kakaotalk://...)
        // 주의: intent 주소 내부의 파라미터들을 잘라서 붙여야 정확히 동작함
        const intentUrlParams = url.split("intent://")[1].split("#Intent;")[0];
        const appUrl = `${scheme}://${intentUrlParams}`;

        Linking.openURL(appUrl).catch(() => {
          // 앱 실행 실패 시 (미설치 등), 마켓으로 이동
          if (packageName) {
            Linking.openURL(`market://details?id=${packageName}`);
          }
        });
      } catch (e) {
        console.error("Intent parsing error", e);
      }
      return false; // 웹뷰가 intent 주소를 로딩하지 않도록 차단
    }

    // 3. iOS 및 기타 스킴 (kakaotalk://, ispmobile:// 등) 처리
    Linking.openURL(url).catch((err) => {
      console.error("앱 실행 실패", err);
    });

    return false; // 웹뷰가 해당 주소를 로딩하지 않도록 차단
  };

  const handleOpenURL = async () => {
    const url = targetUrl; // Replace with your desired URL
    const supported = await Linking.canOpenURL(targetUrl);

    if (supported) {
      await Linking.openURL(url);
    } else {
      console.log(`Don't know how to open this URL: ${url}`);
      // You might want to show an alert to the user here
    }
  };

  return (
    <View style={styles.container}>
      <View>
        <Button title="Open in Browser" onPress={handleOpenURL} />
      </View>
      <WebView
        ref={webviewRef}
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
        userAgent={userAgent}
        // [중요] 모든 URL 스킴 허용 (http, https, intent, kakaotalk 등)
        originWhitelist={["*"]}
        // [중요] 요청 가로채기 함수 연결
        onShouldStartLoadWithRequest={onShouldStartLoadWithRequest}
        sharedCookiesEnabled={true}
        thirdPartyCookiesEnabled={true}
        domStorageEnabled={true}
        javaScriptEnabled={true}
        setSupportMultipleWindows={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 40,
  },
  webView: {
    flex: 1,
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
