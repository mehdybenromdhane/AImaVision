"use client"
import { BackgroundBeamsWithCollision } from '@/components/ui/background-beams-with-collision'
import React, { useState } from 'react'
import MainContainer from './_components/MainContainer'
import { GoogleGenerativeAI } from '@google/generative-ai'

function HomePage() {

  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [keywords, setKeywords] = useState<string[]>([]);
  const [relatedQuestions, setRelatedQuestions] = useState<string[]>([]);


  const [files, setFiles] = useState<File[]>([]);
  const handleFileUpload = (files: File[] | null) => {

    if (files){
      setFiles(files);
    }
    
  }; 



  const identifyImage = async (additionalPrompt: string = "") => {
    if (!files[0]) return;

    setLoading(true);
    const genAI = new GoogleGenerativeAI(
      process.env.NEXT_PUBLIC_GOOGLE_GEMINI_API_KEY!
    );
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    try {
      const imageParts = await fileToGenerativePart(files[0]);
      const result = await model.generateContent([
        `Identify this image and provide its name and important information including a brief explanation about that image. ${additionalPrompt}`,
        imageParts,
      ]);
      const response = await result.response;
      const text = response
        .text()
        .trim()
        .replace(/```/g, "")
        .replace(/\*\*/g, "")
        .replace(/\*/g, "")
        .replace(/-\s*/g, "")
        .replace(/\n\s*\n/g, "\n");
      setResult(text);
      generateKeywords(text);
      await generateRelatedQuestions(text);
    } catch (error) {
      console.error("Error identifying image:", error);
      if (error instanceof Error) {
        setResult(`Error identifying image: ${error.message}`);
      } else {
        setResult("An unknown error occurred while identifying the image.");
      }
    } finally {
      setLoading(false);
    }
  };
  async function fileToGenerativePart(file: File): Promise<{
    inlineData: { data: string; mimeType: string };
  }> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64data = reader.result as string;
        const base64Content = base64data.split(",")[1];
        resolve({
          inlineData: {
            data: base64Content,
            mimeType: file.type,
          },
        });
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  const generateKeywords = (text: string) => {
    const words = text.split(/\s+/);
    const keywordSet = new Set<string>();
    words.forEach((word) => {
      if (
        word.length > 4 &&
        !["this", "that", "with", "from", "have"].includes(word.toLowerCase())
      ) {
        keywordSet.add(word);
      }
    });
    setKeywords(Array.from(keywordSet).slice(0, 5));
  };

  const regenerateContent = (keyword: string) => {
    identifyImage(`Focus more on aspects related to "${keyword}".`);
  };


  
  const generateRelatedQuestions = async (text: string) => {
    const genAI = new GoogleGenerativeAI(
      process.env.NEXT_PUBLIC_GOOGLE_GEMINI_API_KEY!
    );
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    try {
      const result = await model.generateContent([
        `Based on the following information about an image, generate 5 related questions that someone might ask to learn more about the subject:

        ${text}

        Format the output as a simple list of questions, one per line.`,
      ]);
      const response = await result.response;
      const questions = response.text().trim().split("\n");
      setRelatedQuestions(questions);
    } catch (error) {
      console.error("Error generating related questions:", error);
      setRelatedQuestions([]);
    }
  };

  const askRelatedQuestion = (question: string) => {
    identifyImage(
      `Answer the following question about the image: "${question}"`
    );
  };
  return (

    <>
    <div className='bg-gradient-to-b from-purple-100 to-neutral-100'>
      <header>

        <div className='bg-white shadow-sm'>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              
              <h1 className="text-2xl font-bold text-pink-600">
                AImaVision
              </h1>
            </div>
            <nav>
              <ul className="flex space-x-4">
                <li>
                  <a
                    href="#"
                    className="text-gray-600 hover:bg-pink-600 hover:text-white  p-2  rounded-lg transition duration-150 ease-in-out"
                  >
                    Home
                  </a>
                </li>
                <li>
                  <a
                    href="#how-it-works"
                    className="text-gray-600 hover:bg-pink-600 hover:text-white  p-2  rounded-lg transition duration-150 ease-in-out"
                  >
                    How It Works
                  </a>
                </li>
                <li>
                  <a
                    href="#features"
                    className="text-gray-600 hover:bg-pink-600 hover:text-white  p-2  rounded-lg transition duration-150 ease-in-out"
                  >
                    Features
                  </a>
                </li>
              </ul>
            </nav>
          </div>
          </div>
        </div>
      <BackgroundBeamsWithCollision>
<div>
       
      <h2 className="text-lg my-10 relative z-20 md:text-4xl lg:text-7xl font-bold text-center text-black dark:text-white font-sans tracking-tight">
      Analyze Your Images with {" "}
        <div className="relative mx-auto inline-block w-max [filter:drop-shadow(0px_1px_3px_rgba(27,_37,_80,_0.14))]">
          <div className="absolute left-0 top-[1px] bg-clip-text bg-no-repeat text-transparent bg-gradient-to-r py-4 from-purple-500 via-violet-500 to-pink-500 [text-shadow:0_0_rgba(0,0,0,0.1)]">
            <span className="">AImaVision.</span>
          </div>
          <div className="relative bg-clip-text text-transparent bg-no-repeat bg-gradient-to-r from-purple-500 via-violet-500 to-pink-500 py-4">
            <span className="">AImaVision.</span>
          </div>
        </div>
      </h2>

    
   
<MainContainer handleFileUpload={handleFileUpload} identifyImage={identifyImage}  files={files}  loading={loading}/>
</div>
    
    </BackgroundBeamsWithCollision>

      </header>




{loading &&      <div className='text-center'><span className="loading w-32 loading-ring  bg-pink-950 justify-center "></span> </div> 
}

      {result && (

<div className="bg-gradient-to-l  rounded-3xl mx-auto lg:w-[73rem]  from-purple-100 via-violet-100 to-pink-50  shadow-xl">
     


     
     <div className='p-10'>
      <h3 className='text-2xl font-bold text-pink-900  mb-5'>Image Information :</h3>

      {result.split("\n").map((line, index) => {
                  if (
                    line.startsWith("Important Information:") ||
                    line.startsWith("Other Information:")
                  ) { return (
                    <div key={index} className='my-5'>  {line}</div>


                  ) } else if (line.match(/^\d+\./) || line.startsWith("-")) {
                    return (
                      <li key={index} className="ml-4 mb-2 text-gray-700">
                        {line}
                      </li>
                    );
                  } else if (line.trim() !== "") {
                    return (
                      <p key={index} className="mb-2 text-gray-800">
                        {line}
                      </p>
                    );
                  }
                  return null;
                })}


<div className='my-3'>
     <h4 className="text-lg font-semibold mb-2 text-pink-700">
                  Related Keywords:
                </h4>

                <div className="flex flex-wrap gap-2">

                {keywords.map((keyword, index) => (
                    <button
                      key={index}
                      onClick={() => regenerateContent(keyword)}
                      className="bg-pink-100   text-pink-800 px-3 py-1 rounded-full text-sm font-medium hover:bg-pink-200 transition duration-150 ease-in-out"
                    >
                      {keyword}
                    </button>
                  ))}
                    
                </div>

                </div>


                {relatedQuestions.length > 0 && (
                <div className="mt-6">
     <h4 className="text-lg font-semibold mb-2 text-pink-700">
     Related Questions:
                  </h4>
                  <ul className="space-y-2">
                    {relatedQuestions.map((question, index) => (
                      <li key={index}>
                        <button
                          onClick={() => askRelatedQuestion(question)}
                          className="text-left w-full bg-pink-100 text-pink-800 px-4 py-2 rounded-lg text-sm font-medium hover:bg-pink-200 transition duration-150 ease-in-out"
                        >
                          {question}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          
               
        
                 
                

         

          
      </div>
      
  

              )
        
              
            }

            

<section id="how-it-works" className="mt-16 mx-auto md:w-[50rem]  ">
          <h2 className="text-3xl font-bold text-pink-900  mb-8 text-center">
            How It Works
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {["Upload Image", "AI Analysis", "Get Results"].map(
              (step, index) => (
                <div
                  key={index}
                  className="bg-white rounded-lg shadow-md p-6 transition duration-300 ease-in-out transform hover:scale-105"
                >
                  <div className="text-3xl font-bold text-pink-600 mb-4">
                    {index + 1}
                  </div>
                  <h3 className="text-xl font-semibold mb-2 text-gray-800">
                    {step}
                  </h3>
                  <p className="text-gray-600">
                    Our advanced AI analyzes your uploaded image and provides
                    detailed information about its contents.
                  </p>
                </div>
              )
            )}
          </div>
        </section>

        <section id="features" className="mt-16 mx-auto  md:w-[50rem]">
          <h2 className="text-3xl font-bold text-pink-900  mb-8 text-center">
            Features
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {[
              "Accurate Identification",
              "Detailed Information",
              "Fast Results",
              "User-Friendly Interface",
            ].map((feature, index) => (
              <div
                key={index}
                className="bg-white rounded-lg shadow-md p-6 transition duration-300 ease-in-out transform hover:scale-105"
              >
                <h3 className="text-xl font-semibold mb-2 text-pink-600">
                  {feature}
                </h3>
                <p className="text-gray-600">
                  Our image identifier provides quick and accurate results with
                  a simple, easy-to-use interface.
                </p>
              </div>
            ))}
          </div>
        </section>
      
      <footer className="  bg-gradient-to-l  from-purple-400 via-violet-400 to-pink-300 text-white py-8 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-lg font-bold text-pink-800   text-center">
          <p>&copy; 2024 AImaVision. All rights reserved.</p>
        </div>
      </footer>
 
    
      </div>
      </>
        
  )
  
}

export default HomePage