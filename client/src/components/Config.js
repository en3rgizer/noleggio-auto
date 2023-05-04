import React from 'react';
import Col from 'react-bootstrap/Col';
import ConfigForm from './ConfigForm';
import ResultInfo from './ResultInfo';
import moment from 'moment';
import Alert from'react-bootstrap/Alert';


class Config extends React.Component {

    constructor(props)  {
        super(props);
        this.state = {carsNumber: '', price: '', selectedStartDate: '', selectedEndDate: '', selectedCarID: null, FormErr: null, rentalID: null};
    }

    componentDidMount() {
        let today = moment().format("YYYY-MM-DD");
        this.setState({selectedStartDate: today});
        this.setState({selectedEndDate: today});
    }

    onPayment = (newRentalID) => {
        this.setState({rentalID: newRentalID});
    }

    onChangePrice = (newPrice) => {
        this.setState({price: newPrice});
    }
    
    onChangeCarsNumber = (newCarsNumber) => {
        this.setState({carsNumber: newCarsNumber});
    }

    onChangeStartDate = (newStartDate) => {
        this.setState({selectedStartDate: newStartDate});
    }

    onChangeEndDate = (newEndDate) => {
        this.setState({selectedEndDate: newEndDate});
    }

    onChangeCarID = (newCarID) => {
        this.setState({selectedCarID: newCarID});
    }

    onFormError = (newFormError) => {
        this.setState({FormErr: newFormError});
    }


    render() {
        return(
            <>
                <Col lg={4} className="below-nav"> 
                    <ConfigForm onPayment={this.onPayment} handleErrors={this.props.handleErrors} onFormError={this.onFormError} onChangeCarsNumber={this.onChangeCarsNumber} onChangePrice={this.onChangePrice} onChangeCarID={this.onChangeCarID} onChangeStartDate={this.onChangeStartDate} onChangeEndDate={this.onChangeEndDate} categories = {this.props.categories}/>
                </Col>
                <Col lg={1} ></Col>
                <Col lg={4} className="below-nav">
                    {this.state.FormErr && 
                                    <>
                                    <br></br>
                                    <Alert variant= "danger">
                                        <b>Errori:</b>
                                        <ul>
                                            {this.state.FormErr.map((error) => <li key={error.msg}>{error.msg}</li>)}
                                        </ul>
                                    </Alert>
                                    </>
                    }

                    {this.state.rentalID && 
                            <>
                            <br></br>
                            <Alert variant= "success">
                            <svg className="bi bi-check-circle-fill" width="1.5em" height="1.5em" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                            <path fillRule="evenodd" d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"/>
                            </svg>
                                &nbsp; Pagamento effettuato con successo! Il codice della tua prenotazione è {this.state.rentalID}.
                            </Alert>
                            </>
                    }

                    {!this.state.FormErr && this.state.rentalID==null &&
                    <ResultInfo handleErrors={this.props.handleErrors} onPayment={this.onPayment} onChangeCarsNumber = {this.onChangeCarsNumber} carsNumber = {this.state.carsNumber} price = {this.state.price} selectedCarID={this.state.selectedCarID} selectedStartDate = {this.state.selectedStartDate} selectedEndDate = {this.state.selectedEndDate}/>}
                </Col>

            </>
        );
    }
}

export default Config;