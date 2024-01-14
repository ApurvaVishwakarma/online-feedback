import React from "react";
import { Col, Container, Form, Row,Dropdown } from "react-bootstrap";
import Button from '@mui/material/Button';
import SendIcon from '@mui/icons-material/Send';
import '../../commonStyles.css'
const AddUser = () => {

    return (
        <Container>
            <Row>
                <Col>
                    <h1 className="text-center">Add Counsellor</h1>
                </Col>
            </Row>
            <Row>
                <Col>
                    <Form>
                        <Form.Group className="mb-3" controlId="formBasicEmail">
                            <Form.Label>Name</Form.Label>
                            <Form.Control id="input-field" type="text" placeholder="Enter Name" />
                            <Form.Text className="text-danger">
                                *Required
                            </Form.Text>
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formBasicEmail">
                            <Form.Label>Service ID</Form.Label>
                            <Form.Control id="input-field" type="number" placeholder="Enter Service ID" />
                            <Form.Text className="text-danger">
                                *Required
                            </Form.Text>
                        </Form.Group>
                        <Form.Label>Rank</Form.Label>
                        <Dropdown>
                            <Dropdown.Toggle id="dropdown-button-dark-example1" variant="secondary" className="mb-3" style={{color:"#212529",backgroundColor:"white",border:"1px solid #dee2e6"}}  >
                                Select Rank
                            </Dropdown.Toggle>

                            <Dropdown.Menu id="input-field">
                                <Dropdown.Item href="#/action-1" active>Marshal of the Indian Air Force</Dropdown.Item>
                                <Dropdown.Divider />
                                <Dropdown.Item href="#/action-2">Air chief marshal</Dropdown.Item>
                                <Dropdown.Divider />
                                <Dropdown.Item href="#/action-3">Air marshal</Dropdown.Item>
                                <Dropdown.Divider />
                                <Dropdown.Item href="#/action-4">Air vice marshal</Dropdown.Item>
                                <Dropdown.Divider />
                                <Dropdown.Item href="#/action-2">Air chief marshal</Dropdown.Item>
                                <Dropdown.Divider />
                                <Dropdown.Item href="#/action-3">Air commodore </Dropdown.Item>
                                <Dropdown.Divider />
                                <Dropdown.Item href="#/action-2">Group captain</Dropdown.Item>
                                <Dropdown.Divider />
                                <Dropdown.Item href="#/action-3">Wing commander</Dropdown.Item>
                                <Dropdown.Divider />
                                <Dropdown.Item href="#/action-2">Squadron leader</Dropdown.Item>
                                <Dropdown.Divider />
                                <Dropdown.Item href="#/action-3">Flight lieutenant</Dropdown.Item>
                                <Dropdown.Divider />
                                <Dropdown.Item href="#/action-2">Flying officer</Dropdown.Item>
                                <Dropdown.Divider />
                                <Dropdown.Item href="#/action-3">Flight cadet</Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>

                        <Form.Group className="mb-3" controlId="formBasicEmail">
                            <Form.Label>Set Password</Form.Label>
                            <Form.Control id="input-field" type="password" placeholder="Enter Password" />
                            <Form.Text className="text-danger">
                                *Required
                            </Form.Text>
                        </Form.Group>
                    </Form>
                    <div className="text-center">
                        <Button id="submit-Btn" variant="contained" color="success" endIcon={<SendIcon />} size="medium"> Submit</Button>
                    </div>
                </Col>

            </Row>

        </Container>
    )
}

export default AddUser;