import {useNavigation} from '@react-navigation/native';
import {Formik} from 'formik';
import React, {ReactElement, useCallback, useRef} from 'react';
import {Text, Keyboard} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import DatePicker from 'react-native-date-picker';
import BottomSheet from '@gorhom/bottom-sheet';
import dayjs from 'dayjs';

import {selectUserName} from '../store/registrationSelectors';
import {setBirthday} from '../store';
import {validationSchema} from './validationSchema';
import styles from './styles';
import {Form} from '../components/Form';

import {PrimaryButton} from 'Common/buttons';
import {GradientText, StyledText} from 'Common/text';
import {CustomView} from 'Common/views';
import {NAVIGATION_ROUTES} from 'Navigation/routes';
import {colors} from 'Util/constants/colors';
import {BottomSheetCustom} from 'Common/BottomSheets';

const maxDate = dayjs().subtract(18, 'year').toDate();

export function BirthdayScreen(): ReactElement {
  const modalRef = useRef<BottomSheet>();
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const userName = useSelector(selectUserName);

  function onSubmit(birthdayDate: string): void {
    dispatch(setBirthday(birthdayDate));
    navigation.navigate(NAVIGATION_ROUTES.ETHNICITY);
  }
  const Title = useCallback(
    (): ReactElement => (
      <CustomView mb={16} mt={15}>
        <CustomView flexDirection="row">
          <Text style={styles.title}>Hi, </Text>
          <GradientText style={styles.title}>{userName}</GradientText>
          <Text style={styles.title}>!</Text>
        </CustomView>

        <StyledText color={colors.white} fontSize={32} lineHeight={38} fontWeight="600" text="When were you born?" />
      </CustomView>
    ),
    [userName],
  );

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const toggleWarningPopup = useCallback(() => {
    Keyboard.dismiss();
    setTimeout(() => {
      modalRef.current?.expand();
    }, 300);
  }, []);

  return (
    <Form titleContainer={<Title />}>
      <Formik
        validateOnMount={true}
        enableReinitialize={true}
        initialValues={{
          dateOfBirth: maxDate,
        }}
        validationSchema={validationSchema}
        onSubmit={({dateOfBirth}) => onSubmit(dayjs(dateOfBirth).format('YYYY-MM-DD'))}>
        {({values, setFieldValue, handleSubmit, isValid}): ReactElement => (
          <>
            <CustomView flex={1} justifyContent="flex-start" mb={32}>
              <DatePicker
                mode="date"
                date={values.dateOfBirth}
                onDateChange={date => setFieldValue('dateOfBirth', date)}
                maximumDate={maxDate}
                androidVariant="nativeAndroid"
                textColor="whitesmoke"
                style={{alignSelf: 'center'}}
              />
            </CustomView>
            {isValid && (
              <CustomView justifyContent="flex-end" mb={24} mr={32} ml={32}>
                <PrimaryButton onPress={handleSubmit} text="Continue" />
              </CustomView>
            )}
          </>
        )}
      </Formik>
      <BottomSheetCustom heightPercentage="35%" ref={modalRef}>
        <Text style={styles.popupTitle}>Oops...</Text>
        <Text style={styles.popupText}>Looks like you are too young for this application.</Text>
      </BottomSheetCustom>
    </Form>
  );
}
