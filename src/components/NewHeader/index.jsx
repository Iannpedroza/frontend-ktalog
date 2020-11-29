import React, { useState, useContext } from "react";
import { withRouter, useLocation } from "react-router-dom";

import logo from "../../assets/simbolo-ktalog.png";
import api from "../../services/api"
import {
  Toolbar,
  Grid,
  IconButton,
  Typography,
  Link,
  Menu,
  MenuItem,
  Button,
  ListItemIcon,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  TextField,
  Box,
  FormControlLabel,
  Switch
} from "@material-ui/core";
import {
  AccountCircle,
  ExitToApp,
  Person,
  Settings,
  Add,
  LocationCity,
  RateReview,
} from "@material-ui/icons";
import Rating from "@material-ui/lab/Rating";
import StarBorderIcon from "@material-ui/icons/StarBorder";
import { makeStyles } from "@material-ui/core/styles";
import { UserContext } from "../../UserContext";

function NewHeader(props) {
  const styles = useStyles();
  let location = useLocation();

  const initialLogged = window.localStorage.getItem("logged");
  const initialUserLogged = JSON.parse(
    window.localStorage.getItem("userLogged")
  );
  const [openDialogRating, setOpenDialogRating] = useState(false);
  const { userLogged, setUserLogged } = useContext(UserContext);
  const [logged, setLogged] = useState(initialLogged);
  const [usability, setUsability] = useState(3)
  const [hover, setHover] = useState(-1);
  const [frequency, setFrequency] = useState(3)
  const [hoverFrequency, setHoverFrequency] = useState(-1);
  const [utility, setUtility] = useState(3)
  const [hoverUtility, setHoverUtility] = useState(-1);
  const [commentaryRating, setCommentaryRating] = useState()
  const [checkedObjective, setCheckedObjective] = useState(true)
  //const [userLogged, setUserLogged] = useState(initialUserLogged)
  const [anchorEl, setAnchorEl] = useState(null);
  const openUser = Boolean(anchorEl);
  
  const labels = {
    1: 'Péssima',
    2: 'Ruim',
    3: 'Regular',
    4: 'Muito boa',
    5: 'Excelente',
  };

  const labelsFrequency = {
    1: 'Nunca',
    2: 'Raramente',
    3: 'As vezes',
    4: 'Frequentemente',
    5: 'Quase sempre',
  };

  const handleUser = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseUser = () => {
    setAnchorEl(null);
  };

  async function handleLogout() {
    window.localStorage.setItem("logged", "false");
    window.localStorage.removeItem("userLogged");
    setUserLogged("");
    setLogged("false");

    if (location.pathname === "/configuration") {
      props.history.push("/home");
    }
  }

  function handleSettings() {
    props.history.push("/configuration");
  }

  function handleHome() {
    console.log(location);
    if (location.pathname !== "/") {
      props.history.push("/home");
    }
  }

  function handleRating() {
    api.post("ratingKtalog/getById", {userId: initialUserLogged.id})
      .then(res => {
        console.log(res);
        if (!res.data.error) {
          alert("Você já avaliou o aplicativo!")
        } else {
          setOpenDialogRating(true);
        }
      })
    
  }

  function handleRatingClose() {
    setOpenDialogRating(false);
  }

  function handleSendRating() {
    api.post("ratingKtalog/register", {
      commentary: commentaryRating,
      objective: checkedObjective,
      utility: utility,
      usability: usability,
      frequency: frequency,
      user: initialUserLogged.id
    })
      .then(res => {
        if (!res.data.error) {
          alert("Avaliação cadastrada com sucesso. Obrigado");
        } else {
          alert("Ocorreu um erro inesperado!");
        }
        setOpenDialogRating(false);
      })
  }

  function handleChangeCity() {
    props.history.push("/", {
      changeCity: true,
    });
  }

  function handleServices() {
    props.history.push("/services");
  }

  function handleCreateService() {
    props.history.push("/createService");
  }

  function handleEstablishments() {
    props.history.push("/establishments");
  }

  function handleHowWorks() {
    props.history.push("/tips");
  }

  function handleLogin() {
    props.history.push("/login");
  }

  return (
    <React.Fragment>
      <div>
        <Dialog open={openDialogRating} onClose={handleRatingClose}>
          <DialogTitle>Avaliação da plataforma</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Escolha bem os valores para avaliar o Ktalog, você terá direito a apenas uma avaliação.
            </DialogContentText>

            <div className={styles.ratings}>
              <Box component="fieldset" mb={3} borderColor="transparent">
                <Typography component="legend">O objetivo do aplicativo é claro?</Typography>
                <Grid className={styles.flex}>
                  <Typography component="legend" className={styles.labelSwitch}>Não</Typography>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={checkedObjective}
                        onChange={event => setCheckedObjective(event.target.checked)}
                        name="checkedObjective"
                        color="primary"
                      />
                    }
                    label="Sim"
                  />
                </Grid>
              </Box>
              

              <Box component="fieldset" mb={3} borderColor="transparent">
                <Typography component="legend">Em relação a usabilidade do aplicativo:</Typography>
                <Grid className={styles.flex}>
                  <Rating
                    precision={1}
                    size="large"
                    value={usability}
                    onChange={(event, newValue) => {
                      setUsability(newValue);
                    }}
                    onChangeActive={(event, newHover) => {
                      setHover(newHover);
                    }}
                    emptyIcon={<StarBorderIcon fontSize="inherit" />}
                  />
                  {usability !== null && <Box ml={2} className={styles.labelRating}>{labels[hover !== -1 ? hover : usability]}</Box>}
                </Grid>
              </Box>

              <Box component="fieldset" mb={3} borderColor="transparent">
                <Typography component="legend">Com que frequência você já procurou alguma informação em sua cidade e não encontrou ou encontrou com dificuldade? </Typography>
                <Grid className={styles.flex}>
                  <Rating
                    precision={1}
                    size="large"
                    value={frequency}
                    onChange={(event, newValue) => {
                      setFrequency(newValue);
                    }}
                    onChangeActive={(event, newHover) => {
                      setHoverFrequency(newHover);
                    }}
                    emptyIcon={<StarBorderIcon fontSize="inherit" />}
                  />
                  {frequency !== null && <Box ml={2} className={styles.labelRating}>{labelsFrequency[hoverFrequency !== -1 ? hoverFrequency : frequency]}</Box>}
                </Grid>
              </Box>

              <Box component="fieldset" mb={3} borderColor="transparent">
                <Typography component="legend">Em relação a utilidade do aplicativo:</Typography>
                <Grid className={styles.flex}>
                  <Rating
                    precision={1}
                    size="large"
                    value={utility}
                    onChange={(event, newValue) => {
                      setUtility(newValue);
                    }}
                    onChangeActive={(event, newHover) => {
                      setHoverUtility(newHover);
                    }}
                    emptyIcon={<StarBorderIcon fontSize="inherit" />}
                  />
                  {utility !== null && <Box ml={2} className={styles.labelRating}>{labels[hoverUtility !== -1 ? hoverUtility : utility]}</Box>}
                </Grid>
              </Box>

          
              <TextField
                autoFocus
                margin="dense"
                id="commentaryRating"
                label="Comentário"
                type="text"
                fullWidth
                multiline
                value={commentaryRating}
                onChange={(event) => {
                  setCommentaryRating(event.target.value);
                }}
                variant="outlined"
                rows={4}
              />
            </div>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleRatingClose} color="primary" autoFocus>
              Cancelar
            </Button>
            <Button onClick={handleSendRating} color="primary" autoFocus>
              Enviar
            </Button>
          </DialogActions>
        </Dialog>
      </div>
      <Toolbar className={styles.toolbar}>
        <img
          src={logo}
          alt="Ktalog"
          height="28em"
          className={styles.img}
          onClick={handleHome}
        />
        {location.pathname != "/" && (
          <Toolbar
            component="nav"
            variant="dense"
            className={styles.toolbarSecondary}
          >
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
        {logged == "true" && navigator.onLine ? (
          <React.Fragment>
            <IconButton
              aria-label="account of current user"
              aria-controls="menu-account"
              aria-haspopup="true"
              onClick={handleUser}
              color="inherit"
              size="medium"
            >
              {initialUserLogged.avatar ? (
                <Avatar
                  src={
                    process.env.REACT_APP_API_IMAGES_URL +
                    initialUserLogged.avatar
                  }
                />
              ) : (
                <AccountCircle color="inherit" />
              )}
            </IconButton>
            <Menu
              id="menu-account"
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              open={openUser}
              onClose={handleCloseUser}
            >
              <MenuItem onClick={handleLogout} className={styles.user} disabled>
                <ListItemIcon>
                  <Person />
                </ListItemIcon>
                <Typography>{initialUserLogged.name}</Typography>
              </MenuItem>
              <MenuItem onClick={handleCreateService}>
                <ListItemIcon>
                  <Add />
                </ListItemIcon>
                <Typography>Criar serviço</Typography>
              </MenuItem>
              <MenuItem onClick={handleChangeCity}>
                <ListItemIcon>
                  <LocationCity />
                </ListItemIcon>
                <Typography>Alterar a cidade</Typography>
              </MenuItem>
              <MenuItem onClick={handleSettings}>
                <ListItemIcon>
                  <Settings />
                </ListItemIcon>
                <Typography>Configurações</Typography>
              </MenuItem>
              <MenuItem onClick={handleRating}>
                <ListItemIcon>
                  <RateReview />
                </ListItemIcon>
                <Typography>Avalie a plataforma</Typography>
              </MenuItem>
              <MenuItem onClick={handleLogout}>
                <ListItemIcon>
                  <ExitToApp />
                </ListItemIcon>
                <Typography>Sair</Typography>
              </MenuItem>
            </Menu>
          </React.Fragment>
        ) : (
          location.pathname != "/" && (
            <React.Fragment>
              <Button
                variant="contained"
                color="primary"
                onClick={handleLogin}
                disabled={!navigator.onLine}
                className={styles.buttonJoin}
              >
                Entrar
              </Button>
            </React.Fragment>
          )
        )}
      </Toolbar>
    </React.Fragment>
  );
}

const useStyles = makeStyles((theme) => ({
  img: {
    justifyContent: "flex-start",
    cursor: "pointer",
  },
  toolbar: {
    flex: 1,
    justifyContent: "space-between",
  },
  toolbarTitle: {
    justifyContent: "flex-start",
  },
  toolbarButton: {
    justifyContent: "flex-end",
  },
  toolbarSecondary: {
    justifyContent: "space-between",
    overflowX: "auto",
  },
  toolbarLink: {
    padding: theme.spacing(0, 2, 0, 2),
    flexShrink: 0,
    cursor: "pointer",
  },
  user: {
    marginBottom: 10,
  },
  ratings: {
    display: "flex",
    flexDirection: "column",
    margin: "auto",
    width: "fit-content",
  },
  flex: {
    display: "flex",
    justifyContent: "center",
    width: "fit-content"
  },
  labelRating: {
    marginTop: '5px'
  },
  labelSwitch: {
    marginTop: '6px',
    marginRight: '4px'
  },
  buttonJoin: {
    backgroundColor: '#080b57'
  }
}));

export default withRouter(NewHeader);
