import React from 'react';
import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import API from '../api/API';
import moment from 'moment';
import Alert from'react-bootstrap/Alert';


class ConfigForm extends React.Component {

    constructor(props)  {
        super(props);
        this.state = {startDate: undefined, endDate: undefined, category: undefined, age: undefined, addDrivers: undefined, extraIns: undefined, kmPerDay: undefined, formError: null};
    }

    componentDidMount() {
        let today = moment().format("YYYY-MM-DD");
        this.setState({startDate: today});
        this.setState({endDate: today});
        this.setState({category: 'A'});
        this.setState({age: '18'});
        this.setState({addDrivers: '0'});
        this.setState({extraIns: false});
        this.setState({kmPerDay: '0'},() => {
            API.checkPrice(this.state.startDate, this.state.endDate, this.state.category, this.state.age, this.state.addDrivers, this.state.extraIns, this.state.kmPerDay)
            .then((info) => {
                this.props.onFormError(null);
                this.props.onChangePrice(info.price);
                this.props.onChangeCarsNumber(info.carsNumber);
                this.props.onChangeCarID(info.selectedCarID);
            })
            .catch((errors) => {
                if(errors.status===422) {
                    this.props.onFormError(errors.formErrors);
                }
                else {
                    this.props.handleErrors(errors);
                }
            });
        });

    }

    

    createCatOption = (category) => {
        return (
            <option key={category.name.toString()}>{category.name}</option>
            );
    }

    createAgeOption = () => {
        let ages = [];         
        for (let i = 18; i <= 100; i++) {             
            ages.push(<option key={i} value={i}>{i}</option>);   
     }
     return ages;
    }

    checkValidity = (event) => {
        let value = event.target.value;
        let name = event.target.name;

        if(name==='extraIns') {
            value = event.target.checked;
            if(value!==true && value!==false) {
                this.setState({formError: "'Assicurazione extra' può assumere solo uno dei seguenti valori: Vero o Falso."});
                return false;
            }
        }
        
        else if(name==='startDate') {
            if(!moment(value).isValid()) {
                this.setState({formError: "'Giorno d'inizio' deve essere una data."});
                return false;
            }
            if(moment(value).isBefore(moment().format('YYYY-MM-DD'))) {
                this.setState({formError: "'Giorno d'Inizio' non può essere precedente alla data odierna."});
                return false;
            }
            /*if(moment(value).isAfter(moment(this.state.endDate))) {
                this.setState({formError: "'Giorno di fine' non può precedere 'Giorno d'inizio'."});
                return false;
            }*/
            if(moment(value).isAfter(moment(this.state.endDate))) {
                this.setState({endDate: value});
            }
        }

        else if(name==='endDate') {
            if(!moment(value).isValid()) {
                this.setState({formError: "'Giorno di fine' deve essere una data."});
                return false;
            }
            if(moment(value).isBefore(moment().format('YYYY-MM-DD'))) {
                this.setState({formError: "'Giorno di fine' non può essere precedente alla data odierna."});
                return false;
            }
            if(moment(value).isBefore(moment(this.state.startDate))) {
                this.setState({formError: "'Giorno di fine' non può precedere 'Giorno d'inizio'."});
                return false;
            }
        }

        else if(name==='age') {
            if(value<18 || value >100) {
                this.setState({formError: "'Età guidatore' non valida [18-100]."});
                return false;
            }
        }

        else if(name==='addDrivers') {
            if(value<0 || value >5) {
                this.setState({formError: "'Guidatori addizionali' non valido [0-5]."});
                return false;
            }
        }

        else if(name==='category') {
            if(!["A","B","C","D","E"].includes(value)) {
                this.setState({formError: "'Categoria' non valida [A-E]."});
                return false;
            }
        }

        else if(name==='kmPerDay') {
            if(value<0 || value >2) {
                this.setState({formError: "'Numero stimato di km da percorrere' non valido."});
                return false;
            }
        }

        return true;
    }

    onChangeInput = (event) => {
        let value = event.target.value;
        let name = event.target.name;

        if(name==='extraIns')
            value = event.target.checked;

        if(this.checkValidity(event)){
            this.props.onPayment(null);
            this.setState({formError: null});
            this.setState({[event.target.name] : value},() => {
            if(name==='startDate')
                this.props.onChangeStartDate(this.state.startDate);

            if(name==='endDate')
                this.props.onChangeEndDate(this.state.endDate);

            API.checkPrice(this.state.startDate, this.state.endDate, this.state.category, this.state.age, this.state.addDrivers, this.state.extraIns, this.state.kmPerDay)
            .then((info) => {
                this.props.onFormError(null);
                this.props.onChangePrice(info.price);
                this.props.onChangeCarsNumber(info.carsNumber);
                this.props.onChangeCarID(info.selectedCarID);
            })
            .catch((errors) => {
                if(errors.status===422) {
                    this.props.onFormError(errors.formErrors);
                }
                else {
                    this.props.handleErrors(errors);
                }
            });

        });
    }
    };

