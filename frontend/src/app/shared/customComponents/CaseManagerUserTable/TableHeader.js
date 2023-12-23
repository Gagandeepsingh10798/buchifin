import React, { useState, useCallback } from 'react';
import { Card, Checkbox, TablePagination } from "@mui/material";
import styled from "@emotion/styled";
import JumboSearch from "@jumbo/components/JumboSearch";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import AddIcon from '@mui/icons-material/Add';
import CaseManagerAdd from './CaseManagerAdd';
import useToast from 'app/hooks/useToast';
const Item = styled.div(({ theme }) => ({
    padding: theme.spacing(0, 1),
}));

const TableHeader = ({
    setSearchValue,
    resetPage,
    refreshData,
    totalCount,
    page,
    setPage,
    rowsPerPage,
    setRowsPerPage,
    showLoader }) => {
    const showToast = useToast();

    const [addNewGovDialog, setAddNewGovDialog] = useState(false);
    const [isGovAvailable, setGovAvailable] = useState(true);


    const debounce = (func, delay) => {
        let debounceTimer;
        return function (...args) {
            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(() => func(...args), delay);
        };
    };

    const handleSearchChange = useCallback(debounce((value) => {
        resetPage();
        setSearchValue(value);
    }, 500), []);

    const handleAddError = (message) => {
        setAddNewGovDialog(false);
        setTimeout(() => {
            showToast(message, 'error');
        }, 500);
    }

    const handleSuccessfulAdd = (name) => {
        setAddNewGovDialog(false);
        setTimeout(() => {
            showToast(`Successfully added the case manager ${name}!`, 'success');
            refreshData();
        }, 500);
    }


    return (
        <Card sx={{ mb: 1 }}>
            <Stack direction={"row"} alignItems={"center"} justifyContent="space-between" sx={{ p: theme => theme.spacing(2, 1) }}>
                <Stack direction={"row"} alignItems={"center"}>
                    {/* <Checkbox indeterminate={true} /> */}
                    <Item
                        sx={{
                            flex: { xs: 1, md: '0 1 45%', lg: '0 1 35%' }
                        }}
                    >
                        <JumboSearch
                            onChange={(e) => {
                                setSearchValue(e);
                                handleSearchChange(e);
                            }}
                            sx={{
                                display: { xs: 'none', md: 'block' }
                            }}
                        />
                    </Item>
                    <TablePagination
                        showFirstButton={true}
                        showLastButton={true}
                        disabled={true}
                        component="div"
                        count={totalCount}
                        page={page}
                        onPageChange={(event, newPage) => {
                            setPage(newPage)
                        }}
                        rowsPerPage={rowsPerPage}
                        onRowsPerPageChange={(event) => {
                            setRowsPerPage(parseInt(event.target.value, 10));
                            setPage(0);
                        }}
                        {...(showLoader ? {
                            SelectProps: {
                                disabled: showLoader
                            },
                            backIconButtonProps: {
                                disabled: showLoader
                            },
                            nextIconButtonProps: {
                                disabled: showLoader
                            }
                        } : {})}
                    />
                </Stack>
                {
                    isGovAvailable && <Button variant="contained" endIcon={<AddIcon />} onClick={() => setAddNewGovDialog(true)}>
                        ADD
                    </Button>
                }

            </Stack>
            <CaseManagerAdd open={addNewGovDialog} onClose={() => setAddNewGovDialog(false)} onSuccessfulAdd={handleSuccessfulAdd} onError={handleAddError} setGovAvailable={setGovAvailable} />
        </Card>

    );
};

export default TableHeader;
