import ThemeProvider from '@material-ui/styles/ThemeProvider';
import Routes from "@routes";
import { theme } from '@Ui';
import "font-awesome/css/font-awesome.css";
import { SnackbarProvider } from 'notistack';
import * as React from "react";
import * as ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import "./assets/style.scss";
import history from "./history";
import { loadState } from "./store/localStorage";
import { StoreHelper } from "./store/StoreHelper";

const initialState = loadState();
const store = StoreHelper.initStore(history, initialState);

ReactDOM.render(
  <Provider store={store}>
    <ThemeProvider theme={theme}>
      <SnackbarProvider maxSnack={3}

        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}>
        <BrowserRouter>
          <Routes />
        </BrowserRouter>
      </SnackbarProvider>
    </ThemeProvider>
  </Provider>
  ,
  document.getElementById("react-root")
);
