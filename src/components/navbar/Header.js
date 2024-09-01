"use client";
import React from "react";
import { useState } from "react";
import Navbar from "./Navbar.js";
import Sidebar from "./Sidebar.js";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const toggle = () => {
    setIsOpen(!isOpen);
  };
  return (
    <>
        <Sidebar isOpen={isOpen} toggle={toggle} />
        <Navbar toggle={toggle} />
    </>
  );
};

export default Header;