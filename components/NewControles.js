import React from "react";
import {
  Image,
  StyleSheet,
  Dimensions,
  View,
  Title,
  Background,
  TouchableOpacity,
  Text,
} from "react-native";

import AudioRecorderPlayer, {
  AVEncoderAudioQualityIOSType,
  AVEncodingOption,
  AudioEncoderAndroidType,
  AudioSet,
  AudioSourceAndroidType,
} from "react-native-audio-recorder-player";

import { Block, theme } from "galio-framework";
import { Button, Icon, Input } from "../components";
import { Images, argonTheme } from "../constants";
import useBaseURL from "../Hooks/useBaseURL";


const { width } = Dimensions.get("screen");

class NewControles extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoggingIn: false,
      recordSecs: 0,
      recordTime: "00:00:00",
      currentPositionSec: 0,
      currentDurationSec: 0,
      playTime: "00:00:00",
      duration: "00:00:00",
    };
    this.audioRecorderPlayer = new AudioRecorderPlayer();
    //this.audioRecorderPlayer.setSubscriptionDuration(0.09); // optional. Default is 0.1
  }

  onStartRecord = async () => {
    /* const dirs = RNFetchBlob.fs.dirs;
    const path = Platform.select({
      ios: "hello.m4a",
      android: `${dirs.CacheDir}/hello.m4a`,
    }); */
    const response = await fetch(this.state.ImageSource);
    const blob = await response.blob();
    var reader = new FileReader();
    console.log(reader.result);

    const audioSet = {
      AudioEncoderAndroid: AudioEncoderAndroidType.AAC,
      AudioSourceAndroid: AudioSourceAndroidType.MIC,
      AVEncoderAudioQualityKeyIOS: AVEncoderAudioQualityIOSType.high,
      AVNumberOfChannelsKeyIOS: 2,
      AVFormatIDKeyIOS: AVEncodingOption.aac,
    };

    //console.log("audioSet", audioSet);

    const uri = await this.audioRecorderPlayer.startRecorder(path, audioSet);

    this.audioRecorderPlayer.addRecordBackListener((e) => {
      this.setState({
        recordSecs: e.current_position,

        recordTime: this.audioRecorderPlayer.mmssss(
          Math.floor(e.current_position)
        ),
      });
    });

    //console.log(`uri: ${uri}`);
  };

  1;
  onStopRecord = async () => {
    const result = await this.audioRecorderPlayer.stopRecorder();

    this.audioRecorderPlayer.removeRecordBackListener();

    this.setState({
      recordSecs: 0,
    });

    console.log(result);
  };

  onStartPlay = async (e) => {
    console.log("onStartPlay");
    const path = "hello.m4a";
    const msg = await this.audioRecorderPlayer.startPlayer(path);
    this.audioRecorderPlayer.setVolume(1.0);
    console.log(msg);

    this.audioRecorderPlayer.addPlayBackListener((e) => {
      if (e.current_position === e.duration) {
        console.log("finished");

        this.audioRecorderPlayer.stopPlayer();
      }

      this.setState({
        currentPositionSec: e.current_position,
        currentDurationSec: e.duration,
        playTime: this.audioRecorderPlayer.mmssss(
          Math.floor(e.current_position)
        ),

        duration: this.audioRecorderPlayer.mmssss(Math.floor(e.duration)),
      });
    });
  };

  render() {
    const { navigation } = this.props;
    return (
      <Block flex space="between" style={styles.padded}>
        <Block flex space="around" style={{ zIndex: 2 }}>
          <Block center>
            <Block>
              <Text>InstaPlayer</Text>
              <Text>{this.state.recordTime}</Text>
              <Button
                color="primary"
                style={styles.createButton}
                onPress={() => this.onStartRecord()}
              >
                <Text bold size={14} color={argonTheme.COLORS.WHITE}>
                  RECORD
                </Text>
              </Button>
            </Block>
            <Block>
              <Button
                color="primary"
                style={styles.createButton}
                onPress={() => this.onStopRecord()}
              >
                <Text bold size={14} color={argonTheme.COLORS.WHITE}>
                  STOP
                </Text>
              </Button>
            </Block>
            <Block style={styles.recorder_stop}>
              <Text>
                {this.state.playTime} / {this.state.duration}
              </Text>
              <Button
                color="primary"
                style={styles.createButton}
                onPress={() => this.onStartPlay()}
              >
                <Text bold size={14} color={argonTheme.COLORS.WHITE}>
                  PLAY
                </Text>
              </Button>
            </Block>
            <Block style={styles.send}></Block>
          </Block>
        </Block>
      </Block>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.COLORS.BLACK,
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
    shadowOpacity: 0,
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
    marginLeft: -5,
  },
  block_row: {
    flexDirection: "row",
    marginBottom: 45,
  },
});

export default NewControles;
