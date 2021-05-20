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

const { height, width } = Dimensions.get("screen");

import argonTheme from "../constants/Theme";
import Images from "../constants/Images";



const Onboarding = (props) => {

const [record, setRecord] = useState();
const recording = new Audio.Recording();

const startRecording = async() =>{
  let permissionResult = await Audio.requestPermissionsAsync();
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
  setRecord(undefined);    
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
                
              </Block>
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
  }
});

export default Onboarding;
