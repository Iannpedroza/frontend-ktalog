import React, { useState, useContext } from 'react'
import { withRouter, useLocation } from 'react-router-dom'

import logo from '../../assets/simbolo-ktalog.png'

import { Toolbar, Grid, IconButton, Typography, Link, Menu, MenuItem, Button, ListItemIcon, Avatar} from '@material-ui/core'
import { AccountCircle, ExitToApp, Person, Settings, Add, LocationCity } from '@material-ui/icons'
import { makeStyles } from '@material-ui/core/styles'
import { UserContext } from '../../UserContext'

function NewHeader(props) {
  const styles = useStyles()
  let location = useLocation()

  const initialLogged = window.localStorage.getItem('logged');
  const initialUserLogged = JSON.parse(window.localStorage.getItem('userLogged'));
  /*const initialUserLogged = JSON.parse(window.localStorage.getItem('userLogged'));*/
  const { userLogged, setUserLogged } = useContext(UserContext)
  const [logged, setLogged] = useState(initialLogged)
  //const [userLogged, setUserLogged] = useState(initialUserLogged)
  const [anchorEl, setAnchorEl] = useState(null)
  const openUser = Boolean(anchorEl)



  const handleUser = event => {
    setAnchorEl(event.currentTarget);
  }

  const handleCloseUser = () => {
    setAnchorEl(null);
  }

  async function handleLogout() {
    window.localStorage.setItem('logged', "false");
    window.localStorage.removeItem('userLogged');
    setUserLogged('');
    setLogged("false");

    if (location.pathname === '/configuration') {
      props.history.push('/home')
    } 
  }

  function handleSettings() {
    props.history.push('/configuration')
  }

  function handleHome() {
    console.log(location);
    if (location.pathname !== '/') {
      props.history.push('/home')
    } 
  }
  
  function handleChangeCity() {
    props.history.push(
      '/',
      {
        changeCity: true
      }
    )
  }

  function handleServices() {
    props.history.push('/services')
  }

  function handleCreateService() {
    props.history.push('/createService')
  }

  function handleEstablishments() {
    props.history.push('/establishments')
  }

  function handleHowWorks() {
    props.history.push('/tips')
  }

  function handleLogin() {
    props.history.push('/login')
  }

  return (
    <React.Fragment>
      <Toolbar className={styles.toolbar}>
        <img src={logo} alt="Ktalog" height="28em" className={styles.img} onClick={handleHome} />
            {location.pathname != '/' && (
              
              <Toolbar component="nav" variant="dense" className={styles.toolbarSecondary}>
                <Link
                  color="inherit"
                  noWrap
                  variant="body2"
                  onClick={handleServices}
                  className={styles.toolbarLink}
                >
                  Serviços
                </Link>
                <Link
                  color="inherit"
                  noWrap
                  variant="body2"
                  onClick={handleEstablishments}
                  className={styles.toolbarLink}
                >
                  Estabelecimentos
                </Link>
                <Link
                  color="inherit"
                  noWrap
                  variant="body2"
                  onClick={handleHowWorks}
                  className={styles.toolbarLink}
                >
                  Como funciona?
                </Link>
              </Toolbar>
            )}
          {logged == "true" ? (
            <React.Fragment>
              <IconButton
                aria-label="account of current user"
                aria-controls="menu-account"
                aria-haspopup="true"
                onClick={handleUser}
                color="inherit"
                size="medium"
              >
                {
                  initialUserLogged.avatar ? 
                  <Avatar src={process.env.REACT_APP_API_IMAGES_URL + initialUserLogged.avatar}/>
                  :
                  <AccountCircle color='inherit' />
                }
                
              </IconButton>
              <Menu
                id="menu-account"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={openUser}
                onClose={handleCloseUser}
              >
                <MenuItem onClick={handleLogout} className={styles.user} disabled >
                  <ListItemIcon>
                    <Person />
                  </ListItemIcon>
                  <Typography>
                    Iann
                  </Typography>
                </MenuItem>
                <MenuItem onClick={handleCreateService} >
                  <ListItemIcon>
                    <Add />
                  </ListItemIcon>
                  <Typography>
                    Criar serviço
                  </Typography>
                </MenuItem>
                <MenuItem onClick={handleChangeCity} >
                  <ListItemIcon>
                    <LocationCity />
                  </ListItemIcon>
                  <Typography>
                    Alterar a cidade
                  </Typography>
                </MenuItem>
                <MenuItem onClick={handleSettings}>
                  <ListItemIcon>
                    <Settings />
                  </ListItemIcon>
                  <Typography>Configurações</Typography>
                </MenuItem>
                <MenuItem onClick={handleLogout}>
                  <ListItemIcon>
                    <ExitToApp />
                  </ListItemIcon>
                  <Typography>Sair</Typography>
                </MenuItem>
              </Menu>
            </React.Fragment>
          ) : location.pathname != '/' && (
            <React.Fragment>
              <Button variant="outlined" color="default" onClick={handleLogin}>
                  Entrar
              </Button>
            </React.Fragment>
          )}
      </Toolbar>
    </React.Fragment>
  )
}

const useStyles = makeStyles(theme => ({
  img: {
    justifyContent: 'flex-start',
    cursor: 'pointer'
  },
  toolbar: {
    flex: 1,
    justifyContent: 'space-between'
  },
  toolbarTitle: {
    justifyContent: 'flex-start'
  },
  toolbarButton: {
    justifyContent: 'flex-end'
  },
  toolbarSecondary: {
    
    justifyContent: 'space-between',
    overflowX: 'auto',
  },
  toolbarLink: {
    padding: theme.spacing(0, 2, 0, 2),
    flexShrink: 0,
    cursor: 'pointer'

  },
  user: {
    marginBottom: 10
  }
}))

export default withRouter(NewHeader)