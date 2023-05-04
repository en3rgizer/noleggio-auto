import React from 'react';
import Table from 'react-bootstrap/Table'
import Alert from'react-bootstrap/Alert';
import BookingHistoryItem from './BookingHistoryItem';
import API from '../api/API';
import {Link} from 'react-router-dom';

class BookingHistory extends React.Component {

  constructor(props)  {
    super(props);
    this.state = {bookings: [], cmpMount: false};
  } 

    componentDidMount() {
      API.getBookings()
        .then((bookings) => {
          this.setState({bookings: bookings})
          this.setState({cmpMount: true})
        })
        .catch((errorObj) => {
          this.props.handleErrors(errorObj);
        });
    }

    deleteBooking = (rentalID) => {
      API.deleteBooking(rentalID)
        .then(() => {
          //update bookings
          API.getBookings()
            .then((bookings) => this.setState({bookings: bookings}));
        })
        .catch((err) => {
          this.props.handleErrors(err);
        });
    }
  

    render() {
      return(
            <>
            <h2>Prenotazioni</h2>
            {this.state.bookings.length>0 && <Table striped bordered hover>
              <thead>
              <tr>
                <th>Codice</th>
                <th>Brand</th>
                <th>Modello</th>
                <th>Categoria</th>
                <th>Data d'inizio</th>
                <th>Data di fine</th>
                <th>Prezzo</th>
                <th>Annulla</th>
              </tr>
              </thead>
              <tbody>
                {this.state.bookings.map((booking) => <BookingHistoryItem key = {booking.rentalID} booking = {booking} deleteBooking={this.deleteBooking}/>)}
              </tbody>
            </Table>}
            {!this.state.bookings.length && this.state.cmpMount && <Alert variant="info">
            <svg className="bi bi-info-circle-fill" width="1.5em" height="1.5em" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
  <path fillRule="evenodd" d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zm.93-9.412l-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533L8.93 6.588zM8 5.5a1 1 0 1 0 0-2 1 1 0 0 0 0 2z"/>
</svg>
              &nbsp;Non hai ancora effettuato nessuna prenotazione! Clicca {<Link to = "/config"><b>QUI</b></Link>} per iniziare!</Alert>}

              {!this.state.cmpMount && 
                <div className="spinner-border" style={{width: "3rem", height: "3rem"}} role="status">
                  <span className="sr-only">Loading...</span>
                </div>
              }
            </>
    );
  }
}


export default BookingHistory;
