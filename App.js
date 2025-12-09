import { NavigationContainer, useNavigation } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "./Screens/Home";
import {
  Pressable,
  StyleSheet,
  Text,
  View,
  Animated,
  TextInput,
  Button,
} from "react-native";
import Entypo from "@expo/vector-icons/Entypo";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import TasksScreen from "./Screens/Tasks";
import { useEffect, useState, useRef } from "react";
import { MaterialIcons } from "@expo/vector-icons";
import NotesScreen from "./Screens/Notes";
import CalendarScreen from "./Screens/Calendar";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Stack = createNativeStackNavigator();

function RootStack({ anim }) {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: anim,
      }}
    >
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Tasks" component={TasksScreen} />
      <Stack.Screen name="Notes" component={NotesScreen} />
      <Stack.Screen name="Calendar" component={CalendarScreen} />
    </Stack.Navigator>
  );
}

const STORAGE_KEY = "@taskmind_first_time";

const removeName = async () => {
  try {
    await AsyncStorage.removeItem(STORAGE_KEY);
  } catch (e) {
    console.warn("Failed to save notes", e);
  }
};

function NavBar({ setAnim }) {
  const nav = useNavigation();
  const [selected, setSelected] = useState(0);
  return (
    <View style={style.nav}>
      <Pressable
        onPress={() => {
          nav.navigate("Home");
          setAnim(0 > selected ? "slide_from_right" : "slide_from_left");
          setSelected(0);
        }}
      >
        <View style={[style.iconWrap, selected === 0 && style.selectedWrap]}>
          <Entypo
            name="home"
            size={20}
            color={selected === 0 ? "#fff" : "#000"}
          />
        </View>
      </Pressable>

      <Pressable
        onPress={() => {
          nav.navigate("Tasks");
          setAnim(1 > selected ? "slide_from_right" : "slide_from_left");
          setSelected(1);
        }}
      >
        <View style={[style.iconWrap, selected === 1 && style.selectedWrap]}>
          <FontAwesome5
            name="tasks"
            size={20}
            color={selected === 1 ? "#fff" : "#000"}
          />
        </View>
      </Pressable>

      <Pressable
        onPress={() => {
          nav.navigate("Notes");
          setAnim(2 > selected ? "slide_from_right" : "slide_from_left");
          setSelected(2);
        }}
      >
        <View style={[style.iconWrap, selected === 2 && style.selectedWrap]}>
          <MaterialIcons
            name="notes"
            size={20}
            color={selected === 2 ? "#fff" : "#000"}
          />
        </View>
      </Pressable>

      <Pressable
        onPress={() => {
          nav.navigate("Calendar");
          setAnim(3 > selected ? "slide_from_right" : "slide_from_left");
          setSelected(3);
        }}
      >
        <View style={[style.iconWrap, selected === 3 && style.selectedWrap]}>
          <Entypo
            name="calendar"
            size={20}
            color={selected === 3 ? "#fff" : "#000"}
          />
        </View>
      </Pressable>

      {/* <View style={style.iconWrap}>
        <FontAwesome name="user" size={20} color="#000" />
      </View> */}
    </View>
  );
}

export default function App() {
  const [firstTime, setFirstTime] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim2 = useRef(new Animated.Value(0)).current;
  const [welcomeText, setwelcomeText] = useState("Hello!");
  const [name, setName] = useState("");

  const [anim, setAnim] = useState("slide_from_right");
  // removeName()
  useEffect(() => {
    // load saved notes on mount
    (async () => {
      try {
        const json = await AsyncStorage.getItem(STORAGE_KEY);
        if (json) {
          setTasks(JSON.parse(json));
          console.log(json);
        } else {
          setFirstTime(true);
        }
      } catch (e) {
        console.warn("Failed to load notes", e);
      }
    })();
  }, []);

  function startApp() {
    setFirstTime(false);
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify({ name: name.trim() }));
  }

  useEffect(() => {
    if (firstTime) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }).start(() => {
        setTimeout(async () => {
          Animated.timing(fadeAnim, {
            toValue: 0,
            duration: 1000,
            useNativeDriver: true,
          }).start(async () => {
            setwelcomeText("Welcome to TaskMind!");
            setTimeout(() => {
              Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 1000,
                useNativeDriver: true,
              }).start(() => {
                setTimeout(() => {
                  Animated.timing(fadeAnim, {
                    toValue: 0,
                    duration: 1000,
                    useNativeDriver: true,
                  }).start(() => {
                    setwelcomeText("How should we call you?");
                    Animated.timing(fadeAnim, {
                      toValue: 1,
                      duration: 1000,
                      useNativeDriver: true,
                    }).start(() => {
                      Animated.timing(fadeAnim2, {
                        toValue: 1,
                        duration: 1000,
                        useNativeDriver: true,
                      }).start();
                    });
                  });
                }, 500);
              });
            }, 500);
          });
        }, 500);
      });
    }
  }, [firstTime]);

  if (firstTime)
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          padding: 20,
        }}
      >
        <Animated.Text
          style={{ fontSize: 50, opacity: fadeAnim, textAlign: "center" }}
        >
          {welcomeText}
        </Animated.Text>
        <Animated.View
          style={{
            width: "100%",
            marginTop: 20,
            flexDirection: "row",
            opacity: fadeAnim2,
            display:
              welcomeText === "How should we call you?" ? "flex" : "none",
          }}
        >
          <TextInput
            value={name}
            onChangeText={setName}
            style={style.input}
            placeholder="Your name..."
          />
          <Pressable
            onPress={() => {
              if (name.trim()) startApp();
            }}
          >
            <Text style={style.btn}>Get Started</Text>
          </Pressable>
        </Animated.View>
      </View>
    );
  else {
    return (
      <NavigationContainer>
        <RootStack anim={anim}/>
        <NavBar setAnim={setAnim}/>
      </NavigationContainer>
    );
  }
}

const style = StyleSheet.create({
  nav: {
    height: 60,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderColor: "#ddd",
    position: "relative",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: 90,
    alignItems: "center",
    justifyContent: "center",
  },
  selectedWrap: {
    backgroundColor: "#4d7ab7",
    borderRadius: 90,
  },
  input: {
    borderWidth: 1,
    borderColor: "#eee",
    padding: 8,
    borderRadius: 8,
    backgroundColor: "#fff",
    marginBottom: 8,
    width: "70%",
  },
  btn: {
    marginLeft: 10,
    backgroundColor: "#4d7ab7",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    color: "#fff",
  },
});
