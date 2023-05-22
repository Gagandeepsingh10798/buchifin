import React from "react";
import { Snackbar } from "@material-ui/core";
import CustomSnackbar from "Components/atoms/CustomSnackBar";


const SnackbarWrapper = ({ 
  visible = false,
  variant,
  message,
  onClose = () => { },
}) => {
  return (
    <Snackbar
      open={visible}
      onClose={() => {
        onClose();
      }}
    >
      <CustomSnackbar
        onClose={() => {
          onClose();
        }}
        variant={variant}
        message={message}
      />
    </Snackbar>
  );
};

export default SnackbarWrapper;