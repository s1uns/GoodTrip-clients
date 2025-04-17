import { createRoot } from "react-dom/client";
import "./styles/globals.css";
import Main from "./router/Main";

const root = createRoot(document.getElementById("root") as HTMLElement);
root.render(<Main />);
