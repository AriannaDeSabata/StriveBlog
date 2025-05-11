import React, { useState } from 'react'
import { Alert, Button, Container, Form } from 'react-bootstrap'
import { Link, useNavigate } from 'react-router-dom'
import "./styles.css";


export default function Login() {

  const url = process.env.REACT_APP_URL

  const navigate = useNavigate()
  const [showAlertDeny, setShowAlertDeny] = useState(false)
  const [errorMsg, setErrorMsg ] = useState("")
  

  const [userLogin, setUserLogin] = useState({
    email:'',
    password:''
  })


  const loginFetch = async()=>{

    try {
        if(!userLogin.email || !userLogin.password ){
        setShowAlertDeny(true)
        setErrorMsg("Compila tutti i campi!")
        setTimeout(()=>{
          setShowAlertDeny(false)
        },5000)
        return
      }

      const res = await fetch(url + "authors/login", {
        method:'POST',
        body: JSON.stringify(userLogin),
        headers: {
          "Content-Type" : 'application/json',
        }
      })

      if(res.ok){
        const data = await res.json()
        localStorage.setItem("token", data)
        navigate('/home')

      }else if(!res.ok){
        setShowAlertDeny(true)
        setErrorMsg("Email o password non validi")
        setTimeout(()=>{
          setShowAlertDeny(false)
        },5000)
      }


    } catch (error) {
        if(error){
        setShowAlertDeny(true)
        setErrorMsg(error)
        setTimeout(()=>{
          setShowAlertDeny(false)
        },5000)
      }

    }
  }

  const handleChange = (e)=>{
    setUserLogin({
      ...userLogin,
      [e.target.name]: e.target.value
    })

  }


  const handleSubmit = (e)=>{
    e.preventDefault()
    loginFetch()
  }
  const resetForm = ()=>{
    setUserLogin({
      email:'',
      password:''
    })
  }

  return (
    <Container fluid="sm" className="mt-5">
      <h1 className='text-center mb-0'>Login</h1>
      <Form className='mt-3  loginForm' >
        <Form.Group >
          <Form.Label>Email</Form.Label>
          <Form.Control type='email' name='email' value={userLogin.email} onChange={handleChange}/>
        </Form.Group>
        
        <Form.Group>
          <Form.Label>Password</Form.Label>
          <Form.Control type='password' name='password' value={userLogin.password} onChange={handleChange}/>
        </Form.Group>

        {showAlertDeny &&(
            <p className='errorMsg'>{errorMsg}</p>
          )}

        <Form.Group className="d-flex mt-3 flex-column align-items-start">
          <div className='d-flex gap-2'>
            <Button onClick={handleSubmit}>
              Login
            </Button>
            <Button onClick={resetForm} className='btn-danger'>
              Reset
            </Button>
          </div>
          <Link to="/register" className="link my-3 ms-0">Non hai un'account? <span className='registerLink'>Registrati</span></Link>
        </Form.Group>

          <a href='http://localhost:3001/auth/googleLogin' className='btnGoogle'>
          <img src='https://techdocs.akamai.com/identity-cloud/img/social-login/identity-providers/iconfinder-new-google-favicon-682665.png' className='imgGoogleLogin'/>
          Login with Google </a>

      </Form>
    </Container>
  )
}

