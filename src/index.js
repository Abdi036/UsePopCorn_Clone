import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./component/App";
// import RatingStar from "./RatingStar";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
    {/* <RatingStar maxRating={5} /> */}
  </React.StrictMode>
);
