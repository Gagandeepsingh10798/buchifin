import React, { useState } from 'react';
import Stack from "@mui/material/Stack";
import Avatar from "@mui/material/Avatar";
import { Card, Checkbox, Chip, Typography } from "@mui/material";
import Button from "@mui/material/Button";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import styled from "@emotion/styled";
import Span from "@jumbo/shared/Span";
import TruncateText from '../TruncateTextComponent';
import CircularProgress from '@mui/material/CircularProgress';
import { API_URL } from 'app/shared/constants/envVariables';
import JumboDdMenu from "@jumbo/components/JumboDdMenu";
import Visibility from '@mui/icons-material/Visibility';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import { useNavigate } from 'react-router-dom';
import CaseManagerAttach from './caseManagerAttach';
import useToast from 'app/hooks/useToast';
import { useDispatch, useSelector } from "react-redux";
import { selectUserType } from 'app/redux';
import NeutralAttach from './NeutralAttach';
const Item = styled(Span)(({ theme }) => ({
    padding: theme.spacing(0, 1),
}));

const CaseHistoryItem = ({ caseRecord, showLoader, caseManagers, neutrals, fetchHistory }) => {

    const userType = useSelector(selectUserType);
    const navigate = useNavigate();
    const showToast = useToast();
    const [openAssignCaseManagerDialog, setOpenAssignCaseManagerDialog] = useState(false);
    const [openAssignNeutralDialog, setOpenAssignNeutralDialog] = useState(false);


    const formatDateToDDMMYYYY = (isoDate) => {
        const date = new Date(isoDate);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0 indexed
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    };

    const handleSuccessfulAdd = (caseManagerName) => {
        setOpenAssignCaseManagerDialog(false);
        setTimeout(() => {
            showToast(`Successfully assign the case manager ${caseManagerName} to case`, 'success');
        }, 500);
        fetchHistory();
    }

    const handleAddError = (message) => {
        setOpenAssignCaseManagerDialog(false);
        setTimeout(() => {
            showToast(message, 'error');
        }, 500);
        fetchHistory();
    }

    const handleSuccessfulAddNeutral = (caseManagerName) => {
        setOpenAssignNeutralDialog(false);
        setTimeout(() => {
            showToast(`Successfully assign the neutral ${caseManagerName} to case`, 'success');
        }, 500);
        fetchHistory();
    }

    const handleAddErrorNeutral = (message) => {
        setOpenAssignNeutralDialog(false);
        setTimeout(() => {
            showToast(message, 'error');
        }, 500);
        fetchHistory();
    }

    const handleSideMenus = (action) => {
        if (action.action === 'viewCase') {
            navigate(`/admin/view/${caseRecord._id}`);
        }
        else if (action.action === "AssignCaseManager") {
            setOpenAssignCaseManagerDialog(true)
        }
        else if (action.action === "AssignNeutral") {
            setOpenAssignNeutralDialog(true)
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
                                alt={caseRecord.name}
                                src={caseRecord.profilePic}
                            />

                        </Item>
                        <Item>
                            <Typography variant={"h6"} mb={.5}>{caseRecord.name}</Typography>
                            <Typography variant={"body1"} color="text.secondary">{`${caseRecord.phone[0].phone || 'N/A'}`}</Typography>
                            <Typography variant={"body1"} color="text.secondary">{`${caseRecord?.email || 'N/A'}`}</Typography>
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
                    <Typography variant={"body1"} color="text.secondary">Name</Typography>
                    <Typography variant={"h6"} mt={1} lineHeight={1.25}>{caseRecord?.name || 'N/A'}</Typography>
                </Item>
                <Item
                    sx={{
                        alignSelf: 'flex-start',
                        flexBasis: { md: '28%', lg: '18%' },
                        display: { xs: 'none', md: 'block' }
                    }}
                >
                    <Typography variant={"body1"} color="text.secondary">Gender</Typography>
                    <Typography variant={"h6"} mt={1} lineHeight={1.25}>{caseRecord?.gender || 'N/A'}</Typography>
                </Item>
                <Item
                    sx={{
                        alignSelf: 'flex-start',
                        flexBasis: { md: '28%', lg: '18%' },
                        display: { xs: 'none', md: 'block' }
                    }}
                >
                    <Typography variant={"body1"} color="text.secondary">Status</Typography>
                    <Typography variant={"h6"} mt={1} lineHeight={1.25}>{caseRecord?.status || 'N/A'}</Typography>
                </Item>
                {/* <Item
                    sx={{
                        flexBasis: '50%',
                        display: { xs: 'none', lg: 'block' }
                    }}
                >
                    <Stack spacing={2} direction={"row"} alignItems={"center"} sx={{ textAlign: 'center' }}>
                        <Item>
                            <Typography variant={"h6"} mb={.5}>{formatDateToDDMMYYYY(caseRecord.createdAt)}</Typography>
                            <Typography variant={"body1"} color="text.secondary">Filed On</Typography>
                        </Item>
                        <Item>
                            <Typography variant={"h6"} mb={.5}>{formatDateToDDMMYYYY(caseRecord.updatedAt)}</Typography>
                            <Typography variant={"body1"} color="text.secondary">Last Update On</Typography>
                        </Item>
                    </Stack>
                </Item> */}

                {/* <Item
                    sx={{
                        ml: 'auto',
                        display: { xs: 'none', sm: 'block' }
                    }}
                >
                    <a href={`/n/${caseRecord.vehicleNumber || caseRecord.challanNumber || caseRecord.caseNumber}`} target='blank' ><Button sx={{ minWidth: 92 }} disableElevation variant={"contained"} size={"small"}
                        color={caseRecord.isFollowing ? "error" : "primary"}>
                        {caseRecord.isFollowing ? "Unfollow" : "Notice"}
                    </Button>
                    </a>
                </Item> */}
                <Item sx={{ ml: { xs: 'auto', sm: 0 } }}>
                    <JumboDdMenu
                        icon={<MoreHorizIcon />}
                        menuItems={[
                            { icon: <Visibility />, title: "View", action: "viewCase" },
                            // ...(['SUPER_ADMIN'].includes(userType) &&  !caseRecord.caseManager ? [{ icon: <AssignmentIndIcon />, title: "Assign Case Manager", action: "AssignCaseManager" }] : []),
                            // ...(['SUPER_ADMIN'].includes(userType) &&  !caseRecord.neutral ? [{ icon: <AssignmentIndIcon />, title: "Assign Neutral", action: "AssignNeutral" }] : []),
                        ]}
                        onClickCallback={handleSideMenus}
                    />
                    {/* <NeutralAttach open={openAssignNeutralDialog} caseRecord={caseRecord} onClose={() => setOpenAssignNeutralDialog(false)} onSuccessfulAdd={handleSuccessfulAddNeutral} onError={handleAddErrorNeutral} neutrals={neutrals} />
                    <CaseManagerAttach open={openAssignCaseManagerDialog} caseRecord={caseRecord} onClose={() => setOpenAssignCaseManagerDialog(false)} onSuccessfulAdd={handleSuccessfulAdd} onError={handleAddError} caseManagersList={caseManagers} /> */}
                </Item>
            </Stack>
        </Card>
    );
};

export const StyledCard = styled(Card)(({ theme }) => ({
    marginBottom: theme.spacing(1),
}));


export default CaseHistoryItem;
