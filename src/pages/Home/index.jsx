import React, { useContext, useState, useEffect } from 'react'
import { UserContext } from '../../UserContext'
import api from "../../services/api"
import Footer from '../../components/Footer'
import NewHeader from '../../components/NewHeader'
import Warnings from '../../components/Warnings'
import {
  Grid, Container, CssBaseline, Typography,Card, CardMedia, CardContent, Chip, CardActionArea
  
} from '@material-ui/core'

import CallSharp from '@material-ui/icons/CallSharp'
import LocationOn from '@material-ui/icons/LocationOn'
import StarRate from '@material-ui/icons/Star'
import VerifiedUser from '@material-ui/icons/VerifiedUser'
import { makeStyles } from '@material-ui/core/styles'


export default function Home({ history }) {
  const styles = useStyles();

  const [services, setServices] = useState([])
  const {
    globalLocation, setGlobalLocation, loggedIn, topServices, setTopServices
  } = useContext(UserContext)


  function handleCard(service) {
    if (!navigator.onLine) {
      alert(
        "Para utilizar esse recurso é necessário conexão com a internet."
      );
      return;
    }
    console.log(service.key)
    history.push({
      pathname: '/serviceProfile',
      idService: service.key
    })
  }

  function formatPhone(phone) {
    let formatedPhone = "";
    if (phone.length == 8) {
      formatedPhone = phone.slice(0,4) + "-" + phone.slice(4,8);
    } else if (phone.length == 9) {
      formatedPhone = phone.slice(0,5) + "-" + phone.slice(5,9);
    } else if (phone.length == 10) {
      formatedPhone = "(" + phone.slice(0,2) + ") " + phone.slice(2,6) + "-" + phone.slice(6,10);
    } else if (phone.length == 11) {
      formatedPhone = "(" + phone.slice(0,2) + ") " + phone.slice(2,7) + "-" + phone.slice(7,11);
    } else {
      formatedPhone = phone;
    }

    return formatedPhone;
  }

  useEffect(() => {
    if (!navigator.onLine) {
      let topServices = JSON.parse(localStorage.getItem('topServices'));
      if (topServices) {
        setServices(topServices);
      }
    } else {
      api.get('service/topServices').then(res => {
        if (res.data) {
          const auxData = res.data;
          let services = []
          auxData.forEach(service => {
            service.phone = formatPhone(service.phone);
            let address = service.address;
            services.push({
              name: service.name,
              key: service._id,
              rating: service.averageRating,
              category: service.category.name,
              phone: service.phone,
              address: address ? address.street + ", " + address.number + ", " + address.neighborhood : "",
              image: service.image
            });
          });
          
          console.log(services)
          localStorage.setItem('topServices', JSON.stringify(services));
          setServices(services);

        }
      })
    }
  }, [])



  return (
    <React.Fragment>    
      
      <Grid container className={styles.mainGrid}>
        <Grid container direction="column">
          <CssBaseline />
          <Container component="main" maxWidth="lg">
            <NewHeader />
          </Container>
          <Container maxWidth="sm" component="main" className={styles.mainContainer}>
            <Typography className={styles.mainTitle} component="h2" variant="h3" align="center" color="textPrimary" gutterBottom>
              Ranking mensal de serviços
            </Typography>
            <Typography variant="h5" align="center" color="textSecondary" component="p">
              Esses são os 10 melhores serviços verificados da plataforma neste mês, caso deseje realizar uma busca avançada em outros serviços utilize o menu de navegação acima para navegar entre Serviços e Estabelecimentos. 
            </Typography>   
          </Container>
          {!navigator.onLine ? (
            <Warnings/>
          ) : (
            null
          )}
          <Container className={styles.cardGrid} maxWidth="md">
          {services.length !== 0 && (
                <Grid container spacing={2}>
                  {services.map((service) => (
                    <Grid item key={service.key} xs={12} >
                      <Card className={styles.card} elevation={3}>
                        <CardActionArea className={styles.card} onClick={() => handleCard(service)}>
                          <CardContent className={styles.cardContent}>
                            <div className={styles.teste}>
                              <Typography gutterBottom variant="h5" component="h2">
                              {service.name}
                              </Typography>
                              <VerifiedUser className={styles.iconVerified}>
                              </VerifiedUser>
                              <Chip icon={<StarRate fontSize="large" className={styles.star}/>} label={service.rating} className={styles.chip}/>
                            </div>
                            <Typography>
                              {service.category}
                            </Typography>
                            <div className={styles.teste}> 
                              <CallSharp className={styles.callSharp}/>

                              <Typography>
                                {service.phone}
                              </Typography>
                              
                            </div>
                            <div className={styles.teste}> 
                              <LocationOn className={styles.locationOn}/>

                              <Typography>
                                {service.address}
                              </Typography>
                              
                            </div>
                          </CardContent>
                          
                          {
                            service.image && navigator.onLine ? (
                              <CardMedia
                                className={styles.cardMedia}
                                src={process.env.REACT_APP_API_IMAGES_URL + service.image} 
                                component="img"
                                title="Image title"
                              />
                            ) :
                            null
                          }
                          
                        </CardActionArea>
                      </Card>
                    </Grid>
                  ))}
                </Grid>)}
          </Container>
        </Grid>
      </Grid >
      <Footer />
    </React.Fragment >
  ) 
}

const useStyles = makeStyles(theme => ({
  mainGrid: {
    backgroundColor: '#e4fdff',
    minHeight: '100vh'
  },
  mainTitle: {
    fontWeight: 'bold',
  },
  secondaryTitle: {
    paddingTop: theme.spacing(3),
    paddingLeft: theme.spacing(3)
  },
  paper: {
    marginBottom: theme.spacing(8),
  },
  firstButton: {
    marginRight: theme.spacing(1),
    marginTop: theme.spacing(1),
  },
  secondButton: {
    marginTop: theme.spacing(1),
  },
  mainContainer: {
    padding: theme.spacing(8, 0, 6),
  },
  buttons: {
    display: 'flex',
    justifyContent: 'flex-end',
  },
  cardGrid: {
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(8),
  },
  cardMedia: {
    marginLeft: 'auto',
    width: 150
  },
  card: {
    display: 'flex',
  },
  cardContent: {
    flexGrow: 1
  },
  teste: {
    display: 'flex'
  },
  chip: {
    marginLeft: '5px',
    marginTop: '-3px',
    backgroundColor: 'white'
  },
  iconVerified: {
    color: '#11b8ea',
    marginLeft: '10px'
  },
  callSharp: {
    paddingRight: '5px',
    color: '#11b8ea'
  },
  star: {
    color: 'yellow',
    borderRadius: '10px'    
  },
  locationOn: {
    color: '#fd0533',
    paddingRight: '5px'
  }

}));