import * as Yup from 'yup';
import {useFormik} from "formik";
import React from "react";
import UpdateActorDto from "@/dtos/requests/UpdateActorDto";

interface ActorFormProps {
  initialValues: UpdateActorDto;
  onPost: (values: UpdateActorDto) => void;
}

const validationSchema = Yup.object({
  firstName: Yup.string().required('First name is required'),
  lastName: Yup.string().required('Last name is required'),
  biography: Yup.string().nullable(),
  dateOfBirth: Yup.date().required('Date of birth is required'),
});

export default function UpdateActorForm({ onPost, initialValues }: ActorFormProps) {
  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: validationSchema,
    onSubmit: async values => {
      const dto: UpdateActorDto = {
        firstName: values.firstName,
        lastName: values.lastName,
        dateOfBirth: new Date(values.dateOfBirth).toISOString().split('T')[0],
        biography: values.biography
      }
      onPost(dto);
    },
  });

  return (
    <form onSubmit={formik.handleSubmit} className="mx-4 p-4 shadow-lg rounded-lg" style={{width: '400px'}}>
      <h3 className="text-center mb-4">Edit Actor</h3>
      <div className="mb-3">
        <label htmlFor="firstName" className="form-label">First Name</label>
        <input className="form-control" type="text" {...formik.getFieldProps('firstName')} />
        {formik.touched.firstName && formik.errors.firstName &&
          <div className="text-danger">{formik.errors.firstName}</div>}
      </div>

      <div className="mb-3">
        <label htmlFor="lastName" className="form-label">Last name</label>
        <input className="form-control" type="text" {...formik.getFieldProps('lastName')} />
        {formik.touched.lastName && formik.errors.lastName &&
          <div className="text-danger">{formik.errors.lastName}</div>}
      </div>

      <div className="mb-3">
        <label htmlFor="dateOfBirth" className="form-label">Date Of Birth</label>
        <input className="form-control" type="date" {...formik.getFieldProps('dateOfBirth')} />
        {formik.touched.dateOfBirth && formik.errors.dateOfBirth &&
          <div className="text-danger">{formik.errors.dateOfBirth}</div>}
      </div>

      <div className="mb-3">
        <label htmlFor="biography" className="form-label">Biography</label>
        <textarea className="form-control" {...formik.getFieldProps('biography')} />
        {formik.touched.biography && formik.errors.biography &&
          <div className="text-danger">{formik.errors.biography}</div>}
      </div>

      <button type="submit" className="btn btn-primary w-100">Edit</button>
    </form>
  );
}
