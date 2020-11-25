import React, { useState } from 'react'
import Footer from '../../components/Footer'
import NewHeader from '../../components/NewHeader'

import { Grid, Container, CssBaseline, Typography, Divider, FormControl, Select, InputLabel } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'

import logo from '../../assets/logo-texto.png'
import search from '../../assets/search.svg'

export default function Main(props) {
  const styles = useStyles();
  const initialLogged = window.localStorage.getItem('logged');
  const [logged, setLogged] = useState(initialLogged)

  console.log(props);
  if (logged == "true" && (!props.history.location.state || !props.history.location.state.changeCity)) {
    props.history.push('/home');
  }

  const [state, setState] = React.useState({
    age: '',
    name: 'hai',
  });

  const handleChange = (event) => {
    const name = event.target.name;
    setState({
      ...state,
      [name]: event.target.value,
    });
    props.history.push('/home');
  };

  return (
    <React.Fragment>
      <Grid container className={styles.mainGrid}>
        <Grid container direction="column">
          <CssBaseline />
          <Container component="main" maxWidth="lg">
            <NewHeader/>
          </Container>
        </Grid>
        <Container className={styles.mainContainer} maxWidth="md" component="main">
          <Grid container >
            <Grid item xs={12} sm={6} className={styles.grid}>
              <img src={logo} alt="Ktalog" height="140" />
              <Typography className={styles.mainTitle} component="h3" variant="h4" color="textPrimary" gutterBottom>
                Seu catálogo virtual 
              </Typography>
              <Typography component="h5" variant="h6" color="textSecondary" gutterBottom>
                Ajudamos as pessoas a encontrar serviços e estabelecimentos de forma fácil e eficaz.
              </Typography>
              <Grid className={styles.information} container>
                <Grid item xs={12} sm={6}>
                  <Grid container direction="row">
                    <FormControl required variant="outlined" className={styles.formControl}>
                      <InputLabel htmlFor="selected-city">Escolha sua cidade</InputLabel>
                      <Select
                        native
                        value={state.age}
                        onChange={handleChange}
                        label="Escolha sua cidade"
                        inputProps={{
                          name: 'age',
                          id: 'outlined-age-native-simple',
                        }}
                      >
                        <option aria-label="None" value="" />
                        <option value={10}>Caeté</option>
                        <option value={20}>Belo Horizonte</option>
                      </Select>
                  </FormControl>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12} md={6}>
              <img src={search} alt="Imagem" className={styles.img} height="300em" width="100%" />
            </Grid>
          </Grid>
        </Container>
      </Grid>
      <Divider />
      <Divider />
      <Footer />
    </React.Fragment >
  )
}

const useStyles = makeStyles(theme => ({
  mainGrid: {
    backgroundColor: '#e4fdff',
    minHeight: '100vh',
  },
  mainContainer: {
    marginTop: 50
  },
  grid: {
    marginTop: 20
  },
  mainTitle: {
    marginTop: 30,
    fontWeight: 700
  },
  information: {
    marginTop: 50,
    marginBottom: 50
  },
  typography: {
    fontWeight: 'bold'
  },
  img: {
    marginBottom: theme.spacing(2)
  },
  formControl: {
    margin: 0,
    minWidth: 350,
    backgroundColor: '#9ee',
    display: 'flex',
    wrap: 'nowrap'
  }
}))