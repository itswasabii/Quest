import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';

const RegistrationForm = () => {
    // Define initial form values
    const initialValues = {
        name: '',
        email: '',
        password: '',
        phoneNumber: '',
        education: '',
        relevantSkills: '',
        profession: '',
        desiredJobRole: '',
        resume: null,
        agreeToTerms: false,
    };

    // Define validation schema using Yup
    const validationSchema = Yup.object({
        name: Yup.string().required('Name is required'),
        email: Yup.string().email('Invalid email address').required('Email is required'),
        password: Yup.string().min(8, 'Password must be at least 8 characters').required('Password is required'),
        phoneNumber: Yup.string().matches(/^\d{10}$/, 'Phone number must be 10 digits'),
        education: Yup.string().required('Education is required'),
        relevantSkills: Yup.string().required('Relevant skills are required'),
        profession: Yup.string().required('Profession is required'),
        desiredJobRole: Yup.string().required('Desired job role is required'),
        agreeToTerms: Yup.bool().oneOf([true], 'You must agree to the terms and conditions'),
    });

    // Handle form submission
    const handleSubmit = async (values) => {
        try {
            // Convert form data to FormData format
            const formData = new FormData();
            formData.append('name', values.name);
            formData.append('email', values.email);
            formData.append('password', values.password);
            formData.append('phone_number', values.phoneNumber);
            formData.append('education', values.education);
            formData.append('relevant_skills', values.relevantSkills);
            formData.append('profession', values.profession);
            formData.append('desired_job_role', values.desiredJobRole);
            if (values.resume) {
                formData.append('resume', values.resume);
            }

            const url = '/api/register';
    
            const response = await axios.post(url, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
    
                 // Handle successful registration
        if (response.status === 201) {
            alert('User registered successfully');
        } else {
            // Handle unexpected status codes
            alert(`Unexpected response code: ${response.status}`);
        }
    } catch (error) {
        console.error('Error submitting form:', error);
        
        // Extract the error message from the response if available
        if (error.response && error.response.data) {
            alert(`Registration failed: ${error.response.data.error}`);
        } else {
            alert('An error occurred during registration');
        }
    }
};

    return (
        <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
        >
            {({ setFieldValue }) => (
                <Form>
                    <div>
                        <label htmlFor="name">Name</label>
                        <Field id="name" name="name" type="text" />
                        <ErrorMessage name="name" component="div" />
                    </div>
                    <div>
                        <label htmlFor="email">Email</label>
                        <Field id="email" name="email" type="email" />
                        <ErrorMessage name="email" component="div" />
                    </div>
                    <div>
                        <label htmlFor="password">Password</label>
                        <Field id="password" name="password" type="password" />
                        <ErrorMessage name="password" component="div" />
                    </div>
                    <div>
                        <label htmlFor="phoneNumber">Phone Number</label>
                        <Field id="phoneNumber" name="phoneNumber" type="text" />
                        <ErrorMessage name="phoneNumber" component="div" />
                    </div>
                    <div>
                        <label htmlFor="education">Education</label>
                        <Field id="education" name="education" type="text" />
                        <ErrorMessage name="education" component="div" />
                    </div>
                    <div>
                        <label htmlFor="relevantSkills">Relevant Skills</label>
                        <Field id="relevantSkills" name="relevantSkills" type="text" />
                        <ErrorMessage name="relevantSkills" component="div" />
                    </div>
                    <div>
                        <label htmlFor="profession">Profession</label>
                        <Field id="profession" name="profession" type="text" />
                        <ErrorMessage name="profession" component="div" />
                    </div>
                    <div>
                        <label htmlFor="desiredJobRole">Desired Job Role</label>
                        <Field id="desiredJobRole" name="desiredJobRole" type="text" />
                        <ErrorMessage name="desiredJobRole" component="div" />
                    </div>
                    <div>
                        <label htmlFor="resume">Resume (optional)</label>
                        <input
                            id="resume"
                            name="resume"
                            type="file"
                            onChange={(event) => setFieldValue('resume', event.currentTarget.files[0])}
                        />
                        <ErrorMessage name="resume" component="div" />
                    </div>
                    <div>
                        <Field id="agreeToTerms" name="agreeToTerms" type="checkbox" />
                        <label htmlFor="agreeToTerms">I agree to the terms and conditions</label>
                        <ErrorMessage name="agreeToTerms" component="div" />
                    </div>
                    <button type="submit">Register</button>
                </Form>
            )}
        </Formik>
    );
};

export default RegistrationForm;
