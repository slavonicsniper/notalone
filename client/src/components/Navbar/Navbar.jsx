import React from 'react'
import logo from './connect-logo.png';
import {Container, Navbar, Nav} from 'react-bootstrap'

function Navigation(props) {

  return (
    <Navbar collapseOnSelect expand="md" bg="dark" variant="dark" className="mb-3">
      <Container fluid="xxl">
        <Navbar.Brand href="/">
          <img
            alt=""
            src={logo}
            width="30"
            height="30"
            className="d-inline-block align-top"
          />{' '}
        NOTAlone
        </Navbar.Brand>
        {props.loggedIn &&
        <>
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link href="/activities">Activities</Nav.Link>
              <Nav.Link href="/availabilities">Availabilities</Nav.Link>
            </Nav>
            <Nav>
              <Nav.Link href="/profile">{props.userData.username}</Nav.Link>
              <Nav.Link href="/logout">Log out</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </>
        }
                
      </Container>
    </Navbar>
  )
}

export default Navigation;