import React from "react";
import { ScrollView, StyleSheet, Dimensions, TouchableOpacity } from "react-native";
// Galio components
import { Block, Text, Button as GaButton, theme } from "galio-framework";
// Argon themed components
import { argonTheme, tabs } from "../constants/";
import { Button, Select, Icon, Input, Header, Switch } from "../components/";

const { width } = Dimensions.get("screen");

class Elements extends React.Component {

  renderInputs = () => {
    return (
      <Block flex style={styles.group}>
        <Text bold size={16} style={styles.title}>
          Inputs
        </Text>
        <Block style={{ paddingHorizontal: theme.SIZES.BASE }}>
          <Input right placeholder="Regular" iconContent={<Block />} />
        </Block>
        <Block style={{ paddingHorizontal: theme.SIZES.BASE }}>
          <Input
            right
            placeholder="Regular Custom"
            style={{
              borderColor: argonTheme.COLORS.INFO,
              borderRadius: 4,
              backgroundColor: "#fff"
            }}
            iconContent={<Block />}
          />
        </Block>
        <Block style={{ paddingHorizontal: theme.SIZES.BASE }}>
          <Input
            placeholder="Icon left"
            iconContent={
              <Icon
                size={11}
                style={{ marginRight: 10 }}
                color={argonTheme.COLORS.ICON}
                name="search-zoom-in"
                family="ArgonExtra"
              />
            }
          />
        </Block>
        <Block style={{ paddingHorizontal: theme.SIZES.BASE }}>
          <Input
            right
            placeholder="Icon Right"
            iconContent={
              <Icon
                size={11}
                color={argonTheme.COLORS.ICON}
                name="search-zoom-in"
                family="ArgonExtra"
              />
            }
          />
        </Block>
        <Block style={{ paddingHorizontal: theme.SIZES.BASE }}>
          <Input
            success
            right
            placeholder="Success"
            iconContent={
              <Block
                middle
                style={{
                  width: 20,
                  height: 20,
                  borderRadius: 10,
                  backgroundColor: argonTheme.COLORS.INPUT_SUCCESS
                }}
              >
                <Icon
                  size={11}
                  color={argonTheme.COLORS.ICON}
                  name="g-check"
                  family="ArgonExtra"
                />
              </Block>
            }
          />
        </Block>
        <Block style={{ paddingHorizontal: theme.SIZES.BASE }}>
          <Input
            error
            right
            placeholder="Error Input"
            iconContent={
              <Block
                middle
                style={{
                  width: 20,
                  height: 20,
                  borderRadius: 10,
                  backgroundColor: argonTheme.COLORS.INPUT_ERROR
                }}
              >
                <Icon
                  size={11}
                  color={argonTheme.COLORS.ICON}
                  name="support"
                  family="ArgonExtra"
                />
              </Block>
            }
          />
        </Block>
      </Block>
    );
  };

  render() {
    return (
      <Block flex center>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 30, width }}>
          
          {this.renderInputs()}
        </ScrollView>
      </Block>
    );
  }
}

const styles = StyleSheet.create({
  title: {
    paddingBottom: theme.SIZES.BASE,
    paddingHorizontal: theme.SIZES.BASE * 2,
    marginTop: 44,
    color: argonTheme.COLORS.HEADER
  },
  group: {
    paddingTop: theme.SIZES.BASE * 2
  },
  shadow: {
    shadowColor: "black",
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    shadowOpacity: 0.2,
    elevation: 2
  },
  button: {
    marginBottom: theme.SIZES.BASE,
    width: width - theme.SIZES.BASE * 2
  },
  optionsButton: {
    width: "auto",
    height: 34,
    paddingHorizontal: theme.SIZES.BASE,
    paddingVertical: 10
  },
  input: {
    borderBottomWidth: 1
  },
  inputDefault: {
    borderBottomColor: argonTheme.COLORS.PLACEHOLDER
  },
  inputTheme: {
    borderBottomColor: argonTheme.COLORS.PRIMARY
  },
  inputInfo: {
    borderBottomColor: argonTheme.COLORS.INFO
  },
  inputSuccess: {
    borderBottomColor: argonTheme.COLORS.SUCCESS
  },
  inputWarning: {
    borderBottomColor: argonTheme.COLORS.WARNING
  },
  inputDanger: {
    borderBottomColor: argonTheme.COLORS.ERROR
  },
  social: {
    width: theme.SIZES.BASE * 3.5,
    height: theme.SIZES.BASE * 3.5,
    borderRadius: theme.SIZES.BASE * 1.75,
    justifyContent: "center"
  },
});

export default Elements;