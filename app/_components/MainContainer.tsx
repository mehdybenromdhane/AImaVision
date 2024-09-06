"use client";
import React from 'react'
import { ImageWrapper } from './ImageWrapper';
import { FileUpload } from '@/components/ui/file-upload';
import { BackgroundGradient } from '@/components/ui/background-gradient';

type IdentifyImage = () => void;

interface FileUploadProps {
  handleFileUpload: (file: File[] | null) => void;
  identifyImage: IdentifyImage;
  files: File[];
  loading:boolean

}

const MainContainer: React.FC<FileUploadProps> = ({ handleFileUpload, identifyImage, files, loading }) => {
 

  
  return (
    <main className=" mx-10  bg-gradient-to-l  from-purple-400 via-violet-400 to-pink-300 py-10 rounded-3xl shadow-xl  flex-col flex lg:flex-row md:items-center md:justify-around">
   
<div >


        <FileUpload  onChange={handleFileUpload} />

        
</div> 
   
<button      onClick={() => identifyImage()}
              disabled={!files[0] || loading}          className="  my-10 bg-pink-600 text-white items-center px-10 h-10 rounded-lg hover:bg-pink-700 transition duration-150 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed font-medium text-sm"
 >              {loading ? "Scanning..." : "Scan Image"}
</button>


 
<BackgroundGradient className="rounded-[22px] w-[20rem] h-[20rem]  dark:bg-zinc-900">
{files[0] && (
    <ImageWrapper files={files}/> 
  )}
      </BackgroundGradient>

   

   
  </main> 
  )
}

export default MainContainer