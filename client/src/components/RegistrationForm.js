import React from 'react';
import { Formik, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import Select from 'react-select'; // Import react-select
import './Register.css';
import { Field } from 'formik';
import { useHistory } from 'react-router-dom';


const RegistrationForm = () => {
    const history = useHistory();
    const initialValues = {
        name: '',
        email: '',
        password: '',
        phoneNumber: '',
        education: '',
        relevantSkills: [],
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
        relevantSkills: Yup.array().required('Relevant skills are required'),
        profession: Yup.string().required('Profession is required'),
        desiredJobRole: Yup.string().required('Desired job role is required'),
        agreeToTerms: Yup.bool().oneOf([true], 'You must agree to the terms and conditions'),
    });

    // Handle form submission
    const handleSubmit = async (values, { setSubmitting }) => {
        try {
            console.log('Submitting form with values:', values);
    
            // Convert form data to FormData format
            const formData = new FormData();
            formData.append('name', values.name);
            formData.append('email', values.email);
            formData.append('password', values.password);
            formData.append('phone_number', values.phoneNumber);
            formData.append('education', values.education);
            formData.append('relevant_skills', values.relevantSkills.join(',')); // Join relevant skills array into a comma-separated string
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
                console.log('User registered successfully');
                alert('User registered successfully');
                history.push('/login');
            } else {
                // Handle unexpected status codes
                console.error('Unexpected response code:', response.status);
                alert(`Unexpected response code: ${response.status}`);
            }
        } catch (error) {
            console.error('Error submitting form:', error);
            // Extract the error message from the response if available
            if (error.response && error.response.data) {
                console.error('Registration failed:', error.response.data.error);
                alert(`Registration failed: ${error.response.data.error}`);
            } else {
                console.error('An error occurred during registration');
                alert('An error occurred during registration');
            }
        } finally {
            // Ensure setSubmitting is called regardless of success or failure
            setSubmitting(false);
        }
    };
    

    // Define options for the profession dropdown list
    const professionOptions = [
        { value: 'Software Developer', label: 'Software Developer' },
        { value: 'Data Scientist', label: 'Data Scientist' },
        { value: 'Project Manager', label: 'Project Manager' },
        { value: 'Graphic Designer', label: 'Graphic Designer' },
        { value: 'Product Manager', label: 'Product Manager' },
        { value: 'Accountant', label: 'Accountant' },
        { value: 'Human Resources Manager', label: 'Human Resources Manager' },
        { value: 'Sales Representative', label: 'Sales Representative' },
        { value: 'Marketing Specialist', label: 'Marketing Specialist' },
        { value: 'Financial Analyst', label: 'Financial Analyst' },
        { value: 'Business Analyst', label: 'Business Analyst' },
        { value: 'Civil Engineer', label: 'Civil Engineer' },
        { value: 'Mechanical Engineer', label: 'Mechanical Engineer' },
        { value: 'Electrical Engineer', label: 'Electrical Engineer' },
        { value: 'Nurse', label: 'Nurse' },
        { value: 'Doctor', label: 'Doctor' },
        { value: 'Teacher', label: 'Teacher' },
        { value: 'Professor', label: 'Professor' },
        { value: 'Pharmacist', label: 'Pharmacist' },
        { value: 'Lawyer', label: 'Lawyer' },
        { value: 'Web Designer', label: 'Web Designer' },
        { value: 'Journalist', label: 'Journalist' },
        { value: 'Chef', label: 'Chef' },
        { value: 'Musician', label: 'Musician' },
        
    ];
    

    // Define options for the relevant skills multi-select
    const skillsOptions = [
        { value: 'JavaScript', label: 'JavaScript' },
        { value: 'Python', label: 'Python' },
        { value: 'Java', label: 'Java' },
        { value: 'C#', label: 'C#' },
        { value: 'React', label: 'React' },
        { value: 'Angular', label: 'Angular' },
        { value: 'Node.js', label: 'Node.js' },
        { value: 'SQL', label: 'SQL' },
        { value: 'HTML', label: 'HTML' },
        { value: 'CSS', label: 'CSS' },
        { value: 'Adobe Photoshop', label: 'Adobe Photoshop' },
        { value: 'Adobe Illustrator', label: 'Adobe Illustrator' },
        { value: 'Project Management', label: 'Project Management' },
        { value: 'Communication', label: 'Communication' },
        { value: 'Problem Solving', label: 'Problem Solving' },
        { value: 'Critical Thinking', label: 'Critical Thinking' },
        { value: 'Leadership', label: 'Leadership' },
        { value: 'Time Management', label: 'Time Management' },
        { value: 'Writing', label: 'Writing' },
        { value: 'Public Speaking', label: 'Public Speaking' },
        { value: 'Graphic Design', label: 'Graphic Design' },
        { value: 'Machine Learning', label: 'Machine Learning' },
        { value: 'Data Analysis', label: 'Data Analysis' },
        { value: 'Marketing', label: 'Marketing' },
        { value: 'Sales', label: 'Sales' },
        { value: 'Customer Service', label: 'Customer Service' },
        { value: 'Accounting', label: 'Accounting' },
        { value: 'Finance', label: 'Finance' },
        { value: 'Healthcare', label: 'Healthcare' },
        // Add more skills as needed
    ];
    

    return (


    <div className="form-container"> 
         <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
        >
            {({ setFieldValue, values }) => (
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
                        <Select
                            id="relevantSkills"
                            name="relevantSkills"
                            options={skillsOptions}
                            isMulti // Allow multiple selections
                            value={values.relevantSkills}
                            onChange={(selectedOptions) => setFieldValue('relevantSkills', selectedOptions)}
                        />
                        <ErrorMessage name="relevantSkills" component="div" />
                    </div>
                    <div>
                        <label htmlFor="profession">Profession</label>
                        <Select
                          id="profession"
                          name="profession"
                          options={professionOptions}
                          value={{ value: values.profession, label: values.profession }} // Change here
                          onChange={(selectedOption) => setFieldValue('profession', selectedOption.value)}
/>
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

        </div>
    );
};

export default RegistrationForm;
