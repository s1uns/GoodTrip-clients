import { createRoot } from "react-dom/client";
import "./globals.css";
import "./output.css";
import Main from "./router/Main";
import { BrowserRouter } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";

const root = createRoot(document.getElementById("root") as HTMLElement);
root.render(
	<BrowserRouter>
		<Main />
		<ToastContainer />
	</BrowserRouter>,
);
