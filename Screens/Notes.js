import Checkbox from "expo-checkbox";
import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Pressable, ScrollView } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Modal, TextInput } from "react-native";
export default function NotesScreen() {
  const [notes, setNotes] = useState([]);

  const [modalVisible, setModalVisible] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");

  const STORAGE_KEY = "@taskmind_notes";

  useEffect(() => {
    // load saved notes on mount
    (async () => {
      try {
        const json = await AsyncStorage.getItem(STORAGE_KEY);
        if (json) {
          setNotes(JSON.parse(json));
        }
      } catch (e) {
        console.warn("Failed to load notes", e);
      }
    })();
  }, []);

  const persistNotes = async (nextNotes) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(nextNotes));
    } catch (e) {
      console.warn("Failed to save notes", e);
    }
  };

  const addNote = () => {
    if (!newTitle.trim() && !newContent.trim()) return;
    const next = [
      { title: newTitle || "Untitled", content: newContent },
      ...notes,
    ];
    setNotes(next);
    persistNotes(next);
    setNewTitle("");
    setNewContent("");
    setModalVisible(false);
  };

  const removeNote = (index) => {
    const next = notes.filter((_, i) => i !== index);
    setNotes(next);
    persistNotes(next);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.helloText}>Notes</Text>
      <View
        style={[
          styles.card,
          { flexDirection: "row", alignItems: "center", gap: 10 },
        ]}
      >
        <Pressable
          onPress={() => setModalVisible(true)}
          style={{ flexDirection: "row", alignItems: "center", gap: 10 }}
        >
          <Ionicons
            name="add-outline"
            size={24}
            color="#fff"
            style={{ padding: 5, backgroundColor: "#4d7ab7", borderRadius: 90 }}
          />
          <Text>New Note</Text>
        </Pressable>
      </View>

      <ScrollView>
        {notes.length > 0 ? notes.map((note, index) => (
          <View key={index} style={styles.card}>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Text style={{ fontSize: 20 }}>{note.title}</Text>
              <Pressable onPress={() => removeNote(index)}>
                <Text style={{ color: "#d00" }}>Delete</Text>
              </Pressable>
            </View>
            <Text>{note.content}</Text>
          </View>
        )):<Text style={{textAlign: 'center'}}>You don’t have any notes yet—let’s add your first one!</Text>}
      </ScrollView>

      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <Text style={{ fontSize: 18, fontWeight: "600", marginBottom: 8 }}>
              New Note
            </Text>
            <TextInput
              placeholder="Title"
              value={newTitle}
              onChangeText={setNewTitle}
              style={styles.input}
            />
            <TextInput
              placeholder="Content"
              value={newContent}
              onChangeText={setNewContent}
              style={[styles.input, { height: 100 }]}
              multiline
            />
            <View
              style={{
                flexDirection: "row",
                justifyContent: "flex-end",
                gap: 10,
              }}
            >
              <Pressable onPress={() => setModalVisible(false)}>
                <Text style={{ color: "#666" }}>Cancel</Text>
              </Pressable>
              <Pressable onPress={addNote}>
                <Text style={{ color: "#4d7ab7", fontWeight: "600" }}>
                  Save
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
    paddingTop: 100,
    // alignItems: 'center',
    // justifyContent: 'center',
  },
  helloText: {
    fontSize: 35,
    fontWeight: "bold",
  },
  card: {
    shadowColor: "#0000007a",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    backgroundColor: "#f9f9f9",
    borderRadius: 10,
    padding: 20,
    marginTop: 20,
  },
  taskCont: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 15,
    gap: 10,
  },
  checkbox: {
    borderRadius: 90,
  },
  bullet: {
    width: 5,
    height: 5,
    borderRadius: 8,
    backgroundColor: "#000",
    marginRight: 10,
  },
  noteText: {
    flex: 1,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.35)",
    justifyContent: "center",
    padding: 20,
  },
  modalCard: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: "#eee",
    padding: 8,
    borderRadius: 8,
    backgroundColor: "#fff",
    marginBottom: 8,
  },
});
