import React, { useEffect, useState } from "react";
import { Button, Container } from "react-bootstrap";
import BlogList from "../../components/blog/blog-list/BlogList";
import "./styles.css";
import { Link, useNavigate } from "react-router-dom";

const Home = ({searchValue}) => {

  const navigate = useNavigate()
  const [isToken, setisToken] = useState(false)

  useEffect(()=>{
      const token = localStorage.getItem("token")
      if(token){
        setisToken(true)
      }
  },[])


  const handleClick = (params)=>{
    navigate(params)
  }

  return (
    <Container fluid="sm" >
      <h1 className="blog-main-title mb-3 text-center">Benvenuto sullo Strive Blog!</h1>
      {!isToken &&(
        <div className="contButtonHome">
          <button onClick={()=> handleClick("/login")} className="btnLogin">Login</button>
          <button onClick={()=> handleClick("/register")} className="btnRegister">Register</button>
        </div>
 
      )}
      <BlogList searchValue={searchValue}/>
    </Container>
  );
};

export default Home;
