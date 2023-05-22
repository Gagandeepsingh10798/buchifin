import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/lib/integration/react";


import RootRouter from "./Routes/RootRouter";
import { store, persistor } from "./Redux/Store";
import { SnackbarProvider } from "notistack";
import { SnackbarWrapper } from "Components/molecules";
import { useState } from "react";

function App() {
  const [openSnackBar, setOpenSnackbar] = useState(false);
  const [snackbarData,setSnackbarData]=useState({variant:'',message:''})
  return (
    <SnackbarProvider maxSnack={3}>
       <SnackbarWrapper
          visible={openSnackBar}
          onClose={() => setOpenSnackbar(false)}
          variant={snackbarData.variant}
          message={snackbarData.message}
      /> 
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <RootRouter />
      </PersistGate>
    </Provider>
    </SnackbarProvider>
  );
}

export default App;
