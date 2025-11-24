import { ScrollView, StyleSheet, Text, TextInput, View } from "react-native";

export default function MemoEdit() {
  return (
    <ScrollView>
      <Text>메모 작성</Text>
      <View>
        <TextInput placeholder="제목" />
      </View>
      <View>
        <TextInput placeholder="내용" multiline />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({});
