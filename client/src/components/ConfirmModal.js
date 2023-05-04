import React from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from'react-bootstrap/Button';
import moment from 'moment';

class ConfirmModal extends React.Component {
  
  render() {
    return(
      <Modal show={this.props.modalOpen} onHide={this.props.toggleModal} animation={false}>
        <Modal.Header closeButton>
          <Modal.Title>
          <svg className="bi bi-trash-fill" width="1em" height="1em" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
  <path fillRule="evenodd" d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1H2.5zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zM8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5zm3 .5a.5.5 0 0 0-1 0v7a.5.5 0 0 0 1 0v-7z"/>
</svg>
            &nbsp;Cancellazione Prenotazione</Modal.Title>
        </Modal.Header>
      <Modal.Body>Sei sicuro di voler cancellare la seguente prenotazione?<br></br><br></br>
      <b>Auto: </b> {this.props.booking.brand} {this.props.booking.model}<br></br>
      <b>Categoria: </b> {this.props.booking.category}<br></br>
      <b>Data d'inizio: </b> {moment(this.props.booking.startDate).format("DD/MM/YYYY")}<br></br>
      <b>Data di fine: </b> {moment(this.props.booking.endDate).format("DD/MM/YYYY")}
      
      </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => this.props.deleteBooking(this.props.booking.rentalID)}>
            Si
          </Button>
          <Button variant="primary" onClick={() => this.props.toggleModal(this.props.modalOpen)}> 
            No
          </Button>
        </Modal.Footer>
      </Modal>
    );
    
  }
}

export default ConfirmModal;