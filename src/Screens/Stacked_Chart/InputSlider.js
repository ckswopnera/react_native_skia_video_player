import Slider from "@react-native-community/slider"
import * as React from "react"
import { View, Platform } from "react-native"
import { Text } from "./Text"
import { appColors } from "../../Style/theme"

export const InputSlider = ({
  label,
  maxValue,
  minValue,
  step,
  value,
  onChange
}) => (
  <View style={{ marginVertical: 10 }}>
    <Text style={{ fontWeight: "bold" }}>{label}</Text>
    <View
      style={{
        width: "100%",
        flexDirection: "row",
        justifyContent: "space-between"
      }}
    >
      <Slider
        onResponderGrant={() => Platform.select({ android: true, ios: false })}
        minimumTrackTintColor={appColors.tint}
        style={{ width: "90%", height: 40 }}
        minimumValue={minValue}
        maximumValue={maxValue}
        step={step}
        value={value}
        onValueChange={onChange}
      />
      <Text style={{ alignSelf: "center" }}>
        {value % 1 === 0 ? value : value.toFixed(1)}
      </Text>
    </View>
  </View>
)
