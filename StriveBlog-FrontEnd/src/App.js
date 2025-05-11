import React, { useState } from "react";
import NavBar from "./components/navbar/BlogNavbar";
import Footer from "./components/footer/Footer";
import Home from "./views/home/Home";
import Blog from "./views/blog/Blog";
import NewBlogPost from "./views/new/New";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./views/login/Login";
import Register from "./views/register/Register";

function App() {

  const [searchValue, setSearchValue] = useState("")


  return (
    <Router>
      <NavBar setSearchValue={setSearchValue}/>
      <Routes>
        <Route path="/" exact element={<Home />} />
        <Route path="/home" element={<Home searchValue={searchValue}/>}/>
        <Route path="/blog/:id" element={<Blog />} />
        <Route path="/new" element={<NewBlogPost />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
