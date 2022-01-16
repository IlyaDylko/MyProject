import {useNavigation} from '@react-navigation/native';
import React, {ReactElement, useCallback, useLayoutEffect} from 'react';
import {Pressable, StyleSheet, View} from 'react-native';
import {useDispatch} from 'react-redux';

import {BackButtonIcon, DarkSafeArea, Text, KeyboardAvoidingView} from 'Common';
import {setBodyType} from 'Module/Registration/store/registrationSlice';
import {NAVIGATION_ROUTES} from 'Navigation/routes';
import {rem, vrem} from 'Util/dimensions';
import {bodyTypeData as elements} from 'Util/constants/registrationData';
import {colors} from 'Util/constants/colors';

export function BodyTypeScreen(): ReactElement {
  const dispatch = useDispatch();
  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerTransparent: true,
      headerLeft: () => (
        <Pressable onPress={() => navigation.goBack()}>
          <BackButtonIcon />
        </Pressable>
      ),
      headerTitle: 'Body type',
      headerTitleAlign: 'center',
      headerTitleStyle: styles.headerTitleStyle,
    });
  });
  const onBodyTypeSelect = useCallback(index => {
    dispatch(setBodyType(elements[index]));
    navigation.navigate(NAVIGATION_ROUTES.APPEARANCE);
  }, []);
  return (
    <DarkSafeArea>
      <KeyboardAvoidingView>
        <View style={{marginTop: vrem(80)}}>
          {elements.map((item, index) => (
            <Pressable
              key={index}
              onPress={() => onBodyTypeSelect(index)}
              style={[
                styles.button,
                index === 0
                  ? {borderTopLeftRadius: rem(8), borderTopRightRadius: rem(8)}
                  : index === elements.length - 1
                  ? {borderBottomLeftRadius: rem(8), borderBottomRightRadius: rem(8)}
                  : {},
              ]}>
              <Text style={styles.buttonText} text={item} />
            </Pressable>
          ))}
        </View>
      </KeyboardAvoidingView>
    </DarkSafeArea>
  );
}

const styles = StyleSheet.create({
  headerTitleStyle: {
    color: colors.white,
    alignSelf: 'center',
    fontSize: rem(15),
    lineHeight: rem(16),
    letterSpacing: rem(-0.03),
  },
  keyboardContainer: {
    flex: 1,
  },
  titleWrapper: {
    marginBottom: vrem(40),
  },
  title: {
    fontSize: rem(15),
    color: colors.white,
    lineHeight: rem(38),
    letterSpacing: rem(-0.03),
    marginBottom: vrem(16),
  },
  button: {
    height: 56,
    width: rem(313),
    backgroundColor: colors.background,
    marginBottom: vrem(1),
    justifyContent: 'center',
  },
  buttonText: {
    marginLeft: rem(16),
    fontWeight: '400',
  },
});
