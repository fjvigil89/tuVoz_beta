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

import RNPickerSelect from 'react-native-picker-select';
import Modal from 'react-native-modal';
import { AutocompleteDropdown } from 'react-native-autocomplete-dropdown';

import base64 from 'react-native-base64'
import { List, RadioButton } from 'react-native-paper';
import * as SecureStore from "expo-secure-store";

import { Block, Checkbox, Text, theme } from "galio-framework";

import { Images, argonTheme } from "../constants";
import { Button, Select, Icon, Input, Header, Switch } from "../components/";

const { width, height } = Dimensions.get("screen");

const DemoLogin = (props) => {
  const { navigation } = props;
  
  const [visibleModal, setVisibleModal]= useState(null)  

  const [sexo, setSexo]= useState("Femenino")  
  const [edad, setEdad]= useState(0)
  const [dni, setDni]= useState("")
  const [diagnostico, setDiagnostico]= useState("Otros...")
  const [otros, setOtros]= useState("")
  const [detalles, setDetalles]= useState("")
  
  const [selectedItem, setSelectedItem] = useState(true);

  const data = [
    { label:"Otros...", value:"Otros..."},
    { label:"Disfonía psicogenica", value:"Disfonía psicogenica"},
    { label:"Disfonía por tension muscular", value:"Disfonía por tension muscular"},
    { label:"Disfonía por reflujo", value:"Disfonía por reflujo"},
    { label:"Disfonía de esfuerzo", value:"Disfonía de esfuerzo"},
    { label:"Disfonía espasmodica", value:"Disfonía espasmodica"},
    { label:"Nodulo en cuerda vocal", value:"Nodulo en cuerda vocal"},
    { label:"Quiste en cuerda vocal", value:"Quiste en cuerda vocal"},
    { label:"Surcus en cuerda vocal", value:"Surcus en cuerda vocal"},
    { label:"Parálisis de cuerda vocal", value:"Parálisis de cuerda vocal"},
    { label:"Papiloma", value:"Papiloma"},
    { label:"Hiato", value:"Hiato"},
    { label:"Polipos", value:"Polipos"},
    { label:"Leocuplasia", value:"Leocuplasia"},
    { label:"Laringitis Crónica", value:"Laringitis Crónica"},
    { label:"Edema de Reinke", value:"Edema de Reinke"},
  ];
  
  const _renderButton = (text, onPress) => (
    <>    
    <TouchableOpacity onPress={onPress}>      
      
      <View style={styles.button} >
        <Text>{text}</Text>
      </View>
    </TouchableOpacity>
    </>
  );

  const _renderModalContent = () => (    
    <View style={styles.modalContent}>
      <TouchableOpacity style={styles.close} left onPress={() => setVisibleModal(null)}>
        <View>
        <Text>X</Text>
        </View>
      </TouchableOpacity>      
      <Text>Quiere agregar GRBAS!</Text>
      
      {_renderButton('No', () => goDemo())}
      {_renderButton('Si', () => goGRABAS())}
      
    </View>
  );  

  const goGRABAS = async()=>{     
    setVisibleModal(null);        
    
    SecureStore.setItemAsync("metadata",  JSON.stringify(
      { 
        date: new Date(),
        dni:  base64.encode(dni),   
        sexo: sexo.toUpperCase(),
        edad: edad,
        diagnostico: selectedItem ? otros.toUpperCase() : diagnostico.toUpperCase(),
        detalles: detalles.toUpperCase()         
      }
    )); 
    navigation.navigate("Elements"); 
   };
  const goDemo = async()=>{
    setVisibleModal(null);   
    SecureStore.setItemAsync("metadata",  JSON.stringify(
      { 
        date: new Date(),
        dni:  base64.encode(dni),   
        sexo: sexo.toUpperCase(),
        edad: edad,
        diagnostico: selectedItem ? otros.toUpperCase() : diagnostico.toUpperCase(), 
        detalles: detalles.toUpperCase(),    
      }
    ));            
     
    navigation.navigate("Demo");   
  }

  const handleDiagnostico = (item) => {        
    setDiagnostico(item);
    setSelectedItem(false); 
    if (item === "Otros...") {
      setSelectedItem(true); 
    }
    
  }

  useEffect(()=>{                            
    //document.getElementById("input1").value = "";
  },[]);

  return (   
    <Block flex middle>
      
      <ImageBackground
        source={Images.RegisterBackground}
        style={{ width, height, zIndex: 1 }}
      >
      <Block safe flex middle>
        <Block style={styles.registerContainer}>
          <Block flex={0.15} middle style={styles.socialConnect}>
            <Text color={argonTheme.COLORS.PRIMARY} size={22}>
              TuVoz
            </Text>
            
          </Block>
          <Block flex>
            <Block flex={0.07} middle>
            </Block>
            <Block flex center>
              <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior="padding"
                enabled
              >
                        
                  <RadioButton.Group row  onValueChange={newValue => setSexo(newValue)} value={sexo}>
                        <Block left>
                          <Text size={16} color={argonTheme.COLORS.PRIMARY}>  Masculino</Text>
                          <RadioButton value="Masculino" />
                        </Block>

                        <Block  right style={{ marginTop: -55, marginBottom: 15 }}>
                          <Text size={16} color={argonTheme.COLORS.PRIMARY}>  Femenino</Text>
                          <RadioButton value="Femenino" />
                        </Block>  
                  </RadioButton.Group>                  
                
                  <Block  width={width * 0.75} style={{ marginBottom: 15 }}>
                    <Text size={16} color={argonTheme.COLORS.PRIMARY}>                                            
                        DNI:
                        {" "}
                    </Text>                  
                    <Input
                      id="dni"
                      borderless
                      placeholder="DNI"
                      name="dni"
                      value={dni.toUpperCase()}
                      maxLength={9}
                      onChangeText={(dni) => setDni(dni)}                    
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

                <Block  width={width * 0.75} style={{ marginBottom: 15 }}>
                  <Text size={16} color={argonTheme.COLORS.PRIMARY}>                                            
                      Edad:
                      {" "}
                  </Text>
                  <Input
                    id="edad"
                    borderless
                    placeholder="Edad"
                    name="edad"
                    onChangeText={(edad) => setEdad(edad)}
                    keyboardType="numeric"
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
                
                <Block  width={width * 0.75} style={{ marginBottom: 15 }}>
                    <Text size={16} color={argonTheme.COLORS.PRIMARY}>                                            
                        Diagnóstico:
                        {" "}
                    </Text> 
                    <RNPickerSelect
                        onValueChange={(diagnostico) => handleDiagnostico(diagnostico)}
                        items={data}  
                        placeholder={{}}                                                
                        style={{
                          inputAndroid: {                            
                            color:"black"
                          },
                          iconContainer: {
                            top: 5,
                            right: 15,
                          },
                        }}
                        value={diagnostico}
                        useNativeAndroidPickerStyle={false}
                        InputAccessoryView={() => null}                        
                                                                     
                    />


                </Block>

                { selectedItem ? (
                  <Block  width={width * 0.75} style={{ marginBottom: 15 }}>
                      <Text size={16} color={argonTheme.COLORS.PRIMARY}>                                            
                          Otros:
                          {" "}
                      </Text> 

                      <Input
                      id="otros"
                      value={otros}
                      borderless
                      placeholder="Otros"
                      name="otros"
                      onChangeText={(otros) => setOtros(otros)}
                    />

                  </Block>
                ) : 
                (
                  <Block  width={width * 0.75} style={{ marginBottom: 15 }}>
                      <Text size={16} color={argonTheme.COLORS.PRIMARY}>                                            
                          Detalles:
                          {" "}
                      </Text> 

                      <Input
                      id="detalles"
                      value={detalles}
                      borderless
                      placeholder="Detalles"
                      name="detalles"
                      onChangeText={(detalles) => setDetalles(detalles)}
                    />

                  </Block>

                )
                }
                
                <Block middle>
                  <View style={styles.createButton}>
                    {_renderButton('Siguiente', () =>
                      setVisibleModal(1)
                    )}
                    <Modal isVisible={visibleModal === 1}>
                      {_renderModalContent()}
                    </Modal>        
                  </View>              
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
  modalContent: {
    backgroundColor: 'white',
    padding: 22,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },
  close:{ 
    marginRight:-300, 
    borderRadius:4, 
    backgroundColor:"lightblue",
    borderRadius: 4,
    borderColor: 'rgba(0, 0, 0, 0.1)',
    padding: 4,
    
  },
  bottomModal: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  button: {
    backgroundColor: 'lightblue',
    padding: 12,
    margin: 16,        
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
    borderColor: 'rgba(0, 0, 0, 0.1)',
    
  },
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
    //marginTop: 60,
    flex: 1,
    position: 'absolute',  
    top: 0,
    zIndex: 1
  },
  radioButton:{
      flex: 0,
      flexDirection: 'row'   
  }
});

export default DemoLogin;
