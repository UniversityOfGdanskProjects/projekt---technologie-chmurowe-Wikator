import AddActorDto from "@/dtos/requests/AddActorDto";
import * as Yup from 'yup';
import {useFormik} from "formik";
import React from "react";
import readFileAsByteArray from "@/readFileAsByteArray";

interface ActorFormProps {
  onPost: (values: AddActorDto) => void;
}

const initialValues = {
  firstName: '',
  lastName: '',
  dateOfBirth: '',
  biography: '',
  fileContent: null,
};

const validationSchema = Yup.object({
  firstName: Yup.string().required('First name is required'),
  lastName: Yup.string().required('Last name is required'),
  biography: Yup.string().nullable(),
  dateOfBirth: Yup.date().required('Date of birth is required'),
  fileContent: Yup.mixed().nullable()
});

export default function AddActorForm({ onPost }: ActorFormProps) {
  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: validationSchema,
    onSubmit: async values => {
      const dto: AddActorDto = {
        firstName: values.firstName,
        lastName: values.lastName,
        dateOfBirth: new Date(values.dateOfBirth).toISOString().split('T')[0],
        biography: values.biography,
        fileContent: await readFileAsByteArray(values.fileContent),
      }
      onPost(dto);
    },
  });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.currentTarget.files) {
      formik.setFieldValue('fileContent', event.currentTarget.files[0]);
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <form onSubmit={formik.handleSubmit} className="p-4 shadow-lg rounded-lg" style={{width: '400px'}}>
        <h3 className="text-center mb-4">Create Actor</h3>
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

        <div className="mb-3">
          <label htmlFor="file">Picture</label>
          <input
            id="file"
            name="file"
            type="file"
            onChange={handleFileChange}
            accept=".jpg, .jpeg, .png"
          />
        </div>

        {formik.touched.fileContent && formik.errors.fileContent && (
          <div>{formik.errors.fileContent}</div>
        )}

        <button type="submit" className="btn btn-primary w-100">Create</button>
      </form>
    </div>
  );
}
