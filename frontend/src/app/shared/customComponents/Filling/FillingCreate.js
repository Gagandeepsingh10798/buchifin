import React, { useState, useEffect } from 'react';
import { useDropzone } from "react-dropzone";
import { Button, Autocomplete, Stack, ListItem, Typography, TextField, List, Alert, Grid } from "@mui/material";
import CircularProgress from '@mui/material/CircularProgress';
import Div from "@jumbo/shared/Div";
import JumboCardQuick from '@jumbo/components/JumboCardQuick/JumboCardQuick';
import DndWrapper from "./DndWrapper";
import ExcelJS from 'exceljs';
import Badge from "@mui/material/Badge";
import TruncateText from '../TruncateTextComponent';
import useAPI from 'app/hooks/useApi';
import useToast from 'app/hooks/useToast';

const FillingCreate = () => {

    const { POST } = useAPI();
    const showToast = useToast();
    const [governments, setGovernments] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [submitButtonClicked, setSubmitButtonClicked] = useState(false);
    const [showFileExtensionError, setFileExtensionError] = useState({
        error: false,
        value: ''
    });

    const [validValues, setValidValues] = useState({});
    const [FileProcessing, setFileProcessing] = useState(false);
    const [fileDetails, setFileDetails] = useState({ rows: [], totalRecords: 0, columnCount: 0 });
    const [storedFiles, setStoredFiles] = useState([]);
    const [Label, setLabel] = useState({
        value: '',
        error: false,
    });
    const [Gov, setGov] = useState({
        value: null,
        error: false,
    });
    const [District, setDistrict] = useState({
        value: null,
        error: false,
    });
    const [Category, setCategory] = useState({
        value: null,
        error: false,
    });
    const [columnMappings, setColumnMappings] = useState({});


    const fetchDistricts = async (government) => {
        try {
            const response = await POST('/district/listing?limit=all', { "government": government?._id });
            if (response && response.records) {
                setDistricts(response.records);
            } else if (response === null) {
                showToast("Please Login Again", 'error');
            } else {
                showToast('Failed to fetch district data.', 'error');
            }
        } catch (error) {
            showToast("Please refresh the page.", 'error');
        }
    };

    const fetchGovernments = async () => {
        try {
            const response = await POST('/government/listing', {});
            if (response && response.records) {
                setGovernments(response.records);
            } else if (response === null) {
                showToast("Please Login Again", 'error');
            } else {
                showToast('Failed to fetch government data.', 'error');
            }
        } catch (error) {
            showToast("Please refresh the page.", 'error');
        }
    };

    const constructFormData = () => {
        const formData = new FormData();

        formData.append('label', Label.value.trim());
        formData.append('district', District.value?._id);
        formData.append('government', Gov.value?._id);
        formData.append('type', Category.value);

        const mappings = Object.entries(columnMappings);
        mappings.forEach(([column, mappedColumn], index) => {
            if (mappedColumn !== null) {
                formData.append(`mapping[${index}][column]`, column);
                formData.append(`mapping[${index}][mappedColumn]`, mappedColumn);
            }
        });

        if (storedFiles[0]) {
            formData.append('file', storedFiles[0]);
        }

        return formData;
    };

    function customTrimInput(str) {
        const trimmedStart = str.replace(/^\s+/g, '');
        let result = trimmedStart.replace(/\s+/g, ' ');
        if (str.endsWith(' ')) {
            result += ' ';
        }
        return result;
    }



    const handleColumnMappingChange = (columnName, newValue) => {
        setColumnMappings(prevMappings => ({
            ...prevMappings,
            [columnName]: newValue
        }));
    };

    const getAvailableOptionsForColumn = (columnName) => {
        const selectedValues = Object.values(columnMappings);

        return [
            'courtName',
            'dateOfOffence',
            'timeOfOffence',
            'typeOfOffence',
            'caseNumber',
            'compoundingFee',
            'totalFineAmount',
            'sectionOfOffence',
            'vehicleNumber',
            'ownerName',
            'trafficPoliceRepresentativePhone',
            'judgeName',
            'numberOfOffence',
            'typeOfDocumentSeized',
            'documentCollectionPoint',
            'categoryOfDispute',
            'talukaDistrict',
            'claimAmount',
            'loanAmount',
            'loanAccountNumber',
            'petitionerName',
            'petitionerPhone',
            'petitionerEmail',
            'petitionerAdvocateName',
            'petitionerAdvocatePhone',
            'petitionerAdvocateEmail',
            'petitionerAddress',
            'petitionerOrganizationName',
            'respondentAdvocateName',
            'respondentAdvocatePhone',
            'respondentAdvocateEmail',
            'respondentFatherName',
            'respondentName',
            'respondentEmail',
            'respondentAddress',
            'respondentPhoneNumber',
            'policeStation',
            'complaintDescription',
            'challanNumber',
            'challanAddress',
            'preConcilingDate'
        ].filter(option => !selectedValues.includes(option) || columnMappings[columnName] === option);
    };

    const handleGovChange = (event, newValue) => {
        setGov({
            value: newValue,
            error: !newValue,
        })
        fetchDistricts(newValue);
    };

    const handleLabelChange = (event) => {
        let newValue = event?.target?.value;
        newValue = newValue.trimStart();
        newValue = newValue.replace(/[^a-zA-Z0-9\s]/g, "");
        if (newValue.length < 3) {
            setLabel({ value: newValue, error: true });
        } else {
            setLabel({ value: newValue, error: false });
        }
    }

    const handleDistrictChange = (event, newValue) => {
        setDistrict({
            value: newValue,
            error: !newValue,
        })
    };

    const handleCategoryChange = (event, newValue) => {
        setCategory({
            value: newValue,
            error: !newValue,
        })
    };

    const onDropAccepted = async (files) => {
        setFileProcessing(true);
        setStoredFiles(files);
        const workbook = new ExcelJS.Workbook();
        const reader = new FileReader();

        reader.onload = async (e) => {
            try {
                const buffer = e.target.result;
                await workbook.xlsx.load(buffer);

                const worksheet = workbook.worksheets[0];
                const rowsData = [];
                const columnValidValues = {}; // To store the valid values for each column
                let totalRecords = 0;
                let columnCount = 0;
                const isRowHeader = (row) => row.values.every(cell => typeof cell === 'string');
                let isFirstRow = true;
                worksheet.eachRow({ includeEmpty: false }, (row, rowNumber) => {
                    if (isFirstRow) {
                        if (!isRowHeader(row)) {
                            setFileExtensionError({
                                error: true,
                                value: "The first row doesn't seem to be a header. Please format your Excel file."
                            });
                            setStoredFiles([]);
                            setColumnMappings({});
                            setFileDetails({ rows: [], totalRecords: 0, columnCount: 0 });
                            setValidValues({});  // Empty valid values on error
                            return;
                        }
                        isFirstRow = false;
                        columnCount = row.values.length - 1;
                        rowsData.push(row.values.slice(1));
                    }

                    // Capture first 4 valid values for each column
                    row.values.slice(1).forEach((value, idx) => {
                        if (value && (rowNumber > 1)) {
                            const colName = rowsData[0] && rowsData[0][idx];
                            if (colName) {
                                columnValidValues[colName] = columnValidValues[colName] || [];
                                if (columnValidValues[colName].length < 4) {
                                    columnValidValues[colName].push(JSON.stringify(value));
                                }
                            }
                        }
                    });

                    totalRecords = rowNumber;
                });

                if (showFileExtensionError.error) {
                    return;
                }
                setValidValues(columnValidValues); // Set the valid values
                setFileDetails({
                    rows: rowsData,
                    totalRecords: totalRecords,
                    columnCount: columnCount
                });
            } finally {
                setFileProcessing(false);
            }
        };

        reader.readAsArrayBuffer(files[0]);
    };



    const clearStoredFiles = () => {
        setStoredFiles([]);
        setColumnMappings({});
        setFileDetails({ rows: [], totalRecords: 0, columnCount: 0 });
    };

    const { acceptedFiles, getRootProps, getInputProps } = useDropzone({
        accept: ".xls,.xlsx",
        maxFiles: 1,
        onDropAccepted: onDropAccepted,
        onDropRejected: () => {
            setFileExtensionError({
                error: true,
                vaue: 'Only Excel files are allowed!'
            });
        }
    });

    const files = storedFiles.map(file => (
        <Badge key={file.path} onClick={clearStoredFiles} badgeContent={'X'} color="secondary" sx={{ cursor: 'pointer' }}>
            <ListItem selected sx={{ width: 'auto', mr: 1 }}>
                {file.path} - {(file.size / 1048576).toFixed(2)} MB <br />
                Total Records: {fileDetails.totalRecords} <br />
                Column Count: {fileDetails.columnCount}
            </ListItem>
        </Badge>
    ));

    const resetStates = () => {
        setSubmitButtonClicked(false);
        setColumnMappings({});
        setFileExtensionError({
            error: false,
            value: ''
        });
        setValidValues({});
        setFileProcessing(false);
        setFileDetails({ rows: [], totalRecords: 0, columnCount: 0 });
        setStoredFiles([]);
        setLabel({
            value: '',
            error: false,
        });
        setGov({
            value: null,
            error: false,
        });
        setDistrict({
            value: null,
            error: false,
        });
        setCategory({
            value: null,
            error: false,
        });
    };

    const handleSubscribe = async () => {
        setSubmitButtonClicked(true);
        const formData = constructFormData();
        try {
            const response = await POST('/filling/create', formData, true);
            if (response) {
                showToast('Form submitted successfully!', 'success');
                resetStates()
            } else {
                showToast('Error submitting the form. Please try again.', 'error');
            }
        } catch (error) {
            console.error('Error submitting the form:', error);
            showToast('An unexpected error occurred. Please try again.', 'error');
        }
        setSubmitButtonClicked(false);
    };





    useEffect(() => {

        if (showFileExtensionError) {
            const timer = setTimeout(() => {
                setFileExtensionError({
                    error: false,
                    value: ''
                });
            }, 10000);
            return () => clearTimeout(timer);
        }

    }, [showFileExtensionError]);

    useEffect(() => {

        fetchGovernments();
        fetchDistricts();

    }, []);

    return (
        <React.Fragment>
            <JumboCardQuick title={"Happy , Filling"} subheader={"With superfast Blazing speed"}
                wrapperSx={{ backgroundColor: 'background.paper', pt: 0, height: '100%' }}>
                <Div sx={{ width: '100%' }}>
                    <Stack justifyContent="space-between" direction="row" spacing={2} sx={{ py: { lg: 6.5 }, padding: '10px 0px 10px 0px !important' }}>
                        <TextField
                            inputProps={{ maxLength: 20 }}
                            label="Label"
                            value={Label.value}
                            onChange={handleLabelChange}
                            sx={{
                                padding: '0px 0px 50px 0px'
                            }}
                            error={Label.error}
                            helperText={Label.error ? 'Minimum 3 alphanumeric characters required*' : ''}

                        />
                        <Autocomplete
                            onChange={handleGovChange}
                            disablePortal
                            id="combo-box-demo"
                            getOptionLabel={(option) => option.state}
                            isOptionEqualToValue={(option, value) => option.state === value.state}
                            options={governments}
                            sx={{ width: 300, padding: '0px 0px 50px 0px' }}
                            value={Gov.value}
                            renderInput={(params) => <TextField {...params} error={Gov.error} helperText={`required*`} label="Government" />}
                        />
                        <Autocomplete
                            onChange={handleDistrictChange}
                            disablePortal
                            id="district-autocomplete"
                            getOptionLabel={(option) => option.district}
                            isOptionEqualToValue={(option, value) => option.district === value.district}
                            options={districts}
                            sx={{ width: 300, padding: '0px 0px 50px 0px' }}
                            value={District.value}
                            renderInput={(params) => <TextField {...params} error={District.error} helperText={`required*`} label="District" />}
                        />

                        <Autocomplete
                            onChange={handleCategoryChange}
                            disablePortal
                            // isOptionEqualToValue={(option, value) => option.title === value.title && option.year === value.year}
                            id="combo-box-demo"
                            // getOptionLabel={(option) => option.title}
                            options={['PRE_LITIGATION', 'POST_LITIGATION', 'CHALLAN', 'NON_CHALLAN', 'NI_ACT']}
                            sx={{ width: 300, padding: '0px 0px 50px 0px' }}
                            value={Category.value}
                            renderInput={(params) => <TextField {...params} error={Category.error} helperText={`required*`} label="Category" />}
                        />
                    </Stack>
                    {FileProcessing ? (
                        <Div sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '0px 0px 50px 0px' }}>
                            <CircularProgress variant='indeterminate' />
                        </Div>
                    ) : (
                        <>
                            <DndWrapper>
                                <div {...getRootProps()}>
                                    <input {...getInputProps()} />
                                    <Typography variant={"body1"}>Drag 'n' drop some files here, or click to select
                                        files</Typography>
                                </div>
                            </DndWrapper>
                            {showFileExtensionError.error && <Alert sx={{ marginBottom: "10px" }} severity="error">{showFileExtensionError.value}</Alert>}
                            <div style={{ padding: '0px 0px 50px 0px' }}>
                                <Typography variant={"h4"}>File Details</Typography>
                                <List disablePadding sx={{ display: 'flex', padding: '0px 0px 50px 0px' }}>
                                    {files}
                                </List>
                                <Grid container spacing={3}>
                                    {fileDetails.rows[0]?.map(columnName => (
                                        <Grid container item key={columnName} spacing={3}>
                                            <Grid item xs={6}>
                                                <TruncateText width="50%" variant={"body1"}>{columnName}</TruncateText>
                                                {/* Display the valid values here */}
                                                <List>
                                                    {validValues[columnName]?.map((value, index) => (
                                                        <ListItem key={value + index}>
                                                            <TruncateText width="50%" variant={"body2"}>{value}</TruncateText>
                                                        </ListItem>
                                                    ))}
                                                </List>
                                            </Grid>
                                            <Grid item xs={6}>
                                                <Autocomplete
                                                    fullWidth
                                                    options={getAvailableOptionsForColumn(columnName)}
                                                    value={columnMappings[columnName] || null}
                                                    onChange={(_, newValue) => handleColumnMappingChange(columnName, newValue)}
                                                    renderInput={(params) => <TextField {...params} variant="outlined" fullWidth />}
                                                />
                                            </Grid>
                                        </Grid>
                                    ))}
                                </Grid>

                            </div>
                        </>
                    )}
                    <Button disableElevation disabled={(!Label.value || !Gov.value || !Category.value || !District.value || FileProcessing || !storedFiles[0] || submitButtonClicked)} variant={"contained"} onClick={handleSubscribe}
                        sx={{ mb: 2.5 }}>Submit</Button>
                    {/* <Typography variant={"body1"} color={"text.secondary"} sx={{ fontStyle: 'italic', fontSize: 12 }}>Your
                        email is safe with us, we don't spam.</Typography> */}
                </Div>
            </JumboCardQuick>
        </React.Fragment>
    );
};

export default FillingCreate;
