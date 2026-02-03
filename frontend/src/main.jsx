import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";
import { Toaster } from "react-hot-toast";
import { UserProvider } from "./context/userContext.jsx";

import { Provider } from "react-redux";
import { store } from "./redux/store";

ReactDOM.createRoot(document.getElementById("root")).render(
    <Provider store={store}>
      <BrowserRouter>
        <Toaster />
        <UserProvider>
          <App />
        </UserProvider>
      </BrowserRouter>
    </Provider>
);
