import React, { useState } from "react";
import { Button, Container, Form, Nav, Navbar } from "react-bootstrap";
import { Link, useLocation, useNavigate } from "react-router-dom";
import logo from "../../assets/logo.png";
import "./styles.css";


const NavBar = ({setSearchValue}) => {

  const location = useLocation()
  const navigate = useNavigate()
  const token = localStorage.getItem("token")

  const handleChange = (e)=>{
    setSearchValue(e.target.value)
  }

  const logOut = (e)=>{
    e.preventDefault()
    localStorage.removeItem("token")
    navigate('/login')
  }

  return (
    <Navbar expand="lg" className="blog-navbar" fixed="top">
      <Container className="justify-content-between">
        <Nav className="d-flex align-items-center"> 
          <Navbar.Brand as={Link} to="/">
            <img className="blog-navbar-brand" alt="logo" src={logo} />
          </Navbar.Brand>
            {token ? (
              <>
                <Link to="/home" className="link">Home</Link>
                <button onClick={logOut} className="link btn">LogOut</button>
              </>
            ) : (
              <>
                <Link to="/login" className="link">Login</Link>
                <Link to="/register" className="link">Register</Link>
              </>
            )}
        </Nav>

        {location.pathname === '/home' &&
          <>
          <Form >
                <Form.Control type='search' placeholder="Search" onChange={handleChange}/>
          </Form>


          <Button as={Link} to="/new" className="blog-navbar-add-button bg-dark" size="lg">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              className="bi bi-plus-lg"
              viewBox="0 0 16 16"
            >
              <path d="M8 0a1 1 0 0 1 1 1v6h6a1 1 0 1 1 0 2H9v6a1 1 0 1 1-2 0V9H1a1 1 0 0 1 0-2h6V1a1 1 0 0 1 1-1z" />
            </svg>
            Nuovo Articolo
          </Button>
          </>
        }

      </Container>
    </Navbar>
  );
};

export default NavBar;
