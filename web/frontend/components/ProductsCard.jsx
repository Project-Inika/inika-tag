import React, { useState, useRef } from 'react';
import { Card, TextContainer, Text } from "@shopify/polaris";
import { Toast } from "@shopify/app-bridge-react";
import { useTranslation } from "react-i18next";
import { useAppQuery, useAuthenticatedFetch } from "../hooks";
import inika_logo from "./Inika_logo.png";
import "./inikaTag.css"
import axios from 'axios';


export const ProductsCard = () => {
  const [imageFile, setImageFile] = useState(null);
  const [textList, setTextList] = useState([]);
  const [newText, setNewText] = useState('');
  const imageInputRef = useRef(null);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [jsonResult, setJsonResult] = useState(null);
  
  
  const handleImageChange = (event) => {
    setImageFile(event.target.files[0]);
  };
  
  const convertBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(file);
      fileReader.onload = () => {
        const base64Data = fileReader.result.match(/base64,(.*)$/)[1]; // Extract base64 part
        resolve(base64Data);
      };
      fileReader.onerror = (error) => {
        reject(error);
      };
    });
  };

  
  const handleTextChange = (event) => {
    setNewText(event.target.value.toLowerCase());
  };
  
  
  const handleAddText = () => {
    if (newText.trim() !== '') {
      setTextList([...textList, newText.trim()]);
      setNewText('');
    }
  };
  
  
  const handleSubmit = async () => {
    try {
      const formData = new FormData();
      setUploadedImage(imageFile);
      const base64Data = await convertBase64(imageFile);
      formData.append('textList', textList.join(','));
      if (imageInputRef.current) {
        imageInputRef.current.value = '';
      }

      console.log(textList)
      console.log(base64Data)
      setImageFile(null);
      setTextList([]);

      const response = await axios.post('https://us-central1-inika-webpage.cloudfunctions.net/auto-tag ', {
        base64_image: base64Data,
        tag_list: textList
      });

      console.log(response.data);
      setJsonResult(response.data); 
    } catch (error) {
      console.error('Error submitting data:', error);
    }
  };


  const renderUploadedImage = () => {
    if (uploadedImage) {
      return (
        <div className="uploaded-image-container">
          <img src={URL.createObjectURL(uploadedImage)} alt="Uploaded" style={{height: "270px", width: "200px"}} />
        </div>
      );
    }
    return null;
  };


  const renderJsonData = (data, indent = 0) => {
  
    return (
      <div>
        {Object.entries(data).map(([key, value]) => (
          <div key={key}>
            {key}: {value}
          </div>
        ))}
      </div>
    );
  };


  return (
<div className='inikaTagBG'>
<div className='TagImageContainer'>
      <img src={inika_logo} alt="Centered Image" className="TagImage" />
      </div>



      <div>

      {/* Image Input Container */}
      <div className='tagInput'>
      <div style={{float: 'left', margin: '0 auto'}}>
        <h2 style={{marginLeft: '-20%'}}>Image Input</h2>
        <input type="file" accept="image/*" onChange={handleImageChange} />
      </div>

      {/* Text Input and List */}
      <div style={{float: 'right', margin: '0 auto'}}>
        <h2>Text Input</h2>
        <input type="text" value={newText} onChange={handleTextChange} />
        <button onClick={handleAddText} style={{marginLeft: '10px'}}>Add Tags</button>
        <ul style={{marginTop: '10px'}}>
          {textList.map((text, index) => (
            <li key={index} style={{backgroundColor: 'white', marginTop: '2px'}}>{text}</li>
          ))}
        </ul>
      </div>
      </div>

            {/* Submit Button */}
            <button onClick={handleSubmit} disabled={!imageFile || textList.length === 0}>
        Generate Tags
      </button>
    </div>

    <div className= "TagOutput" style={{marginTop: '5%'}}>
      <div style={{float: 'left', margin: '0 auto'}}>
    {renderUploadedImage()}
    </div>

    <div style={{float: 'right', margin: '0 auto', marginTop: '8%'}}>

    {jsonResult && renderJsonData(jsonResult)}
    </div>


    </div>
    </div>
);
  };

  