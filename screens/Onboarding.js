import React, {useState} from "react";
import {
  ImageBackground,
  Image,
  StyleSheet,
  StatusBar,
  Dimensions,  
} from "react-native";
import { Block, Button, Text, theme } from "galio-framework";
//import * as ImagePicker from 'expo-image-picker';
import { Audio } from 'expo-av';
//import * as FileSystem from 'expo-file-system';


import useBaseURL from '../Hooks/useBaseURL';
import Cookies from 'universal-cookie';
import axios from 'axios';

const { height, width } = Dimensions.get("screen");

import argonTheme from "../constants/Theme";
import Images from "../constants/Images";


const cookie = new Cookies();

const Onboarding = (props) => {

  //uso del Hooks para la url de la API
  const baseURL= useBaseURL(null);

const [record, setRecord] = useState();
const [shuldShowButomRecord, setShuldShowButomRecord] = useState(true);
const recording = new Audio.Recording();

const startRecording = async() =>{
  let permissionResult = await Audio.getPermissionsAsync();
  if (permissionResult.status === "granted") {        
    try {      
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });      
      
      await recording.prepareToRecordAsync(Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY);
      await recording.startAsync(); 
      setRecord(recording);
      
    } catch (err) {
      console.error('Failed to start recording', err);
    }
  }
  else{
    console.log(permissionResult)
  }
  
}

const stopRecording = async() => {
  console.log('Stopping recording..');  
  await record.stopAndUnloadAsync();
  const uri = record.getURI();   
  console.log('Recording stopped and stored at', uri);        
  
  //hacer visible/oculto el boton de Grabar
  setShuldShowButomRecord(!shuldShowButomRecord);
  
  
  //storeRecordFile(record);
  //setRecord(undefined);
  
}

const storeRecordFile = async()=>{
//baseURL+'api/storeRecordFile'  
setRecord(undefined);
setShuldShowButomRecord(!shuldShowButomRecord);

}

const lisentRecord = async()=>{
  const soundObject = new Audio.Sound();
  try {
    await soundObject.loadAsync({ uri: record.getURI() /* url for your audio file */ });
    soundObject.playAsync();
  } catch (e) {
    console.log('ERROR Loading Audio', e);
  }

}

  
 const { navigation } = props;

    return (
      <Block flex style={styles.container}>
        <StatusBar hidden />
        <Block flex center>
        <ImageBackground
            source={Images.Onboarding}
            style={{ height, width, zIndex: 1 }}
          />
        </Block>
        <Block center>
          <Image source={Images.LogoOnboarding} style={styles.logo} />
        </Block>
        <Block flex space="between" style={styles.padded}>
            <Block flex space="around" style={{ zIndex: 2 }}>
              <Block style={styles.title}>
                <Block>
                  <Text color="white" size={30}>
                    Mejora...
                  </Text>
                </Block>
                <Block>
                  <Text color="white" size={60}>
                    TuVoz
                  </Text>
                </Block>
                <Block style={styles.subTitle}>
                  <Text color="white" size={16}>
                    Siempre pensando en Usted
                  </Text>
                </Block>
              </Block>
              
                { shuldShowButomRecord ? (
                <Block center>
                  <Button                  
                    style={styles.button}
                    color={argonTheme.COLORS.SECONDARY}
                    //onPress={() => navigation.navigate("App")}                  
                    textStyle={{ color: argonTheme.COLORS.BLACK }}                 
                    onPress={record ? stopRecording : startRecording}
                  >        
                  {record ? 'Stop Recording' : 'Start Recording'}          
                  </Button> 
                </Block> ) : null
                }
              
              { !shuldShowButomRecord ? (
                <Block style= {styles.block_row}>
                  <Button
                    style={styles.button_lisent}
                    color={argonTheme.COLORS.SECONDARY}
                    //onPress={() => navigation.navigate("App")}                  
                    textStyle={{ color: argonTheme.COLORS.BLACK }}   
                    onPress={lisentRecord}                                
                  >        
                  Repriducir 
                  </Button>
                  
                  <Button
                    style={styles.button_lisent}
                    color={argonTheme.COLORS.SECONDARY}
                    onPress={storeRecordFile}                  
                    textStyle={{ color: argonTheme.COLORS.BLACK }}                                  
                  >        
                  Guardar
                  </Button>
                </Block> ) : null
              }
          </Block>
        </Block>
      </Block>
    );
  
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.COLORS.BLACK
  },
  padded: {
    paddingHorizontal: theme.SIZES.BASE * 2,
    position: "relative",
    bottom: theme.SIZES.BASE,
    zIndex: 2,
  },
  button: {
    width: width - theme.SIZES.BASE * 4,
    height: theme.SIZES.BASE * 3,
    shadowRadius: 0,
    shadowOpacity: 0
  },
  logo: {
    width: 200,
    height: 60,
    zIndex: 2,
    position: 'relative',
    marginTop: '-50%'
  },
  title: {
    marginTop:'-5%'
  },
  subTitle: {
    marginTop: 20
  },
  button_lisent:{
    width: width - theme.SIZES.BASE * 16,
    height: theme.SIZES.BASE * 3,
    shadowRadius: 0,
    shadowOpacity: 0,
    margin: 25
  },
  block_row:{    
    flexDirection: "row",
  }

});

export default Onboarding;
