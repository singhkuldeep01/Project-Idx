import React from 'react'
import {AiFillFileText, AiFillFileExcel } from 'react-icons/ai';
import { DiJavascript, DiHtml5, DiCss3, DiReact, DiNodejs } from 'react-icons/di';
import { FaPython, FaJava, FaPhp , FaExclamation , FaGitAlt } from 'react-icons/fa';
import { BsFiletypeTxt } from "react-icons/bs";
import { SiSvg } from 'react-icons/si';
import { LuFileJson } from "react-icons/lu";

const getFileIcon = (extension) => {
    switch (extension) {
      case 'js':
        return <DiJavascript size={20} color="#F0DB4F" />;
      case 'html':
        return <DiHtml5 size={20} color="#E34F26" />;
      case 'css':
        return <DiCss3 size={20} color="#2965F1" />;
      case 'jsx':
        return <DiReact size={20} color="#61DAFB" />;
      case 'py':
        return <FaPython size={20} color="#306998" />;
      case 'java':
        return <FaJava size={20} color="#007396" />;
      case 'php':
        return <FaPhp size={20} color="#8993BE" />;
      case 'txt':
        return <BsFiletypeTxt size={16}  color="#00000" />;
      case 'xlsx':
        return <AiFillFileExcel size={20} color="#007A33" />;
      case 'md':
        return <FaExclamation size={15} color="#007A33" />;
      case 'gitignore':
        return <FaGitAlt size={20} color="#F14E32" />;
      case 'svg':
        return <SiSvg size={20} color="#ffb300" />;
      case 'json':
        return <LuFileJson  size={20} color="#7ee787" />;
      default:
        return <AiFillFileText size={20} color="#000000" />;
    }
  };
export default getFileIcon