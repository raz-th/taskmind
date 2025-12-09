import Checkbox from "expo-checkbox";
import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Pressable, ScrollView } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Calendar } from "react-native-calendars";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function CalendarScreen() {
  const [tasks, setTasks] = useState([]);
  const [toshow, setToShow] = useState(null);
  const markedDates = () => {
    const marks = {};
    tasks.forEach((task) => {
      marks[task.date] = { ...(marks[task.date] || {}), marked: true, dotColor: "red" };
    });
    if (toshow) {
      marks[toshow] = { ...(marks[toshow] || {}), selected: true, selectedColor: "#4d7ab7" };
    }
    return marks;
  };

  const todayString = () => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    const dd = String(today.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  };

  const STORAGE_KEY = "@taskmind_tasks";

  useEffect(() => {
    const todayStr = todayString();
    setToShow(todayStr);
    (async () => {
      try {
        const json = await AsyncStorage.getItem(STORAGE_KEY);
        if (json) {
          const tasksBefore = JSON.parse(json);
          const newTasks = [];
          tasksBefore.forEach((newTask) => {
            let found = false;
            const day = newTask.day;
            const title = newTask.title;
            if (!day) return;
            const existing = newTasks.find((t) => t.date === day);
            if (existing){
                existing.list.push(title);
            }else{
                newTasks.push({date: day, list: [title]});
            }
            
          });
          setTasks(newTasks);
          console.log(json);
        }
      } catch (e) {
        console.warn("Failed to load notes", e);
      }
    })();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.helloText}>Calendar</Text>

      <Calendar
        style={styles.card}
        onDayPress={(date) => setToShow(date.dateString)}
        markedDates={markedDates()}
      />
      {toshow && (
        <View style={styles.card}>
          <Text style={{ fontSize: 20, marginBottom: 10 }}>
            Tasks for {toshow===todayString()?"today":toshow}
          </Text>
          {tasks.filter((t) => t.date === toshow).length > 0 ? (
            tasks
              .filter((t) => t.date === toshow)[0]
              .list.map((task, index) => (
                <View key={index} style={styles.taskCont}>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 10,
                    }}
                  >
                    <Checkbox
                      color={"#000"}
                      value={false}
                      style={styles.checkbox}
                    />
                    <Text>{task}</Text>
                  </View>
                </View>
              ))
          ) : (
            <Text>
              {todayString() === toshow
                ? "No tasks for today."
                : "No tasks for this day."}
            </Text>
          )}
        </View>
      )}
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
});
