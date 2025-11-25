import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useColorScheme,
} from "react-native";
import * as db from "../db/db";
import * as types from "../types/types";

export default function MemoDetail() {
  // 1. 다크모드 감지 및 색상 설정
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  const theme = {
    containerBg: isDark ? "#121212" : "#ffffff", // 전체 배경
    text: isDark ? "#ffffff" : "#000000", // 기본 글자
    subText: isDark ? "#aaaaaa" : "#666666", // 날짜 등 보조 글자
    divider: isDark ? "#333333" : "#eeeeee", // 구분선 색상
  };

  const [memo, setMemo] = useState<types.Memo>({});
  const queryString = useLocalSearchParams();
  const memoId = Number(queryString?.memoId ?? 0);
  const router = useRouter();

  async function init() {
    await db.initDB();
    if (memoId) {
      let _memo = await db.getMemoById(memoId);
      if (_memo) {
        setMemo(_memo);
      }
    }
  }

  useFocusEffect(
    useCallback(() => {
      init();
    }, [memoId])
  );

  /*
  수정 버튼 만들고, MemoEdit 으로 가게하기
   */
  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.containerBg }]}
      contentContainerStyle={styles.contentContainer}
    >
      {/* 헤더 영역: 제목과 날짜 */}
      <View style={[styles.header, { borderBottomColor: theme.divider }]}>
        <Text style={[styles.title, { color: theme.text }]}>{memo.title}</Text>
        <Text style={[styles.date, { color: theme.subText }]}>
          {memo.date ? memo.date : "날짜 정보 없음"}
        </Text>
      </View>

      {/* 본문 영역: 내용 */}
      <View style={styles.body}>
        <Text style={[styles.content, { color: theme.text }]}>
          {memo.content}
        </Text>
      </View>
      {/* 버튼 영역: 수정/삭제 */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, styles.editButton]}
          onPress={() => {}}
        >
          <Text style={styles.buttonText}>수정</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.deleteButton]}
          onPress={() => {}}
        >
          <Text style={styles.buttonText}>삭제</Text>
        </TouchableOpacity>
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
  header: {
    marginBottom: 20,
    paddingBottom: 15,
    borderBottomWidth: 1, // 제목과 내용 사이에 얇은 구분선 추가
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 8,
    lineHeight: 32, // 제목이 길어질 경우 줄 간격 확보
  },
  date: {
    fontSize: 14,
  },
  body: {
    minHeight: 200, // 내용이 없어도 최소한의 영역 확보
  },
  content: {
    fontSize: 17,
    lineHeight: 26, // 본문 가독성을 위해 줄 간격을 넉넉하게
    textAlign: "left", // 왼쪽 정렬
  },

  // --- 버튼 스타일 추가 ---
  buttonContainer: {
    flexDirection: "row", // 가로 배치
    justifyContent: "space-between", // 사이 간격 균등
    marginTop: 30, // 본문과의 거리
    gap: 15, // 버튼 사이의 간격 (React Native 0.71+ 지원)
  },
  button: {
    flex: 1, // 화면 너비를 반반 차지하도록 설정
    paddingVertical: 15, // 버튼 높이감
    borderRadius: 12, // 둥근 모서리
    alignItems: "center",
    justifyContent: "center",
    elevation: 2, // 안드로이드 그림자
    shadowColor: "#000", // iOS 그림자
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  editButton: {
    backgroundColor: "#2E7D32", // 짙은 초록색 (눈이 편안함)
  },
  deleteButton: {
    backgroundColor: "#D32F2F", // 짙은 빨간색 (경고 느낌)
  },
  buttonText: {
    color: "#FFFFFF", // 흰색 글씨
    fontSize: 16,
    fontWeight: "bold",
  },
  // 버튼 스타일 END
});
