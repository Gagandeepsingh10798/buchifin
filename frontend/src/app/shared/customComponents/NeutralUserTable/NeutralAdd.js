import React, { useState, useEffect } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, Autocomplete, DialogTitle, TextField, IconButton, InputAdornment } from "@mui/material";
import Stack from '@mui/material/Stack';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import Autorenew from '@mui/icons-material/Autorenew';
import useAPI from 'app/hooks/useApi';


const NeutralAdd = ({ open, onClose, onSuccessfulAdd, onError, setGovAvailable }) => {

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
    const languagesList = ['English', 'Hindi'];
    const { POST } = useAPI();
    const [showPassword, setShowPassword] = useState(false);
    const [formValues, setFormValues] = useState({
        adminName: '',
        adminEmail: '',
        adminPhone: '',
        password: '',
        address: '',
        designation: '',
        languages: [],
    });

    const [formErrors, setFormErrors] = useState({});

    const handleInputChange = (e) => {
        let { id, value } = e.target;
        const fieldName = id.split('-')[1];

        value = ['adminName', 'adminEmail', 'address', 'designation'].includes(fieldName) ? value.trimStart() : value;
        setFormValues(prevState => ({
            ...prevState,
            [fieldName]: value
        }));
        validateField(fieldName, value);
    };

    const validateField = (name, value) => {
        let errors = {};

        switch (name) {
            case 'address':
                errors[name] = value.trim().length >= 3 ? '' : 'Address must be at least 3 characters';
                break;
            case 'designation':
                errors[name] = value.trim().length >= 3 ? '' : 'Designation must be at least 3 characters';
                break;
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
            email: formValues.adminEmail,
            password: formValues.password,
            designation: formValues.designation,
            phone: formValues.adminPhone,
            address: formValues.address,
            lang: formValues.languages,
            countryCode: '+91',
        };
        try {
            const response = await POST('/neutral/signup', payload, false, true);
            if (response.status === 200) {
                onSuccessfulAdd(payload.name);

            } else {
                onError(response.data.message);
            }
        } catch (error) {
            onError("Error Occured");
        }
    };

    useEffect(() => {
    }, []);



    return (
        <React.Fragment>
            <Dialog open={open}>
                <DialogTitle>Add New Neutral</DialogTitle>
                <DialogContent>
                    <Stack spacing={4}>
                        <DialogContentText>
                            To subscribe to this website, please enter your email address here. We
                            will send updates occasionally.
                        </DialogContentText>
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
                            id="outlined-designation"
                            label="Designation"
                            placeholder="Designation"
                            onChange={handleInputChange}
                            error={Boolean(formErrors.designation)} 
                            helperText={formErrors.designation}
                            inputProps={{ maxLength: 50 }}
                            value={formValues.designation}
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
                            id="outlined-address"
                            label="Address"
                            placeholder="Address"
                            onChange={handleInputChange}
                            inputProps={{ maxLength: 100 }}
                            value={formValues.address}
                        />
                        <Autocomplete
                            multiple
                            id="outlined-languages"
                            options={languagesList}
                            getOptionLabel={(option) => option}
                            onChange={(event, newValue) => handleInputChange({
                                target: {
                                    id: 'outlined-languages',
                                    value: newValue || []
                                }
                            })}
                            renderInput={(params) => <TextField {...params} label="Languages" />}
                        />
                        <TextField
                            required
                            id="outlined-password"
                            label="Password"
                            type={showPassword ? 'text' : 'password'}
                            autoComplete="current-password"
                            value={formValues.password}
                            onChange={e => {
                                const value = e.target.value;
                                setFormValues(prevState => ({ ...prevState, password: value }));
                                validateField('password', value);
                            }}
                            error={Boolean(formErrors.password)}
                            helperText={formErrors.password}
                            onKeyPress={(e) => e.charCode === 32 && e.preventDefault()}
                            InputProps={{
                                endAdornment: (
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

export default NeutralAdd;
