"use client";
import React, { useState, useEffect } from 'react';
import Image from 'next/image';

export default function Loading() {
    const [width, setWidth] = useState(100);
    
    useEffect(() => {
        if (window) {
            if (window.innerWidth < 640) {
                setWidth(50);
            }
        } 
    }, []);

    return (
        <div 
            className="flex justify-center items-center h-screen fixed top-0 left-0 w-full z-50"
            style={{backgroundColor: 'rgba(0, 0, 0, 0.3)'}}    
        >
            <Image 
                src="/img/caracolT.png" 
                width={width} 
                height={width} 
                alt="logo"
                className="animate-spin"
            />
        </div>
    )
}