import React, { useState } from 'react';
import Stack from "@mui/material/Stack";
import Avatar from "@mui/material/Avatar";
import { Card, Typography } from "@mui/material";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import styled from "@emotion/styled";
import Span from "@jumbo/shared/Span";
import { CircularStatic } from 'app/pages/components/mui/Progress/CircularProgressWithLabel'
import CircularProgress from '@mui/material/CircularProgress';
import JumboDdMenu from "@jumbo/components/JumboDdMenu";
import NotesIcon from '@mui/icons-material/Notes';
import NmsAttach from './NmsAttach';
import useToast from 'app/hooks/useToast';
import DownloadIcon from '@mui/icons-material/Download';
const Item = styled(Span)(({ theme }) => ({
    padding: theme.spacing(0, 1),
}));


const FillingHistoryItem = ({ filling, showLoader, notices }) => {

    const showToast = useToast();
    const [addAttachNoticeDialog, setAddAttachNoticeDialog] = useState(false);

    const handleSuccessfulAdd = (noticeName) => {
        filling.nms = {
            label: noticeName
        };

        setAddAttachNoticeDialog(false);
        setTimeout(() => {
            showToast(`Successfully attach the notice ${noticeName} to filling ${filling.label}!`, 'success');
        }, 500);
    }

    const handleAddError = () => {
        setAddAttachNoticeDialog(false);
        setTimeout(() => {
            showToast('Failed to attach the notice. Please try again.', 'error');
        }, 500);
    }

    const handleOpenAttachNotice = (action) => {
        if (action.action === 'attachNotice') {
            setAddAttachNoticeDialog(true);
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

                        <Item>

                            <Avatar
                                sx={{
                                    width: 56,
                                    height: 56
                                }}
                                alt={filling.label}
                                src={'https://cdn-icons-png.flaticon.com/512/149/149071.png'}
                            />

                        </Item>
                        <Item>
                            <Typography variant={"h6"} mb={.5}>{filling.label}</Typography>
                            <Typography variant={"body1"} color="text.secondary">{`Filed By : ${filling.createdBy.name}`}</Typography>
                            <Typography variant={"body1"} color="text.secondary">{`           ${filling.createdBy.email}`}</Typography>
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
                    <Typography variant={"h6"} mt={1} lineHeight={1.25}>{filling.district.district}</Typography>
                    <Typography variant={"body1"} color="text.secondary">District Name</Typography>
                </Item>
                <Item
                    sx={{
                        alignSelf: 'flex-start',
                        flexBasis: { md: '28%', lg: '18%' },
                        display: { xs: 'none', md: 'block' }
                    }}
                >
                    <Typography variant={"h6"} mt={1} lineHeight={1.25}>{filling.government.state}</Typography>
                    <Typography variant={"body1"} color="text.secondary">Government Name</Typography>
                </Item>
                <Item
                    sx={{
                        alignSelf: 'flex-start',
                        flexBasis: { md: '28%', lg: '18%' },
                        display: { xs: 'none', md: 'block' }
                    }}
                >
                    <Typography variant={"h6"} mt={1} lineHeight={1.25}>{filling.type || 'N/A'}</Typography>
                    <Typography variant={"body1"} color="text.secondary">Category Name</Typography>
                </Item>
                <Item
                    sx={{
                        alignSelf: 'flex-start',
                        flexBasis: { md: '28%', lg: '18%' },
                        display: { xs: 'none', md: 'block' }
                    }}
                >
                    <Typography variant={"h6"} mt={1} lineHeight={1.25}>{filling.nms?.label || 'N/A'}</Typography>
                    <Typography variant={"body1"} color="text.secondary">Notice Attached</Typography>
                </Item>
                <Item
                    sx={{
                        alignSelf: 'flex-start',
                        flexBasis: { md: '28%', lg: '18%' },
                        display: { xs: 'none', md: 'block' }
                    }}
                >
                    <CircularStatic value={((filling.totalCases / filling.totalRecords) * 100)} />
                </Item>
                <Item
                    sx={{
                        flexBasis: '30%',
                        display: { xs: 'none', lg: 'block' }
                    }}
                >
                    <Stack spacing={4} direction={"row"} alignItems={"center"} sx={{ textAlign: 'center' }}>
                        <Item>
                            <Typography variant={"h6"} mb={.5}>{filling.totalRecords}</Typography>
                            <Typography variant={"body1"} color="text.secondary">Cases</Typography>
                        </Item>
                        <Item>
                            <Typography variant={"h6"} mb={.5}>{filling.errors}</Typography>
                            <Typography variant={"body1"} color="text.secondary">Errored Cases</Typography>
                        </Item>
                    </Stack>
                </Item>




                <Item sx={{ ml: { xs: 'auto', sm: 0 } }}>
                    <JumboDdMenu
                        icon={<MoreHorizIcon />}
                        menuItems={[
                            ...(((filling.totalCases / filling.totalRecords) * 100) === 100 ? [{ icon: <NotesIcon />, title: "Attach Notice", action: "attachNotice" }] : []),
                            ...(((filling.totalCases / filling.totalRecords) * 100) === 100 ? [{ icon: <DownloadIcon />, title: "Download Healthy Records", action: "downloadHealthyRecords" }] : []),
                            ...(((filling.totalCases / filling.totalRecords) * 100) === 100 ? [{ icon: <DownloadIcon />, title: "Download Error Records", action: "downloadErrorRecords" }] : [])
                        ]}
                        onClickCallback={handleOpenAttachNotice}
                    />
                    <NmsAttach open={addAttachNoticeDialog} onClose={() => setAddAttachNoticeDialog(false)} onSuccessfulAdd={handleSuccessfulAdd} onError={handleAddError} fillingId={filling._id} noticeList={notices} />
                </Item>
            </Stack>
        </Card>
    );
};

export const StyledCard = styled(Card)(({ theme }) => ({
    marginBottom: theme.spacing(1),
}));


export default FillingHistoryItem;
