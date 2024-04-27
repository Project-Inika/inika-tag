import { Card, Page, Layout, TextContainer, Text } from "@shopify/polaris";
import { TitleBar } from "@shopify/app-bridge-react";
import { useTranslation } from "react-i18next";
import { useAppQuery, useAuthenticatedFetch } from "../hooks";
import React, { useEffect, useState } from 'react';
import "./SectionStepOne.css"





const SectionStepOne = () => {

    const [showCheckboxes, setShowCheckboxes] = useState(false);
  
    // State to manage selected images
    const [selectedImages, setSelectedImages] = useState([]);

    const fetch = useAuthenticatedFetch();
    const [productImages, setProductImages] = useState([]);

    const toggleCheckboxes = () => {
        setShowCheckboxes(!showCheckboxes);
      };
    
      // Function to toggle individual image selection
      const toggleImageSelection = (imageUrl) => {
        if (selectedImages.includes(imageUrl)) {
          setSelectedImages(selectedImages.filter((img) => img !== imageUrl));
        } else {
          setSelectedImages([...selectedImages, imageUrl]);
        }
      };

        const performAction = () => {
    // Your logic to perform action here
    console.log("Selected images:", selectedImages);
  };

    useEffect(() => {


        const fetchData = async () => {
            try {
                const response = await fetch("/api/products/all");
                const productInfo = ( await response.json());
                console.log(productInfo)
                const productImages = productInfo.data.map(item => {
                    if (item.image) {
                        return item.image.src;
                    } else {
                        return null;
                    }
                });
                setProductImages(productImages);
                console.log(productImages)

            } catch (err) {
                console.log(err);
            }
        };

        fetchData(); // Call fetchData when the component mounts

        // Optionally, return a cleanup function if needed
        // return () => {
        //     cleanup logic here
        // };
    }, []); // Pass an empty dependency array to run the effect only once on component mount

    return (

        <div className="inikaTagBG">

<div className="buttonContainer-view">
        <button
          onClick={() => setShowCheckboxes(!showCheckboxes)}
          style={{ backgroundColor: "#C1AA96", opacity: "0.8", color: "#000" }}
        >
          {showCheckboxes ? "De-Select" : "Select"}
        </button>


        {showCheckboxes && selectedImages.length > 0 && (
          <button onClick={performAction} style={{ backgroundColor: "#C1AA96", opacity: "0.8", color: "#000" }}>Tag Selected Images</button>
        )}
</div>
            
<div className="image-container">
        {productImages.map((imageUrl, index) => (
          <div key={index} className="image-wrapper">
            {showCheckboxes && (
              <input
                type="checkbox"
                checked={selectedImages.includes(imageUrl)}
                onChange={() => toggleImageSelection(imageUrl)}
                style={{ width: "15px", height: "15px", marginRight: "5px"}} 
              />
            )}
            <img
              className="image"
              src={imageUrl}
              alt={`No Image available`}
            />
          </div>
        ))}
      </div>
        </div>
    );
   
}

export default SectionStepOne