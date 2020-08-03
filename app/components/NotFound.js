import React from "react";
import Page from "./Page";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <Page title="Not Found">
      <div className="text-center">
        <h2>We cannot find the page...</h2>
        <p>
          Go back to <Link to="/">homepage</Link>
        </p>
      </div>
    </Page>
  );
};

export default NotFound;
