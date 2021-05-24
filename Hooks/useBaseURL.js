import {useState} from "react";

const useBaseURL = (urlApi) => {
  //const [url, setUrl] = useState("http://localhost:8000/"); 
  const [url, setUrl] = useState("http://155.210.158.136:8000/");
  if(urlApi !== null){
    setUrl(urlApi);
  }  
  return url;
};export default useBaseURL;