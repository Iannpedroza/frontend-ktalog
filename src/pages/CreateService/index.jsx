import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { UserContext } from '../../UserContext'
import ServiceTypeInformation from '../../components/ServiceTypeInformation'
import api from "../../services/api"
import { serialize } from 'object-to-formdata';
import ServiceDetails from '../../components/ServiceDetails'

import ServiceConfirm from '../../components/ServiceConfirm'

import NewHeader from '../../components/NewHeader'
import {
     Button, Paper, Container, Grid, CssBaseline, Typography, Stepper, Step, StepLabel
  } from '@material-ui/core'
import { useContext } from 'react';

const steps = ['Tipo do Serviço', 'Detalhes do Serviço', 'Revisar dados'];


function getStepContent(step) {
    switch (step) {
        case 0:
            return <ServiceTypeInformation />
        case 1:
            return <ServiceDetails/>
        case 2:
            return <ServiceConfirm/>
        default:
            throw new Error('Unknown step')
    }
}

const useStyles = makeStyles((theme) => ({
    appBar: {
        position: 'relative',
    },
    layout: {
        width: 'auto',
        marginLeft: theme.spacing(2),
        marginRight: theme.spacing(2),
        [theme.breakpoints.up(600 + theme.spacing(2) * 2)]: {
        width: 600,
        marginLeft: 'auto',
        marginRight: 'auto',
        },
    },
    paper: {
        marginTop: theme.spacing(3),
        marginBottom: theme.spacing(3),
        padding: theme.spacing(2),
        [theme.breakpoints.up(600 + theme.spacing(3) * 2)]: {
        marginTop: theme.spacing(6),
        marginBottom: theme.spacing(6),
        padding: theme.spacing(3),
        },
    },
    stepper: {
        padding: theme.spacing(3, 0, 5),
    },
    buttons: {
        display: 'flex',
        justifyContent: 'flex-end',
    },
    button: {
        marginTop: theme.spacing(3),
        marginLeft: theme.spacing(1)
    },
    background: {
        backgroundColor: '#e4fdff',
        minHeight: '100vh'
    },
    mainGrid: {
        backgroundColor: '#e4fdff',
    }

}));

export default function CreateService({history}) {
    const classes = useStyles();

    const [activeStep, setActiveStep] = React.useState(0);
    const { serviceName, description, phone, category, cep, selectedUf, city, street, streetNumber, neighbour, verificado, serviceType, cpf, cnpj, scheduleItems, userLogged,
        productItems, averagePrice, serviceImage
      } = useContext(UserContext)
    
    if (!navigator.onLine) {
        alert("É necessário conexão com internet para utilizar esse recurso.");
        history.push('/home');
    }

    const handleNext = () => {
        if (activeStep === 0 && verificado) {
            let auxCpf = cpf.replace(/[^0-9]/g,''), auxCnpj = cnpj.replace(/[^0-9]/g,'');
            
            if (serviceType == 0 && auxCpf.length != 11) {
                alert("Preencha o CPF")
                return;
            } else if (serviceType == 1 && auxCnpj.length != 14) {
                alert("Preencha o CNPJ")
                return;
            }
        }
        
        if (activeStep == 1) {
            if (!serviceName || !phone || !category || !cep || !street || !streetNumber || !neighbour || !selectedUf || !city) {
                alert("Algum campo obrigatório está em falta. Preencha os campos com asterisco(*)")
                return;
            }

            let phoneAux = phone.replace(/[^0-9]/g,'');
            if (phoneAux.length < 10) {
                alert("Telefone inválido")
                return;
            }
            if (verificado ) {
                let erro = false;
                scheduleItems.map(schedule => {
                    if (!schedule.from || !schedule.to) {
                        erro = true;
                    }
                }) 
                if (erro) {
                    alert("Algum campo de horários está incompleto. Preencha para prosseguir.")
                    return;
                }
                

            }
        }

        if (activeStep == 2) {
            criar();
        }
        setActiveStep(activeStep + 1);
      };
    
    const handleBack = () => {
        setActiveStep(activeStep - 1);
    };

    const criar = () => {
        const initialUserLogged = JSON.parse(window.localStorage.getItem('userLogged'));
        let objectToCreate = {
            name: serviceName, 
            description,  
            verified: verificado ? true : false,
            phone: phone.replace(/[^0-9]/g,''), 
            category, 
            address: {
                zipcode: cep.replace(/[^0-9]/g,''),
                city: city,
                state: selectedUf,
                neighborhood: neighbour,
                number: streetNumber,
                street: street
            },
            user: userLogged.id || initialUserLogged.id,
            image: serviceImage
        };

        if (verificado) {
            if (serviceType == 0) {
                objectToCreate.averagePrice = averagePrice;
            } else {
                if (productItems && productItems.length > 0) {

                    objectToCreate.products = JSON.stringify(productItems);
                    let aux = [];
                    productItems.forEach(el => {
                        if (el.image) {
                            aux.push(el.image);
                        }
                    });
                    objectToCreate.productsImages = aux;
                }
                objectToCreate.cnpj = cnpj.replace(/[^0-9]/g,'');
            }

            if (scheduleItems && scheduleItems.length > 0) {
                objectToCreate.schedules = JSON.stringify(scheduleItems);
            }
            
        } 
        if (serviceType == 0) {
            objectToCreate.averagePrice = averagePrice;
        } 

        const formData = serialize(objectToCreate);

        console.log(formData);
        api.post('service/register', formData)
            .then(service => {
                if (service) {
                    console.log("serviço criado" + JSON.stringify(service))
                }
            }) 

            .catch(err => {
                console.error("erro" + err)
            })
        
        
    };

    return (
        <React.Fragment>
            <Grid container className={classes.mainGrid}>
                <Grid container direction="column">
                    <CssBaseline />
                    <Container component="main" maxWidth="lg">
                        <NewHeader />
                    </Container>
                </Grid>
            </Grid>
            <Grid className={classes.background} container alignItems="center" justify="center">


                <main className={classes.layout}>
                    <Paper className={classes.paper}>
                        <Typography component="h1" variant="h4" align="center">
                            Criar Serviço
                        </Typography>
                        <Stepper activeStep={activeStep} className={classes.stepper}>
                            {steps.map((label) => (
                            <Step key={label}>
                                <StepLabel>{label}</StepLabel>
                            </Step>
                            ))}
                        </Stepper>
                        <React.Fragment>
                            
                            {activeStep === steps.length ? (
                                <React.Fragment>
                                <Typography variant="h5" gutterBottom>
                                  Obrigado por cadastrar um serviço.
                                </Typography>
                                <Typography variant="subtitle1">
                                  Volte para a tela principal e comece a usar.
                                </Typography>
                                <div className={classes.buttons}>
                                  <Button variant="contained" color="primary" onClick={console.log("oi")} className={classes.button}>
                                    Ok
                                  </Button>
                                </div>
                              </React.Fragment>
                            ) : 
                            (
                                <React.Fragment>
                                    {getStepContent(activeStep)}
                                    <div className={classes.buttons}>
                                    {activeStep !== 0 && (
                                        <Button variant="contained" onClick={handleBack} className={classes.button}>
                                            Voltar
                                        </Button>
                                    )}
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        onClick={handleNext}
                                        className={classes.button}
                                    >
                                        {activeStep == 2 ? "Criar" : "Próximo"}
                                    </Button>
                                    </div>
                                </React.Fragment>
                            )}
                            
                            
                        </React.Fragment>
                    </Paper>
                </main>
            </Grid>
        </React.Fragment>
    );
  }
