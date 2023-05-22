import React from 'react';
import {CheckCircle,Error,Info,Close,Warning} from '@material-ui/icons';

import { amber, green } from '@material-ui/core/colors';
import{IconButton,SnackbarContent,makeStyles} from '@material-ui/core';

import classNames from 'classnames';
import './style.scss';
const variantIcon = {
    success: CheckCircle,
    warning: Warning,
    error: Error,
    info: Info,
};

const useStyles1 = makeStyles(theme => ({
    success: {
        backgroundColor: "13651b",
    },
    error: {
        backgroundColor: 'rgb(246,194,198)',
        color: '#fff'
    },
    info: {
        backgroundColor: theme.palette.primary.main,
    },
    warning: {
        backgroundColor: amber[700],
    },
    errorIcon: {
        fontSize: 20,
        color: 'white',
        fill: '#c51f51'
    },
    successIcon: {
        fontSize: 20,
        color: 'white',
        fill: 'white'
    },
    iconVariant: {
        opacity: 0.9,
        marginRight: theme.spacing(1),
    },
    errorMessage: {
        display: 'flex',
        alignItems: 'center',
        color: '#c51f51'
    },
    successMessage: {
        display: 'flex',
        alignItems: 'center',
        color: 'white'
    },
}));

// component to show API notifications 
const CustomSnackbar = ({ className, message, onClose, variant, ...other }) => {
    const classes = useStyles1();
    const Icon = variant === 'success' ? variantIcon["success"] : variantIcon["error"];
    return (
        <>
            <SnackbarContent
                className={classNames([classes[variant], className])}
                aria-describedby="client-snackbar"
                message={
                    <span id="client-snackbar" className={classNames([variant === 'error' ? classes.errorMessage : classes.successMessage, 'message-text'])}>
                        <Icon style={{ fill: (variant === 'error') ? '#c51f51' : '#fff' }} className={classNames([classes.icon, classes.iconVariant])} />
                        {message}
                    </span>
                }
                action={[
                    <IconButton key="close" aria-label="close" color="inherit" onClick={onClose}>
                        <Close className={classNames([variant === 'error' ? classes.errorIcon : classes.successIcon])} />
                    </IconButton>,
                ]}
                {...other}
            />
        </>
    );
};
export default CustomSnackbar;