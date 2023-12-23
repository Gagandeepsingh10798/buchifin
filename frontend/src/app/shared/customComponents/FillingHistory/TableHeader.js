import React, { useState, useCallback } from 'react';
import { Card, Checkbox, TablePagination } from "@mui/material";
import styled from "@emotion/styled";
import JumboSearch from "@jumbo/components/JumboSearch";
import Stack from "@mui/material/Stack";

const Item = styled.div(({ theme }) => ({
    padding: theme.spacing(0, 1),
}));

const TableHeader = ({ setSearchValue,
    resetPage,
    totalCount,
    page,
    setPage,
    fetchHistory,
    rowsPerPage,
    setRowsPerPage,
    showLoader }) => {
    const [searchTerm, setSearchTerm] = useState('');

    const debounce = (func, delay) => {
        let debounceTimer;
        return function (...args) {
            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(() => func(...args), delay);
        };
    };

    const handleSearchChange = useCallback(debounce((value) => {
        if (value) {
            resetPage();
        }
        setSearchValue(value);
    }, 500), []);

    return (
        <Card sx={{ mb: 1 }}>
            <Stack direction={"row"} alignItems={"center"} sx={{ p: theme => theme.spacing(2, 1) }}>
                {/* <Checkbox indeterminate={true} /> */}
                <Item
                    sx={{
                        flex: { xs: 1, md: '0 1 45%', lg: '0 1 35%' }
                    }}
                >
                    <JumboSearch
                        onChange={(e) => {
                            if (e) {
                                setSearchTerm(e);
                                handleSearchChange(e);
                            }
                        }}
                        sx={{
                            display: { xs: 'none', md: 'block' }
                        }}
                    />
                </Item>
                <TablePagination
                        labelRowsPerPage={"Rows per page:"}
                        showFirstButton={true}
                        showLastButton={true}
                        disabled={true}
                        component="div"
                        count={totalCount}
                        page={page}
                        onPageChange={(event, newPage) => {
                            setPage(newPage)
                            fetchHistory(rowsPerPage, newPage, searchTerm);
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
        </Card>
    );
};

export default TableHeader;
