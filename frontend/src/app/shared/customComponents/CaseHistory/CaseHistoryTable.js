import React, { useEffect, useState } from 'react';
import CaseHistoryItem, { StyledCard } from "./CaseHistoryItem";
import { Typography, TablePagination, Stack } from "@mui/material";
import useAPI from 'app/hooks/useApi';
import useToast from 'app/hooks/useToast';
import TableHeader from './TableHeader';
import { useParams } from 'react-router-dom';

const CaseHistoryTable = () => {
    const { caseType } = useParams();
    console.log(caseType)
    const caseTypeMapping = {
        'niact': "NI_ACT",
        'challan': "CHALLAN"
    };

    const { POST,GET } = useAPI();
    const showToast = useToast();
    const [caseManagers, setCaseManagers] = useState([]);
    const [neutrals, setNeutrals] = useState([]);
    const [showLoader, setShowLoader] = useState(true);
    const [history, setHistory] = useState([]);
    const [page, setPage] = useState(0);
    const [totalCount, setTotalCount] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [searchValue, setSearchValue] = useState('');

    const fetchHistory = async (limit = 10, page = 0, search = '', path) => {
        try {
            setShowLoader(true);
            const response = await POST(`/retailer/get/all`);
            console.log(response)
            setShowLoader(false);
            if (response && response.records) {
                setHistory(response.records);
                setPage(response.page - 1);
                setTotalCount(response.count);
            }
        } catch (error) {
            console.log(error)
        }
    };

    const fetchCaseManagers = async () => {
        try {
            const response = await POST('/casemanager/listing');
            if (response && response.records) {
                setCaseManagers(response.records);
            }
        } catch (error) {
            console.log(error);
        }
    };

    const fetchNeutrals = async () => {
        try {
            const response = await POST('/neutral/listing');
            if (response && response.records) {
                setNeutrals(response.records);
            }
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        fetchHistory(rowsPerPage, page, searchValue);
        // fetchCaseManagers();
        // fetchNeutrals();
    }, [rowsPerPage, searchValue, caseType]);

    useEffect(() => {
        setPage(0);
        setSearchValue('');
        setRowsPerPage(10);
        fetchHistory(10, 0, '');
    }, [caseType]);

    return (
        <React.Fragment>
            <Typography variant={'h2'} mb={3}>{caseType} </Typography>
            <TableHeader
                key={caseType}
                setSearchValue={setSearchValue}
                resetPage={() => setPage(0)}
                refreshData={fetchHistory}
                totalCount={10}
                page={page}
                setPage={setPage}
                fetchHistory={fetchHistory}
                rowsPerPage={rowsPerPage}
                setRowsPerPage={setRowsPerPage}
                showLoader={showLoader}
                caseType={caseType}
            />
            {showLoader ? <CaseHistoryItem caseRecord={null} key={0} showLoader={true} /> : <></>}
            {history.length > 0 ? (showLoader ? <></> :
                history.map((caseRecord, index) => <CaseHistoryItem caseRecord={caseRecord} key={index} caseManagers={caseManagers} neutrals={neutrals} fetchHistory={fetchHistory} />)
            ) : (showLoader ? <></> :
                <StyledCard>
                    <Stack direction={"row"} alignItems={"center"} justifyContent={"center"} sx={{ p: theme => theme.spacing(2, 1) }}>
                        <Typography variant={"h1"}>Sorry, no records found</Typography>
                    </Stack>
                </StyledCard>
            )}
        </React.Fragment>
    );
};

export default CaseHistoryTable;
