import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Button,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  useColorScheme, // 다크모드 감지를 위해 추가
} from "react-native";
import * as db from "../db/db";
import * as types from "../types/types";

export default function MemoEdit() {
  // 1. 다크모드 감지
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  // 2. 테마에 따른 색상 정의
  const theme = {
    containerBg: isDark ? "#121212" : "#ffffff",
    text: isDark ? "#ffffff" : "#000000",
    inputBg: isDark ? "#2c2c2c" : "#f9f9f9", // 입력창 배경을 약간 다르게 하여 구분감 줌
    border: isDark ? "#555555" : "#cccccc",
    placeholder: isDark ? "#aaaaaa" : "#888888",
  };

  const [inputHeight, setInputHeight] = useState(40);
  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [memo, setMemo] = useState<types.Memo>({});

  const queryString = useLocalSearchParams();
  const memoId = Number(queryString?.memoId ?? 0);
  const router = useRouter();

  async function init() {
    await db.initDB();
    if (memoId) {
      const data = await db.getMemoById(memoId);
      // (참고) DB에서 불러온 데이터를 화면에 보여주려면 state에 넣어줘야 합니다.
      if (data) {
        setMemo(data);
        setTitle(data.title || "");
        setContent(data.content || "");
      }
    }
  }

  useFocusEffect(
    React.useCallback(() => {
      init();
      return () => {};
    }, [memoId])
  );

  const handleContentSizeChange = (event: any) => {
    setInputHeight(event.nativeEvent.contentSize.height);
  };

  async function onSave() {
    await db.updateMemo(memoId, title, content);
    router.replace("/");
  }

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.containerBg }]} // 전체 배경색 적용
      contentContainerStyle={{ padding: 20 }}
    >
      <Text style={[styles.headerTitle, { color: theme.text }]}>메모 작성</Text>

      <View style={styles.inputGroup}>
        <Text style={[styles.label, { color: theme.text }]}>제목</Text>
        <TextInput
          style={[
            styles.input,
            {
              color: theme.text, // 입력 글자색
              backgroundColor: theme.inputBg, // 입력창 배경색
              borderColor: theme.border, // 테두리 색상
            },
          ]}
          placeholder="제목을 입력하세요"
          placeholderTextColor={theme.placeholder} // 힌트 글자색
          value={title} // DB에서 불러온 값 표시를 위해 value 추가
          onChangeText={setTitle}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={[styles.label, { color: theme.text }]}>내용</Text>
        <TextInput
          placeholder="내용을 입력하세요..."
          placeholderTextColor={theme.placeholder}
          multiline={true}
          value={content} // DB에서 불러온 값 표시를 위해 value 추가
          onContentSizeChange={handleContentSizeChange}
          onChangeText={setContent}
          style={[
            styles.input,
            {
              color: theme.text,
              backgroundColor: theme.inputBg,
              borderColor: theme.border,
              height: Math.max(120, inputHeight), // 기본 높이를 조금 더 시원하게(120) 늘림
              textAlignVertical: "top", // 안드로이드 멀티라인 정렬 필수
            },
          ]}
        />
      </View>

      <View style={styles.buttonContainer}>
        <Button title="저장하기" onPress={onSave} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    marginTop: 10,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 8,
    opacity: 0.8,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8, // 테두리를 둥글게
    padding: 12, // 안쪽 여백을 넉넉하게
    fontSize: 16,
  },
  buttonContainer: {
    marginTop: 10,
    marginBottom: 40,
  },
});
