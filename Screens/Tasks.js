import Checkbox from "expo-checkbox";
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Modal,
  TextInput,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Calendar } from "react-native-calendars";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function TasksScreen() {
  const [tasks, setTasks] = useState([]);

  const [modalVisible, setModalVisible] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [day, setDay] = useState(null);

  const onToggle = (index, newValue) => {
    setTasks((prev) =>
      prev.map((t, i) => (i === index ? { ...t, value: newValue } : t))
    );
  };
  const STORAGE_KEY = "@taskmind_tasks";

  useEffect(() => {
    // load saved notes on mount
    (async () => {
      try {
        const json = await AsyncStorage.getItem(STORAGE_KEY);
        if (json) {
          setTasks(JSON.parse(json));
          // console.log(json)
        }
      } catch (e) {
        console.warn("Failed to load notes", e);
      }
    })();
  }, []);


  const persistTasks = async (nextTasks) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(nextTasks));
    } catch (e) {
      console.warn("Failed to save notes", e);
    }
  };

  const addTask = () => {
    if (!newTitle.trim() && !day) return;
    const next = [{ title: newTitle || "Untitled", day: day }, ...tasks];
    setTasks(next);
    persistTasks(next);
    setNewTitle("");
    setDay(null);
    setModalVisible(false);
  };

  const removeTask = (index) => {
    const next = tasks.filter((_, i) => i !== index);
    setTasks(next);
    persistTasks(next);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.helloText}>Tasks</Text>
      <Pressable
        style={[
          styles.card,
          { flexDirection: "row", alignItems: "center", gap: 10 },
        ]}
        onPress={() => {
          setModalVisible(true);
          setDay(null);
          setNewTitle("");
        }}
      >
        <Ionicons
          name="add-outline"
          size={24}
          color="#fff"
          style={{ padding: 5, backgroundColor: "#4d7ab7", borderRadius: 90 }}
        />
        <Text>New Task</Text>
      </Pressable>
      <View style={styles.card}>
        <Text style={{ fontSize: 20 }}>Tasks</Text>
        {tasks.length > 0 ? tasks.map((task, index) => (
          <View key={index} style={styles.taskCont}>
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 10 }}
            >
              <Checkbox
                color={task.value ? "#4d7ab7" : "#000"}
                onValueChange={(v) => onToggle(index, v)}
                value={task.value}
                style={styles.checkbox}
              />
              <Text>{task.title}</Text>
            </View>
            <Pressable onPress={()=>removeTask(index)}>
              <Text style={{ color: "#d00" }}>Delete</Text>
            </Pressable>
          </View>
        )):<Text style={{textAlign: 'center', marginTop: 20}}>You don’t have any tasks yet—let’s add your first one!</Text>}
      </View>
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <Text style={{ fontSize: 18, fontWeight: "600", marginBottom: 8 }}>
              New Task
            </Text>
            <TextInput
              placeholder="Title"
              value={newTitle}
              onChangeText={setNewTitle}
              style={styles.input}
            />
            <Calendar
              onDayPress={(d) => setDay(d.dateString)}
              markedDates={{
                [day]: { selected: true, disableTouchEvent: true },
              }}
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
              <Pressable onPress={addTask}>
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
