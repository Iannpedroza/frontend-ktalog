import React, {useState} from 'react';

import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import { UserContext } from './UserContext'

import "bootstrap/dist/css/bootstrap.min.css";

import Main from "./pages/Main";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Forgot from "./pages/Forgot";
import CreateService from "./pages/CreateService"
import Home from "./pages/Home"
import Services from "./pages/Services"
import serviceProfile from "./pages/ServiceProfile"
import Configuration from './pages/Configuration'
import Establishments from './pages/Establishments'

function App() {
  const [userLogged, setUserLogged] = useState('')
  const [street, setStreet] = useState('')
  const [streetNumber, setStreetNumber] = useState('')
  const [neighbour, setNeighbour] = useState('')
  const [selectedUf, setSelectedUf] = useState('')
  const [description, setDescription] = useState('')
  const [city, setCity] = useState('')
  const [cep, setCEP] = useState('')
  const [phone, setPhone] = useState('')
  const [cpf, setCpf] = useState('')
  const [cnpj, setCnpj] = useState('')
  const [category, setCategory] = useState('')
  const [verificado, setVerificado] = useState('')
  const [serviceName, setServiceName] = useState('')
  const [serviceType, setServiceType] = useState('')
  const [topServices, setTopServices] = useState('')
  const [averagePrice, setAveragePrice] = useState('')
  const [serviceImage, setServiceImage] = useState('')
  
  const [productItems, setProductItems] = useState([]);
  const [scheduleItems, setScheduleItems] = useState([
    { week_day: 0, from: "", to: "" },
  ]);
  const user = {
    serviceName, setServiceName,
    description, setDescription, street, setStreet, streetNumber, setStreetNumber, neighbour, setNeighbour, selectedUf, setSelectedUf, city, 
    setCity ,cep, setCEP, phone, setPhone, cpf, setCpf, cnpj, setCnpj, category, setCategory, verificado, setVerificado, serviceType, setServiceType,
    topServices, setTopServices, userLogged, setUserLogged, averagePrice, setAveragePrice, serviceImage, setServiceImage, productItems, setProductItems,
    scheduleItems, setScheduleItems
  }
  return (
    <Router>
      <Switch>
        <UserContext.Provider value={user}>
          <Route path="/" exact component={Main} />
          <Route path="/register" component={Register} />
          <Route path="/login" component={Login} />
          <Route path="/forgot" component={Forgot} />
          <Route path="/createService" component={CreateService} />
          <Route path="/home" component={Home} />
          <Route path="/serviceProfile" component={serviceProfile} />
          <Route path="/configuration" component={Configuration} />
          <Route path="/services" component={Services} />
          <Route path="/establishments" component={Establishments} />
        </UserContext.Provider>
      </Switch>
      
    </Router>
  );
}

export default App;
