import React, { useState, useEffect } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, Autocomplete, DialogTitle, TextField, IconButton, InputAdornment } from "@mui/material";
import Stack from '@mui/material/Stack';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import Autorenew from '@mui/icons-material/Autorenew';
import useAPI from 'app/hooks/useApi';
import { Country, State, City } from 'country-state-city';


const AddRetailers = ({ open, onClose, onSuccessfulAdd, onError, fetchRetailers }) => {
    const { POST } = useAPI();
    const [showPassword, setShowPassword] = useState(false);

    // States for dropdown options
    const [states, setStates] = useState([]);
    const [city, setCity] = useState([]);
    const [genders, setGenders] = useState(["Male", "Female", "Other"]); // Example gender options
    const [firmTypes, setFirmTypes] = useState(["Proprietorship", "Partnership", "Private Limited"])

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

    // Form values
    const [formValues, setFormValues] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: '',
        password: '',
        gender: '',
        country: '',
        state: '',
        city: '',
        pin: '',
        address: '',
        firmType: '',
        firmName: '',
        firmCountry: '',
        firmState: '',
        firmCity: '',
        firmAddress: '',
        firmPin: ''
    });

    const [formErrors, setFormErrors] = useState({});


    const handleInputChange = (e) => {
        let { id, value } = e.target;
        const fieldName = id.split('-')[1];

        value = ['stateName', 'adminName', 'adminEmail'].includes(fieldName) ? value.trimStart() : value;
        setFormValues(prevState => ({
            ...prevState,
            [fieldName]: value
        }));
        validateField(fieldName, value);
    };

    const isFormComplete = () => {
        const allFieldsFilled = Object.values(formValues).every(val => val !== "");
        const noValidationErrors = Object.values(formErrors).every(val => val === "");
        return allFieldsFilled && noValidationErrors;
    };

    const handleSubscribe = async () => {
        console.log(formValues)
        const payload1 = {
            name: formValues.adminName,
            email: formValues.adminEmail,
            password: formValues.password,
            phone: formValues.adminPhone,
            countryCode: '+91',
            state: formValues.stateName
        };

        let tree = {
            "firstName": "Ursula",
            "lastName": "Parsons",
            "email": "geqox@mailinator.com",
            "phoneNumber": "9877947899",
            "password": "Pa$$w0rd!",
            "gender": "Male",
            "country": "Ipsum omnis quo dolo",
            "state": "Quisquam ipsam vel q",
            "city": "Ratione dolorem offi",
            "pin": "160000",
            "address": "Illum rerum ut in l",
            "firmType": "Proprietorship",
            "firmName": "Steel Talley",
            "firmCountry": "Laudantium sint vol",
            "firmState": "Quasi id et excepteu",
            "firmCity": "Proident eveniet i",
            "firmAddress": "Qui esse id vitae d",
            "firmPin": "160000"
        }

        let payload = {
            retailer: {
                name: formValues.firstName + " " + formValues.lastName,
                email: formValues.email,
                gender: formValues.gender === "Male" ? "MALE" : "FEMALE",
                dob: "12-12-1985",
                phone: [{
                    phoneType: "HOME",
                    phone: formValues.phoneNumber
                }],
                address: [{
                    addressType: "HOME",
                    address: formValues.address,
                    city: formValues.city,
                    state: formValues.state,
                    country: formValues.country,
                    zip: formValues.pin
                }],
                password: formValues.password
            },
            firm: {
                name: formValues.firmName,
                address: [{
                    addressType: "HOME",
                    address: formValues.firmAddress,
                    city: formValues.firmCity,
                    state: formValues.firmState,
                    country: formValues.firmCountry,
                    zip: formValues.firmPin
                }],
                companyType: formValues.firmType,
            }
        }

        try {
            const response = await POST('/retailer/create', payload, false, true);
            console.log(response)
            if (response.status === 200) {
                onSuccessfulAdd();
                // fetchRetailers();
            } else {
                onError(response.data.message);
            }
        } catch (error) {
            console.log(error)
            onError("Error Occured");
        }
    };

    // ... existing code for handleInputChange and validateField ...

    // Update validateField function to include new fields
    const validateField = (name, value) => {
        let errors = {};

        switch (name) {
            case 'firstName':
            case 'lastName':
                errors[name] = !value ? "This is a required field" :
                    (value.length < 2 || value.length > 25) ? "Minimum Length is 2 and Maximum Length is 25" : '';
                break;

            case 'email':
                const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
                errors[name] = !value ? "This is a required field" :
                    !emailValid ? "Invalid email address" : '';
                break;

            case 'phoneNumber':
                const phoneValid = /^\d+$/.test(value);
                errors[name] = !value ? "This is a required field" :
                    !phoneValid ? "Phone number must contain only digits" :
                        (value.length < 10 || value.length > 15) ? "Minimum 10 digits required and Maximum 15 digits allowed" : '';
                break;

            case 'pin':
            case 'firmPin':
                const pinValid = /^\d+$/.test(value) && value.length === 6;
                errors[name] = !value ? "This is a required field" :
                    !pinValid ? `${name === 'pin' ? 'PIN' : 'Firm PIN'} must contain only 6 digits` : '';
                break;

            case 'country':
            case 'state':
            case 'city':
            case 'firmType':
            case 'firmCountry':
            case 'firmState':
            case 'firmCity':
            case 'gender':
                errors[name] = !value ? "This is a required field" : '';
                break;

            case 'address':
            case 'firmAddress':
                errors[name] = !value ? "This is a required field" :
                    (value.length < 2 || value.length > 40) ? "Minimum Length is 2 and Maximum Length is 40" : '';
                break;

            case 'password':
                errors[name] = !value ? "This is a required field" :
                    value.length < 8 ? "Minimum 8 characters required" : '';
                break;

            case 'firmName':
                errors[name] = !value ? "This is a required field" :
                    (value.length < 2 || value.length > 40) ? "Minimum Length is 2 and Maximum Length is 40" : '';
                break;

            // ... any other cases ...

            default:
                // Optional: Handle unknown fields or do nothing
                break;
        }

        setFormErrors(prevErrors => ({
            ...prevErrors,
            ...errors
        }));
    };


    // const countries = Country.getAllCountries();

    // const countryChangeHandler = (country) => {
    //     let states = State.getStatesOfCountry(country.value);
    //     setStates(states)
    // }

    // const stateChangeHandler = (state) => {
    //     let cities = City.getCitiesOfState(state.country, state.value);
    //     setCity(cities)
    //     // setStates()
    // }



    // ... existing code ...

    return (
        <React.Fragment>
            <div

            >
                <Dialog open={open} >
                    <DialogTitle>Add New Retailer</DialogTitle>
                    <DialogContent>
                        <Stack spacing={2}>
                            <DialogContentText style={{
                                width: "530px"
                            }}>
                                Enter the details of the new retailer.
                            </DialogContentText>
                            {/* Fields for personal details */}
                            <TextField
                                required
                                id="outlined-firstName"
                                label="First Name"
                                placeholder="First Name"
                                onChange={handleInputChange}
                                error={Boolean(formErrors.firstName)}
                                helperText={formErrors.firstName}
                                value={formValues.firstName}
                                inputProps={{
                                    maxLength: 40
                                }}
                            />
                            <TextField
                                required
                                id="outlined-lastName"
                                label="Last Name"
                                placeholder="Last Name"
                                onChange={handleInputChange}
                                error={Boolean(formErrors.lastName)}
                                helperText={formErrors.lastName}
                                value={formValues.lastName}
                            />
                            <TextField
                                required
                                id="outlined-email"
                                label="Email"
                                placeholder="Email"
                                onChange={handleInputChange}
                                error={Boolean(formErrors.email)}
                                helperText={formErrors.email}
                                value={formValues.email}
                            />
                            <TextField
                                required
                                id="outlined-phoneNumber"
                                label="Phone Number"
                                placeholder="Phone Number"
                                onChange={handleInputChange}
                                error={Boolean(formErrors.phoneNumber)}
                                helperText={formErrors.phoneNumber}
                                value={formValues.phoneNumber}
                            />
                            {/* Dropdown for Gender */}
                            <Autocomplete
                                id="outlined-gender"
                                options={genders}
                                getOptionLabel={(option) => option}
                                onChange={(event, newValue) => handleInputChange({
                                    target: {
                                        id: 'outlined-gender',
                                        value: newValue || ''
                                    }
                                })}
                                renderInput={(params) => <TextField {...params} label="Gender" error={Boolean(formErrors.gender)} helperText={formErrors.gender} />}
                            />
                            {/* Fields for address details */}
                            {/* <Autocomplete
                                id="outlined-Country"
                                options={countries?.map((t) => ({
                                    value: t.isoCode,
                                    label: t.name,
                                  }))}
                                getOptionLabel={(option) => option}
                                onChange={(event, newValue) => handleInputChange({
                                    target: {
                                        id: 'outlined-country',
                                        value: newValue || ''
                                    }
                                })}
                                renderInput={(params) => <TextField {...params} label="Country" error={Boolean(formErrors.gender)} helperText={formErrors.gender} />}
                            /><Autocomplete
                                id="outlined-state"
                                options={states?.map((t) => ({
                                    value: t.isoCode,
                                    label: t.name,
                                    country: t.countryCode
                                  }))}
                                getOptionLabel={(option) => option}
                                onChange={(event, newValue) => handleInputChange({
                                    target: {
                                        id: 'outlined-state',
                                        value: newValue || ''
                                    }
                                })}
                                renderInput={(params) => <TextField {...params} label="State" error={Boolean(formErrors.gender)} helperText={formErrors.gender} />}
                            /><Autocomplete
                                id="outlined-city"
                                options={city?.map((t) => ({
                                    value: t.isoCode,
                                    label: t.name,
                                  }))}
                                getOptionLabel={(option) => option}
                                onChange={(event, newValue) => handleInputChange({
                                    target: {
                                        id: 'outlined-city',
                                        value: newValue || ''
                                    }
                                })}
                                renderInput={(params) => <TextField {...params} label="City" error={Boolean(formErrors.gender)} helperText={formErrors.gender} />}
                            /> */}
                            <TextField
                                required
                                id="outlined-address"
                                label="Address"
                                placeholder="Address"
                                onChange={handleInputChange}
                                error={Boolean(formErrors.address)}
                                helperText={formErrors.address}
                                value={formValues.address}
                            />
                            <TextField
                                required
                                id="outlined-country"
                                label="Country"
                                placeholder="country"
                                onChange={handleInputChange}
                                error={Boolean(formErrors.country)}
                                helperText={formErrors.country}
                                value={formValues.country}
                            />
                            <TextField
                                required
                                id="outlined-state"
                                label="State"
                                placeholder="state"
                                onChange={handleInputChange}
                                error={Boolean(formErrors.state)}
                                helperText={formErrors.state}
                                value={formValues.state}
                            />
                            <TextField
                                required
                                id="outlined-city"
                                label="City"
                                placeholder="city"
                                onChange={handleInputChange}
                                error={Boolean(formErrors.city)}
                                helperText={formErrors.city}
                                value={formValues.city}
                            />
                            <TextField
                                required
                                id="outlined-pin"
                                label="PIN"
                                placeholder="PIN"
                                onChange={handleInputChange}
                                error={Boolean(formErrors.pin)}
                                helperText={formErrors.pin}
                                value={formValues.pin}
                            />
                            {/* Dropdowns for Country, State, City */}
                            {/* Similar to the Gender dropdown */}

                            {/* Fields for firm details */}
                            <Autocomplete
                                id="outlined-firmtype"
                                options={firmTypes}
                                getOptionLabel={(option) => option}
                                onChange={(event, newValue) => handleInputChange({
                                    target: {
                                        id: 'outlined-firmType',
                                        value: newValue || ''
                                    }
                                })}
                                renderInput={(params) => <TextField {...params} label="Firm Type" error={Boolean(formErrors.gender)} helperText={formErrors.gender} />}
                            />
                            <TextField
                                required
                                id="outlined-firmName"
                                label="Firm Name"
                                placeholder="Firm Name"
                                onChange={handleInputChange}
                                error={Boolean(formErrors.firmName)}
                                helperText={formErrors.firmName}
                                value={formValues.firmName}
                            />
                            <TextField
                                required
                                id="outlined-firmAddress"
                                label="Firm Address"
                                placeholder="Firm Address"
                                onChange={handleInputChange}
                                error={Boolean(formErrors.firmAddress)}
                                helperText={formErrors.firmAddress}
                                value={formValues.firmAddress}
                            />
                            <TextField
                                required
                                id="outlined-firmCountry"
                                label="Firm Country"
                                placeholder="Firm Country"
                                onChange={handleInputChange}
                                error={Boolean(formErrors.firmCountry)}
                                helperText={formErrors.firmCountry}
                                value={formValues.firmCountry}
                            /><TextField
                                required
                                id="outlined-firmState"
                                label="Firm State"
                                placeholder="Firm State"
                                onChange={handleInputChange}
                                error={Boolean(formErrors.firmState)}
                                helperText={formErrors.firmState}
                                value={formValues.firmState}
                            /><TextField
                                required
                                id="outlined-firmCity"
                                label="Firm City"
                                placeholder="Firm City"
                                onChange={handleInputChange}
                                error={Boolean(formErrors.firmCity)}
                                helperText={formErrors.firmCity}
                                value={formValues.firmCity}
                            />
                            <TextField
                                required
                                id="outlined-firmPin"
                                label="Firm PIN"
                                placeholder="Firm PIN"
                                onChange={handleInputChange}
                                error={Boolean(formErrors.firmPin)}
                                helperText={formErrors.firmPin}
                                value={formValues.firmPin}
                            />
                            {/* Dropdown for Firm Type */}
                            {/* Similar to the Gender dropdown */}

                            {/* Password field with visibility toggle and generate button */}
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
            </div>
        </React.Fragment>
    );
};

export default AddRetailers;
