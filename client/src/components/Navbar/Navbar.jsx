import React from 'react'
import logo from './connect-logo.png';
import { Container, Navbar, Nav } from 'react-bootstrap'
import { Link } from 'react-router-dom';

function Navigation(props) {

  return (
    <Navbar collapseOnSelect expand="md" bg="dark" variant="dark">
      <Container fluid="xxl">
        <Navbar.Brand as={Link} to="/">
          <img
            alt=""
            src={logo}
            width="30"
            height="30"
            className="d-inline-block align-top"
          />{' '}
          NOTAlone
        </Navbar.Brand>
        <>
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav">
            {props.loggedIn ?
              <>
                <Nav className="me-auto">
                  <Nav.Link as={Link} to="/">Home</Nav.Link>
                  <Nav.Link as={Link} to="/inbox">Inbox</Nav.Link>
                  <Nav.Link as={Link} to="/activities">Activities</Nav.Link>
                  <Nav.Link as={Link} to="/availabilities">Availabilities</Nav.Link>
                </Nav>
                <Nav>
                  <Nav.Link as={Link} to="/profile">{props.userData.username}</Nav.Link>
                  <Nav.Link as={Link} to="/logout">Log out</Nav.Link>
                </Nav>
              </>
              :
              <>
                <Nav className="me-auto">
                </Nav>
                <Nav>
                  <Nav.Link as={Link} to="/login">Login</Nav.Link>
                  <Nav.Link as={Link} to="/register">Register</Nav.Link>
                </Nav>
              </>
            }
          </Navbar.Collapse>
        </>
      </Container>
    </Navbar>
  )
}

export default Navigation;