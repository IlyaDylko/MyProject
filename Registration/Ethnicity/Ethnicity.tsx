import {useNavigation} from '@react-navigation/native';
import React, {ReactElement, useCallback} from 'react';
import {Pressable, ScrollView, Switch, View} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';

import {Form} from '../components/Form';
import styles from './styles';
import {selectRegistration, setDisplayEthnicity, setEthnicity} from '../store';

import {rem, vrem} from 'Util/dimensions';
import {NAVIGATION_ROUTES} from 'Navigation/routes';
import {PrimaryButton, Select, Text} from 'Common';
import {ethnicityData as elements} from 'Util/constants/registrationData';

export function EthnicityScreen(): ReactElement {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const {ethnicity, displayEthnicity} = useSelector(selectRegistration);

  const currentIndex = elements.findIndex(element => element === ethnicity);
  const onSelect = useCallback(
    index => {
      dispatch(setEthnicity(elements[index]));
    },
    [dispatch],
  );
  const onSetDisplay = useCallback(
    show => {
      dispatch(setDisplayEthnicity(show));
    },
    [dispatch],
  );
  const onContinuePress = () => {
    navigation.navigate(NAVIGATION_ROUTES.APPEARANCE);
  };
  return (
    <Form title="What is your ethnicity?" onSkip={onContinuePress}>
      <ScrollView
        contentContainerStyle={{alignItems: 'center'}}
        style={{marginBottom: 20}}
        showsVerticalScrollIndicator={false}>
        {elements.map((item, index) => {
          if (currentIndex === index) {
            return (
              <Pressable onPress={() => onSelect(index)} key={index} style={styles.buttonSelected}>
                <Text style={styles.buttonSelectedText} text={item} />
                <View style={styles.subTextWrapper}>
                  <Text style={styles.buttonSelectedSubText} text={'Display ethnicity to other users?'} />
                  <Switch
                    trackColor={{false: 'rgba(22, 22, 32, 1)', true: 'rgba(22, 22, 32, 1)'}}
                    thumbColor={displayEthnicity ? 'white' : 'rgba(235, 63, 141, 1)'}
                    ios_backgroundColor="rgba(22, 22, 32, 1)"
                    onValueChange={() => onSetDisplay(!displayEthnicity)}
                    value={displayEthnicity}
                  />
                </View>
              </Pressable>
            );
          } else {
            return (
              <Select style={styles.button} key={index} onPress={() => onSelect(index)}>
                <Text style={styles.buttonText} text={item} />
              </Select>
            );
          }
        })}
      </ScrollView>
      {!!ethnicity && (
        <PrimaryButton
          wrapperStyle={{marginBottom: vrem(24), width: rem(247), alignSelf: 'center'}}
          onPress={onContinuePress}
          text="Continue"
        />
      )}
    </Form>
  );
}
