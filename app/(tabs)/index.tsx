import { FlatList, StyleSheet, Text, View } from "react-native";

import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import * as db from "../db/db";
import * as types from "../types/types";

export default function HomeScreen() {
  const [memos, setMemos] = useState<types.Memo[]>([]);

  async function init() {
    let _memos = await db.getMemos();
    setMemos(_memos);
  }

  // 화면 포커스 될 때마다 DB 조회
  useFocusEffect(
    useCallback(() => {
      init();
    }, [])
  );

  return (
    <View>
      <View>
        <Text>메모 리스트</Text>
      </View>
      <View>
        <FlatList
          data={memos}
          keyExtractor={(item) => item?.id?.toString() ?? ""}
          contentContainerStyle={{ padding: 20 }}
          renderItem={({ item }) => (
            <View
              style={{
                borderBottomWidth: 1,
                borderColor: "#eee",
                paddingVertical: 15,
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  marginBottom: 5,
                }}
              >
                <Text style={{ fontSize: 18, fontWeight: "bold" }}>
                  {item?.title}
                </Text>
                {/* 여기서 날짜 변환 한 줄로 처리 */}
                <Text style={{ color: "#888" }}>{item?.date ?? ""}</Text>
              </View>
            </View>
          )}
          ListEmptyComponent={
            <Text style={{ textAlign: "center", marginTop: 50, color: "#999" }}>
              메모가 없습니다.
            </Text>
          }
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: "absolute",
  },
});
