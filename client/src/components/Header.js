import React from 'react';
import logo from '../rent.png';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Image from 'react-bootstrap/Image'
import {NavLink} from 'react-router-dom';
import {AuthContext} from '../auth/AuthContext'

const Header = (props) => {

  return(
    <AuthContext.Consumer>
      {(context) => (
        <Navbar bg="info" variant="dark" expand="sm" fixed="top">

        <Navbar.Brand href="/">
        <Image src={logo} height="40px" />
        
        </Navbar.Brand>
        
        {context.authUser && <Nav className="mr-auto">
          <Nav.Link as={NavLink} to="/config">Configuratore</Nav.Link> 
          <Nav.Link as={NavLink} to="/bookings">Prenotazioni</Nav.Link> 
        </Nav>}

        <Nav className="ml-md-auto">
          {context.authUser && 
            <>
              <Navbar.Brand>{context.authUser.email}</Navbar.Brand> 
              <Nav.Link onClick = {() => {context.logoutUser()}}>Logout</Nav.Link>
            </>}
          {!context.authUser && <Nav.Link as = {NavLink} to = "/login">Login</Nav.Link>}
          <Nav.Link href="#">
            <svg className="bi bi-people-circle" width="30" height="30" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
              <path d="M13.468 12.37C12.758 11.226 11.195 10 8 10s-4.757 1.225-5.468 2.37A6.987 6.987 0 008 15a6.987 6.987 0 005.468-2.63z"/>
              <path fillRule="evenodd" d="M8 9a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd"/>
              <path fillRule="evenodd" d="M8 1a7 7 0 100 14A7 7 0 008 1zM0 8a8 8 0 1116 0A8 8 0 010 8z" clipRule="evenodd"/>
            </svg>
          </Nav.Link>
        </Nav>
      </Navbar>
      )}
    </AuthContext.Consumer>
      );
}

export default Header;
