import React, {useEffect, useState} from 'react'
import User from '../../services/User';
import {Row, Col, Card, Container, ListGroup, Button, Modal, Placeholder, Stack, Badge, Alert} from 'react-bootstrap'
import SendMessage from './SendMessage';
import userAvatar from './userAvatar.png'

function UserCard(props) {
    return (
        <Modal
          show={props.show}
          onHide={props.onHide}
          size="lg"
          aria-labelledby="contained-modal-title-vcenter"
          centered
        >
            {props.user ?
            <>
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                  {props.user.username}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <ListGroup variant="flush">
                    <ListGroup.Item variant="light">
                        <strong>City:</strong> {props.user.city}
                        <br/>
                        <strong>Country:</strong> {props.user.country}
                        <br/>
                        <strong>Age:</strong> {props.user.age}
                    </ListGroup.Item>
                    <ListGroup.Item variant="light">
                        <strong>Interested in: </strong>
                        <Stack className="mt-2"direction="horizontal" gap={2}>                           
                            {props.user.Activities.map(activity => <Badge pill bg="primary" key={activity.uuid}>{activity.name}</Badge>)}
                        </Stack>
                    </ListGroup.Item>
                    <ListGroup.Item variant="light">
                        <strong>Available: </strong>    
                        <Stack className="mt-2"direction="horizontal" gap={2}>                        
                            {props.user.Availabilities.map(availability => <Badge pill bg="success" key={availability.uuid}>{availability.day} {availability.start_time} - {availability.end_time}</Badge>)}
                        </Stack>
                    </ListGroup.Item>
                </ListGroup>
            </Modal.Body>
            <Modal.Footer>
                <Button onClick={props.onHide}>Close</Button>
            </Modal.Footer>
            </>
            :
            <>
            <Modal.Header closeButton>
                <Placeholder as={Modal.Title} animation="glow" xs={4}>
                    <Placeholder xs={12}/>
                </Placeholder>
            </Modal.Header>
            <Modal.Body>
                <Placeholder as="h6" animation="glow">
                <Placeholder xs={4}/>
                </Placeholder>
                <Placeholder as="h6" animation="glow">
                    <Placeholder xs={4}/>
                </Placeholder>
                <Placeholder as="h6" animation="glow">
                    <Placeholder xs={4}/>
                </Placeholder>
                <Placeholder as="h6" animation="glow">
                    <Placeholder xs={2}/>
                </Placeholder>
                <ListGroup horizontal={'md'}>
                    <Placeholder as={ListGroup.Item} variant='info' animation="glow" xs={2}>
                        <Placeholder xs={12}/>
                    </Placeholder>
                    <Placeholder as={ListGroup.Item} variant='info' animation="glow" xs={2}>
                        <Placeholder xs={12}/>
                    </Placeholder>
                    <Placeholder as={ListGroup.Item} variant='info' animation="glow" xs={2}>
                        <Placeholder xs={12}/>
                    </Placeholder>
                </ListGroup>
                <Placeholder as="h6" animation="glow">
                    <Placeholder xs={2}/>
                </Placeholder>
                <ListGroup horizontal={'md'}>
                    <Placeholder as={ListGroup.Item} variant='info' animation="glow" xs={2}>
                        <Placeholder xs={12}/>
                    </Placeholder>
                    <Placeholder as={ListGroup.Item} variant='info' animation="glow" xs={2}>
                        <Placeholder xs={12}/>
                    </Placeholder>
                    <Placeholder as={ListGroup.Item} variant='info' animation="glow" xs={2}>
                        <Placeholder xs={12}/>
                    </Placeholder>
                </ListGroup>
            </Modal.Body>
            <Modal.Footer>
                <Placeholder.Button xs={2}/>
            </Modal.Footer>
            </>
            }
            
        </Modal>
    );
  }



