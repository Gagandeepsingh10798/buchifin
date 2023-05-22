import React, { useState, useEffect } from 'react';
import axios from "axios";
import { useSelector } from "react-redux";
import { X_API_KEY } from "Services/Api/Constants";

const ServerImage = ({ url = "", defaultSrc="", alt = "", width = 40, height = 40, className = "" ,children}) => {
    
    const [imageUrl, setImageUrl] = useState("");
   
    async function fetchImage() {
        if(url){
               const response = await axios.get(`https://api.visitballyhoura.com/v1/file/{path}?path=${url}`, { 
                responseType: 'blob'
            });
            let urlFromBlob = URL.createObjectURL(response.data);
            setImageUrl(urlFromBlob);
        } 
    };

    useEffect(() => {
        !defaultSrc && fetchImage();
    }, [url]);
    return (
        <>
            {imageUrl && <img src={defaultSrc ? defaultSrc : imageUrl} alt={alt} width={width} height={height} className={className} />}
            {children}
        </>
    )
}

export default ServerImage;