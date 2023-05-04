import React from 'react';
import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import PaymentForm from './PaymentForm';
import Button from 'react-bootstrap/Button';
import InputGroup from 'react-bootstrap/InputGroup'

class ResultInfo extends React.Component {

    constructor(props)  {
        super(props);
        this.state = {modalOpen: false};
    }

    toggleModal = () => {
        this.setState((state) => ({modalOpen: !state.modalOpen}));
    }


    render() {
        return(
            <Container fluid>
                <Row>
                    <Col>
                        <h2 className="ui teal image header">
                            <div className="content">
                            <svg className="bi bi-search" width="0.9em" height="0.9em" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                            <path fillRule="evenodd" d="M10.442 10.442a1 1 0 0 1 1.415 0l3.85 3.85a1 1 0 0 1-1.414 1.415l-3.85-3.85a1 1 0 0 1 0-1.415z"/>
                            <path fillRule="evenodd" d="M6.5 12a5.5 5.5 0 1 0 0-11 5.5 5.5 0 0 0 0 11zM13 6.5a6.5 6.5 0 1 1-13 0 6.5 6.5 0 0 1 13 0z"/>
                            </svg>
                                &nbsp;Risultato
                            </div>
                        </h2>

                        <Form>
                        <fieldset disabled>
                            <Form.Row>
                                <Form.Group as={Col} controlId="formGridCarsNumber">
                                    <Form.Label>Auto disponibili</Form.Label>
                                    <Form.Control readOnly value = {this.props.carsNumber}/>
                                </Form.Group>

                                <Form.Group as={Col} controlId="formGridPrice">
                                    <Form.Label>Prezzo</Form.Label>
                                    <InputGroup className="mb-3">
                                        <InputGroup.Prepend>
                                        <InputGroup.Text>€</InputGroup.Text>
                                        </InputGroup.Prepend>
                                        <Form.Control readOnly value = {this.props.price}/>
                                    </InputGroup>
                                </Form.Group>
                                
                            </Form.Row>
                        </fieldset>
                        <Form.Row style={{textAlign: "right"}}> 
                            <Col></Col>
                            <Col>
                                <Button variant="primary" onClick={this.toggleModal} disabled={this.props.carsNumber===0 ? true : false}>Effettua pagamento</Button>
                            </Col>
                        </Form.Row>

                        {/*this.props.rentalID && 
                                <>
                                <br></br>
                                <Alert variant= "success">
                                <svg className="bi bi-check-circle-fill" width="1.5em" height="1.5em" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
  <path fillRule="evenodd" d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"/>
</svg>
                                    &nbsp; Pagamento effettuato con successo! Il codice della tua prenotazione è {this.props.rentalID.id}.
                                </Alert>
                                </>
                        */}
                        
                        </Form>
                        {this.state.modalOpen && <PaymentForm handleErrors={this.props.handleErrors} onChangeCarsNumber = {this.props.onChangeCarsNumber} carsNumber = {this.props.carsNumber} price = {this.props.price} selectedCarID = {this.props.selectedCarID} selectedStartDate = {this.props.selectedStartDate} selectedEndDate = {this.props.selectedEndDate} modalOpen={this.state.modalOpen} onPayment={this.props.onPayment} toggleModal={this.toggleModal}/>}
                    </Col>
                </Row>
            </Container>
        );

}}

export default ResultInfo;