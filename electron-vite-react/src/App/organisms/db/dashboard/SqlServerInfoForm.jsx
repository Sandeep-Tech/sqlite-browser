import React from "react";
import PropTypes from 'prop-types';
import './SqlServerInfoForm.scss';
import {
  Form,
  FormInput,
  FormLabel,
  FormError,
  FormReset,
  FormSubmit,
  useFormState,
} from '../../../atoms/form/Form';

function SqlServerInfoForm({ onSubmit }) {
  const form = useFormState({ 
    defaultValues: {
      servername: "",
      username: "",
      password: "",
      dbname: "",
      port: "",
    }
  });
  form.useSubmit(() => onSubmit(form.values));
  return (
    <Form
      state={form}
      aria-labelledby="enter-sql-server-details"
      className="form"
    >
      <div className="form__field">
        <FormLabel name={form.names.servername}>Server Name</FormLabel>
        <FormInput name={form.names.servername} required />
        <FormError name={form.names.servername} />
      </div>
      <div className="form__field">
        <FormLabel name={form.names.username}>Username</FormLabel>
        <FormInput name={form.names.username} required />
        <FormError name={form.names.username} />
      </div>
      <div className="form__field">
        <FormLabel name={form.names.password}>Password</FormLabel>
        <FormInput name={form.names.password} required />
        <FormError name={form.names.password} />
      </div>
      <div className="form__field">
        <FormLabel name={form.names.dbname}>Database name</FormLabel>
        <FormInput name={form.names.dbname} required />
        <FormError name={form.names.dbname} />
      </div>
      <div className="form__field">
        <FormLabel name={form.names.port}>Port</FormLabel>
        <FormInput name={form.names.port} required type="number" min={0} />
        <FormError name={form.names.port} />
      </div>
      <div className="form__buttons">
        <FormReset className="button secondary reset">Reset</FormReset>
        <FormSubmit className="button">Connect</FormSubmit>
      </div>
    </Form>
  )
}
SqlServerInfoForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
}

export default SqlServerInfoForm;

