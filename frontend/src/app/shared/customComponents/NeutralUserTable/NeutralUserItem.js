import React from 'react';
import Stack from "@mui/material/Stack";
import Avatar from "@mui/material/Avatar";
import { Card, Typography, Chip } from "@mui/material";
import CircularProgress from '@mui/material/CircularProgress';
import styled from "@emotion/styled";
import Span from "@jumbo/shared/Span";

const Item = styled(Span)(({ theme }) => ({
    padding: theme.spacing(0, 1),
}));

const NeutralUserItem = ({ user, showLoader }) => {
    if (showLoader) {
        return (
            <Card sx={{ mb: 1 }}>
                <Stack direction={"row"} alignItems="center" spacing={2}></Stack>
                <Stack direction={"row"} justifyContent="space-evenly" alignItems={"center"} sx={{ alignItems: 'center', p: theme => theme.spacing(2, 1) }}>
                    <Item> <CircularProgress /></Item>
                </Stack>
            </Card>
        );
    }
    return (
        <Card sx={{ mb: 1 }}>
            <Stack direction={"row"} alignItems={"center"} sx={{ p: theme => theme.spacing(2, 1) }}>

                <Item
                    sx={{
                        flex: { xs: 1, md: '0 1 45%', lg: '0 1 35%' }
                    }}
                >
                    <Stack direction={'row'} alignItems={'center'}>

                        <Item>

                            <Avatar
                                sx={{
                                    width: 56,
                                    height: 56
                                }}
                                alt={`${user.name}`}
                                src={'https://cdn-icons-png.flaticon.com/512/149/149071.png'}
                            />

                        </Item>
                        <Item>
                            <Typography variant={"h6"} mb={.5}>{`${user.name}`}</Typography>
                            <Typography variant={"body1"} color="text.secondary">{user.email}</Typography>
                        </Item>
                    </Stack>
                </Item>
                <Item
                    sx={{
                        alignSelf: 'flex-start',
                        flexBasis: { md: '28%', lg: '18%' },
                        display: { xs: 'none', md: 'block' }
                    }}
                >
                    <Typography variant={"h6"} mt={1} lineHeight={1.25}>{`${user.phone}`}</Typography>
                    <Typography variant={"body1"} color="text.secondary">Phone Number</Typography>
                </Item>
                <Item sx={{ flexBasis: '20%', display: { xs: 'none', lg: 'block' } }}>
                    <Stack spacing={3} direction={"row"} alignItems={"center"}>
                        <Item>
                            <Typography variant={"h6"} mb={.5}>{user.casesCount || 0}</Typography>
                            <Typography variant={"body1"} color="text.secondary">Total Assigned Cases</Typography>
                        </Item>
                    </Stack>
                </Item>
            </Stack>
        </Card>
    );
};

export const StyledCard = styled(Card)(({ theme }) => ({
    marginBottom: theme.spacing(1),
}));


export default NeutralUserItem;
