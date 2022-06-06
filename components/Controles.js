import React, { useState, useEffect } from "react";
import {
    Image,
    StyleSheet,
    Dimensions,
    TouchableOpacity,
    PermissionsAndroid,
    Text, 
    Button,
    
} from "react-native";

import { useNavigation } from '@react-navigation/native';

import { Block, theme } from "galio-framework";
import { Audio } from 'expo-av';
import { Images } from "../constants";

import useBaseURL from '../Hooks/useBaseURL';
import * as MediaLibrary from 'expo-media-library';

import AWS from 'aws-sdk';
import * as SecureStore from "expo-secure-store";



const s3Bucket= new AWS.S3({
    accessKeyId:"AKIA4RAX6HMDMSGCRHMF",
    secretAccessKey:"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",
    Bucket:"tuvoz-bucket",
    signatureVersion:"v4",
});

const { width } = Dimensions.get("screen");

const Controles = (props) => {

    //const { navigation } = props;
    //uso del Hooks para la url de la API
    const navigation = useNavigation(); 

    const [record, setRecord] = useState();
    const [shuldShowButomRecord, setShuldShowButomRecord] = useState(true);
    const [shuldDeleteRecord, setshuldDeleteRecord] = useState(false);
    const [startRecord, setstartRecord] = useState(false);

    const recording = new Audio.Recording();
    const soundObject = new Audio.Sound();


    const checkMicrophone = async () => {
        const result = await PermissionsAndroid.check(
            PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
            PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
            PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
        );
        return result;
    };

    const requestRecorAudioPermission = async () => {
        try {
            const status = await checkMicrophone();
            if (!status) {
                if (Platform.OS === 'android') {

                    const grants = await PermissionsAndroid.requestMultiple([
                        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
                        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
                        PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
                    ], {
                        title: "Necesarios!!",
                        message:
                            "la aplicación TuVoz necesita varios permisos" +
                            "para que puedas tomar un audio increíble",
                        //         buttonNeutral: "Pregúntame Luego",
                        //         buttonNegative: "Cancelar",
                        buttonPositive: "OK"
                    });

                    //console.log('write external stroage', grants);

                    if (
                        grants['android.permission.WRITE_EXTERNAL_STORAGE'] ===
                        PermissionsAndroid.RESULTS.GRANTED &&
                        grants['android.permission.READ_EXTERNAL_STORAGE'] ===
                        PermissionsAndroid.RESULTS.GRANTED &&
                        grants['android.permission.RECORD_AUDIO'] ===
                        PermissionsAndroid.RESULTS.GRANTED
                    ) {
                        //console.log("Puedes usar la grabación de audio");
                    } else {
                        //console.log("Todos los permisos fueron denegados");
                        return;
                    }

                }
            }

        } catch (err) {
            console.warn(err);
            return;
        }
    };


    const startRecording = async () => {

        await requestRecorAudioPermission();
        await MediaLibrary.requestPermissionsAsync();
        await Audio.requestPermissionsAsync();
        const status = await checkMicrophone();        
        if (status) {
            try {
                await Audio.setAudioModeAsync({
                    allowsRecordingIOS: true,
                    playsInSilentModeIOS: true,
                    // interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DO_NOT_MIX,
                    // staysActiveInBackground: true,
                    // interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DUCK_OTHERS,
                    // shouldDuckAndroid: true,
                    // playThroughEarpieceAndroid: true,
                });

                await recording.prepareToRecordAsync({
                    android: {
                        extension: ".m4a",
                        outputFormat: Audio.RECORDING_OPTION_ANDROID_OUTPUT_FORMAT_MPEG_4,
                        audioEncoder: Audio.RECORDING_OPTION_ANDROID_AUDIO_ENCODER_AAC,
                        sampleRate: 48000,
                        numberOfChannels: 1,
                        bitRate: 768000,
                    },
                    ios: {
                        extension: ".m4a",
                        audioQuality: Audio.RECORDING_OPTION_IOS_AUDIO_QUALITY_MAX,
                        sampleRate: 48000,
                        numberOfChannels: 1,
                        bitRate: 768000,
                        linearPCMBitDepth: 16,
                        linearPCMIsBigEndian: false,
                        linearPCMIsFloat: false,
                        allowsRecordingIOS: true,
                    },
                });
                await recording.startAsync();
                setRecord(recording);


            } catch (err) {
                console.error('Failed to start recording', err);
            }
        }
        else {
            //console.log(permissionResult)
        }  

    }

    const stopRecording = async () => {
        //console.log('Stopping recording..');
        await record.stopAndUnloadAsync();

        //hacer visible/oculto el boton de Grabar
        setShuldShowButomRecord(!shuldShowButomRecord);
        setshuldDeleteRecord(true);
        //setRecord(undefined);
    }

    const storeRecordFile = async (phrase) => {
        const assets = await MediaLibrary.createAssetAsync(record.getURI()); 
        
        await s3upload(assets, phrase);
        await deleteRecordFile(assets);
    }

    const s3upload = async(assets, phrase)=>{        
        s3_metadata(phrase);
        s3_audio(assets, phrase);
    }

    const s3_metadata = async(phrase)=>{        
        const data= JSON.parse(await SecureStore.getItemAsync("metadata"));
        SecureStore.setItemAsync("metadata",  JSON.stringify(
        { 
            date: new Date(),
            dni:  data.dni,   
            sexo: data.sexo,
            edad: data.edad,
            diagnostico: data.diagnostico,
            detalles: data.detalles,
            grbas:{
            g: data.g,
            r: data.r,
            b: data.b,
            a: data.a,
            s: data.s
            },
            tmf: data.tmf,
            audioId: phrase.id,
            audioName: phrase.name,

        }
        ));          
        let body = await SecureStore.getItemAsync("metadata");        
        const params={
            Bucket:"tuvoz-bucket",
            Key:data.dni+ "(" + phrase.id +").json",
            Body:body,            
            ContentType: "text/json"
        }
        
        s3Bucket.upload(params,(err, data)=>{
            if(err){
                //console.log("err",err);
            }else{
                //console.log("data", data);
            }
        });
        
        
    }
    
    const s3_audio = async (assets, phrase) => { 
        const data= JSON.parse(await SecureStore.getItemAsync("metadata"));
               
        let uriParts = assets.uri.split('.');
        let name = data.dni+ "(" + phrase.id +")";        
        let type = assets.mediaType+"/" + uriParts[uriParts.length - 1];
        let ext = "."+uriParts[uriParts.length - 1];

        const resp = await fetch(assets.uri);
        const body = await resp.blob();
        const params={
            Bucket:"tuvoz-bucket",
            Key:name+ext,
            Body:body,            
            ContentType: type
        }             
         
        s3Bucket.upload(params, function(err, data) {
            if (err) console.log("error",err); // an error occurred
            else     console.log("successful",data);           // successful response
          });
        
        handleNextPhrase();    
        
    }

    const deleteRecordFile = async (assets) => {
        setRecord(undefined);
        setShuldShowButomRecord(!shuldShowButomRecord);
        setshuldDeleteRecord(false);
        setstartRecord(false);
        await MediaLibrary.deleteAssetsAsync(assets);
    }

    const lisentRecord = async () => {
        try {
            await soundObject.loadAsync({ uri: record.getURI() });
            setstartRecord(!startRecord);
            setshuldDeleteRecord(true);
            soundObject.playAsync();
        } catch (e) {
            console.log('ERROR Loading Audio', e);
        }
    }
    const pauseRecord = async () => {
        try {
            setstartRecord(false);
        } catch (e) {
            console.log('ERROR Loading Audio', e);
        }

    }
    
    const phrase = [        
       {id:1, name:"Aaaaaaaaa",},
       {id:2, name:"Iiiiiiiii",},
       {id:3, name:"Uuuuuuuuu",},
       {id:4, name:"Érase un pastor que tenía un rebaño. ",},
       {id:5, name:"En el monte se aburría mucho.",},
       {id:6, name:"¡Que viene el lobo, socorro! gritó el pastor.",},
       {id:7, name:"Uno de ellos preguntó: ¿Dónde está el lobo?",},
       {id:8, name:"¡Socorro, el lobo se está comiendo a mis ovejas!",},
       {id:9, name:"El lobo se comió todo el rebaño",},
       {id:10, name:"En boca del mentiroso, lo cierto se hace dudoso."},
      ];
    
    const [current, setCurrent] = useState(phrase[0]);
   
    const handleNextPhrase = async () => {
    
        const aux = phrase.map((item, index) => {                                        
            if (item.id === current.id) {                
                setCurrent(phrase[index + 1]);
            }                      
            return phrase[index + 1];
        });
    };

    return current ? (
        <Block flex space="between" style={styles.padded}>
            <Block flex={0.25} middle space="around" style={{ zIndex: 2 }}>
                <Block justify>
                <Text style={styles.subTitle}>{current.name} </Text>
                </Block>
            </Block>

            <Block flex space="around" style={{ zIndex: 2 }}>
                <Block center style={styles.block_row}>
                    <Block style={styles.play_pause}>
                        {!shuldShowButomRecord ?
                            <TouchableOpacity onPress={lisentRecord}>
                                <Image
                                    style={styles.play_pause}
                                    source={Images.play}
                                />
                            </TouchableOpacity> : null
                        }
                    </Block>
                    <Block style={styles.recorder_stop}>
                        {!shuldDeleteRecord ?
                            <TouchableOpacity onPress={record ? stopRecording : startRecording}>
                                <Image
                                    style={styles.recorder}
                                    source={record ? Images.stop : Images.recorder}
                                />
                            </TouchableOpacity>
                            :
                            <TouchableOpacity onPress={deleteRecordFile}>
                                <Image
                                    style={styles.stop}
                                    source={Images.trash}
                                />
                            </TouchableOpacity>
                        }
                    </Block>
                    <Block style={styles.send}>
                        {!shuldShowButomRecord ?
                            <TouchableOpacity onPress={()=>storeRecordFile(current)}>
                                <Image
                                    style={styles.send}
                                    source={Images.send}
                                />
                            </TouchableOpacity> : null
                        }
                    </Block>
                </Block>
            </Block>
        </Block>
    ): 
    (
        <Block flex space="between" style={styles.padded}>
            <Block flex={0.25} middle space="around" style={{ zIndex: 2 }}>
                <Block justify>
                <Text style={styles.subTitle}>{current} </Text>
                </Block>
            </Block>
 
            <Block flex space="around" style={{ zIndex: 2 }}>
                <Button
                    onPress={() => navigation.navigate('DemoLogin')}
                    title="Inicio"
                />
            </Block>
        </Block>
    ); 

}

const styles = StyleSheet.create({
    container: {
        backgroundColor: theme.COLORS.BLACK
    },
    subTitle: {        
        width: 300,
        height: 400,
        color: "#fff",
        fontSize: 35,
        textAlign: "center",
        marginTop:20,
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
    recorder: {
        width: 150,
        height: 150,
        margin: 20,
        marginLeft: 1,
    },
    stop: {
        width: 80,
        height: 80,
        margin: 20,
        marginTop: 100,
        marginRight: 55,
        marginLeft: 40,

    },
    play_pause: {
        width: 80,
        height: 60,
        marginTop: 45,

    },
    send: {
        width: 70,
        height: 60,
        marginTop: 45,
        marginLeft: -5
    },
    block_row: {
        flexDirection: "row",
        marginBottom: 45,
    }

});

export default Controles;
