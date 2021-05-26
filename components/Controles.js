import React, { useState, useEffect } from "react";
import {
    Image,
    StyleSheet,
    Dimensions,
    TouchableOpacity
} from "react-native";
import { Block, theme } from "galio-framework";
import { Audio } from 'expo-av';

import useBaseURL from '../Hooks/useBaseURL';

const { width } = Dimensions.get("screen");

import { Images } from "../constants";


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

        let formData = new FormData();
        formData.append('audio', {
            uri: uri,
            name: name,
            type
        });

        return await fetch(apiUrl, {
            method: 'POST',
            body: formData,
            header: {
                'content-type': 'multipart/form-data',
            },
        }).then(res => res.json())
            .catch(error => {
                alert(error)                
            })
            .then(response => {
                alert(response.message);
            });

    }


    const lisentRecord = async () => {
        try {
            await soundObject.loadAsync({ uri: record.getURI() });
            setstartRecord(!startRecord);
            setshuldDeleteRecord(!shuldDeleteRecord);
            soundObject.playAsync();
        } catch (e) {
            console.log('ERROR Loading Audio', e);
        }

    }

    const pauseRecord = async () => {
        try {
            // await soundObject.loadAsync({ uri: record.getURI()});           
            // soundObject.pauseRecord();
            setstartRecord(false);
        } catch (e) {
            console.log('ERROR Loading Audio', e);
        }

    }


    const { navigation } = props;

    return (
        <Block flex space="between" style={styles.padded}>
            <Block flex space="around" style={{ zIndex: 2 }}>
                <Block style={styles.block_row}>
                    <Block style={styles.play_pause}>
                        {!shuldShowButomRecord ?
                            <TouchableOpacity onPress={!startRecord ? lisentRecord : pauseRecord}>
                                <Image
                                    style={styles.play_pause}
                                    source={!startRecord ? Images.play : Images.pause}
                                />
                            </TouchableOpacity> : null
                        }
                    </Block>
                    <Block style={styles.recorder_stop}>
                        {!shuldDeleteRecord ?
                            <TouchableOpacity onPress={record ? stopRecording : startRecording}>
                                <Image
                                    style={styles.recorder_stop}
                                    source={record ? Images.stop : Images.recorder}
                                />
                            </TouchableOpacity>
                            :
                            <TouchableOpacity onPress={deleteRecordFile}>
                                <Image
                                    style={styles.recorder_stop}
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
    recorder_stop: {
        width: 150,
        height: 150,
        margin: 20,
        marginLeft: 1,
    },
    play_pause: {
        width: 80,
        height: 60,
        marginTop: 45,

    },
    send: {
        width: 80,
        height: 60,
        marginTop: 45,
        marginLeft: -10
    },
    block_row: {
        flexDirection: "row",
        marginBottom: 45,
    }

});

export default Controles;