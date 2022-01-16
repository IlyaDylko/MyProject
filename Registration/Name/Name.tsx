import React, {ReactElement} from 'react';
import {useTranslation} from 'react-i18next';
import {Formik} from 'formik';
import {useNavigation} from '@react-navigation/native';
import {useDispatch} from 'react-redux';

import {setUserName} from '../store';
import {validationSchema} from './validationSchema';
import {Form} from '../components/Form';

import {CustomView} from 'Common/views';
import {StyledInput} from 'Common/inputs';
import {PrimaryButton} from 'Common/buttons';
import {NAVIGATION_ROUTES} from 'Navigation/routes';

export function NameScreen(): ReactElement {
  const {t} = useTranslation();
  const navigation = useNavigation();
  const dispatch = useDispatch();

  function onSubmit(name: string): void {
    dispatch(setUserName(name));
    navigation.navigate(NAVIGATION_ROUTES.SPECIFY_BIRTHDAY);
  }

  return (
    <Form title="What is your name?" subTitle="This name will be displayed on your profile">
      <Formik
        enableReinitialize={true}
        initialValues={{
          name: '',
        }}
        validateOnBlur
        validateOnChange
        validationSchema={validationSchema}
        onSubmit={({name}) => onSubmit(name)}>
        {({values, handleChange, handleSubmit, handleBlur, errors, touched, setFieldTouched}): ReactElement => (
          <>
            <StyledInput
              name="name"
              error={errors && touched.name && errors.name ? errors.name : ''}
              onChange={name => {
                setFieldTouched('name', true);
                handleChange('name')(name);
              }}
              onBlur={handleBlur('name')}
              value={values.name}
              placeholder={t('My name is')}
            />

            {!!values.name?.length && (
              <CustomView flex={1} justifyContent="flex-end" mb={24} mr={32} ml={32}>
                <PrimaryButton onPress={handleSubmit} text="Continue" />
              </CustomView>
            )}
          </>
        )}
      </Formik>
    </Form>
  );
}
