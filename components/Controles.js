import React, { useState, useEffect } from "react";
import {
    Image,
    StyleSheet,
    Dimensions,
    TouchableOpacity
} from "react-native";
import { Block, theme } from "galio-framework";
import { Audio } from 'expo-av';
import { Images } from "../constants";

import useBaseURL from '../Hooks/useBaseURL';
import { Clock, startClock } from "react-native-reanimated";

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



    // useEffect = (() => {        
    // }, []);

    const startRecording = async () => {

        const { status, expires, permissions } = await Audio.requestPermissionsAsync();        
        if (status === "granted") {
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
        //console.log("Uploading " + uri);
        let apiUrl = baseURL + 'api/storeRecordFile';
        let uriParts = uri.split('.');
        let name = uri.split('/')[11];
        let type = "audio/" + uriParts[uriParts.length - 1];

        console.log(apiUrl);
        let formData = new FormData();
        formData.append('audio', {
            uri: uri,
            name: name,
            type
        });        
        await fetch(apiUrl, {
            method: 'POST',
            body: formData,
            header: {
                'content-type': 'multipart/form-data',
                'Access-Control-Allow-Origin':'*',
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
      },[]);

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