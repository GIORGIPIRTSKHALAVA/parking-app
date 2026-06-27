import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";

export default function App() {
  const [status, setStatus] = useState("Loading...");

  const ESP_IP = "http://192.168.4.1";

  const fetchStatus = async () => {
    try {
      const res = await fetch(ESP_IP);
      const text = await res.text();

      const match = text.match(/Status:\s*(Free|Occupied)/);

      if (match) {
        setStatus(match[1]);
      }
    } catch (err) {
      console.log("Error:", err);
    }
  };

  useEffect(() => {
    fetchStatus();
    const interval = setInterval(fetchStatus, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: status === "Occupied" ? "#3b0000" : "#003b00" },
      ]}
    >
      <Text style={styles.title}>🚗 Smart Parking System</Text>

      <Text
        style={[
          styles.status,
          { color: status === "Occupied" ? "red" : "lime" },
        ]}
      >
        {status}
      </Text>

      <Text style={styles.sub}>
        {status === "Occupied"
          ? "Parking NOT available"
          : "Parking AVAILABLE"}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "white",
    marginBottom: 30,
  },
  status: {
    fontSize: 50,
    fontWeight: "bold",
  },
  sub: {
    fontSize: 18,
    color: "white",
    marginTop: 20,
  },
});