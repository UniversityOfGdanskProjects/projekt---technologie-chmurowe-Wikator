import React from 'react';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import LoginDto from "@/dtos/requests/loginDto";

const initialValues: LoginDto = {
  email: '',
  password: '',
};

const validationSchema: Yup.ObjectSchema<LoginDto> = Yup.object({
  email: Yup.string().email('Invalid email address').required('Email is required'),
  password: Yup.string().required('Password is required'),
});

interface LoginFormProps {
  onLogin: (values: LoginDto) => void;
}

export default function LoginForm({ onLogin }: LoginFormProps) {
  const handleSubmit = (values: LoginDto) => {
    onLogin(values);
  };

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        <Form className="p-4 shadow-lg rounded-lg" style={{ width: '400px' }}>
          <h2 className="mb-4 text-center">Login</h2>

          <div className="mb-3">
            <label htmlFor="email" className="form-label">Email:</label>
            <Field className="form-control" type="email" id="email" name="email" />
            <ErrorMessage name="email" component="div" className="text-danger" />
          </div>

          <div className="mb-3">
            <label htmlFor="password" className="form-label">Password:</label>
            <Field className="form-control" type="password" id="password" name="password" />
            <ErrorMessage name="password" component="div" className="text-danger" />
          </div>

          <button type="submit" className="btn btn-primary w-100">Login</button>
        </Form>
      </Formik>
    </div>
  );
};
