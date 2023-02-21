import React from 'react';
import {
  Form as AriakitForm,
  FormError as AriakitFormError,
  FormInput as AriakitFormInput,
  FormLabel as AriakitFormLabel,
  FormReset as AriakitFormReset,
  FormSubmit as AriakitFormSubmit,
  useFormState,
} from "ariakit/form";
import "./Form.scss";

function Form(props) {
  return <AriakitForm {...props} className='form' />
}

function FormError(props) {
  return <AriakitFormError {...props} className="form__error" />
}

function FormInput(props) {
  return <AriakitFormInput {...props} className="form__input" />
}

function FormLabel(props) {
  return <AriakitFormLabel {...props} />
}

function FormReset(props) {
  return <AriakitFormReset {...props} className="form__button form__button--secondary form__button--reset" />
}

function FormSubmit(props) {
  return <AriakitFormSubmit {...props} className="form__button" />
}

export {
  Form,
  FormError,
  FormInput,
  FormLabel,
  FormReset,
  FormSubmit,
  useFormState,
}
