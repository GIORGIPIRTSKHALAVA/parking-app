import { useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  StyleSheet,
  Text,
  View,
} from "react-native";

const { height } = Dimensions.get("window");
const ESP_IP = "http://192.168.4.1";

export default function App() {
  const [status, setStatus] = useState("Free");
  const statusRef = useRef("Free");
  const carY = useRef(new Animated.Value(height)).current;

  const animateCarIn = () => {
    carY.setValue(height);
    Animated.timing(carY, {
      toValue: 180,
      duration: 2000,
      useNativeDriver: true,
    }).start();
  };

  const animateCarOut = () => {
    Animated.timing(carY, {
      toValue: height,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  };

  const fetchStatus = async () => {
    try {
      const res = await fetch(ESP_IP);
      const text = await res.text();
      const match = text.match(/Status:\s*(Free|Occupied)/);

      if (match) {
        const newStatus = match[1];

        if (newStatus !== statusRef.current) {
          statusRef.current = newStatus;
          setStatus(newStatus);

          if (newStatus === "Occupied") {
            animateCarIn();
          } else {
            animateCarOut();
          }
        }
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchStatus();
    const interval = setInterval(fetchStatus, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: status === "Occupied" ? "#3b0000" : "#003b00",
        },
      ]}
    >
      <Text style={styles.title}>🚗 Smart Parking System</Text>

      {/* Parking Area */}
      <View style={styles.parkingArea}>
        <View style={styles.parkingSpace} />

        <Animated.Image
          source={require("./assets/car.png")}
          style={[styles.car, { transform: [{ translateY: carY }] }]}
          resizeMode="contain"
        />
      </View>

      <Text
        style={[
          styles.status,
          { color: status === "Occupied" ? "red" : "lime" },
        ]}
      >
        {status}
      </Text>

      <Text style={styles.sub}>
        {status === "Occupied" ? "Parking NOT Available" : "Parking Available"}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "white",
    marginBottom: 20,
  },
  parkingArea: {
    width: 150,
    height: 350,
    justifyContent: "flex-start",
    alignItems: "center",
    marginBottom: 40,
  },
  parkingSpace: {
    position: "absolute",
    top: 170,
    width: 90,
    height: 170,
    borderWidth: 4,
    borderColor: "white",
    borderRadius: 10,
    borderStyle: "dashed",
  },
  car: {
    position: "absolute",
    width: 200,
    height: 160,
  },
  status: {
    fontSize: 48,
    fontWeight: "bold",
  },
  sub: {
    fontSize: 20,
    color: "white",
    marginTop: 15,
  },
});