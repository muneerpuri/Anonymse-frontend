import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { AuthContextProvider } from "./context/AuthContext";
import { ToastProvider } from 'react-toast-notifications';

ReactDOM.render(
  <React.StrictMode>
    <AuthContextProvider>
    <ToastProvider autoDismissTimeout={4000} autoDismiss={true}>
      <App />
    </ToastProvider>
    </AuthContextProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
