"use client"
import React, { useEffect, useState, useRef } from "react";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import Fullscreen from "yet-another-react-lightbox/plugins/fullscreen";
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import Inline from "yet-another-react-lightbox/plugins/inline";
import "yet-another-react-lightbox/plugins/thumbnails.css";
import "yet-another-react-lightbox/plugins/captions.css";

import NextJsImage from "./Carousel.Image.js";

export default function Slide({ slides, width }) {
  const [index, setIndex] = useState(0);  
  const ref = useRef(null);
    
  const clickSlice = () => {
    
  };

  return (
      <Lightbox
          index={index}
          styles={{ 
            root: { "--yarl__color_backdrop": "white" },  
          }}
          slides={slides}
          plugins={[Inline, Thumbnails, Fullscreen, Zoom]}
          render={{ slide: NextJsImage, thumbnails: NextJsImage }}
          controller={{ ref }}
          on={{
            click: clickSlice,
          }}
          transition={{ duration: 0.3, timingFunction: "ease" }}
          slideshow={{ autoplay: true, delay: 3000}}
          carousel={{
            padding: 0,
            spacing: 0,
            imageFit: "cover",
          }}
          inline={{
            style: {
              toolBar: true,
              width: "100%",
              maxWidth: "300px",
              //aspectRatio: width<600 ? "1.5 / 3" : width<1380 ? "1.8 / 3.2" : "2.5 / 3",
              aspectRatio: "1.8 / 3.2",
              //margin: "auto",
            },
          }}
          thumbnails={{
            position: 'bottom',
            width: 80,
            height: 60,
            border: 2,
            borderRadius: 4,
            padding: 4,
            gap: 4,
            showToggle: true,
          }}         
          zoom={{
            scrollToZoom: true,
            maxZoomPixelRatio:5
          }}
          fullscreen={{
            showToggle: true,
            zIndex: 10000,            
          }}          
        />
    );
}