import React, {useState, Component, useEffect} from "react";
import {
  StyleSheet,
  ImageBackground,
  Dimensions,
  StatusBar,
  KeyboardAvoidingView, 
  TouchableOpacity,
  SafeAreaView,
  View,
} from "react-native";

import { List, RadioButton } from 'react-native-paper';
import * as SecureStore from "expo-secure-store";


import { Block, Checkbox, Text, theme } from "galio-framework";

import { Images, argonTheme } from "../constants";
import { Button, Select, Icon, Input, Header, Switch } from "../components/";


const { width, height } = Dimensions.get("screen");


const Elements = (props) => {
  const { navigation } = props;
  
  const [g, setG]= useState("0")  
  const [r, setR]= useState("0")
  const [b, setB]= useState("0")
  const [a, setA]= useState("0")
  const [s, setS]= useState("0")
  const [tmf, setTMF]= useState("0.0")

  const goDemo = async()=>{              
    const data= JSON.parse(await SecureStore.getItemAsync("metadata"));
    SecureStore.setItemAsync("metadata",  JSON.stringify(
      { 
        date: new Date(),
        dni:  data.dni,   
        sexo: data.sexo,
        edad: data.edad,
        diagnostico: data.diagnostico,
        grbas:{
          g: g,
          r: r,
          b: b,
          a: a,
          s: s
        },
        tmf: tmf

      }
    ));  
    console.log("meta",await SecureStore.getItemAsync("metadata"));
    navigation.navigate("Demo");   
    
  }

  return (   
    <Block flex middle>
      
      <ImageBackground
        source={Images.RegisterBackground}
        style={{ width, height, zIndex: 1 }}
      >
      <Block safe flex middle>
        <Block style={styles.registerContainer}>
          <Block flex={0.10} middle style={styles.socialConnect}>
            <Text color={argonTheme.COLORS.PRIMARY} size={22}>
              GRBAS
            </Text>
          </Block>
          <Block flex>
            <Block flex={0.03} middle>
            </Block>
            <Block flex center>
              <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior="padding"
                enabled
              >
                <Block  width={width * 0.75} style={{ marginBottom: 15 }}>                
                  <RadioButton.Group row  onValueChange={newValue => setG(newValue)} value={g}>
                      <Text>Grade:</Text>
                  
                        <Block left>
                          <Text size={16} color={argonTheme.COLORS.PRIMARY}>  0</Text>
                          <RadioButton value="0" />
                        </Block>
                        <Block  center style={{ marginTop: -55, marginRight:85 }}>
                          <Text size={16} color={argonTheme.COLORS.PRIMARY}>  1</Text>
                          <RadioButton value="1" />
                        </Block> 
                        <Block  center style={{ marginTop: -55, marginRight:-85 }}>
                          <Text size={16} color={argonTheme.COLORS.PRIMARY}>  2</Text>
                          <RadioButton value="2" />
                        </Block> 
                        <Block  right style={{ marginTop: -60 }}>
                          <Text size={16} color={argonTheme.COLORS.PRIMARY}>  3</Text>
                          <RadioButton value="3" />
                        </Block>  
                  </RadioButton.Group>                  
                </Block>  

                 <Block  width={width * 0.75} style={{ marginBottom: 15 }}>                
                  <RadioButton.Group row  onValueChange={newValue => setR(newValue)} value={r}>
                  <Text>Roughness:</Text>
                        <Block left>
                          <Text size={16} color={argonTheme.COLORS.PRIMARY}>  0</Text>
                          <RadioButton value="0" />
                        </Block>
                        <Block  center style={{ marginTop: -55, marginRight:85 }}>
                          <Text size={16} color={argonTheme.COLORS.PRIMARY}>  1</Text>
                          <RadioButton value="1" />
                        </Block> 
                        <Block  center style={{ marginTop: -55, marginRight:-85 }}>
                          <Text size={16} color={argonTheme.COLORS.PRIMARY}>  2</Text>
                          <RadioButton value="2" />
                        </Block> 
                        <Block  right style={{ marginTop: -60 }}>
                          <Text size={16} color={argonTheme.COLORS.PRIMARY}>  3</Text>
                          <RadioButton value="3" />
                        </Block>  
                  </RadioButton.Group>                  
                </Block>   

                 <Block  width={width * 0.75} style={{ marginBottom: 15 }}>                
                  <RadioButton.Group row  onValueChange={newValue => setB(newValue)} value={b}>
                  <Text>Breathy:</Text>
                        <Block left>
                          <Text size={16} color={argonTheme.COLORS.PRIMARY}>  0</Text>
                          <RadioButton value="0" />
                        </Block>
                        <Block  center style={{ marginTop: -55, marginRight:85 }}>
                          <Text size={16} color={argonTheme.COLORS.PRIMARY}>  1</Text>
                          <RadioButton value="1" />
                        </Block> 
                        <Block  center style={{ marginTop: -55, marginRight:-85 }}>
                          <Text size={16} color={argonTheme.COLORS.PRIMARY}>  2</Text>
                          <RadioButton value="2" />
                        </Block> 
                        <Block  right style={{ marginTop: -60 }}>
                          <Text size={16} color={argonTheme.COLORS.PRIMARY}>  3</Text>
                          <RadioButton value="3" />
                        </Block>  
                  </RadioButton.Group>                  
                </Block> 

                 <Block  width={width * 0.75} style={{ marginBottom: 15 }}>                
                  <RadioButton.Group row  onValueChange={newValue => setA(newValue)} value={a}>
                  <Text>Asthenic:</Text>
                        <Block left>
                          <Text size={16} color={argonTheme.COLORS.PRIMARY}>  0</Text>
                          <RadioButton value="0" />
                        </Block>
                        <Block  center style={{ marginTop: -55, marginRight:85 }}>
                          <Text size={16} color={argonTheme.COLORS.PRIMARY}>  1</Text>
                          <RadioButton value="1" />
                        </Block> 
                        <Block  center style={{ marginTop: -55, marginRight:-85 }}>
                          <Text size={16} color={argonTheme.COLORS.PRIMARY}>  2</Text>
                          <RadioButton value="2" />
                        </Block> 
                        <Block  right style={{ marginTop: -60 }}>
                          <Text size={16} color={argonTheme.COLORS.PRIMARY}>  3</Text>
                          <RadioButton value="3" />
                        </Block>  
                  </RadioButton.Group>                  
                </Block> 

                <Block  width={width * 0.75} style={{ marginBottom: 15 }}>                
                  <RadioButton.Group row  onValueChange={newValue => setS(newValue)} value={s}>
                  <Text>Strain: </Text>
                        <Block left>
                          <Text size={16} color={argonTheme.COLORS.PRIMARY}>  0</Text>
                          <RadioButton value="0" />
                        </Block>
                        <Block  center style={{ marginTop: -55, marginRight:85 }}>
                          <Text size={16} color={argonTheme.COLORS.PRIMARY}>  1</Text>
                          <RadioButton value="1" />
                        </Block> 
                        <Block  center style={{ marginTop: -55, marginRight:-85 }}>
                          <Text size={16} color={argonTheme.COLORS.PRIMARY}>  2</Text>
                          <RadioButton value="2" />
                        </Block> 
                        <Block  right style={{ marginTop: -60 }}>
                          <Text size={16} color={argonTheme.COLORS.PRIMARY}>  3</Text>
                          <RadioButton value="3" />
                        </Block>  
                  </RadioButton.Group>                  
                </Block>                 
 
                <Block  width={width * 0.75} style={{ marginBottom: 15 }}>
                    <Text size={16} color={argonTheme.COLORS.PRIMARY}>                                            
                        TMF:
                        {" "}
                    </Text>                  
                    <Input
                      id="tmf"
                      borderless
                      placeholder="TMF (0.0)"
                      name="tmf"
                      onChangeText={(tmf) => setTMF(tmf)}     
                      keyboardType="numeric"               
                      iconContent={
                        <Icon
                          size={16}
                          color={argonTheme.COLORS.ICON}
                          name="g-check"
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
                    onPress={()=>goDemo()}                     
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
  plus: {
    position: "absolute",
    left: 15,
    top: 10,
  },
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
  inputIcons: {
    marginRight: 12
  },
 
});

export default Elements;
