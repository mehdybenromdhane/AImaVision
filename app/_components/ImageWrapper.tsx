"use client";
import React from "react";
import Image from "next/image";
interface FileUploadProps {
  files: File[];
}
export function ImageWrapper({files} : FileUploadProps) {
  return (
  
        <Image
          src={URL.createObjectURL(files[0])}
          alt="a"
          height="400"
          width="400"
          className="object-cover w-full h-full rounded-xl"
          />
       

      
       
  
  );
}
