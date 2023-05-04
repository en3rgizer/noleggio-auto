import React from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import API from '../api/API';
import Alert from'react-bootstrap/Alert';
import moment from 'moment';

class PaymentForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {cardNumber: '', name: '', expDateYear: '', expDateMonth: '', cvv: '', msgErr: null, submitted: false};
  }

  componentDidMount() {
    let currentYear = parseInt(moment().format('YYYY'));
    let currentMonth = moment().format('MM');

    this.setState({expDateYear: currentYear, expDateMonth: currentMonth});
  }

  updateField = (name, value) => {
    this.setState({[name]: value});
}

checkValidity = () => {
  let currentYear = parseInt(moment().format('YYYY'));
  let currentMonth = moment().format('MM');
  
  if(this.state.name==='') {
    this.setState({msgErr: "'Nome' non valido."});
    return false;
  }

  if(this.state.expDateYear === currentYear) {
    if(this.state.expDateMonth < currentMonth) {
      this.setState({msgErr: "'Data scadenza' non valida."});
        return false;
    }
  }

  if(this.state.expDateYear < currentYear) {
      this.setState({msgErr: "'Data scadenza' non valida."});
      return false;
  }


  if(!/^[a-zA-Z ]+$/.test(this.state.name)) {
    this.setState({msgErr: "'Nome' non valido."});
    return false;
  }

  if(this.state.cardNumber.length!==16) {
    this.setState({msgErr: "'Numero di carta' non valido."});
    return false;
  }

  if(!/^[0-9]{3,4}$/.test(this.state.cvv)) {
    this.setState({msgErr: "'CVV' non valido."});
    return false;
  }

  return true;
}

handleSubmit = (event) => {
  event.preventDefault();
  
  if(this.checkValidity()) {
    this.setState({submitted: true});
    API.makePayment(this.state.cardNumber,this.state.name,this.state.expDateMonth,this.state.expDateYear,this.state.cvv,this.props.price)
      .then(() => {
        this.setState({msgErr: null});
        API.addBooking(this.props.selectedCarID,this.props.selectedStartDate,this.props.selectedEndDate,this.props.price)
          .then( (rentalID) => { 
            this.props.toggleModal(this.props.modalOpen);
            this.props.onPayment(rentalID.id);
          })
          .catch((err) => {
            this.props.handleErrors(err);
          })
      })
      .catch((err) => {
        if(err.status===422) {
          this.setState({msgErr: err.errMsg});
        }
        else {
          this.props.handleErrors(err);
        }
      })
  }
}

createExpDateYearOption = () => {
  let years = [];
  let currentYear = parseInt(moment().format('YYYY'));
  for (let i = currentYear; i <= currentYear+20; i++) {             
    years.push(<option key={i} value={i}>{i}</option>);   
  }

  return years;
}


  render() {
    return(
      <Modal show={this.props.modalOpen} onHide={this.props.toggleModal} animation={false}>
        <Modal.Header closeButton>
          <Modal.Title>
          <svg className="bi bi-cart-fill" width="1em" height="1em" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
  <path fillRule="evenodd" d="M0 1.5A.5.5 0 0 1 .5 1H2a.5.5 0 0 1 .485.379L2.89 3H14.5a.5.5 0 0 1 .491.592l-1.5 8A.5.5 0 0 1 13 12H4a.5.5 0 0 1-.491-.408L2.01 3.607 1.61 2H.5a.5.5 0 0 1-.5-.5zM5 12a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm7 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm-7 1a1 1 0 1 0 0 2 1 1 0 0 0 0-2zm7 0a1 1 0 1 0 0 2 1 1 0 0 0 0-2z"/>
</svg>
            &nbsp;Pagamento</Modal.Title>
        </Modal.Header>
        <Form method="POST" onSubmit={(event) => this.handleSubmit(event)}>
          <Modal.Body>
          <Form.Group controlId="name">
              <Form.Label className="font-weight-bold">Intestatario carta</Form.Label>
              <Form.Control type="text" name="name" placeholder="Mario Rossi" value = {this.state.name} onChange={(ev) => this.updateField(ev.target.name, ev.target.value)} autoFocus/>
            </Form.Group>

            <Form.Group controlId="cardNumber">
              <Form.Label className="font-weight-bold">Numero Carta</Form.Label>
              <Form.Control maxLength="16" type="number" name="cardNumber" placeholder="4444444444444444" value = {this.state.cardNumber} onChange={(ev) => this.updateField(ev.target.name, ev.target.value)}/>
            </Form.Group>

            <Form.Row>
            <Form.Group controlId="expDateMonth">
                <Form.Label className="font-weight-bold">Data scadenza</Form.Label>
                <Form.Control name="expDateMonth" as="select" value = {this.state.expDateMonth} onChange={(ev) => this.updateField(ev.target.name, ev.target.value)} style={{width:"100px"}}>
                  <option disabled={true}>Mese</option>
                  <option value="01">01</option>
                  <option value="02">02</option>
                  <option value="03">03</option>
                  <option value="04">04</option>
                  <option value="05">05</option>
                  <option value="06">06</option>
                  <option value="07">07</option>
                  <option value="08">08</option>
                  <option value="09">09</option>
                  <option value="10">10</option>
                  <option value="11">11</option>
                  <option value="12">12</option>
                </Form.Control>
              </Form.Group>
              <Form.Group controlId="expDateYear">
                <Form.Label>&zwnj;</Form.Label>
                  <Form.Control name="expDateYear" as="select" value = {this.state.expDateYear} onChange={(ev) => this.updateField(ev.target.name, ev.target.value)} style={{width:"100px"}}>
                    <option disabled={true}>Anno</option>
                    {this.createExpDateYearOption()}
                  </Form.Control>
              </Form.Group>

              <Form.Group as={Col} controlId="col">

              </Form.Group>

              <Form.Group controlId="cvv">
                  <Form.Label className="font-weight-bold">CVV</Form.Label>
                  <Form.Control maxLength="4" type="text" name="cvv" placeholder="123" value = {this.state.cvv} onChange={(ev) => this.updateField(ev.target.name, ev.target.value)} style={{width:"100px"}}/>
              </Form.Group>
                  
            </Form.Row>
            <Form.Row style={{textAlign: "right"}}>
              <Col>
              
                    <Form.Label><h5>Totale: € {this.props.price}</h5></Form.Label>
              
              </Col>
            </Form.Row>

          </Modal.Body>
          <Modal.Footer>
          {this.state.msgErr &&
                    <Alert variant= "danger">
                      <svg className="bi bi-x-circle-fill" width="1.5em" height="1.5em" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
  <path fillRule="evenodd" d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-4.146-3.146a.5.5 0 0 0-.708-.708L8 7.293 4.854 4.146a.5.5 0 1 0-.708.708L7.293 8l-3.147 3.146a.5.5 0 0 0 .708.708L8 8.707l3.146 3.147a.5.5 0 0 0 .708-.708L8.707 8l3.147-3.146z"/>
</svg>
                        <b>&nbsp;Errore: </b>{this.state.msgErr}
                    </Alert>
            }   
            <Button variant="primary" type="submit">Conferma {this.state.submitted && this.state.msgErr===null && <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>}</Button>
          </Modal.Footer>
        </Form>
      </Modal>
    );
    
  }
}

export default PaymentForm;