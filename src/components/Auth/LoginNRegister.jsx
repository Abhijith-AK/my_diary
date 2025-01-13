import { useFormik } from 'formik';
import React, { useContext, useEffect, useState } from 'react';
import * as Yup from 'yup';
import { createUserAPI, getUserAPI } from '../../services/allAPI';
import { Box, Button, ButtonGroup, Container, TextField, Typography } from '@mui/material';
import { replace, useNavigate } from 'react-router-dom';
import { SnackbarContext } from '../../App';
import quillPen from '../../assets/quillPen.svg'

const LoginNRegister = () => {
    const [authMode, setAuthMode] = useState("login");
    const { snackBarProps, setSnackBarProps } = useContext(SnackbarContext)
    const navigate = useNavigate();

    // Check if the user is already logged in
    useEffect(() => {
        const user = sessionStorage.getItem('user');
        if (user) {
            navigate('/calendar');  // If logged in, redirect to calendar
        }
    }, [navigate]);

    // formik for handling form states and submission and Yup for validation 
    const formik = useFormik({
        initialValues: {
            name: '',
            email: '',
            password: '',
            dob: ''
        },
        validationSchema: Yup.object({
            name: authMode === "register"
                ? Yup.string().required("Name is required")
                : Yup.string(),
            email: Yup.string().email('Invalid email address').required("Email is required"),
            password: Yup.string().min(6, "Password must be atleast 6 characters").required("Password is required"),
            dob: authMode === "register"
                ? Yup.date().required("Date of Birth is required")
                : Yup.date()
        }),
        onSubmit: async (values) => {
            if (authMode === "register") {
                try {
                    // check if email already exists
                    const response = await getUserAPI();
                    const isEmailExists = response.data.some(user => user.email === values.email)
                    if (isEmailExists) {
                        setSnackBarProps({
                            snackBarVarient: 'warning',
                            snackBarMessage: 'This email is already registered!',
                            openSnackBar: true,
                        })
                        return;
                    }
                    // registering user
                    await createUserAPI(values);
                    setSnackBarProps({
                        snackBarVarient: 'success',
                        snackBarMessage: 'User Registered Successfully!',
                        openSnackBar: true
                    })
                    setAuthMode("login");
                } catch (err) {
                    setSnackBarProps({
                        snackBarVarient: 'error',
                        snackBarMessage: 'Error registering user!',
                        openSnackBar: true
                    })
                }
            } else {
                try {
                    const response = await getUserAPI();
                    const user = response.data.find(user => user.email === values.email && user.password === values.password);
                    if (user) {
                        setSnackBarProps({
                            snackBarVarient: 'success',
                            snackBarMessage: 'Login Successful!',
                            openSnackBar: true
                        })
                        sessionStorage.setItem('user', JSON.stringify(user))
                        navigate('/calendar')
                    } else {
                        setSnackBarProps({
                            snackBarVarient: 'error',
                            snackBarMessage: 'Invalid Credentials!',
                            openSnackBar: true
                        })
                    }
                } catch (err) {
                    setSnackBarProps({
                        snackBarVarient: 'error',
                        snackBarMessage: 'Login Failed!',
                        openSnackBar: true
                    })
                }
            }
        }
    })

    return (
        <Container maxWidth="sm" className='flex justify-center items-center h-screen'>
            <Box
                component="form"
                onSubmit={formik.handleSubmit}
                className='mt-5 p-4 shadow rounded border relative'
            >
                <Typography variant='h4' gutterBottom align='center'>
                    {authMode === "login" ? "Login" : "Register"}
                </Typography>
                {authMode === "register" && (
                    <TextField
                        name='name'
                        type='text'
                        fullWidth
                        margin='normal'
                        label='Name'
                        value={formik.values.name}
                        onChange={formik.handleChange}
                        error={formik.touched.name && Boolean(formik.errors.name)}
                        helperText={formik.touched.name && formik.errors.name}
                    />
                )}

                <TextField
                    name='email'
                    type='email'
                    required
                    fullWidth
                    margin='normal'
                    label='Email'
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    error={formik.touched.email && Boolean(formik.errors.email)}
                    helperText={formik.touched.email && formik.errors.email}
                />

                <TextField
                    name='password'
                    type='password'
                    fullWidth
                    margin='normal'
                    label='Password'
                    value={formik.values.password}
                    onChange={formik.handleChange}
                    error={formik.touched.password && Boolean(formik.errors.password)}
                    helperText={formik.touched.password && formik.errors.password}
                />

                {authMode === "register" && (
                    <TextField
                        name='dob'
                        type='date'
                        fullWidth
                        margin='normal'
                        label='Date of Birth'
                        InputLabelProps={{ shrink: true }}
                        value={formik.values.dob}
                        onChange={formik.handleChange}
                        error={formik.touched.dob && Boolean(formik.errors.dob)}
                        helperText={formik.touched.dob && formik.errors.dob}
                    />
                )}
                <ButtonGroup>

                    <Button variant="contained" type="submit" sx={{
                        margin: '1rem',
                        backgroundColor: 'black',
                        padding: '0.7rem 2rem'
                    }} >
                        {authMode === "login" ? "Login" : "Register"}
                    </Button>

                    <Button
                        variant="text"
                        onClick={() => setAuthMode(authMode === "login" ? "register" : "login")}
                        color='inherit'
                        sx={{
                            margin: '1rem',
                            padding: '0.7rem 2rem'
                        }}
                    >
                        {authMode === "login" ? "Switch to Register" : "Switch to Login"}
                    </Button>
                </ButtonGroup>

                <img width={300} className='absolute -bottom-20 -right-20 z-[-1]' src={quillPen} alt="" />

            </Box>
        </Container>
    );
};

export default LoginNRegister;
