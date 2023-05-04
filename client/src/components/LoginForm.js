import React from 'react';
import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from'react-bootstrap/Button';
import Alert from'react-bootstrap/Alert';
import {Redirect} from 'react-router-dom';
import {AuthContext} from '../auth/AuthContext'
import logo from '../rent.png';
import Image from 'react-bootstrap/Image'

class LoginForm extends React.Component {
    
    constructor(props) {
        super(props);
        this.state = {email: '', password: '', submitted: false};
    }

    onChangeEmail = (event) => {
        this.setState({email : event.target.value});
    }; 
    
    onChangePassword = (event) => {
        this.setState({password : event.target.value});
    };

    
    handleSubmit = (event, onLogin) => {
        event.preventDefault();
        onLogin(this.state.email,this.state.password);
        this.setState({submitted : true}); 
    }

    render() {
        
        return(
            <AuthContext.Consumer>
                {(context) => (
                <>
                {this.state.submitted && context.authUser!=null && <Redirect to='/'/>}
                <Container fluid>
                    <Row>
                        <Col>
                            <Image src={logo} width="100%" />
                            <h4 className="ui teal image header">
                                <div className="content" style={{textAlign: "center"}}>
                                    Effettua il Log-in
                                </div>
                            </h4>

                            <Form method="POST" onSubmit={(event) => this.handleSubmit(event, context.loginUser)}>
                                <Form.Group controlId="email">
                                    <Form.Label>E-mail</Form.Label>
                                    <Form.Control style={{padding: "10px", height:"auto", fontSize:"larger"}} type="email" name="email" placeholder="E-mail" value = {this.state.email} onChange={(ev) => this.onChangeEmail(ev)} required autoFocus/>
                                </Form.Group>

                                <Form.Group controlId="password">
                                    <Form.Label>Password</Form.Label>
                                    <Form.Control style={{padding: "10px", height:"auto", fontSize:"larger"}} type="password" name="password" placeholder="Password" value = {this.state.password} onChange={(ev) => this.onChangePassword(ev)} required/>
                                </Form.Group>

                                <Button variant="primary" type="submit" style={{fontSize: "1.25rem"}}>Login {context.authErr===null && this.state.submitted && <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>}</Button>

                            </Form>
                            {context.authErr && this.state.submitted && 
                            <>
                            <br></br>
                            <Alert variant= "danger">
                            <svg className="bi bi-x-circle-fill" width="1.5em" height="1.5em" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
  <path fillRule="evenodd" d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-4.146-3.146a.5.5 0 0 0-.708-.708L8 7.293 4.854 4.146a.5.5 0 1 0-.708.708L7.293 8l-3.147 3.146a.5.5 0 0 0 .708.708L8 8.707l3.146 3.147a.5.5 0 0 0 .708-.708L8.707 8l3.147-3.146z"/>
</svg>
                                &nbsp;{context.authErr.msg}
                            </Alert>
                            </>
                            }
                        </Col>
                    </Row>
                </Container>
                </>
                )}
            </AuthContext.Consumer>

        );
    }


}

export default LoginForm;