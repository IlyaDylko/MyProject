import React, {ReactElement, useCallback, useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {Pressable, ScrollView, StyleSheet, Text as CommonText, View} from 'react-native';
import {useSelector} from 'react-redux';
import {unwrapResult} from '@reduxjs/toolkit';
import {useNavigation} from '@react-navigation/native';

import {Form} from '../components/Form';
import {deletePleasure, selectPleasures, setPleasure} from '../store';
import {getSuggestionsThunk} from '../store/suggestionsSlice';

import {useAppDispatch} from 'Store';
import {rem, vrem} from 'Util/dimensions';
import {colors, hexToRGBA} from 'Util/constants/colors';
import {PrimaryButton, StyledInput, Text} from 'Common';
import {Icon} from 'Assets/images';
import {NAVIGATION_ROUTES} from 'Navigation/routes';

export function PleasureScreen(): ReactElement {
  const {t} = useTranslation();
  const dispatch = useAppDispatch();
  const navigation = useNavigation();
  const pleasures = useSelector(selectPleasures);

  const [suggestArray, setSuggestArray] = useState([] as string[]);
  const [suggestions, setSuggestions] = useState([] as string[]);

  const onContinuePress = () => {
    navigation.navigate(NAVIGATION_ROUTES.LOCATION);
  };

  useEffect(() => {
    const fetchData = async () => {
      const payload = unwrapResult(await dispatch(getSuggestionsThunk()));
      if (payload) {
        setSuggestions(payload);
      }
    };
    fetchData();
  }, [dispatch]);

  const validateData = useCallback(
    (text: string) => {
      const textSuggestions = suggestions.filter((item: string) => item.toLowerCase().includes(text.toLowerCase()));
      if (text && text !== ' ') {
        const isItInPleasures = pleasures.filter(pleasure => pleasure === text).length !== 0;
        if (!isItInPleasures) {
          if (textSuggestions.length === 0) {
            setSuggestArray([text]);
          } else {
            setSuggestArray(textSuggestions);
          }
        }
      } else {
        setSuggestArray([]);
      }
    },
    [pleasures, suggestions],
  );
  const addTag = useCallback(
    suggestItem => {
      if (pleasures.filter(pleasure => pleasure === suggestItem).length === 0) {
        setSuggestArray([]);
        dispatch(setPleasure(suggestItem));
      }
    },
    [dispatch, pleasures],
  );
  const deleteTag = useCallback(
    index => {
      dispatch(deletePleasure(index));
    },
    [dispatch],
  );
  return (
    <Form title="What Turns You On?" onSkip={onContinuePress}>
      <>
        <StyledInput
          maxLength={30}
          name="name"
          onChange={text => {
            if (pleasures.length < 5) {
              validateData(text);
            }
          }}
          placeholder={t('e.g. walking under the rain')}
        />
        {pleasures && pleasures.length !== 0 && suggestArray.length === 0 && (
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.pleasuresStyle}>
            {pleasures.map((suggestItem, index) => (
              <Pressable style={styles.selectedItem} key={index} onPress={() => deleteTag(index)}>
                <CommonText style={styles.selectedItemText}>{suggestItem}</CommonText>
                <Icon.SVG name={'Delete'} style={styles.icon} />
              </Pressable>
            ))}
          </ScrollView>
        )}
        {suggestArray.length !== 0 && (
          <ScrollView keyboardShouldPersistTaps={'always'} style={styles.suggestionsList}>
            {suggestArray.map((suggestItem, index) => (
              <Pressable key={index} onPress={() => addTag(suggestItem)}>
                <Text style={styles.suggestionsItem} text={suggestItem} />
              </Pressable>
            ))}
          </ScrollView>
        )}
        {suggestArray.length === 0 && (
          <View style={{flex: 1, justifyContent: 'flex-end'}}>
            <PrimaryButton wrapperStyle={styles.mainButtonWrapper} onPress={onContinuePress} text="Continue" />
          </View>
        )}
      </>
    </Form>
  );
}

const styles = StyleSheet.create({
  button: {
    height: vrem(56),
    width: rem(313),
    backgroundColor: hexToRGBA(colors.main, 0.3),
    marginBottom: vrem(1),
    justifyContent: 'center',
  },
  buttonText: {
    marginLeft: rem(16),
    fontWeight: '400',
  },
  icon: {
    width: rem(16),
    height: vrem(16),
  },
  mainButtonWrapper: {
    marginBottom: vrem(24),
    width: rem(247),
    alignSelf: 'center',
  },
  pleasuresStyle: {
    flexWrap: 'wrap',
    flexDirection: 'row',
  },
  selectedItem: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    paddingVertical: vrem(12),
    paddingHorizontal: rem(8),
    borderColor: colors.main,
    borderRadius: rem(4),
    marginRight: rem(10),
    marginTop: vrem(10),
  },
  selectedItemText: {
    color: colors.main,
    fontSize: rem(16),
    lineHeight: rem(16),
    marginRight: rem(10),
  },
  suggestionsList: {
    flexDirection: 'column',
    backgroundColor: colors.dark,
    height: vrem(200),
    borderRadius: rem(8),
    marginTop: vrem(8),
    marginBottom: vrem(8),
  },
  suggestionsItem: {
    fontSize: rem(16),
    lineHeight: rem(16),
    paddingVertical: vrem(20),
    paddingHorizontal: rem(8),
    marginLeft: rem(16),
    marginTop: vrem(10),
  },
});
