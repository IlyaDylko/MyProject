import React, {ReactElement, ReactNode} from 'react';
import {
  StyleProp,
  ImageBackground,
  StyleSheet,
  ViewStyle,
  View,
  KeyboardAvoidingView,
  Pressable,
  Platform, StatusBar,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useRoute} from '@react-navigation/native';

import {background} from 'Assets/images';
import {rem, vrem} from 'Util/dimensions';
import {Stepper, Text} from 'Common';
import {colors} from 'Util/constants/colors';
import {StepNumber} from 'Util/stepper';

type Props = {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  title?: string;
  subTitle?: string;
  headerStyle?: StyleProp<ViewStyle>;
  contentStyle?: StyleProp<ViewStyle>;
  childrenStyle?: StyleProp<ViewStyle>;
  onSkip?: () => void;
  titleContainer?: ReactElement;
};

export function Form({
  children,
  title,
  subTitle,
  headerStyle,
  contentStyle,
  childrenStyle,
  titleContainer,
  onSkip,
}: Props): ReactElement {
  const route = useRoute();
  const insets = useSafeAreaInsets();
  const headerStyles = [styles.header, headerStyle];
  const keyboardVerticalOffset = Platform.select({
    ios: insets.top,
    android: insets.top + Number(StatusBar.currentHeight),
  });

  return (
    <ImageBackground style={styles.image} source={background}>
      <View style={[styles.content, {marginBottom: insets.bottom, marginTop: insets.top}, contentStyle]}>
        <KeyboardAvoidingView
          style={styles.keyboardContainer}
          behavior="padding"
          keyboardVerticalOffset={keyboardVerticalOffset}>
          <View style={styles.stepper}>
            <Stepper step={StepNumber[route.name]} />
          </View>
          {onSkip && (
            <Pressable style={styles.skipButton} onPress={onSkip}>
              <Text style={styles.skipText} text={'Skip'} />
            </Pressable>
          )}
          <View style={headerStyles}>
            {title && <Text style={styles.title} text={title} />}
            {titleContainer}
            {subTitle && <Text style={styles.subTitle} text={subTitle} />}
          </View>
          <View style={[styles.children, childrenStyle]}>{children}</View>
        </KeyboardAvoidingView>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  keyboardContainer: {
    flex: 1,
  },
  image: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    marginHorizontal: rem(32),
  },
  header: {
    marginTop: vrem(68),
    marginBottom: vrem(30),
  },
  title: {
    fontSize: rem(32),
    color: colors.white,
    lineHeight: rem(38),
    letterSpacing: rem(-0.03),
    marginBottom: vrem(16),
    marginTop: vrem(10),
  },
  subTitle: {
    fontSize: rem(14),
    color: colors.dotColor,
    lineHeight: vrem(21),
    fontWeight: 'normal',
    marginBottom: vrem(10),
  },
  children: {
    flex: 1,
  },
  skipText: {
    color: colors.dotColor,
    fontSize: rem(15),
    lineHeight: rem(32),
  },
  skipButton: {
    right: 0,
    top: vrem(15),
    position: 'absolute',
  },
  stepper: {
    left: 0,
    top: vrem(35),
    position: 'absolute',
  },
  upperHeader: {
    position: 'absolute',
    top: vrem(35),
  },
});
