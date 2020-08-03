import React, { useContext, useState } from "react";
import Axios from "axios";

import DispatchContext from "../DispatchContext";

const HeaderLoggedOut = () => {
  const [username, setUsername] = useState();
  const [password, setPassword] = useState();

  const appDispatch = useContext(DispatchContext);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await Axios.post("/login", {
        username,
        password,
      });
      console.log(response.data);
      if (response.data.token !== undefined) {
        appDispatch({ type: "login", data: response.data });
        appDispatch({
          type: "flashMessages",
          value: "You have successfully logged in.",
        });
      } else {
        appDispatch({
          type: "flashMessages",
          value: "Invalid username / password",
        });
      }
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-0 pt-2 pt-md-0">
      <div className="row align-items-center">
        <div className="col-md mr-0 pr-md-0 mb-3 mb-md-0">
          <input
            onChange={(e) => setUsername(e.target.value)}
            name="username"
            className="form-control form-control-sm"
            type="text"
            placeholder="Username"
            autoComplete="off"
          />
        </div>
        <div className="col-md mr-0 pr-md-0 mb-3 mb-md-0">
          <input
            onChange={(e) => setPassword(e.target.value)}
            name="password"
            className="form-control form-control-sm"
            type="password"
            placeholder="Password"
          />
        </div>
        <div className="col-md-auto">
          <button className="btn btn-success btn-sm">Sign In</button>
        </div>
      </div>
    </form>
  );
};

export default HeaderLoggedOut;
