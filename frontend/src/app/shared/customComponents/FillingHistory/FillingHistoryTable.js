import React, { useEffect, useState } from 'react';
import FillingHistoryItem, {StyledCard} from "./FillingHistoryItem";
import { Typography, TablePagination, Stack } from "@mui/material";
import useAPI from 'app/hooks/useApi';
import useToast from 'app/hooks/useToast';
import TableHeader from './TableHeader';

const FillingHistoryTable = () => {
    const { POST } = useAPI();
    const showToast = useToast();

    const [showLoader, setShowLoader] = useState(true);
    const [notices, setNotices] = useState([]);
    const [history, setHistory] = useState([]);
    const [page, setPage] = useState(0);
    const [totalCount, setTotalCount] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [searchValue, setSearchValue] = useState('');

    const fetchHistory = async (limit = 10, page = 1, search = '') => {
        try {
            setShowLoader(true);
            const response = await POST(`/filling/listing?limit=${limit}&page=${page + 1}&search=${search}`, {});
            setShowLoader(false);
            if (response && response.records) {
                setHistory(response.records);
                setPage(response.page - 1);
                setTotalCount(response.count);
                // fetchHistory(limit, page, search);
            } 
            else if(response === null){
                showToast("Please Login Again", 'error');
            } else {
                showToast('Failed to fetch user data.', 'error');
            }
        } catch (error) {
            console.log(error)
            showToast("Please refresh the page.", 'error');
        }
    };
    const fetchNotices = async () => {
        try {
            const response = await POST('/nms/listing');
            if (response && response.records) {
                setNotices(response.records);
            }
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        fetchHistory(rowsPerPage, page, searchValue);
        fetchNotices();
    }, [ rowsPerPage, searchValue]);

    return (
        <React.Fragment>
            <Typography variant={'h2'} mb={3}>Fillings</Typography>
            <TableHeader
                setSearchValue={setSearchValue}
                resetPage={() => setPage(0)}
                refreshData={fetchHistory}
                totalCount={totalCount}
                page={page}
                setPage={setPage}
                fetchHistory={fetchHistory}
                rowsPerPage={rowsPerPage}
                setRowsPerPage={setRowsPerPage}
                showLoader={showLoader}
            />
             {showLoader ? <FillingHistoryItem filling={null} key={0} showLoader={true} /> : <></>}
            {history.length > 0 ?  (showLoader ? <></> :
                history.map((filling, index) => <FillingHistoryItem filling={filling} key={index} notices={notices} />)
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

export default FillingHistoryTable;
