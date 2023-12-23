import React, { useState, useEffect } from 'react';
import { Button, Dialog, DialogActions, Autocomplete, DialogContent, DialogContentText, DialogTitle, TextField } from "@mui/material";
import Stack from '@mui/material/Stack';
import useAPI from 'app/hooks/useApi';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import Autorenew from '@mui/icons-material/Autorenew';


const DisAdd = ({ open, onClose, onSuccessfulAdd, onError }) => {
    const { POST } = useAPI();
    const [governments, setGovernments] = useState([]);
    const [showPassword, setShowPassword] = useState(false);
    const [formValues, setFormValues] = useState({
        districtName: '',
        governmentId: null,
        adminName: '',
        adminEmail: '',
        adminPhone: '',
        password: '',
    });

    const fetchGovernments = async () => {
        const response = await POST('/government/listing', {});
        if (response && response.records) {
            setGovernments(response.records);
        }
    };

    const [formErrors, setFormErrors] = useState({});

    const handleInputChange = (e, newValue) => {
        let { id, value } = e.target;
        let fieldName = id.split('-')[1];
        if (newValue === null || newValue) {
            fieldName = 'governmentId';
            setFormValues(prevState => ({
                ...prevState,
                [fieldName]: newValue
            }));
            validateField(fieldName, newValue);
            return;
        }

        value = ['districtName', 'adminName', 'adminEmail'].includes(fieldName) ? value.trimStart() : value;
        

        setFormValues(prevState => ({
            ...prevState,
            [fieldName]: value
        }));
        validateField(fieldName, value);
    };

    const validateField = (name, value) => {
        let errors = {};

        switch (name) {
            case 'districtName':
            case 'adminName':
                const trimmedValue = value.trim();
                errors[name] = trimmedValue.length >= 3 ? '' : 'Name must be at least 3 characters';
                break;
            case 'adminEmail':
                const emailValid = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value);
                errors[name] = value.length > 2 && emailValid ? '' : 'Invalid email format';
                break;
            case 'adminPhone':
                const phoneValid = /^[0-9]{10}$/.test(value);
                errors[name] = phoneValid ? '' : 'Phone number must be 10 digits and contain only numbers';
                break;
            case 'password':
                const strongPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/.test(value);
                errors[name] = strongPassword ? '' : 'Password must be strong (8+ chars, 1 uppercase, 1 lowercase, 1 number, 1 special character)';
                break;
            case 'governmentId':
                errors[name] = value?._id ? '' : 'Government selection is required';
                break;
            default:
                break;
        }

        setFormErrors(prevErrors => ({
            ...prevErrors,
            ...errors
        }));
    };

    const isFormComplete = () => {
        const allFieldsFilled = Object.values(formValues).every(val => val !== "");
        const noValidationErrors = Object.values(formErrors).every(val => val === "");
        return allFieldsFilled && noValidationErrors;
    };

    const handleSubscribe = async () => {
        const payload = {
            name: formValues.adminName,
            state: formValues.governmentId?._id,
            email: formValues.adminEmail,
            password: formValues.password,
            phone: formValues.adminPhone,
            countryCode: '+91',
            district: formValues.districtName
        };
        try {
            const response = await POST('/district/signup', payload, false, true);
            if (response.status === 200) {
                onSuccessfulAdd(response.data.result.district);
            } else {
                onError(response.data.message);
            }
        } catch (error) {
            onError("Error Occured");
        }
    };

    const generatePassword = () => {
        const length = 12;
        const numbers = "0123456789";
        const lowercaseChars = "abcdefghijklmnopqrstuvwxyz";
        const uppercaseChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        const specialChars = "!@#$%^&*";

        const allChars = numbers + lowercaseChars + uppercaseChars + specialChars;

        const guaranteedChars = [
            numbers.charAt(Math.floor(Math.random() * numbers.length)),
            lowercaseChars.charAt(Math.floor(Math.random() * lowercaseChars.length)),
            uppercaseChars.charAt(Math.floor(Math.random() * uppercaseChars.length)),
            specialChars.charAt(Math.floor(Math.random() * specialChars.length))
        ];

        let password = guaranteedChars.join('');

        for (let i = 0; i < length - guaranteedChars.length; ++i) {
            password += allChars.charAt(Math.floor(Math.random() * allChars.length));
        }

        return password.split('').sort(() => 0.5 - Math.random()).join('');

    }


    useEffect(() => {
        fetchGovernments();
    }, []);


    return (
        <React.Fragment>
            <Dialog open={open}>
                <DialogTitle>Add New District</DialogTitle>
                <DialogContent>
                    <Stack spacing={4}>
                        <DialogContentText>
                            To subscribe to this website, please enter your email address here. We
                            will send updates occasionally.
                        </DialogContentText>
                        <Autocomplete
                            onChange={handleInputChange}
                            disablePortal
                            id="outlined-governmentId"
                            getOptionLabel={(option) => option.state}
                            isOptionEqualToValue={(option, value) => option.state === value.state}
                            options={governments}
                            value={formValues.governmentId}
                            renderInput={(params) => <TextField {...params} error={Boolean(formErrors.governmentId)} helperText={formErrors.governmentId} label="Government" />}
                        />
                        <TextField
                            required
                            id="outlined-districtName"
                            label="District name"
                            placeholder="District name"
                            onChange={handleInputChange}
                            error={Boolean(formErrors.districtName)}
                            helperText={formErrors.districtName}
                            inputProps={{ maxLength: 40 }}
                            value={formValues.districtName}
                        />
                        <TextField
                            required
                            id="outlined-adminName"
                            label="Admin name"
                            placeholder="Admin name"
                            onChange={handleInputChange}
                            error={Boolean(formErrors.adminName)}
                            helperText={formErrors.adminName}
                            inputProps={{ maxLength: 40 }}
                            value={formValues.adminName}
                        />
                        <TextField
                            required
                            id="outlined-adminEmail"
                            label="Admin Email"
                            placeholder="Admin Email"
                            onChange={handleInputChange}
                            error={Boolean(formErrors.adminEmail)}
                            helperText={formErrors.adminEmail}
                            inputProps={{ maxLength: 40 }}
                            value={formValues.adminEmail}
                        />
                        <TextField
                            required
                            id="outlined-adminPhone"
                            label="Admin Phone Number"
                            placeholder="Admin Phone Number"
                            onChange={handleInputChange}
                            error={Boolean(formErrors.adminPhone)}
                            helperText={formErrors.adminPhone}
                            inputProps={{ maxLength: 10 }}
                        />
                        <TextField
                            required
                            id="outlined-password"
                            label="Password"
                            type={showPassword ? 'text' : 'password'}
                            autoComplete="current-password"
                            value={formValues.password}
                            onChange={handleInputChange}
                            error={Boolean(formErrors.password)}
                            helperText={formErrors.password}
                            onKeyPress={(e) => e.charCode === 32 && e.preventDefault()}
                            InputProps={{
                                endAdornment: (
                                    <React.Fragment>
                                        <InputAdornment position="end">
                                            <IconButton
                                                onClick={() => setShowPassword(!showPassword)}
                                                onMouseDown={(event) => event.preventDefault()}
                                                edge="end"
                                            >
                                                {showPassword ? <VisibilityOff /> : <Visibility />}
                                            </IconButton>
                                            <IconButton
                                                onClick={() => {
                                                    const newPassword = generatePassword();
                                                    setFormValues((prevState) => ({
                                                        ...prevState,
                                                        password: newPassword,
                                                    }));
                                                    validateField('password', newPassword);
                                                }}
                                                edge="end"
                                            >
                                                <Autorenew />
                                            </IconButton>
                                        </InputAdornment>
                                    </React.Fragment>
                                ),
                            }}
                        />

                    </Stack>
                </DialogContent>
                <DialogActions>
                    <Button onClick={onClose}>Cancel</Button>
                    <Button onClick={handleSubscribe} disabled={!isFormComplete()}>Add</Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    );
};

export default DisAdd;
