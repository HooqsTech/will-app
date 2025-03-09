import { Alert, Snackbar } from '@mui/material';

export type TAlertType = 'error' | 'warning' | 'info' | 'success';

interface ICustomSnackBarPros {
    alertType: TAlertType ;
    message: string;
    open: boolean;
    onClose: () => void;
}
const CustomSnackBar:React.FC<ICustomSnackBarPros> = ({alertType,message,open,onClose}) => {

  return (
    <Snackbar
        open={open}
        autoHideDuration={10000} // Hides after 3 seconds
        onClose={onClose}
        anchorOrigin={{ "vertical": "top", "horizontal":"right" }}
      >
        <Alert onClose={onClose} severity={alertType}>
          {message}
        </Alert>
      </Snackbar>
  );
};

export default CustomSnackBar;