export default function Dashboard(props) {
    const [users, setUsers] = useState(null)
    const [allUsers, setAllUsers] = useState(null)
    const [filteredUsers, setFilteredUsers] = useState(null)
    const [clickedUser, setClickedUser] = useState(null)
    const [userCardShow, setUserCardShow] = useState(false);
    const [sendMessageShow, setSendMessageShow] = useState(false);
    const [queryParams, setQueryParams] = useState('')
    const [onlyMatchedSwitch, setOnlyMatchedSwitch] = useState(false)
    const [message, setMessage] = useState(null)
    const [username, setUsername] = useState('')
    const [userUuid, setUserUuid] = useState('')

    const fetchUsers = async () => {
        try {
            if(allUsers && filteredUsers) {
                if(queryParams) {
                        setUsers(filteredUsers)
                } else {                    
                        setUsers(allUsers)
                }
            } else {
                const response = await User.getUsers(queryParams)
                if(response.message === "Not authenticated") {
                    props.handleLogin(false)
                    window.localStorage.removeItem('data')
                }
                if(queryParams) {
                        setFilteredUsers(response.data)
                        setUsers(response.data)
                } else {                    
                        setAllUsers(response.data)
                        setUsers(response.data)
                }
            }
        } catch(err) {
            console.log(err)
            setMessage({status: "Failed", message: "Something went wrong!"})
        }
    }

    const handleShowMore = (user) => {
        setUserCardShow(true)
        setClickedUser(user)
    }

    useEffect(() => {
        if(onlyMatchedSwitch) {
            setQueryParams('?filter=true') 
        } else {
            setQueryParams('')
        }
    }, [onlyMatchedSwitch])

    useEffect(() => {
        fetchUsers()
    }, [queryParams])

    const handleSendMessage = (username, userUuid) => {
        setSendMessageShow(true)
        setMessage(null)
        setUsername(username)
        setUserUuid(userUuid)
    }

    return (
        <Container>
            {message &&
            <Alert variant={message.status === "Failed" ? "danger" : "success"}>
                {message.message && message.message}
            </Alert>}
            <div className="form-check form-switch mb-3 mt-3">
              <input className="form-check-input" type="checkbox" role="switch" id="flexSwitchCheckChecked" checked={onlyMatchedSwitch} onChange={() => setOnlyMatchedSwitch(!onlyMatchedSwitch)}/>
              <label className="form-check-label" htmlFor="flexSwitchCheckChecked">Only matched users</label>
            </div>                   
            {
                users ?
                    users.length > 0 ?
                        <Row xs={1} sm={2} md={3} lg={4} xl={5} className="g-4">
                            {users.map((user) => 
                                <Col key={user.uuid}>
                                  <Card>
                                    <Card.Img variant="top" src={userAvatar} />
                                    <Card.Body>
                                        <Card.Title>{user.username}</Card.Title>
                                        <Card.Text>
                                            Here will go some description about the user.
                                        </Card.Text>
                                    </Card.Body>
                                    <ListGroup className="list-group-flush">
                                        <ListGroup.Item className="text-truncate">                        
                                            <small className="text-muted">{user.Activities.map(activity => activity.name).join(', ')}</small>
                                        </ListGroup.Item>
                                        <ListGroup.Item className="text-truncate">
                                        <small className="text-muted">{user.Availabilities.map(availability => `${availability.day} ${availability. start_time} - ${availability.end_time}`).join(', ')}</small>
                                        </ListGroup.Item>
                                    </ListGroup>
                                    <Card.Body>
                                        <Stack gap={1}>
                                            <Button variant="outline-secondary" onClick={() => {handleShowMore(user)}} size="sm">
                                              Show more
                                            </Button>
                                            <Button variant="primary" onClick={() => {handleSendMessage(user.username, user.uuid)}} size="sm">
                                              Send message
                                            </Button>
                                        </Stack>
                                    </Card.Body>
                                  </Card>
                                </Col>
                            )}
                        </Row>
                    :      
                    <Alert variant="info">
                        No matched users found for now. Stay patient, there might be one tomorrow!
                    </Alert>
                :
                <Row xs={1} sm={2} md={3} lg={4} xl={5} className="g-4">
                    {Array.from({ length: 5 }).map((_, idx) => (
                        <Col key={idx}>
                          <Card>
                            <Card.Img variant="top" src={userAvatar} />
                            <Card.Body>
                                <Placeholder as={Card.Title} animation="glow">
                                    <Placeholder xs={6}/>
                                </Placeholder>
                                <Placeholder as={Card.Text} animation="glow">
                                    <Placeholder xs={7} /> <Placeholder xs={4} /> <Placeholder                          xs={4} />{' '}
                                    <Placeholder xs={6} /> <Placeholder xs={8} />
                                </Placeholder>
                                <Placeholder as={Card.Text} animation="glow">
                                    <Placeholder xs={12}/>
                                </Placeholder>       
                                <Placeholder as={Card.Text} animation="glow">
                                    <Placeholder xs={12}/>
                                </Placeholder>
                                <Placeholder.Button xs={6} variant="outline-secondary"/>
                                <Placeholder.Button xs={6} variant="primary"/>                        
                            </Card.Body>
                          </Card>                  
                        </Col>
                    ))}                
                </Row>
            }
            <UserCard
                user={clickedUser}
                show={userCardShow}
                onHide={() => setUserCardShow(false)}
            />
            <SendMessage
                username={username}
                userUuid={userUuid}
                show={sendMessageShow}
                onHide={() => setSendMessageShow(false)}
                setMessage={setMessage}
                setSendMessageShow={setSendMessageShow}
            />            
        </Container>
    )
}