    render() {
        return(
            <Container fluid>
                <Row>
                    <Col>
                        <h2 className="ui teal image header">
                            <div className="content">
                            <svg className="bi bi-gear-fill" width="0.9em" height="0.9em" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
  <path fillRule="evenodd" d="M9.405 1.05c-.413-1.4-2.397-1.4-2.81 0l-.1.34a1.464 1.464 0 0 1-2.105.872l-.31-.17c-1.283-.698-2.686.705-1.987 1.987l.169.311c.446.82.023 1.841-.872 2.105l-.34.1c-1.4.413-1.4 2.397 0 2.81l.34.1a1.464 1.464 0 0 1 .872 2.105l-.17.31c-.698 1.283.705 2.686 1.987 1.987l.311-.169a1.464 1.464 0 0 1 2.105.872l.1.34c.413 1.4 2.397 1.4 2.81 0l.1-.34a1.464 1.464 0 0 1 2.105-.872l.31.17c1.283.698 2.686-.705 1.987-1.987l-.169-.311a1.464 1.464 0 0 1 .872-2.105l.34-.1c1.4-.413 1.4-2.397 0-2.81l-.34-.1a1.464 1.464 0 0 1-.872-2.105l.17-.31c.698-1.283-.705-2.686-1.987-1.987l-.311.169a1.464 1.464 0 0 1-2.105-.872l-.1-.34zM8 10.93a2.929 2.929 0 1 0 0-5.86 2.929 2.929 0 0 0 0 5.858z"/>
</svg>
                                &nbsp;Configuratore
                            </div>
                        </h2>

                        <Form>
                            <Form.Row>
                                <Form.Group as={Col} controlId="formGridStartDate">
                                    <Form.Label>Giorno d'inizio</Form.Label>
                                    <Form.Control name="startDate" type="date" min={moment().format('YYYY-MM-DD')} value = {this.state.startDate || ''} onChange={(ev) => this.onChangeInput(ev)}/>
                                </Form.Group>

                                <Form.Group as={Col} controlId="formGridEndDate">
                                    <Form.Label>Giorno di fine</Form.Label>
                                    <Form.Control name="endDate" type="date" min={moment(this.state.startDate).format('YYYY-MM-DD')} value = {this.state.endDate || ''} onChange={(ev) => this.onChangeInput(ev)}/>
                                </Form.Group>
                            </Form.Row>

                            <Form.Row>
                                <Form.Group as={Col} controlId="formGridCategory">
                                    <Form.Label>Categoria</Form.Label>
                                    <Form.Control name="category" as="select" value = {this.state.category} onChange={(ev) => this.onChangeInput(ev)}>
                                        {this.props.categories.map(this.createCatOption) }
                                    </Form.Control>
                                </Form.Group>

                                <Form.Group as={Col} controlId="formGridAge">
                                    <Form.Label>Età guidatore</Form.Label>
                                    <Form.Control name="age" as="select" value = {this.state.age} onChange={(ev) => this.onChangeInput(ev)}>
                                        {this.createAgeOption()}
                                    </Form.Control>
                                </Form.Group>

                                <Form.Group as={Col} controlId="formGridAddDrivers">
                                    <Form.Label>Guidatori addizionali</Form.Label>
                                    <Form.Control name="addDrivers" as="select" value = {this.state.addDrivers} onChange={(ev) => this.onChangeInput(ev)}>
                                        <option>0</option>
                                        <option>1</option>
                                        <option>2</option>
                                        <option>3</option>
                                        <option>4</option>
                                        <option>5</option>
                                    </Form.Control>
                                </Form.Group>
                            </Form.Row>

                            <Form.Row>
                                <Form.Group as={Col} controlId="formGridDailyKm">
                                    <Form.Label>Numero stimato di km da percorrere</Form.Label>
                                    <Form.Control name="kmPerDay" as="select" defaultValue="meno di 50 km/giorno" onChange={(ev) => this.onChangeInput(ev)}>
                                        <option value="0">meno di 50 km/giorno</option>
                                        <option value="1">tra 50 e 150 km/giorno</option>
                                        <option value="2">km/giorno illimitati</option>
                                    </Form.Control>
                                </Form.Group>
                            </Form.Row>

                            <Form.Group id="formGridCheckbox">
                                <Form.Check name="extraIns" value={this.state.extraIns} type="checkbox" label="Assicurazione extra" onChange={(ev) => this.onChangeInput(ev)}/>
                            </Form.Group>
                        </Form>

                        {this.state.formError && 
                                <>
                                <br></br>
                                <Alert variant= "danger">
                                <svg className="bi bi-x-circle-fill" width="1.5em" height="1.5em" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
  <path fillRule="evenodd" d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-4.146-3.146a.5.5 0 0 0-.708-.708L8 7.293 4.854 4.146a.5.5 0 1 0-.708.708L7.293 8l-3.147 3.146a.5.5 0 0 0 .708.708L8 8.707l3.146 3.147a.5.5 0 0 0 .708-.708L8.707 8l3.147-3.146z"/>
</svg>
                                    <b>&nbsp;Errore:</b>
                                    <ul>
                                        <li key={this.state.formError}>{this.state.formError}</li>
                                    </ul>
                                </Alert>
                                </>
                        }

                    </Col>
                </Row>
            </Container>
        );

}}

export default ConfigForm;