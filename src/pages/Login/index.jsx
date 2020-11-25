import React, { useState, useContext } from 'react'
import FacebookLogin from 'react-facebook-login';
import Footer from '../../components/Footer'
import NewHeader from '../../components/NewHeader'
import { UserContext } from '../../UserContext'
import axios from 'axios'

import {
    TextField, IconButton, InputAdornment, Button, Paper, Container,
    Link, Grid, CssBaseline, Divider
} from '@material-ui/core'

import { Visibility, VisibilityOff } from '@material-ui/icons';
import { makeStyles } from '@material-ui/core/styles'

import logo from '../../assets/logo-texto.png'

export default function Login({ history }) {
  const styles = useStyles();
  //const [openDialog, setOpenDialog] = useState(false)
  const { userLogged, setUserLogged } = useContext(UserContext)
  const [email, setEmail] = useState('')
  const [values, setValues] = useState({
    password: '',
    showPassword: false
  })

  const handleChange = prop => event => {
    setValues({ ...values, [prop]: event.target.value });
  };

  const handleClickShowPassword = () => {
    setValues({ ...values, showPassword: !values.showPassword });
  };

  const handleMouseDownPassword = event => {
    event.preventDefault();
  };

  function handleRegister() {
    history.push('/register')
  }

  function handleForgotPassword() {
    history.push("/forgot")
  }


  const responseFacebook = (response) => {
      console.log(response);
      return axios
        .post('http://localhost:5000/users/fblogin', {
            accessToken: response.accessToken,
            userID: response.userID
        })
        .then(response => {
            console.log("Facebook login success", response);
            window.localStorage.setItem('logged', "true");
            localStorage.setItem('userLogged', JSON.stringify(response.data.user));
            setUserLogged(response.data.user)
        })
  }

  async function handleLogin() {
    try {
        return axios
          .post('http://localhost:5000/users/login', {
            email: email,
            password: values.password
          })
          .then(response => {
            console.log(response);
            if (response.data.error) {
                alert("Usuário e/ou senha inválidos.")
                return;
            } else {
                localStorage.setItem('logged', "true");
                localStorage.setItem('userLogged', JSON.stringify(response.data));
                setUserLogged(response.data)
                history.push('/home');
            }
            
          })
          .catch(() => {
            console.log('Erro')
          })
    } catch (error) {
      alert(error.message)
    }
  }


  return (
    <React.Fragment>
      <Grid container className={styles.mainGrid}>
        <Grid container direction="column">
          <CssBaseline />
          <Container component="main" maxWidth="lg">
            <NewHeader />
          </Container>
        </Grid>
      </Grid>
      <Grid className={styles.background} container alignItems="center" justify="center">
        <Container component="main" maxWidth="xs">
          <CssBaseline />
          <Paper elevation={3} className={styles.paper}>
            <img src={logo} alt="Ktalog" height="90em" />
            <form className={styles.form} onSubmit={e => e.preventDefault() && false} noValidate>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    autoFocus
                    fullWidth
                    id="email"
                    label="Endereço de e-mail"
                    name="email"
                    value={email}
                    onChange={event => setEmail(event.target.value)}
                    autoComplete="email"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    name="password"
                    label="Senha"
                    type={values.showPassword ? 'text' : 'password'}
                    id="password"
                    value={values.password}
                    onChange={handleChange('password')}
                    autoComplete="current-password"
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton size="small" onClick={handleClickShowPassword} onMouseDown={handleMouseDownPassword}>
                            {values.showPassword ? <Visibility /> : <VisibilityOff />}
                          </IconButton>
                        </InputAdornment>
                      )
                    }}
                  />
                  <Grid container justify="flex-end" >
                    <Grid item>
                      <Link
                        component="button"
                        onClick={handleForgotPassword}
                        className={styles.link}
                        variant="body2">
                        Esqueceu a senha?
										</Link>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
              <Button
                type="submit"
                fullWidth
                onClick={handleLogin}
                variant="contained"
                color="defaut"
                className={styles.btnEmail}>
                Entrar
          				</Button>  
                    
                  <FacebookLogin
                    appId="2343581862614110"
                    autoLoad={false}
                    callback={responseFacebook} />
                
              <Grid container justify="center">
                <Grid item>
                  <Link
                    component="button"
                    onClick={handleRegister}
                    className={styles.link}
                    variant="body2">
                    Novo por aqui? Cadastre-se
              		</Link>
                </Grid>
              </Grid>
            </form>
          </Paper>
        </Container>
      </Grid>
      <Divider />
      <Footer />
    </React.Fragment >
  )
}

const useStyles = makeStyles(theme => ({
  background: {
    backgroundColor: '#e4fdff',
    minHeight: '100vh'
  },
  mainGrid: {
    backgroundColor: '#e4fdff',
  },
  paper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: 20,
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%'
  },
  btnEmail: {
    margin: theme.spacing(2, 0, 2, 0)
  },
  btnGoogle: {
    margin: theme.spacing(2, 0, 1, 0)
  },
  btnFacebook: {
    margin: theme.spacing(0, 0, 1, 0)
  },
  label: {
    color: '#8A8F9E',
    textAlign: 'center',
    textTransform: 'uppercase',
    fontSize: '12px'
  },
  link: {
    color: '#8A8F9E',
    fontSize: '12px',
    margin: theme.spacing(1, 0, 0, 0)
  }
}));
