import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="border-top text-center small text-muted py-3 mt-5">
      <p>
        <Link to="/" className="mx-1">
          Home
        </Link>{" "}
        |
        <Link className="mx-1" to="/aboutus">
          about Us
        </Link>{" "}
        |
        <Link className="mx-1" to="/terms">
          Terms
        </Link>
      </p>
      <p className="m-0">
        Copyright &copy; 2020{" "}
        <Link to="/" className="text-muted">
          Heejun Seo
        </Link>
        . All rights reserved.
      </p>
    </footer>
  );
};

export default Footer;
