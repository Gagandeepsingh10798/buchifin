import React, { useEffect, useState } from 'react';
import NmsUserItem, { StyledCard } from "./NmsUserItem";
import { Typography, Stack } from "@mui/material";
import useAPI from 'app/hooks/useApi';
import useToast from 'app/hooks/useToast';
import TableHeader from './TableHeader';

const NmsUsersTable = () => {
    const { POST } = useAPI();
    const showToast = useToast();

    const [showLoader, setShowLoader] = useState(true);
    const [users, setUsers] = useState([]);
    const [page, setPage] = useState(0);
    const [totalCount, setTotalCount] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [searchValue, setSearchValue] = useState('');

    const fetchUsers = async (limit = 10, page = 0, search = '') => {
        try {
            setShowLoader(true);
            const response = await POST(`/nms/listing?limit=${limit}&page=${page + 1}&search=${search}`, {});
            setShowLoader(false);
            if (response && response.records) {
                setUsers(response.records);
                setPage(response.page - 1);
                setTotalCount(response.count);
            }
            else if (response === null) {
                showToast("Please Login Again", 'error');
            } else {
                showToast('Failed to fetch user data.', 'error');
            }
        } catch (error) {
            console.log(error)
            showToast("Please refresh te page.", 'error');
        }
    };

    useEffect(() => {
        fetchUsers(rowsPerPage, page, searchValue);
    }, [rowsPerPage, searchValue]);

    return (
        <React.Fragment>
            <Typography variant={'h2'} mb={3}>Notices</Typography>
            <TableHeader
                setSearchValue={setSearchValue}
                resetPage={() => setPage(0)}
                refreshData={fetchUsers}
                totalCount={totalCount}
                page={page}
                setPage={setPage}
                fetchUsers={fetchUsers}
                rowsPerPage={rowsPerPage}
                setRowsPerPage={setRowsPerPage}
                showLoader={showLoader}
            />
            {showLoader ? <NmsUserItem user={null} key={0} showLoader={true} /> : <></>}
            {users.length > 0 ? (showLoader ? <></> :
                users.map((user, index) => <NmsUserItem user={user} key={index} />)
            ) : (showLoader ? <></> :
                <StyledCard>
                    <Stack direction={"row"} alignItems={"center"} justifyContent={"center"} sx={{ p: theme => theme.spacing(2, 1) }}>
                        <Typography variant={"h1"}>Sorry, no records found</Typography>
                    </Stack>
                </StyledCard>
            )}
        </React.Fragment >
    );
};

export default NmsUsersTable;
