import React, { useState, useCallback } from 'react';
import { Card, Checkbox } from "@mui/material";
import styled from "@emotion/styled";
import JumboSearch from "@jumbo/components/JumboSearch";
import Stack from "@mui/material/Stack";

const Item = styled.div(({ theme }) => ({
    padding: theme.spacing(0, 1),
}));

const TableHeader = ({ setSearchValue , resetPage }) => {
    const [searchTerm, setSearchTerm] = useState('');

    const debounce = (func, delay) => {
        let debounceTimer;
        return function(...args) {
            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(() => func(...args), delay);
        };
    };

    const handleSearchChange = useCallback(debounce((value) => {
        if(value){
            resetPage();
        }
        setSearchValue(value);
    }, 500), []);

    return (
        <Card sx={{ mb: 1 }}>
            <Stack direction={"row"} alignItems={"center"} sx={{ p: theme => theme.spacing(2, 1) }}>
                <Checkbox indeterminate={true} />
                <Item
                    sx={{
                        flex: { xs: 1, md: '0 1 45%', lg: '0 1 35%' }
                    }}
                >
                    <JumboSearch
                        onChange={(e) => {
                            if(e){
                                setSearchTerm(e);
                                handleSearchChange(e);
                            }
                        }}
                        sx={{
                            display: { xs: 'none', md: 'block' }
                        }}
                    />
                </Item>
            </Stack>
        </Card>
    );
};

export default TableHeader;
