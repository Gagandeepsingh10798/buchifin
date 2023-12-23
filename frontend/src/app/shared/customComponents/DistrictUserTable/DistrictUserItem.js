import React from 'react';
import Stack from "@mui/material/Stack";
import Avatar from "@mui/material/Avatar";
import {Card, IconButton, Typography, Checkbox, Chip} from "@mui/material";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import styled from "@emotion/styled";
import Span from "@jumbo/shared/Span";
import CircularProgress from '@mui/material/CircularProgress';

const Item = styled(Span)(({theme}) => ({
    padding: theme.spacing(0, 1),
}));

const DistrictUserItem = ({user, showLoader}) => {
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
        <Card sx={{mb: 1}}>
            <Stack direction={"row"} alignItems={"center"} sx={{p: theme => theme.spacing(2, 1)}}>
           
                <Item
                    sx={{
                        flex: {xs: 1, md: '0 1 45%', lg: '0 1 35%'}
                    }}
                >
                    <Stack direction={'row'} alignItems={'center'}>
                        {/* <Item sx={{ml: -1}}>
                        <Checkbox indeterminate={false} sx={{verticalAlign: 'middle'}} />
                            
                        </Item> */}
                        <Item>
                                <Avatar
                                    sx={{
                                        width: 56,
                                        height: 56
                                    }}
                                    alt={`${user.user.name}`}
                                    src={'https://cdn-icons-png.flaticon.com/512/149/149071.png'}
                                />
                        </Item>
                        <Item>
                            <Typography variant={"h6"} mb={.5}>{`${user.user.name}`}</Typography>
                            <Typography variant={"body1"} color="text.secondary">{user.user.email}</Typography>
                        </Item>
                    </Stack>
                </Item>
                <Item
                    sx={{
                        alignSelf: 'flex-start',
                        flexBasis: {md: '28%', lg: '18%'},
                        display: {xs: 'none', md: 'block'}
                    }}
                >
                    <Typography variant={"h6"} mt={1} lineHeight={1.25}>{`${user.district}`}</Typography>
                    <Typography variant={"body1"} color="text.secondary">District Name</Typography>
                </Item>
                <Item
                    sx={{
                        alignSelf: 'flex-start',
                        flexBasis: {md: '28%', lg: '18%'},
                        display: {xs: 'none', md: 'block'}
                    }}
                >
                    <Typography variant={"h6"} mt={1} lineHeight={1.25}>{user.government.state}</Typography>
                    <Typography variant={"body1"} color="text.secondary">Government Name</Typography>
                </Item>
                {/* <Item
                    sx={{
                        alignSelf: 'flex-start',
                        flexBasis: {md: '28%', lg: '18%'},
                        display: {xs: 'none', md: 'block'}
                    }}
                >
                   <Chip label="active" color="success"/>
                </Item> */}
                <Item
                    sx={{
                        flexBasis: '30%',
                        display: {xs: 'none', lg: 'block'}
                    }}
                >
                    <Stack spacing={3} direction={"row"} alignItems={"center"} sx={{textAlign: 'center'}}>
                        {/* <Item>
                            <Typography variant={"h6"} mb={.5}>{100}</Typography>
                            <Typography variant={"body1"} color="text.secondary">Views</Typography>
                        </Item> */}
                        <Item>
                            <Typography variant={"h6"} mb={.5}>{user.fillingCount}</Typography>
                            <Typography variant={"body1"} color="text.secondary">Fillings</Typography>
                        </Item>
                        <Item>
                            <Typography variant={"h6"} mb={.5}>{user.caseCount}</Typography>
                            <Typography variant={"body1"} color="text.secondary">Cases</Typography>
                        </Item>
                    </Stack>
                </Item>
                
                {/* <Item
                    sx={{
                        ml: 'auto',
                        display: {xs: 'none', sm: 'block'}
                    }}
                >
                    <Button sx={{minWidth: 92}} disableElevation variant={"contained"} size={"small"}
                            color={user.isFollowing ? "error" : "primary"}>
                        {user.isFollowing ? "Unfollow" : "Follow"}
                    </Button>
                </Item> */}
                {/* <Item sx={{ml: {xs: 'auto', sm: 0}}}>
                    <IconButton aria-label="settings">
                        <MoreHorizIcon/>
                    </IconButton>
                </Item> */}
            </Stack>
        </Card>
    );
};

export const StyledCard = styled(Card)(({ theme }) => ({
    marginBottom: theme.spacing(1),
}));


export default DistrictUserItem;
