import React from 'react';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import RegisterDto from "@/dtos/requests/registerDto";

const initialValues: RegisterDto = {
  email: '',
  name: '',
  password: ''
};

const validationSchema: Yup.ObjectSchema<RegisterDto> = Yup.object({
  email: Yup.string().email('Invalid email address').required('Email is required'),
  name: Yup.string().required("Username is required"),
  password: Yup.string().required('Password is required')
});

interface RegisterFormProps {
  onRegister: (values: RegisterDto) => void;
}

export default function RegisterForm({ onRegister }: RegisterFormProps) {
  const handleSubmit = (values: RegisterDto) => {
    onRegister(values);
  };

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        <Form className="p-4 shadow-lg rounded-lg" style={{ width: '400px' }}>
          <h2 className="mb-4 text-center">Register</h2>

          <div className="mb-3">
            <label htmlFor="email" className="form-label">Email:</label>
            <Field className="form-control" type="email" id="email" name="email" />
            <ErrorMessage name="email" component="div" className="text-danger" />
          </div>

          <div className="mb-3">
            <label htmlFor="name" className="form-label">Username:</label>
            <Field className="form-control" type="text" id="name" name="name" />
            <ErrorMessage name="name" component="div" className="text-danger" />
          </div>

          <div className="mb-3">
            <label htmlFor="password" className="form-label">Password:</label>
            <Field className="form-control" type="password" id="password" name="password" />
            <ErrorMessage name="password" component="div" className="text-danger" />
          </div>

          <button type="submit" className="btn btn-primary w-100">Register</button>
        </Form>
      </Formik>
    </div>
  );
};
