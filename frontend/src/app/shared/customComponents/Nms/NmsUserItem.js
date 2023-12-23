import React from 'react';
import Stack from "@mui/material/Stack";
import Badge from "@mui/material/Badge";
import Avatar from "@mui/material/Avatar";
import { Card, IconButton, Typography, Checkbox, Chip } from "@mui/material";
import CircularProgress from '@mui/material/CircularProgress';
import Button from "@mui/material/Button";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import JumboDdMenu from "@jumbo/components/JumboDdMenu";
import styled from "@emotion/styled";
import Span from "@jumbo/shared/Span";
import EditIcon from "@mui/icons-material/Edit";
import { Link, useNavigate } from 'react-router-dom';


const Item = styled(Span)(({ theme }) => ({
    padding: theme.spacing(0, 1),
}));

const NmsUserItem = ({ user, showLoader }) => {
    const navigate = useNavigate();
    const handleSubMenu = (action) => {
        if (action.action === "edit") {
            navigate(`/nms/edit/${user._id}`);
        }
    };

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
                        {/* <Item sx={{ ml: -1 }}>
                            <Checkbox indeterminate={false} sx={{ verticalAlign: 'middle' }} />

                        </Item> */}
                        <Item>
                            {/* <Badge overlap="circular" variant="dot"
                                   anchorOrigin={{
                                       vertical: 'bottom',
                                       horizontal: 'right',
                                   }}
                                   sx={{
                                       '.MuiBadge-badge': {
                                           border: '2px solid #FFF',
                                           height: '14px',
                                           width: '14px',
                                           borderRadius: '50%',
                                           bgcolor: user.isOnline ? "success.main" : "#757575"
                                       }
                                   }}
                            > */}
                            <Avatar
                                sx={{
                                    width: 56,
                                    height: 56
                                }}
                                alt={`${user.createdBy.name}`}
                                src={'https://cdn-icons-png.flaticon.com/512/149/149071.png'}
                            />
                            {/* </Badge> */}
                        </Item>
                        <Item>
                            <Typography variant={"h6"} mb={.5}>{`${user.createdBy.name}`}</Typography>
                            <Typography variant={"body1"} color="text.secondary">{user.createdBy.email}</Typography>
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
                    <Typography variant={"h6"} mt={1} lineHeight={1.25}>{`${user.label}`}</Typography>
                    <Typography variant={"body1"} color="text.secondary">Label</Typography>
                </Item>
                <Item
                    sx={{
                        alignSelf: 'flex-start',
                        flexBasis: { md: '28%', lg: '18%' },
                        display: { xs: 'none', md: 'block' }
                    }}
                >
                    <Typography variant={"h6"} mt={1} lineHeight={1.25}>{`${user.government.state}`}</Typography>
                    <Typography variant={"body1"} color="text.secondary">Government Name</Typography>
                </Item>
                <Item
                    sx={{
                        alignSelf: 'flex-start',
                        flexBasis: { md: '28%', lg: '18%' },
                        display: { xs: 'none', md: 'block' }
                    }}
                >
                    <Typography variant={"h6"} mt={1} lineHeight={1.25}>{`${user.district.district}`}</Typography>
                    <Typography variant={"body1"} color="text.secondary">District Name</Typography>
                </Item>
                <Item
                    sx={{
                        flexBasis: '20%',
                        display: { xs: 'none', lg: 'block' }
                    }}
                >
                    <Stack spacing={3} direction={"row"} alignItems={"center"} sx={{ textAlign: 'center' }}>
                        <Item>
                            <Typography variant={"h6"} mb={.5}>{user.type}</Typography>
                            <Typography variant={"body1"} color="text.secondary">Category</Typography>
                        </Item>
                    </Stack>
                </Item>
                <Item sx={{ ml: { xs: 'auto', sm: 0 } }}>
                    <JumboDdMenu
                        icon={<MoreHorizIcon />}
                        menuItems={[
                            { icon: <EditIcon />, title:"Edit", action: "edit" },
                        ]}
                        onClickCallback={handleSubMenu}
                    />
                </Item>

            </Stack>
        </Card>
    );
};

export const StyledCard = styled(Card)(({ theme }) => ({
    marginBottom: theme.spacing(1),
}));


export default NmsUserItem;
