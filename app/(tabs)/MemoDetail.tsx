import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import * as db from "../db/db";
import * as types from "../types/types";

export default function MemoDetail() {
  const [memo, setMemo] = useState<types.Memo>({});
  const queryString = useLocalSearchParams();
  const memoId = Number(queryString?.memoId ?? 0);
  const router = useRouter();

  async function init() {
    await db.initDB();
    let _memo = await db.getMemoById(memoId);
    if (_memo) {
      setMemo(_memo);
    }
  }

  // 화면 포커스 될 때마다 DB 조회
  useFocusEffect(
    useCallback(() => {
      init();
    }, [])
  );

  return (
    <ScrollView>
      <View>
        <Text>메모 상세 화면</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({});
