import React, {useEffect, useState} from 'react'
import User from '../../services/User';
import {Row, Col, Card, Container, ListGroup, Button, Modal, Placeholder, Stack, Form} from 'react-bootstrap'

function MyVerticallyCenteredModal(props) {
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
                <Stack gap={4}>
                    <div>
                        <h6>City: {props.user.city}</h6>
                        <h6>Country: {props.user.country}</h6>
                        <h6>Age: {props.user.age}</h6>
                    </div>
                    <div>
                        <h6>Activities</h6>
                        <ListGroup horizontal={'md'}>
                            {props.user.Activities.map(activity => <ListGroup.Item variant='info' key={activity.uuid}>{activity.name}</ListGroup.Item>)}
                        </ListGroup>
                    </div>
                    <div>
                        <h6>Availabilities</h6>
                        <ListGroup horizontal={'md'}>
                            {props.user.Availabilities.map(availability => <ListGroup.Item variant='info' key={availability.uuid}>{availability.day} {availability.start_time} - {availability.end_time}</ListGroup.Item>)}
                        </ListGroup>
                    </div>        
                </Stack>
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

export default function Dashboard() {
    const [users, setUsers] = useState([])
    const [clickedUser, setClickedUser] = useState(null)
    const [uuid, setUuid] = useState('')
    const [modalShow, setModalShow] = useState(false);
    const [queryParams, setQueryParams] = useState('?filter=true')
    const [filterCheck, setFilterCheck] = useState(true)

    const fetchUsers = async () => {
        try {
            const response = await User.getUsers(queryParams)
            setUsers(response.data)
        } catch(err) {
            console.log(err)
        }
    }

    const fetchClickedUser = async (uuid) => {
        try {
            console.log(uuid)
            const response = await User.getUser(uuid)
            setClickedUser(response.data)
        } catch(err) {
            console.log(err)
        }
    }

    const handleShowMore = (e) => {
        if(e.target.id !== uuid) {
            setUuid(e.target.id)
            fetchClickedUser(e.target.id)
        }
        setModalShow(true)
    }

    const handleFilterSwitch = () => {
        setFilterCheck(!filterCheck);
        setUsers([])
      };

    useEffect(() => {
        if(!filterCheck) {
            setQueryParams('')
        } else {
            setQueryParams('?filter=true')
        }
    }, [filterCheck])

    useEffect(() => {
        fetchUsers()
    }, [queryParams])

    return (
        <Container>
            <div className="form-check form-switch">
              <input className="form-check-input" type="checkbox" role="switch" id="flexSwitchCheckChecked" checked={filterCheck} onChange={handleFilterSwitch}/>
              <label className="form-check-label" htmlFor="flexSwitchCheckChecked">Only matched users</label>
            </div>                   
            <Row xs={1} sm={2} md={3} lg={4} xl={5} xxl={6} className="g-4">
                {users.length > 0 ?
                users.map((user) => (
                    <Col key={user.uuid}>
                      <Card>
                        <Card.Body>
                            <Stack gap={3}>
                            <Card.Title>{user.username}</Card.Title>
                            <div>
                                <Card.Header>Activities</Card.Header>
                                <Card.Text>
                                    {user.UserActivities.map(activity => activity.Activity.name).join(', ')}
                                </Card.Text>
                            </div>
                            <div>
                                <Card.Header>Availabilities</Card.Header>
                                <Card.Text>
                                    {user.Availabilities.map(availability => `${availability.day} ${availability.start_time} - ${availability.end_time}`).join(', ')}
                                </Card.Text>
                            </div>
                            <div>
                                <Button id={user.uuid} variant="primary" onClick={handleShowMore}>
                                  Show more
                                </Button>
                            </div>
                            </Stack>
                            <MyVerticallyCenteredModal
                              user={clickedUser}
                              show={modalShow}
                              onHide={() => setModalShow(false)}
                            />                        
                        </Card.Body>
                      </Card>
                    </Col>
                ))
                :
                    <Col>
                      <Card>
                        <Card.Body>
                            <Placeholder as={Card.Title} animation="glow">
                                <Placeholder xs={6}/>
                            </Placeholder>
                            <Placeholder as={Card.Header} animation="glow">
                                <Placeholder xs={8}/>
                            </Placeholder>
                            <Placeholder as={Card.Text} animation="glow">
                                <Placeholder xs={12}/>
                            </Placeholder>
                            <Placeholder as={Card.Header} animation="glow">
                                <Placeholder xs={8}/>
                            </Placeholder>
                            <Placeholder as={Card.Text} animation="glow">
                                <Placeholder xs={12}/>
                            </Placeholder>
                            <Placeholder.Button xs={6} variant="primary"/>                        
                        </Card.Body>
                      </Card>                  
                    </Col>
                }
                
            </Row>
        </Container>
    )
}