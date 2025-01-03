import React from "react";
import { View, StyleSheet } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { appColors } from "../../Style/theme";
import { Text } from "./Text";

export const InfoCard = ({ style, children }) => {
  return (
    <View style={[styles.card, style]}>
      <View style={styles.content}>
        <Ionicons
          name="information-circle-sharp"
          size={20}
          style={{ marginRight: 10 }}
          color={
           appColors.infoCardActive.light
          }
        />
        {typeof children === "string" ? (
          <Text style={styles.text}>{children}</Text>
        ) : (
          children
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    width: "100%",
    borderWidth: 1,
    borderColor: appColors.infoCardActive.light,
    borderRadius: 10,
  },
  content: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "flex-start",
    margin: 15,
  },
  text: {
    flex: 1,
  },
});

