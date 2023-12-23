import React, { useState, useEffect } from 'react';
import Typography from "@mui/material/Typography";
import TinyMCEEditor from "./Editor";
import { useTranslation } from "react-i18next";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import { Stack, Button, Alert } from "@mui/material";
import JumboCardQuick from '@jumbo/components/JumboCardQuick/JumboCardQuick';
import Div from "@jumbo/shared/Div";
import useAPI from 'app/hooks/useApi';
import useToast from 'app/hooks/useToast';

const NmsAdd = () => {
    const { t } = useTranslation();
    const { POST } = useAPI();
    const showToast = useToast();
    const languagesList = [
        { name: "English", code: "en" },
        { name: "Hindi", code: "hi" },
        { name: "Bengali", code: "bn" },
        { name: "Telugu", code: "te" },
        { name: "Marathi", code: "mr" },
        { name: "Tamil", code: "ta" },
        { name: "Urdu", code: "ur" },
        { name: "Gujarati", code: "gu" },
        { name: "Malayalam", code: "ml" },
        { name: "Kannada", code: "kn" },
        { name: "Odia", code: "or" },
        { name: "Punjabi", code: "pa" },
        { name: "Assamese", code: "as" },
        { name: "Maithili", code: "mai" },
        { name: "Bhojpuri", code: "bh" },
        { name: "Santali", code: "sat" },
        { name: "Kashmiri", code: "ks" },
        { name: "Nepali", code: "ne" },
        { name: "Konkani", code: "kok" },
        { name: "Sindhi", code: "sd" },
        { name: "Dogri", code: "doi" },
        { name: "Manipuri", code: "mni" },
        { name: "Tulu", code: "tcy" },
        { name: "Sanskrit", code: "sa" },
        { name: "Rajasthani", code: "raj" },
        { name: "Chhattisgarhi", code: "hne" },
        { name: "Goan Konkani", code: "gom" },
        { name: "Bodo", code: "brx" },
        { name: "Magahi", code: "mag" },
        { name: "Awadhi", code: "awa" },
        { name: "Braj", code: "bra" }
    ];
    const [languages, setLanguages] = useState(languagesList.find(lang => lang.name === "English"));
    const [sources, setSources] = useState({});
    const [governments, setGovernments] = useState([]);
    const [editorContent, setEditorContent] = useState('');
    const [districts, setDistricts] = useState([]);
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
    const [showError, setShowError] = useState({
        error: false,
        value: ''
    });

    const fetchGovernments = async () => {
        const response = await POST('/government/listing', {});
        if (response && response.records) {
            setGovernments(response.records);
        } else if (response === null) {
            showToast("Please Login Again", 'error');
        } else {
            showToast('Failed to fetch government data.', 'error');
        }
    };

    const fetchDistricts = async (government) => {
        const response = await POST('/district/listing?limit=all', { "government": government?._id });
        if (response && response.records) {
            setDistricts(response.records);
        } else if (response === null) {
            showToast("Please Login Again", 'error');
        } else {
            showToast('Failed to fetch district data.', 'error');
        }
    };

    const handleGovChange = (event, newValue) => {
        setGov({
            value: newValue,
            error: !newValue,
        });
        fetchDistricts(newValue);
    };
    const resetStates = () => {
        setEditorContent('');
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
        setShowError({
            error: false,
            value: ''
        });
        setSources({});
        setLanguages(languagesList.find(lang => lang.name === "English"));
    }

    const handleSave = async () => {
        let sourcePayload = {};
        Object.keys(sources).forEach(lang => {
            if (sources[lang].trim() !== '') {
                sourcePayload[lang] = sources[lang];
            }
        });

        const payload = {
            ...(Label.value && { label: Label.value }),
            ...(Gov.value && { government: Gov.value._id }),
            ...(District.value && { district: District.value._id }),
            ...(Category.value && { type: Category.value }),
            sources: sourcePayload
        };

        if (!Label.value) {
            setLabel(prev => ({ ...prev, error: true }));
        } else {
            const response = await POST('/nms/create', payload);
            if (response) {
                showToast(`Successfully added the notice ${response.label}!`, 'success');
                resetStates();
            }
        }
    };

    const handleLanguageChange = (newValue) => {
        console.log(newValue)
        setLanguages(newValue);
        if (!sources[newValue.code]) {
            setSources(prevSources => ({
                ...prevSources,
                [newValue.code]: ''
            }));
        }
    };



    useEffect(() => {
        fetchGovernments();
    }, []);

    return (
        <React.Fragment>
            <JumboCardQuick title={t('pages.title.nmsAdd')}>
                <Div sx={{ width: '100%' }}>
                    <Stack justifyContent="space-between" direction="row" spacing={2}>
                        <TextField
                            label="Label"
                            value={Label.value}
                            onChange={(event) => setLabel({ value: event.target.value, error: !event.target.value })}
                            error={Label.error}
                            helperText={Label.error ? "Label is required" : ""}
                        />
                        <Autocomplete
                            onChange={handleGovChange}
                            disablePortal
                            id="combo-box-demo"
                            getOptionLabel={(option) => option.state}
                            options={governments}
                            sx={{ width: 300 }}
                            value={Gov.value}
                            renderInput={(params) => <TextField {...params} label="Government" />}
                        />
                        <Autocomplete
                            onChange={(event, newValue) => setDistrict({ value: newValue, error: !newValue })}
                            disablePortal
                            id="district-autocomplete"
                            getOptionLabel={(option) => option.district}
                            options={districts}
                            sx={{ width: 300 }}
                            value={District.value}
                            renderInput={(params) => <TextField {...params} label="District" />}
                        />
                        <Autocomplete
                            onChange={(event, newValue) => setCategory({ value: newValue, error: !newValue })}
                            disablePortal
                            id="combo-box-demo"
                            options={['PRE_LITIGATION', 'POST_LITIGATION', 'CHALLAN', 'NON_CHALLAN']}
                            sx={{ width: 300 }}
                            value={Category.value}
                            renderInput={(params) => <TextField {...params} label="Category" />}
                        />


                    </Stack>
                    <br />
                    <Stack justifyContent="space-between" direction="row" spacing={2}>
                        <Autocomplete
                            onChange={(event, newValue) => handleLanguageChange(newValue)}
                            disablePortal
                            disableClearable
                            id="languages-autocomplete"
                            options={languagesList}
                            getOptionLabel={(option) => option.name}
                            value={languages}
                            sx={{ width: 300 }}
                            renderInput={(params) => <TextField {...params} label="Languages" />}
                        />
                    </Stack>
                    <br />
                    {
                        languages && (
                            <div>
                                <Typography variant="h6">{languages.name}</Typography>
                                <TinyMCEEditor
                                    key={languages.code}
                                    onEditorChange={(content) => {
                                        setSources(prevSources => ({ ...prevSources, [languages.code]: content }));
                                    }}
                                    currentContent={sources[languages.code] || ''}
                                />
                            </div>
                        )
                    }
                    <br />
                    <Button disableElevation sx={{ mb: 2.5 }} variant={"contained"} onClick={handleSave}>Save</Button>
                    {showError.error && <Alert severity="error">{showError.value}</Alert>}
                </Div>
            </JumboCardQuick>
        </React.Fragment>
    );
};

export default NmsAdd;
