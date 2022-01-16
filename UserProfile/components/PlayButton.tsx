import React, {ReactElement, useCallback, useEffect, useRef, useState} from 'react';
import {
  ActivityIndicator,
  Easing,
  GestureResponderEvent,
  ImageBackground,
  ImageSourcePropType,
  ImageStyle,
  StyleProp,
  StyleSheet,
  TextStyle,
  TouchableOpacity,
} from 'react-native';
import RNFS from 'react-native-fs';
import AudioRecorderPlayer from 'react-native-audio-recorder-player';
import {useSelector} from 'react-redux';
import {AnimatedCircularProgress} from 'react-native-circular-progress';

import {PausePink, Play} from 'Assets/icons';
import {colors, hexToRGBA} from 'Util/constants/colors';
import {rem, vrem} from 'Util/dimensions';
import {UserProps} from 'Module/Search/Search/store/searchSlice';
import {getActiveUserData} from 'Module/Search/Search/store/searchSelectors';
import {isIos} from 'Util/platform';

interface ButtonProps {
  onPress?: (event: GestureResponderEvent) => void;
  style?: StyleProp<TextStyle>;
  isLike?: boolean;
  source?: ImageSourcePropType;
  imageStyle?: StyleProp<ImageStyle>;
  isPlaying: boolean;
}

export const circlesDelay = [0, 1000, 2000, 3000, 4000, 5000];
const audioRecorderPlayer = new AudioRecorderPlayer();

export const PlayButton = ({style, imageStyle}: ButtonProps): ReactElement => {
  const progressRef = useRef(null);
  const [isButtonPressed, setIsButtonPressed] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentPosition, setCurrentPosition] = useState(0);
  const [isPlayerCreated, setIsPlayerCreated] = useState(false);
  const activeUser: UserProps = useSelector(getActiveUserData);
  const {gallery, id} = activeUser;
  const {voice_introduction} = gallery;
  const currentAbsPosition = (currentPosition / duration) * 100;
  const durationLeft = duration - currentPosition;

  const SELF_INTRODUCTION_LOCAL_FILE_PATH = `${RNFS.CachesDirectoryPath}/self-introduction-userId-${id}.${
    isIos ? 'm4a' : 'mp4'
  }`;
  const path = isIos ? `file://${SELF_INTRODUCTION_LOCAL_FILE_PATH}` : SELF_INTRODUCTION_LOCAL_FILE_PATH;

  useEffect(() => {
    if (voice_introduction) {
      RNFS.downloadFile({
        fromUrl: voice_introduction.presigned_url,
        toFile: SELF_INTRODUCTION_LOCAL_FILE_PATH,
      }).promise.then(r => {
        if (r.statusCode === 200) {
          setIsLoaded(true);
        }
      });
    }
  }, [SELF_INTRODUCTION_LOCAL_FILE_PATH, voice_introduction]);

  useEffect(async () => {
    await audioRecorderPlayer.setSubscriptionDuration(0.05);
    await verifyDuration();

    return async function () {
      await audioRecorderPlayer.stopPlayer();
      await audioRecorderPlayer.removePlayBackListener();
    };
  }, []);

  const verifyDuration = async () => {
    await audioRecorderPlayer.startPlayer(path);
    await audioRecorderPlayer.addPlayBackListener(async e => {
      if (!isNaN(e.duration) && e.duration !== 0) {
        await audioRecorderPlayer.stopPlayer();
        setDuration(e.duration);
        await audioRecorderPlayer.removePlayBackListener();
      }
    });
  };

  const onStart = useCallback(async () => {
    await addSubscription();

    try {
      setIsPlaying(true);

      if (currentPosition && isPlayerCreated) {
        await audioRecorderPlayer.seekToPlayer(currentPosition);
        await audioRecorderPlayer.resumePlayer().then(data => {
          progressRef?.current?.reAnimate(currentAbsPosition, 100, durationLeft, Easing.linear);
        });
      } else {
        await audioRecorderPlayer.startPlayer(path).then(data => {
          progressRef?.current?.animate(100, duration, Easing.linear);
        });
        await audioRecorderPlayer.seekToPlayer(currentPosition);

        setIsPlayerCreated(true);
      }
    } catch (e) {
      console.log('onStart recording voice error', e);
    }
  }, [currentAbsPosition, currentPosition, duration, durationLeft, isPlayerCreated, path]);

  const addSubscription = async () => {
    return audioRecorderPlayer.addPlayBackListener(e => {
      if (e.duration === e.currentPosition) {
        setIsPlaying(false);
        setIsPlayerCreated(false);
        setCurrentPosition(0);
        return;
      }

      if (!isNaN(e.duration) && e.duration !== 0) {
        setDuration(e.duration);
      }

      if (!isNaN(e.currentPosition)) {
        setCurrentPosition(e.currentPosition);
      }
    });
  };

  const onPause = useCallback(async () => {
    await audioRecorderPlayer.removePlayBackListener();
    await audioRecorderPlayer.pausePlayer();
    setIsPlaying(false);
  }, []);

  const onPress = useCallback(() => {
    setIsButtonPressed(true);
    isPlaying ? onPause() : onStart();
  }, [isPlaying, onPause, onStart]);

  const hided = voice_introduction === null;

  return (
    <TouchableOpacity
      disabled={hided || !isLoaded}
      style={[styles.buttonStyle, style, hided && styles.disabled]}
      onPress={onPress}>
      {!hided && (
        <>
          {isLoaded ? (
            <>
              {isPlaying ? (
                <ImageBackground source={PausePink} style={[styles.image, imageStyle]} />
              ) : (
                <ImageBackground source={Play} style={[styles.image, imageStyle]} />
              )}
            </>
          ) : (
            <ActivityIndicator size={'small'} />
          )}
          {isPlaying ? (
            <AnimatedCircularProgress
              style={{position: 'absolute'}}
              ref={progressRef}
              lineCap={'round'}
              size={58}
              fill={0}
              width={1}
              duration={duration}
              rotation={0}
              tintColor="#EB3F8D"
              backgroundColor="rgba(255, 255, 255, 0)"
            />
          ) : (
            <AnimatedCircularProgress
              style={{position: 'absolute'}}
              lineCap={'round'}
              size={58}
              fill={currentAbsPosition}
              width={1}
              duration={0}
              rotation={0}
              tintColor="#EB3F8D"
              backgroundColor="rgba(255, 255, 255, 0)"
            />
          )}
        </>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  buttonStyle: {
    height: vrem(52),
    width: vrem(52),
    borderRadius: vrem(26),
    marginHorizontal: rem(16),
    borderWidth: 1,
    borderColor: hexToRGBA(colors.white, 0.1),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: hexToRGBA(colors.black, 0.25),
  },
  image: {
    width: vrem(32),
    height: vrem(32),
    resizeMode: 'cover',
    justifyContent: 'center',
  },
  disabled: {
    borderColor: hexToRGBA(colors.black, 0.25),
  },
});
