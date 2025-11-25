import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import * as db from "../db/db";
import * as types from "../types/types";

export default function HomeScreen() {
  const [memos, setMemos] = useState<types.Memo[]>([]);
  const router = useRouter();

  async function init() {
    await db.initDB();
    let _memos = await db.getMemos();
    setMemos(_memos);
  }

  // 화면 포커스 될 때마다 DB 조회
  useFocusEffect(
    useCallback(() => {
      init();
    }, [])
  );

  async function onDetailScreen(memoId: number = 0) {
    console.log(`onDetailScreen memoid: `, memoId);
    router.push(`/MemoDetail?memoId=${memoId}`);
  }

  return (
    <View style={styles.container}>
      {/* 헤더 영역 */}
      <View style={styles.headerContainer}>
        <Text style={styles.headerTitle}>메모 리스트</Text>
      </View>

      {/* 리스트 영역 */}
      <FlatList
        data={memos}
        keyExtractor={(item) => item?.id?.toString() ?? ""}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => onDetailScreen(item?.id ?? 0)}>
            <View style={styles.itemContainer}>
              <View style={styles.itemHeader}>
                <Text style={styles.itemTitle}>{item?.title}</Text>
                <Text style={styles.itemDate}>{item?.date ?? ""}</Text>
              </View>
              {/* 내용 미리보기 등이 필요하면 여기에 추가 */}
            </View>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <Text style={styles.emptyText}>메모가 없습니다.</Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  headerContainer: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  itemContainer: {
    borderBottomWidth: 1,
    borderColor: "#eee",
    paddingVertical: 15,
  },
  itemHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 5,
  },
  itemTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
  },
  itemDate: {
    fontSize: 14,
    color: "#888",
  },
  emptyText: {
    textAlign: "center",
    marginTop: 50,
    fontSize: 16,
    color: "#999",
  },
});
