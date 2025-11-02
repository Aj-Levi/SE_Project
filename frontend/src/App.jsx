import { useState } from 'react'
import './App.css'
import { EarthPage } from "./Pages/EarthPage/EarthPage";
import { SearchPage } from "./Pages/SearchPage/SearchPage";
import { Home} from "./Pages/Home/HomePage";
import { MainLayout } from './Components/MainLayout';
import { Routes, Route } from "react-router-dom";
import { PageNotFound } from './Pages/PageNotFound';

function App() {

  return (
    <>
      <Routes>
        <Route path="/" element={<MainLayout/>}>
          <Route index element={<EarthPage/>} />
          <Route path="home" element={<Home/>}/>
          <Route path="search" element={<SearchPage/>}/>
        </Route>
        <Route path="*" element={<PageNotFound/>}/>
      </Routes>
    </>
  )
}

export default App
