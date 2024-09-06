"use client";

import { FileUpload } from '@/components/ui/file-upload';
import { div } from 'framer-motion/client';
import React, { useState } from 'react'

function ImageUpload() {
    const [files, setFiles] = useState<File[]>([]);
    const handleFileUpload = (files: File[]) => {
      setFiles(files);
      console.log(files);
    };
   
    return (
     <div>aa</div>
    );
  }
export default ImageUpload