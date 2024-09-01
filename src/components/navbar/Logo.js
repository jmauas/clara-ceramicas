"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import Link from "next/link";
import React from "react";

const Logo = () => {
  //update the size of the logo when the size of the screen changes
  const [width, setWidth] = useState(0);

  const updateWidth = () => {
    const newWidth = window.innerWidth;
    setWidth(newWidth);
  };

  useEffect(() => {
    window.addEventListener("resize", updateWidth);
    updateWidth();
  }, []);


  return (
      <Link 
        href="/"
        className="m-0"
        >
        <Image
          src="/img/logoT.png"
          alt="Logo"
          width={width < 1024 ? "100" : "150"}
          height={width < 1024 ? "35" : "54"}
          className="relative ml-2 md:ml-0"
          placeholder="blur"
          blurDataURL={'/img/logo.png'}
        />
      </Link>      
  );
};

export default Logo;