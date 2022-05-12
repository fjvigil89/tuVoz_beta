import React from "react";
import {
  StyleSheet,
  ImageBackground,
  Dimensions,
  StatusBar,
  KeyboardAvoidingView, 
  TextInput,
  CheckBox,
  View,
} from "react-native";

import { RadioButton } from 'react-native-paper';
import * as SecureStore from "expo-secure-store";

import { createStackNavigator } from "@react-navigation/stack";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { Block, Checkbox, Text, theme } from "galio-framework";
import { Button, Icon, Input } from "../components";
import { Images, argonTheme } from "../constants";
import { useState } from "react";

import useBaseURL from '../Hooks/useBaseURL';


const { width, height } = Dimensions.get("screen");

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

const DemoLogin = (props) => {

  
  //uso del Hooks para la url de la API
  const baseURL= useBaseURL(null);

  const [sexo, setSexo]= useState("Femenino")  
  const [edad, setEdad]= useState("")
  const [diagnostico, setDiagnostico]= useState("")
  
  const goDemo = async()=>{      
    SecureStore.setItemAsync("metadata",  JSON.stringify(
      {    
        sexo: sexo,
        edad: edad,
        diagnostico: diagnostico,         
      }
    ));            
    
    navigation.navigate("Demo");   
  }

  const { navigation } = props;
 
  return (   
    <Block flex middle>
    
    <ImageBackground
      source={Images.RegisterBackground}
      style={{ width, height, zIndex: 1 }}
    >
      <Block safe flex middle>
        <Block style={styles.registerContainer}>
          <Block flex={0.25} middle style={styles.socialConnect}>
            <Text color="#8898AA" size={12}>
              Sign up with
            </Text>
            <Block row style={{ marginTop: theme.SIZES.BASE }}>
              <Button style={{ ...styles.socialButtons, marginRight: 30 }}>
                <Block row>
                  <Icon
                    name="logo-github"
                    family="Ionicon"
                    size={14}
                    color={"black"}
                    style={{ marginTop: 2, marginRight: 5 }}
                  />
                  <Text style={styles.socialTextButtons}>GITHUB</Text>
                </Block>
              </Button>
              <Button style={styles.socialButtons}>
                <Block row>
                  <Icon
                    name="logo-google"
                    family="Ionicon"
                    size={14}
                    color={"black"}
                    style={{ marginTop: 2, marginRight: 5 }}
                  />
                  <Text style={styles.socialTextButtons}>GOOGLE</Text>
                </Block>
              </Button>
            </Block>
          </Block>
          <Block flex>
            <Block flex={0.17} middle>
              <Text color="#8898AA" size={12}>
                Or sign up the classic way
              </Text>
            </Block>
            <Block flex center>
              <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior="padding"
                enabled
              >
                <Block row width={width * 0.75} style={{ marginBottom: 15 }}>
                  <RadioButton.Group onValueChange={newValue => setSexo(newValue)} value={sexo}>
                    <View>
                      <Text>Masculino</Text>
                      <RadioButton value="Masculino" />
                    </View>
                    <View>
                      <Text>Femenino</Text>
                      <RadioButton value="Femenino" />
                    </View>
                  </RadioButton.Group>                  
                </Block>

                <Block row width={width * 0.75} style={{ marginBottom: 15 }}>
                  <Text size={22} color={argonTheme.COLORS.PRIMARY}>                                            
                      Edad:
                      {" "}
                  </Text>
                  <Input
                    style = {{right: -70 }}
                    borderless
                    placeholder="Edad"
                    name="edad"
                    onChangeText={(edad) => setEdad(edad)}
                    iconContent={
                      <Icon
                        size={16}
                        color={argonTheme.COLORS.ICON}
                        name="hat-3"
                        family="ArgonExtra"
                        style={styles.inputIcons}
                      />
                    }
                  />
                </Block>
                
                <Block row width={width * 0.75} style={{ marginBottom: 15 }}>
                  <Text size={22} color={argonTheme.COLORS.PRIMARY}>                                            
                      Diagnóstico:
                      {" "}
                  </Text>
                  <Input                    
                    borderless
                    placeholder="Diagnóstico"
                    name="diagnostico"
                    onChangeText={(diagnostico) => setDiagnostico(diagnostico)}
                    iconContent={
                      <Icon
                        size={16}
                        color={argonTheme.COLORS.ICON}
                        name="hat-3"
                        family="ArgonExtra"
                        style={styles.inputIcons}
                      />
                    }
                  />
                </Block>
                
                <Block middle>
                 <Button 
                    color="primary" 
                    style={styles.createButton} 
                    onPress={() => goDemo()}                     
                    >
                      <Text bold size={14} color={argonTheme.COLORS.WHITE}>
                        Siguiente
                      </Text>
                  </Button>                 
                </Block>
              </KeyboardAvoidingView>
            </Block>
          </Block>
        </Block>
      </Block>
    </ImageBackground>
  </Block>
     
         
  );
  
}

const styles = StyleSheet.create({
  registerContainer: {
    width: width * 0.9,
    height: height * 0.875,
    backgroundColor: "#F4F5F7",
    borderRadius: 4,
    shadowColor: argonTheme.COLORS.BLACK,
    shadowOffset: {
      width: 0,
      height: 4
    },
    shadowRadius: 8,
    shadowOpacity: 0.1,
    elevation: 1,
    overflow: "hidden"
  },
  socialConnect: {
    backgroundColor: argonTheme.COLORS.WHITE,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: "#8898AA"
  },
  socialButtons: {
    width: 120,
    height: 40,
    backgroundColor: "#fff",
    shadowColor: argonTheme.COLORS.BLACK,
    shadowOffset: {
      width: 0,
      height: 4
    },
    shadowRadius: 8,
    shadowOpacity: 0.1,
    elevation: 1
  },
  socialTextButtons: {
    color: argonTheme.COLORS.PRIMARY,
    fontWeight: "800",
    fontSize: 14
  },
  inputIcons: {
    marginRight: 12
  },
  passwordCheck: {
    paddingLeft: 15,
    paddingTop: 13,
    paddingBottom: 30
  },
  createButton: {
    width: width * 0.5,
    marginTop: 25
  }
});

export default DemoLogin;
