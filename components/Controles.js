import React, { useState, useEffect } from "react";
import {
    Image,
    StyleSheet,
    Dimensions,
    TouchableOpacity,
    PermissionsAndroid
} from "react-native";
import { Block, theme } from "galio-framework";
import { Audio } from 'expo-av';
import { Images } from "../constants";

import useBaseURL from '../Hooks/useBaseURL';


const { width } = Dimensions.get("screen");

const Controles = (props) => {

    //uso del Hooks para la url de la API
    const baseURL = useBaseURL(null);

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

                        console.log('write external stroage', grants);

                        if (
                            grants['android.permission.WRITE_EXTERNAL_STORAGE'] ===
                            PermissionsAndroid.RESULTS.GRANTED &&
                            grants['android.permission.READ_EXTERNAL_STORAGE'] ===
                            PermissionsAndroid.RESULTS.GRANTED &&
                            grants['android.permission.RECORD_AUDIO'] ===
                            PermissionsAndroid.RESULTS.GRANTED
                        ) {
                            console.log("Puedes usar la grabación de audio");
                        } else {
                            console.log("Todos los permisos fueron denegados");
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

        
        let code =  {
            isMeteringEnabled: true,
            android: {
              extension: '.flac',
              outputFormat: Audio.RECORDING_OPTION_ANDROID_OUTPUT_FORMAT_WEBM,
              audioEncoder: Audio.RECORDING_OPTION_ANDROID_AUDIO_ENCODER_AAC,
              sampleRate: 44100,
              numberOfChannels: 2,
              bitRate: 128000,
            },
            ios: {
              extension: '.caf',
              audioQuality: Audio.RECORDING_OPTION_IOS_AUDIO_QUALITY_MAX,
              sampleRate: 44100,
              numberOfChannels: 2,
              bitRate: 128000,
              linearPCMBitDepth: 16,
              linearPCMIsBigEndian: false,
              linearPCMIsFloat: false,
            },
          };
        
          
        await requestRecorAudioPermission();
        const status = await checkMicrophone();
        //console.log(status);
        if (status) {
            try {
                await Audio.setAudioModeAsync({
                    allowsRecordingIOS: true,
                    playsInSilentModeIOS: true,
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
            console.log(permissionResult)
        }

    }

    const stopRecording = async () => {
        console.log('Stopping recording..');
        await record.stopAndUnloadAsync();

        //hacer visible/oculto el boton de Grabar
        setShuldShowButomRecord(!shuldShowButomRecord);
        setshuldDeleteRecord(true);
        //setRecord(undefined);
    }

    const storeRecordFile = async () => {

        await uploadAudioAsync(record.getURI());
        await deleteRecordFile();

    }
    const deleteRecordFile = async () => {
        setRecord(undefined);
        setShuldShowButomRecord(!shuldShowButomRecord);
        setshuldDeleteRecord(false);
        setstartRecord(false);
    }

    const uploadAudioAsync = async (uri) => {
        alert(baseURL);
        //console.log("Uploading " + uri);
        let apiUrl = baseURL + 'api/storeRecordFile';
        let uriParts = uri.split('.');
        let name = uri.split('/')[11];
        let type = "audio/" + uriParts[uriParts.length - 1];
        let hash = name.split('recording')[1];

        let formData = new FormData();
        formData.append('audio', {
            uri: uri,
            name: name,
            type
        });
        formData.append('identificador', hash);
        await fetch(apiUrl, {
            method: 'POST',
            body: formData,
            header: {
                'content-type': 'multipart/form-data',
                'Access-Control-Allow-Origin': '*',
            },
        }).then(res => res.json())
            .catch(error => {
                console.log(error);
                alert(error);
            })
            .then(response => {
                console.log(response);
                alert(response.message);

            });


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

    useEffect(() => {
        //const timer = setTimeout(() => console.log("Hello, World!"), 1000);
        //return () => startClock();        
    }, []);

    const { navigation } = props;

    return (
        <Block flex space="between" style={styles.padded}>
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
                            <TouchableOpacity onPress={storeRecordFile}>
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