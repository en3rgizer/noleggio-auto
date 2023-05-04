import React from 'react';
import moment from 'moment';
import Button from 'react-bootstrap/Button'
import OverlayTrigger from 'react-bootstrap/OverlayTrigger'
import Tooltip from 'react-bootstrap/Tooltip'
import ConfirmModal from './ConfirmModal';

class BookingHistoryItem extends React.Component {
  
  constructor(props)  {
    super(props);
    this.state = {modalOpen: false};
  }

  toggleModal = () => {
    this.setState((state) => ({modalOpen: !state.modalOpen}));
  }

  render() {

    const today = moment().format("YYYY-MM-DD");
    const startDate = this.props.booking.startDate;
    const endDate = this.props.booking.endDate;

    return(

    <tr>
        <td>{this.props.booking.rentalID}</td>
        <td>{this.props.booking.brand}</td>
        <td>{this.props.booking.model}</td>
        <td>{this.props.booking.category}</td>
        <td>{moment(startDate).format("DD/MM/YYYY")}</td>
        <td>{moment(endDate).format("DD/MM/YYYY")}</td>
        <td>€ {this.props.booking.price.toFixed(2)}</td>
        {moment(endDate).isAfter(today) && moment(startDate).isAfter(today) ? <td><Button variant="danger" onClick={this.toggleModal}>Cancella</Button></td> :
                <td>
                  <OverlayTrigger placement="right" overlay={<Tooltip id="tooltip-disabled">La prenotazione è già stata confermata!</Tooltip>}>
                    <span className="d-inline-block">
                      <Button variant="danger" disabled>
                        Cancella
                      </Button>
                    </span>
                  </OverlayTrigger>
                </td>
        }
        {this.state.modalOpen && <ConfirmModal booking = {this.props.booking} deleteBooking={this.props.deleteBooking} modalOpen={this.state.modalOpen} toggleModal={this.toggleModal}/>}
    </tr>
  );
}}


export default BookingHistoryItem;
