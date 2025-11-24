import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Button,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import * as db from "../db/db";

export default function MemoEdit() {
  const [inputHeight, setInputHeight] = useState(40); // 기본 높이 설정
  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<string>("");

  const queryString = useLocalSearchParams();
  const memoId = Number(queryString?.memoId ?? 0);
  const router = useRouter();

  async function init() {
    await db.initDB();
    if (memoId) {
      const memo = await db.getMemoById(memoId);
    }
  }

  useFocusEffect(
    React.useCallback(() => {
      init();
      return () => {};
    }, [])
  );

  // 내용 크기가 변경될 때 호출되는 함수
  const handleContentSizeChange = (event: any) => {
    // 새로운 내용 높이로 state를 업데이트합니다.
    setInputHeight(event.nativeEvent.contentSize.height);
  };

  async function onSave() {
    router.replace("/");
  }

  return (
    <ScrollView>
      <Text>메모 작성</Text>
      <View>
        <TextInput placeholder="제목" onChangeText={setTitle} />
      </View>
      <View>
        <TextInput
          placeholder="내용을 입력하세요..."
          multiline={true} // 필수
          onContentSizeChange={handleContentSizeChange}
          onChangeText={setContent}
          style={[styles.input, { height: Math.max(40, inputHeight) }]} // 최소 높이 40을 유지하면서, 내용 크기에 따라 높이 설정
        />
      </View>
      <View>
        <Button title="저장" onPress={onSave} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    // 부모 View의 스타일은 TextInput의 높이 조절에 영향을 주지 않도록 설정
    margin: 20,
  },
  input: {
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    fontSize: 16,
    // Android에서 텍스트가 위쪽에 정렬되도록 추가 (선택 사항)
    textAlignVertical: "top",
  },
});
