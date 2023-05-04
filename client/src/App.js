import React from 'react';
import './App.css';
import Header from './components/Header';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import LoginForm from './components/LoginForm';
import GridItem from './components/GridItem';
import Config from './components/Config';
import Filters from './components/Filters';
import BookingHistory from './components/BookingHistory';
import API from './api/API';
import {Route} from 'react-router-dom';
import {Switch} from 'react-router';
import {AuthContext} from './auth/AuthContext';
import { withRouter } from 'react-router-dom';
import {Redirect} from 'react-router-dom';
import Alert from'react-bootstrap/Alert';

class App extends React.Component {
  
  constructor(props)  {
    super(props);
    this.handleErrors = this.handleErrors.bind(this);
    this.state = {cars: [], brands: [], categories: [], filtBrands: [], filtCategories: [], cmpMount: false};
  }

  componentDidMount() {
    //check if the user is authenticated
    
    API.isAuthenticated().then(
      (user) => {
        this.setState({authUser: user});
      }
    ).catch((err) => { 
      this.setState({authUser: null});
    });
    
    API.getCars().then((cars) => this.setState({cars: cars},() => {
      this.setState({cmpMount: true})
    }));
    API.getBrands().then((brands) => this.setState({brands: brands}));
    API.getCategories().then((categories) => this.setState({categories: categories}));
    
  }

  handleErrors(err) {
    if (err) {
        if (err.status && err.status === 401) {
          this.setState({authUser: null},() => {
            this.props.history.push("/");
          });
        }
    }
  }

  // Logout method
  logout = () => {
    API.userLogout().then(() => {
      this.setState({authUser: null,authErr: null});
      this.props.history.push("/login");
    });
  }
  
  //Login method
  login = (email, password) => {
    API.userLogin(email, password).then(
      (user) => {
          this.setState({authUser: user, authErr: null});
          this.setState({filtBrands: [], filtCategories: []});
          API.getCars().then((cars) => this.setState({cars: cars}));
          API.getBrands().then((brands) => this.setState({brands: brands}));
          API.getCategories().then((categories) => this.setState({categories: categories}));
        })
      .catch(
          (errorObj) => {
            const err0 = errorObj.errors[0];
            this.setState({authErr: err0});
          }
    );
  }

  filterCars = (filter, value, type) => {
    if(type===0) {
      let tempfiltBrands = this.state.filtBrands;
      if(value===true)
        tempfiltBrands.push(filter);
      else {
        const index = tempfiltBrands.indexOf(filter);
        tempfiltBrands.splice(index,1);
      }
      this.setState({filtBrands: tempfiltBrands});
    }
    else {
      let tempfiltCategories = this.state.filtCategories;
      if(value===true)
      tempfiltCategories.push(filter);
      else {
        const index = tempfiltCategories.indexOf(filter);
        tempfiltCategories.splice(index,1);
      }
      this.setState({filtCategories: tempfiltCategories});
    }

    API.getCars(this.state.filtBrands,this.state.filtCategories).then((cars) => {
      window.scrollTo(0, 0); 
      this.setState({cars: cars});
    });
  }

  render() {
    // compose value prop as object with user object and logout method
    const value = {
      authUser: this.state.authUser,
      authErr: this.state.authErr,
      loginUser: this.login,
      logoutUser: this.logout
    }
    
    return(
      <AuthContext.Provider value={value}>
        <Header/>
        <Container fluid>   

          <Switch>

              <Route exact path="/">
                <Row className="vheight-100">
                    <Col sm={12} md={4} lg={3} xl={2} bg="light" className="below-nav px-xl-4 px-3">
                      <div className="filter-bar">

                      <Filters filterCars={this.filterCars} brands = {this.state.brands} categories = {this.state.categories}/>
                      </div>
                      
                    </Col>
                  <Col sm={12} md={8} lg={9} xl={10} className="below-nav main-c">
                    <div className="FilterGrid">
                      {this.state.cars.length>0 && this.state.cars.map((car) => <GridItem key = {car.carID} car = {car} />)}
                      {!this.state.cars.length && this.state.cmpMount && <Alert className='m-alert' variant="info">
                      <svg className="bi bi-info-circle-fill" width="1.5em" height="1.5em" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
  <path fillRule="evenodd" d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zm.93-9.412l-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533L8.93 6.588zM8 5.5a1 1 0 1 0 0-2 1 1 0 0 0 0 2z"/>
</svg>
                        &nbsp; Nessuna auto rispecchia i tuoi filtri.</Alert>}
                    </div>
                    {!this.state.cmpMount && 
                        <div className="spinner-border" style={{width: "3rem", height: "3rem"}} role="status">
                          <span className="sr-only">Loading...</span>
                        </div>
                      }
                  </Col>
                </Row>
              </Route>

              <Route path="/login">
                {this.state.authUser!=null && <Redirect to='/'/>}
                <Row className="vheight-100" style={{backgroundColor: "#f6f6f6"}}>
                  <Col sm={3} xl={4}></Col>
                  <Col sm={6} xl={4} className="below-nav"> 
                    <LoginForm/>
                  </Col>
                </Row>
              </Route>

              <Route path="/config">
                {(this.state.authUser==null) && <Redirect to='/'/>}
                <Row className="vheight-100">
                  <Col sm={0} lg={1}></Col>
                  <Config handleErrors={this.handleErrors} categories = {this.state.categories} />
                </Row>
              </Route>

              <Route path="/bookings">
                {(this.state.authUser==null) && <Redirect to='/'/>}
                <Row className="vheight-100">
                  <Col sm={0} lg={2} className="below-nav"></Col>
                  <Col sm={12} lg={8} className="below-nav">
                    <BookingHistory handleErrors={this.handleErrors} />
                  </Col>
                </Row>
              </Route>

          </Switch>
          

        </Container>
      </AuthContext.Provider>
    );
  }

}

export default withRouter(App);
