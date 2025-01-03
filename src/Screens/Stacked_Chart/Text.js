import * as React from "react";
import { StyleSheet, Text as _Text, } from "react-native";
import { appColors } from "../../Style/theme";

export const Text = (props) => {
  return <_Text {...props} style={[props.style, styles.text]} />;
};

const styles = StyleSheet.create({
  text: {
    color: appColors.text.light,
    $dark: {
      color: appColors.text.dark,
    },
  },
});
