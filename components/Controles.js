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
    accessKeyId:"AKIA4RAX6HMDBQ5MBKP7",
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

    const storeRecordFile = async () => {
        const assets = await MediaLibrary.createAssetAsync(record.getURI());  
        console.log(assets);              
        await s3upload(assets);
        await deleteRecordFile(assets);
    }

    const s3upload = async(assets)=>{        
        let uriParts = assets.uri.split('.');
        let name = assets.filename;
        let type = assets.mediaType+"/" + uriParts[uriParts.length - 1];
        let hash = name.split('.')[0];
        
        s3_metadata(hash);
        s3_audio(assets);
    }

    const s3_metadata = async(hash)=>{
        let body = await SecureStore.getItemAsync("metadata");
        const params={
            Bucket:"tuvoz-bucket",
            Key:hash+".json",
            Body:body,            
            ContentType: "json"
        }
        s3Bucket.upload(params,(err: any, data: any)=>{
            if(err){
                //console.log("err",err);
            }else{
                //console.log("data", data);
            }
        });
        
        
    }
    const s3_audio = async (assets) => {        
        let uriParts = assets.uri.split('.');
        let name = assets.filename;
        let type = assets.mediaType+"/" + uriParts[uriParts.length - 1];
        let hash = name.split('.')[0];

        let formData = new FormData();
        formData.append('audio', {
            uri: assets.uri,
            name: name,
            type
        });
        
        // send http request in a new thread (using native code)
        
        const body = new Blob([assets], {type: type});
        
        const params={
            Bucket:"tuvoz-bucket",
            Key:name,
            Body:assets,            
            ContentType: type
        }
        s3Bucket.upload(params,(err: any, data: any)=>{
            if(err){
                //console.log("err",err);
            }else{
                //console.log("data", data);
            }
        });
        // //console.log(body);
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

    const listPhrase = [
        {
            name: "Francia, Suiza y Hungría ya hicieron causa común.",
            status: 0,
        },
        {
            name: "Mi primer profesor de lengua fue López García.",
            status: 0,
        },
        {
            name: "Guillermo y Yolanda practicaban ciclismo con Jaime.",
            status: 0,
        },
        {
            name: "El primero en Guipúzcoa y el segundo en Valladolid.",
            status: 0,
        },
        {
            name: "Fue aquel hombre tan gordo el que se acercó en globo.",
            status: 0,
        },
        {
            name: "éramos un grupo de profesores de lengua y literatura.",
            status: 0,
        },
        {
            name: "Yo no recuerdo en mi pueblo ningún caso de triquinosis.",
            status: 0,
        },
        {
            name: "éramos un grupo de gente bastante distinguida.",
            status: 0,
        },
        {
            name: "Después ya se hizo muy amiga nuestra.",
            status: 0,
        },
        {
            name: "Los achaques de Jesús remitieron sin causar disgustos.",
            status: 0,
        },
        {
            name: "Su viuda se casó con un profesor de inglés de allá.",
            status: 0,
        },
        {
            name: "Durante tus estudios has hecho algún viaje.",
            status: 0,
        },
        {
            name: "Dos años y medio en Vilanova ya fueron suficientes.",
            status: 0,
        },
        {
            name: "Pero en el fondo le tengo cariño.",
            status: 0,
        },
        {
            name: "Puede haber deficiencia de agua en Logroño.",
            status: 0,
        },
        {
            name: "La sangre se revuelve con estas migas de pan blanco.",
            status: 0,
        },
        {
            name: "Los yernos de Ismael no engordarán los pollos con hierba.",
            status: 0,
        },
        {
            name: "Mi mujer es profesora de Lengua y Literatura.",
            status: 0,
        },
        {
            name: "Sabía un poquito de inglés pero muy poco.",
            status: 0,
        },
        {
            name: "En Julio hacíamos en Burgos otra vez la preparación.",
            status: 0,
        },
        {
            name: "Un niño muy rico que se llama Ignacio.",
            status: 0,
        },
        {
            name: "No en lenguaje hablado pero sí en lenguaje escrito.",
            status: 0,
        },
        {
            name: "Era muy gordo, muy gordo y con un tupé inmenso.",
            status: 0,
        },
        {
            name: "Ellos, ya desde un principio, se quedan con el dinero.",
            status: 0,
        },
        {
            name: "Después de la mili ya me vine a Cataluña.",
            status: 0,
        },
        {
            name: "Estuve en Guernica dando clase de lengua y literatura.",
            status: 0,
        },
        {
            name: "Firmaban como cántabros incluso en tumbas funerarias.",
            status: 0,
        },
        {
            name: "Aunque ellos ya engrasaron los ejes como yo les enseñé.",
            status: 0,
        },
        {
            name: "Habla un poco de su prepotencia y de su orgullo.",
            status: 0,
        },
        {
            name: "Trabajaba en Granollers y vivía en Barcelona.",
            status: 0,
        },
        {
            name: "Es uno de los recuerdos más bonitos que guardo.",
            status: 0,
        },
        {
            name: "Vimos que el ambiente había cambiado mucho.",
            status: 0,
        },
        {
            name: "Bajamos un día al mercadillo de Palma.",
            status: 0,
        },
        {
            name: "Por las noches organizaban bailes y fiestas.",
            status: 0,
        },
        {
            name: "Yo entré en filas a cumplir el servicio militar.",
            status: 0,
        },
        {
            name: "Uno llevaba el chorizo, el otro llevaba el gazpacho.",
            status: 0,
        },
        {
            name: "Con Gema y con Blanca me veo por las noches en casa.",
            status: 0,
        },
        {
            name: "Subimos un rato al apartamento y luego ya nos fuimos.",
            status: 0,
        },
        {
            name: "Le voy a contar por qué he estudiado lengua.",
            status: 0,
        },
        {
            name: "Llevas quince años fuera de la montaña.",
            status: 0,
        },
        {
            name: "Existe un viento del norte que es un viento frío.",
            status: 0,
        },
        {
            name: "Nos dio el disgusto más grande de nuestra vida.",
            status: 0,
        },
        {
            name: "Se hacen chorizos y salchichones de dos clases.",
            status: 0,
        },
        {
            name: "Antes de primero de bachiller ya te traumatizaban.",
            status: 0,
        },
        {
            name: "La profesora que tengo tampoco es muy agradable.",
            status: 0,
        },
        {
            name: "Yo tengo derecho a que a mí se me entienda.",
            status: 0,
        },
        {
            name: "Al segundo día empezaron a llegar colegios.",
            status: 0,
        },
        {
            name: "En estos pueblos preciosos de Vizcaya y Guipúzcoa.",
            status: 0,
        },
        {
            name: "Me he tomado un café con leche en un bar.",
            status: 0,
        },
        {
            name: "Dentro de muy poco pues va a estar la mitad cubierto.",
            status: 0,
        },
        {
            name: "Los automóviles circulan por el pueblo.",
            status: 0,
        },
        {
            name: "Hay dos niños o tres que le habían dicho que les gustaba.",
            status: 0,
        },
        {
            name: "Cuando entré en el instituto jugué un año más.",
            status: 0,
        },
        {
            name: "Cuéntame los sitios en que has vivido en Cataluña.",
            status: 0,
        },
        {
            name: "Se limpian con agua caliente y raspándolos bien.",
            status: 0,
        },
        {
            name: "Durante el año era muchísimo más barato.",
            status: 0,
        },
        {
            name: "Yo he visto a gente expulsarla del colegio por fumar.",
            status: 0,
        },
        {
            name: "A las ocho de la mañana ya estaba haciendo guardia.",
            status: 0,
        },
        {
            name: "Nos lo pasamos muy bien aunque no vimos nada.",
            status: 0,
        },
        {
            name: "Nos cogieron y nos llevaron otra vez al congreso.",
            status: 0,
        },
        {
            name: "En Nochevieja, de los cincuenta, sólo cinco íbamos a casa.",
            status: 0,
        },
        {
            name: "Pero a las pequeñas les falta todavía aprender mucho.",
            status: 0,
        },
        {
            name: "Con veintiún años podrías comenzar a comerte el mundo.",
            status: 0,
        },
        {
            name: "Sus calles son empedradas y los faroles de hierro viejo.",
            status: 0,
        },
        {
            name: "Guadalajara no está colgada de las rocas. Cuenca sí.",
            status: 0,
        },
        {
            name: "En diez minutos te puedes colocar en Peñacabarga.",
            status: 0,
        },
        {
            name: "Iba vestida muy rara pero era superdivertida.",
            status: 0,
        },
        {
            name: "Como es lógico donde hay montañas hay valles.",
            status: 0,
        },
        {
            name: "A Belén la conocí cuando hice primero el primer curso.",
            status: 0,
        },
        {
            name: "De repente se giró una cosa con gafas y era Carlos.",
            status: 0,
        },
        {
            name: "No se hablaba de ella en ningún noticiero.",
            status: 0,
        },
        {
            name: "Al final llegamos corriendo por la carretera.",
            status: 0,
        },
        {
            name: "Pasé un año dando clase aquí, en Bellaterra.",
            status: 0,
        },
        {
            name: "Ya empezarán los malos modos o los morritos.",
            status: 0,
        },
        {
            name: "El año pasado no pude porque cambié de trabajo.",
            status: 0,
        },
        {
            name: "Yo iba hasta la ermita de San Gabriel con este cacharro.",
            status: 0,
        },
        {
            name: "Yo tuve la suerte de que había unas conferencias.",
            status: 0,
        },
        {
            name: "El carácter es en principio cerrado aunque luego se da.",
            status: 0,
        },
        {
            name: "Una vez que ya se ha chocarrado bien se limpia la piel.",
            status: 0,
        },
        {
            name: "Los mandos nos hacían la vida imposible.",
            status: 0,
        },
        {
            name: "Pero tú ahora elijes ya previamente.",
            status: 0,
        },
        {
            name: "Empezamos a reivindicar que se hiciese pueblo nuevo.",
            status: 0,
        },
        {
            name: "Nosotros esto lo tuvimos muy claro desde el principio.",
            status: 0,
        },
        {
            name: "Lo han tirado abajo y han hecho un bloque nuevo.",
            status: 0,
        },
        {
            name: "Entonces todo el mundo vive de la agricultura.",
            status: 0,
        },
        {
            name: "Yo me quedé con tu amiga Gloria casi toda la noche.",
            status: 0,
        },
        {
            name: "Estuve una semana allí en Cataluña.",
            status: 0,
        },
        {
            name: "Rita ha desayunado mientras yo me afeitaba.",
            status: 0,
        },
        {
            name: "Les dijeron que eligieran una casa allá, en las mismas condiciones.",
            status: 0,
        },
        {
            name: "Podríamos encasillarlo como hombre de derechas.",
            status: 0,
        },
        {
            name: "Los hombres normalmente chocarran el cochino.",
            status: 0,
        },
        {
            name: "Yo me he dado cuenta cuando he vuelto aquí.",
            status: 0,
        },
        {
            name: "Pajares está a cinco kilómetros de San Andrés.",
            status: 0,
        },
        {
            name: "Yo creo que Víctor habló con los franceses en una pausa del congreso.",
            status: 0,
        },
        {
            name: "Ganamos todos los partidos menos el de la final.",
            status: 0,
        },
        {
            name: "Conseguimos que se hiciese un pueblo.",
            status: 0,
        },
        {
            name: "Cuando me giré ya no tenía la cartera.",
            status: 0,
        },
        {
            name: "Los servicios que pueden prestar son muy superiores.",
            status: 0,
        },
        {
            name: "Esos años estuvimos haciendo ocho asignaturas.",
            status: 0,
        },
        {
            name: "Había un autobús que nos llevaba otra vez para el cuartel.",
            status: 0,
        },
        {
            name: "Es la riqueza ganadera y la riqueza agrícola.",
            status: 0,
        },
        {
            name: "Había algunos que no habían visto nunca el mar.",
            status: 0,
        },
        {
            name: "Por otra parte es una ciudad que está muy cuidada.",
            status: 0,
        },
        {
            name: "Tiene quince y está haciendo primero de BUP.",
            status: 0,
        },
        {
            name: "Tendrá unas siete u ocho islas alrededor.",
            status: 0,
        },
        {
            name: "Son los cuadros más bonitos de las casas de mi pueblo.",
            status: 0,
        },
        {
            name: "Un partido socialista con representatividad.",
            status: 0,
        },
        {
            name: "Produce dolor de cabeza a los montañeses.",
            status: 0,
        },
        {
            name: "Una para ellos y otra para invitar a las chicas.",
            status: 0,
        },
        {
            name: "Es un hombre franco pero no es un hombre que se entregue.",
            status: 0,
        },
        {
            name: "Desde esta perspectiva han de ser dos culturas.",
            status: 0,
        },
        {
            name: "Van a echar abajo la tribuna para aumentar su capacidad.",
            status: 0,
        },
        {
            name: "Haciendo el primer campamento y el segundo campamento.",
            status: 0,
        },
        {
            name: "A aquella gente que le va mucho la vida militar.",
            status: 0,
        },
        {
            name: "Por otra parte, yo estaba fuera de mi casa.",
            status: 0,
        },
        {
            name: "Hoy no tenía que llevar bocadillo por la mañana.",
            status: 0,
        },
        {
            name: "Pero yo quería ser ingeniero de montes.",
            status: 0,
        },
        {
            name: "No se hace en ningún sitio como se hace allá.",
            status: 0,
        },
        {
            name: "Un matrimonio ya mayor manda a su hijo a Alicante.",
            status: 0,
        },
        {
            name: "Recibíamos un nombre que es los foramontanos.",
            status: 0,
        },
        {
            name: "Unas indemnizaciones no les iban del todo mal.",
            status: 0,
        },
        {
            name: "Las de dos pisos tienen un primer piso con una habitación.",
            status: 0,
        },
        {
            name: "Nos íbamos preparando con aquellos equipos tan gloriosos.",
            status: 0,
        },
        {
            name: "Había gente que quería marcharse a vivir a Lumbreras.",
            status: 0,
        },
        {
            name: "Y en el segundo piso, pues hay tres habitaciones.",
            status: 0,
        },
        {
            name: "Me vine aquí y me admitieron en su organización.",
            status: 0,
        },
        {
            name: "En el siglo octavo hizo expulsar a los judíos de España.",
            status: 0,
        },
        {
            name: "Se va dando vueltas a la sangre para que no se cuaje.",
            status: 0,
        },
        {
            name: "Rezando porque tenía un miedo impresionante.",
            status: 0,
        },
        {
            name: "Es uno de los momentos más bonitos del día.",
            status: 0,
        },
        {
            name: "La mitad va a estar cubierto por un pantano.",
            status: 0,
        },
        {
            name: "Los chorizos y los jamones están colgando de las paredes.",
            status: 0,
        },
        {
            name: "El que llevaba todo el club no me caía muy bien.",
            status: 0,
        },
        {
            name: "Nos fuimos a las siete de la mañana y volvimos por la noche.",
            status: 0,
        },
        {
            name: "Lo tengo asociado al día de la matanza.",
            status: 0,
        },
        {
            name: "Hechos con la carne más ensangrentada y más grasienta.",
            status: 0,
        },
        {
            name: "Es un apellido muy abundante en la zona de Pamplona.",
            status: 0,
        },
        {
            name: "Había estado en una tertulia en Logroño.",
            status: 0,
        },
        {
            name: "Y mi padre es de aquí y no es tan bueno.",
            status: 0,
        },
        {
            name: "Volvemos otra vez por encima de Santander.",
            status: 0,
        },
        {
            name: "El mar Atlántico entra por el golfo de Vizcaya.",
            status: 0,
        },
        {
            name: "Yo llevaba la cartera con todo el dinero.",
            status: 0,
        },
        {
            name: "Había mucha gente fuera y nos quedamos sentadas.",
            status: 0,
        },
        {
            name: "En definitiva yo pienso que el pantano está bien.",
            status: 0,
        },
        {
            name: "No jugábamos a básket, sólo los mirábamos a ellos.",
            status: 0,
        },
        {
            name: "Es un sótano que tendrá diez metros de altitud.",
            status: 0,
        },
        {
            name: "Entonces se creó una cuña natural que fue Santander.",
            status: 0,
        },
        {
            name: "Quien mandaba era un alférez que era compañero.",
            status: 0,
        },
        {
            name: "Ganaban el dinero para hacer el viaje.",
            status: 0,
        },
        {
            name: "Bueno, total que va y resulta que me admiten.",
            status: 0,
        },
        {
            name: "Esto se hace cuando ya se saben los resultados del veterinario.",
            status: 0,
        },
        {
            name: "A las ocho y media o así nos volvieron a bajar.",
            status: 0,
        },
        {
            name: "Aunque naturalmente hay un partido comunista.",
            status: 0,
        },
        {
            name: "Casi haciendo frontera con Bilbao está el río Asón.",
            status: 0,
        },
        {
            name: "La mayoría de los guerreros tenían reuma.",
            status: 0,
        },
        {
            name: "Al llegar a Barcelona tendremos que arreglarlo todo.",
            status: 0,
        },
        {
            name: "Esta es una de las cosas que yo más recuerdo.",
            status: 0,
        },
        {
            name: "Acabaron las maniobras éstas de submarinismo.",
            status: 0,
        },
        {
            name: "Esa sangre después se echa en una caldera.",
            status: 0,
        },
        {
            name: "Teníamos que andar unos diez minutos o así.",
            status: 0,
        },
        {
            name: "Dio la casualidad que a la una y media estaban allí.",
            status: 0,
        },
        {
            name: "Llegaba a Santander a las ocho de la mañana.",
            status: 0,
        },
        {
            name: "Se la conoce o la conocen como la pequeña Suiza.",
            status: 0,
        },
        {
            name: "El rey mandó a su yerno a derrotar a los cántabros.",
            status: 0,
        },
        {
            name: "Tiene una niña de dos años que se llama Carmen.",
            status: 0,
        },
        {
            name: "Era como una pequeña cabaña llena de italianos.",
            status: 0,
        },
        {
            name: "Los cochinos estaban bien, no tenían triquinosis.",
            status: 0,
        },
        {
            name: "Se emplea para atar los haces de hierba.",
            status: 0,
        },
        {
            name: "Se alegraron mucho de vernos y ya nos quedamos a cenar.",
            status: 0,
        },
        {
            name: "Bueno, es otra vida completamente distinta.",
            status: 0,
        },
        {
            name: "En el caso mío, yo era delineante industrial.",
            status: 0,
        },
        {
            name: "Esto es por todo el reglamento del mercado común europeo.",
            status: 0,
        },
        {
            name: "Entonces yo había alquilado una hamaca.",
            status: 0,
        },
        {
            name: "Luego Susana se quedó en la bañera con la falda puesta.",
            status: 0,
        },
        {
            name: "Una vez que se cuelga el cochino se deja que se seque.",
            status: 0,
        },
        {
            name: "Uno de esos caciques era amigo de Azaña.",
            status: 0,
        },
        {
            name: "Ya empezamos a llorar bastante en el apartamento.",
            status: 0,
        },
        {
            name: "Le he dado un beso y me he vuelto a mi casa.",
            status: 0,
        },
        {
            name: "Los niños son catalanes, han nacido en Blanes los tres.",
            status: 0,
        },
        {
            name: "No se carga a nadie, es bastante cariñosa.",
            status: 0,
        },
        {
            name: "Teníamos que pasar por unos puntos marcados en el mapa.",
            status: 0,
        },
        {
            name: "La montaña con sus acantilados llega hasta el mar.",
            status: 0,
        },
        {
            name: "Te voy a contar el viaje que he hecho esta mañana.",
            status: 0,
        },
        {
            name: "Es la sede de la actual Universidad Menéndez Pelayo.",
            status: 0,
        },
        {
            name: "En una ladera del monte se ubica la iglesia.",
            status: 0,
        },
        {
            name: "Esto es lo que has hecho durante el año y durante el verano.",
            status: 0,
        },
        {
            name: "Bueno, pero vamos a la historia que te contaba.",
            status: 0,
        },
        {
            name: "La higiene que había allí era bastante deprimente.",
            status: 0,
        },
        {
            name: "Este viento quemó toda la ciudad absolutamente.",
            status: 0,
        },
        {
            name: "Había una especie de montaña o de colina.",
            status: 0,
        },
        {
            name: "Me parece admirable su actitud en este caso.",
            status: 0,
        },
        {
            name: "La carne mala se llama la carne ensangrentada.",
            status: 0,
        },
        {
            name: "Entonces lo único que hacíamos era ir a cenar.",
            status: 0,
        },
        {
            name: "No dormimos prácticamente en toda la noche.",
            status: 0,
        },
        {
            name: "En todos los sitios había italianos.",
            status: 0,
        },
        {
            name: "Tiene espectáculos bastante agradables en verano.",
            status: 0,
        },
        {
            name: "Para ser Semana Santa había mucha gente.",
            status: 0,
        },
        {
            name: "Esta vez no me había preparado en absoluto.",
            status: 0,
        },
        {
            name: "Teníamos permiso para ir a nuestras casas.",
            status: 0,
        },
        {
            name: "Lo que se consigue de esta manera es que todos paguen la cuota.",
            status: 0,
        },
    ];

    
    const phrase = [
         "Francia, Suiza y Hungría ya hicieron causa común.",
         "Mi primer profesor de lengua fue López García.",
         "Guillermo y Yolanda practicaban ciclismo con Jaime.",
         "El primero en Guipúzcoa y el segundo en Valladolid.",
         "Fue aquel hombre tan gordo el que se acercó en globo.",       
      ];
    
    const [current, setCurrent] = useState(phrase[0]);
   
    const handleNextPhrase = async () => {
    
        const aux = phrase.map((item, index) => { 
                              
            if (item == current) {                
                setCurrent(phrase[index + 1]);
            }                      
            return phrase[index + 1];
        });
    };

    return current ? (
        <Block flex space="between" style={styles.padded}>
            <Block flex={0.25} middle space="around" style={{ zIndex: 2 }}>
                <Block justify>
                <Text style={styles.subTitle}>{current} </Text>
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
        height: 100,
        color: "#fff",
        fontSize: 25,
        textAlign: "justify",
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
