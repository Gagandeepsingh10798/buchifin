import React, { useRef } from 'react';
import { Editor } from '@tinymce/tinymce-react';
const items = [
    { name: "Category Of Dispute", value: "categoryOfDispute" },
    { name: "Court Name", value: "courtName" },
    { name: "Date Of Offence", value: "dateOfOffence" },
    { name: "Time Of Offence", value: "timeOfOffence" },
    { name: "Type Of Offence", value: "typeOfOffence" },
    { name: "Case Number", value: "caseNumber" },
    { name: "Compounding Fee", value: "compoundingFee" },
    { name: "Total Fine Amount", value: "totalFineAmount" },
    { name: "Section Of Offence", value: "sectionOfOffence" },
    { name: "Vehicle Number", value: "vehicleNumber" },
    { name: "Owner Name", value: "ownerName" },
    { name: "Traffic Police Representative Phone", value: "trafficPoliceRepresentativePhone" },
    { name: "Judge Name", value: "judgeName" },
    { name: "Number Of Offence", value: "numberOfOffence" },
    { name: "Type Of Document Seized", value: "typeOfDocumentSeized" },
    { name: "Document Collection Point", value: "documentCollectionPoint" },
    { name: "Taluka District", value: "talukaDistrict" },
    { name: "Claim Amount", value: "claimAmount" },
    { name: "Loan Amount", value: "loanAmount" },
    { name: "Loan Account Number", value: "loanAccountNumber" },
    { name: "Petitioner Name", value: "petitionerName" },
    { name: "Petitioner Phone", value: "petitionerPhone" },
    { name: "Petitioner Email", value: "petitionerEmail" },
    { name: "Petitioner Address", value: "petitionerAddress" },
    { name: "Petitioner Organization Name", value: "petitionerOrganizationName" },
    { name: "Respondent Father Name", value: "respondentFatherName" },
    { name: "Respondent Name", value: "respondentName" },
    { name: "Respondent Email", value: "respondentEmail" },
    { name: "Respondent Address", value: "respondentAddress" },
    { name: "Respondent Phone Number", value: "respondentPhoneNumber" },
    { name: "Police Station", value: "policeStation" },
    { name: "Complaint Description", value: "complaintDescription" },
    { name: "Challan Number", value: "challanNumber" },
    { name: "Challan Address", value: "challanAddress" },
    { name: "Pre-Conciling Date", value: "preConcilingDate" }
];

const TinyMCEEditor = ({ onEditorChange, currentContent }) => {
    const editorRef = useRef(null);
    const useDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const autocompleteSetup = (editor) => {
        editor.ui.registry.addAutocompleter("autocomplete-items", {
            trigger: "@",
            minChars: 1,
            columns: 1,
            onAction: (autocompleteApi, rng, value) => {
                editor.selection.setRng(rng);
                const selectedItem = items.find(item => item.name === value);
                if (selectedItem) {
                    editor.insertContent(`<strong>[[${selectedItem.value}]]</strong>&nbsp;`);
                }
                autocompleteApi.hide();
            },
            fetch: (pattern) => {
                return new Promise((resolve) => {
                    const filteredItems = items.filter(
                        (item) => item.name.toLowerCase().includes(pattern.toLowerCase())
                    );
                    const results = filteredItems.map((item) => ({
                        type: "autocompleteitem",
                        value: item.name,
                        text: item.name
                    }));
                    resolve(results);
                });
            }
        });
    };

    return (
        <>
            <Editor
                apiKey='eoawv1ri1hxhebwdwk7em2zud5r0aqu296z4nxj5ctjd5mtd'
                onEditorChange={onEditorChange}
                onInit={(evt, editor) => {
                    editorRef.current = editor;
                }}
                value={currentContent}
                init={{
                    setup: autocompleteSetup,
                    plugins: 'print preview paste importcss searchreplace autolink autosave save directionality code visualblocks visualchars image link media template codesample table charmap hr pagebreak nonbreaking anchor toc insertdatetime advlist lists wordcount imagetools textpattern noneditable help charmap quickbars emoticons',
                    imagetools_cors_hosts: ['picsum.photos'],
                    menubar: 'file edit view insert format tools table help',
                    toolbar: 'undo redo | bold italic underline strikethrough | fontselect fontsizeselect formatselect | alignleft aligncenter alignright alignjustify | outdent indent |  numlist bullist | forecolor backcolor removeformat | pagebreak | charmap emoticons | fullscreen  preview save print | insertfile image media template link anchor codesample | ltr rtl',
                    toolbar_sticky: true,
                    autosave_ask_before_unload: true,
                    autosave_interval: '30s',
                    autosave_prefix: '{path}{query}-{id}-',
                    autosave_restore_when_empty: false,
                    autosave_retention: '2m',
                    image_advtab: true,
                    link_list: [
                        { title: 'My page 1', value: 'https://www.tiny.cloud' },
                        { title: 'My page 2', value: 'http://www.moxiecode.com' }
                    ],
                    image_list: [
                        { title: 'My page 1', value: 'https://www.tiny.cloud' },
                        { title: 'My page 2', value: 'http://www.moxiecode.com' }
                    ],
                    image_class_list: [
                        { title: 'None', value: '' },
                        { title: 'Some class', value: 'class-name' }
                    ],
                    importcss_append: true,
                    file_picker_callback: function (callback, value, meta) {
                        let input = document.createElement('input');
                        input.setAttribute('type', 'file');
                        input.setAttribute('accept', 'image/*');

                        input.onchange = () => {
                            let file = input.files[0];
                            if (file && /^image\//.test(file.type)) {
                                let reader = new FileReader();
                                reader.onload = (e) => {
                                    callback(e.target.result, { alt: file.name });
                                };
                                reader.readAsDataURL(file);
                            } else {
                                // Show error dialog if the selected file is not an image
                                this.notificationManager.open({
                                    text: 'Please select an image file.',
                                    type: 'error'
                                });
                                this.windowManager.close();
                            }
                        };

                        input.click();
                    },
                    templates: [
                        { title: 'New Table', description: 'creates a new table', content: '<div class="mceTmpl"><table width="98%%"  border="0" cellspacing="0" cellpadding="0"><tr><th scope="col"> </th><th scope="col"> </th></tr><tr><td> </td><td> </td></tr></table></div>' },
                        { title: 'Starting my story', description: 'A cure for writers block', content: 'Once upon a time...' },
                        { title: 'New list with dates', description: 'New List with dates', content: '<div class="mceTmpl"><span class="cdate">cdate</span><br /><span class="mdate">mdate</span><h2>My List</h2><ul><li></li><li></li></ul></div>' }
                    ],
                    template_cdate_format: '[Date Created (CDATE): %m/%d/%Y : %H:%M:%S]',
                    template_mdate_format: '[Date Modified (MDATE): %m/%d/%Y : %H:%M:%S]',
                    height: 600,
                    image_caption: true,
                    quickbars_selection_toolbar: 'bold italic | quicklink h2 h3 blockquote quickimage quicktable',
                    noneditable_noneditable_class: 'mceNonEditable',
                    toolbar_mode: 'sliding',
                    contextmenu: 'link image imagetools table',
                    skin: useDarkMode ? 'oxide-dark' : 'oxide',
                    content_css: useDarkMode ? 'dark' : 'default',
                    content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
                }}
            />
        </>
    );
}

export default TinyMCEEditor;
