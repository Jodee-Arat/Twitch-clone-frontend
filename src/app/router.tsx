import App from "../App";
import Reg from "../pages/auth/reg";
import { createBrowserRouter } from "react-router-dom";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "reg",
        element: <Reg />,
      },
    ],
  },
]);
