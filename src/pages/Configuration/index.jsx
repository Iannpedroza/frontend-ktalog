import React, { useState, useContext } from "react";

import Header from "../../components/NewHeader";
import Footer from "../../components/Footer";
import api from "../../services/api";
import PhotoCamera from "@material-ui/icons/PhotoCamera";
import EditIcon from "@material-ui/icons/Edit";
import DeleteForeverIcon from "@material-ui/icons/DeleteForever";
import {
  Grid,
  Container,
  CssBaseline,
  Typography,
  Avatar,
  Paper,
  Button,
  TextField,
  InputAdornment,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Slide,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Divider,
} from "@material-ui/core";
import Work from "@material-ui/icons/Work";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import { Visibility, VisibilityOff } from "@material-ui/icons";
import SaveIcon from "@material-ui/icons/Save";
import DeleteIcon from "@material-ui/icons/Delete";
import { UserContext } from "../../UserContext";

import { makeStyles } from "@material-ui/core/styles";
import { useEffect } from "react";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function Settings({ history }) {
  const styles = useStyles();
  const [openDialogDelete, setOpenDialogDelete] = useState(false);
  const { userLogged, setUserLogged } = useContext(UserContext);
  const [myServices, setMyServices] = useState([]);
  const [name, setName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  //const [avatar, setAvatar] = useState('')
  const [oldObject, setOldObject] = useState("");
  const [values, setValues] = useState({
    password: "",
    confirmPassword: "",
    showPassword: false,
    showConfirmPassword: false,
  });

  useEffect(() => {
    const initialUserLogged = JSON.parse(
      window.localStorage.getItem("userLogged")
    );
    api.post("users/getById", {
        id: userLogged.id || initialUserLogged.id,
      })
      .then((res) => {
        console.log(res);
        if (!res.data.error) {
          setName(res.data.first_name);
          setLastName(res.data.last_name);
          //setAvatar(res.data.avatar)
          setEmail(res.data.email);
          setOldObject({
            name: res.data.first_name,
            lastName: res.data.last_name,
            //avatar: res.data.avatar,
            email: res.data.email,
          });
        }
      });

    api
      .post("service/getByUserId", {
        userId: userLogged.id || initialUserLogged.id,
      })
      .then((res) => {
        if (!res.data.error) {
          setMyServices(res.data);
        }
      });
  }, []);

  const handleChange = (prop) => (event) => {
    setValues({ ...values, [prop]: event.target.value });
  };

  function editService() {}

  function removeService(service) {
    const serviceId = service._id;
    api.post('service/delete', {serviceId: serviceId})
      .then(res => {
        if (!res.data.error) {
          alert("Serviço deletado com sucesso");
          let auxServices = myServices.slice();
          setMyServices(auxServices.splice(auxServices.findIndex(el => el._id == serviceId), 1));
        }
      });
  }
  const handleClickShowPassword = () => {
    setValues({ ...values, showPassword: !values.showPassword });
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleClickShowConfirmPassword = () => {
    setValues({ ...values, showConfirmPassword: !values.showConfirmPassword });
  };

  const handleMouseDownConfirmPassword = (event) => {
    event.preventDefault();
  };

  const handleCloseDelete = () => {
    setOpenDialogDelete(false);
  };

  function handleAccept() {
    console.log("teste");
    const initialUserLogged = JSON.parse(
      window.localStorage.getItem("userLogged")
    );
    api.post("users/delete", { userId: initialUserLogged.id }).then((res) => {
      if (!res.data.error) {
        alert("Conta deletada com sucesso");
        window.localStorage.setItem("logged", "false");
        window.localStorage.removeItem("userLogged");
        history.push("/home");
        
      }
    });
    handleCloseDelete();
  }

  function handleDelete() {
    setOpenDialogDelete(true);
  }

  function handleChangePassword() {
    if (values.password === values.confirmPassword) {
      //TODO
    } else {
      alert(
        "As senhas digitadas nos campos se diferem. Por favor digite novamente."
      );
    }
  }

  function handleChangeInfo() {
    if (
      name != oldObject.name ||
      lastName != oldObject.lastName ||
      email != oldObject.email /*||  avatar != oldObject.avatar */
    ) {
      const initialUserLogged = JSON.parse(
        window.localStorage.getItem("userLogged")
      );
      api
        .post("users/updateInfo", {
          id: userLogged.id || initialUserLogged.id,
          name: name,
          lastName: lastName,
          email: email,
          //avatar: avatar
        })
        .then((res) => {
          console.log(res);
        });
    }
  }

  return (
    <React.Fragment>
      <div>
        <Dialog
          open={openDialogDelete}
          onClose={handleCloseDelete}
          keepMounted
          TransitionComponent={Transition}
        >
          <DialogTitle>Atenção</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Você realmente deseja deletar sua conta? Todos seus serviços serão
              deletados também.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleAccept} color="primary" autoFocus>
              Sim
            </Button>
            <Button onClick={handleCloseDelete} color="secondary" autoFocus>
              Não
            </Button>
          </DialogActions>
        </Dialog>
      </div>
      <Grid container className={styles.mainGrid}>
        <Grid container direction="column">
          <CssBaseline />
          <Container component="main" maxWidth="lg">
            <Header />
          </Container>
          <Container
            maxWidth="sm"
            component="main"
            className={styles.mainContainer}
          >
            <Container>
              <Typography
                className={styles.mainTitle}
                component="h2"
                variant="h3"
                align="center"
                color="textPrimary"
                gutterBottom
              >
                Configuração
              </Typography>
              <Container maxWidth="sm">
                <Typography
                  component="h5"
                  variant="h6"
                  align="center"
                  color="textSecondary"
                >
                  Altere detalhes da sua conta e do seus serviços aqui.
                </Typography>
              </Container>
            </Container>
          </Container>
          <main className={styles.layout}>
            <Paper elevation={3} className={styles.paper}>
              <Typography
                align="center"
                variant="h6"
                gutterBottom
                className={styles.title}
              >
                Detalhes da Conta
              </Typography>

              <Typography variant="h6" gutterBottom className={styles.title}>
                Alteração de dados
              </Typography>

              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    autoFocus
                    fullWidth
                    label="Nome"
                    required="true"
                    name="firstName"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    id="lastName"
                    label="Sobrenome"
                    name="lastName"
                    value={lastName}
                    onChange={(event) => setLastName(event.target.value)}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    id="email"
                    label="Email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                  />
                </Grid>
                <Grid item xs={12} sm={6} className={styles.buttons}>
                  <Button
                    variant="contained"
                    color="primary"
                    startIcon={<SaveIcon />}
                    className={styles.button}
                    onClick={handleChangeInfo}
                  >
                    Salvar
                  </Button>
                </Grid>

                {/* <Grid item xs={12} sm={6} >
                  <input
                    accept="image/*"
                    onChange={(event) => setAvatar("avatar", event.target.files[0])}
                    className={styles.input}
                    id="icon-button-file"
                    type="file"
                  />

                  <label htmlFor="icon-button-file">
                    Insira uma nova foto de avatar
                    <IconButton
                      color="primary"
                      aria-label="upload picture"
                      component="span"
                    >
                      <PhotoCamera />
                    </IconButton>
                  </label>
                </Grid> */}
              </Grid>

              <Typography variant="h6" gutterBottom className={styles.title}>
                Alteração de senha
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Senha"
                    type={values.showPassword ? "text" : "password"}
                    value={values.password}
                    onChange={handleChange("password")}
                    autoComplete="current-password"
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            size="small"
                            onClick={handleClickShowPassword}
                            onMouseDown={handleMouseDownPassword}
                          >
                            {values.showPassword ? (
                              <Visibility />
                            ) : (
                              <VisibilityOff />
                            )}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Confirmar senha"
                    type={values.showConfirmPassword ? "text" : "password"}
                    value={values.confirmPassword}
                    onChange={handleChange("confirmPassword")}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            size="small"
                            onClick={handleClickShowConfirmPassword}
                            onMouseDown={handleMouseDownConfirmPassword}
                          >
                            {values.showConfirmPassword ? (
                              <Visibility />
                            ) : (
                              <VisibilityOff />
                            )}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
              </Grid>
              <div className={styles.buttons}>
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<SaveIcon />}
                  className={styles.button}
                  onClick={handleChangePassword}
                >
                  Salvar
                </Button>
              </div>

              <Grid container direction="row">
                <Typography variant="h6" gutterBottom className={styles.title}>
                  Excluir Conta
                </Typography>
                <Typography component="h6" color="textSecondary" gutterBottom>
                  Se você não deseja utilizar mais os nossos serviços é possível
                  excluir a sua conta do sistema clicando no botão abaixo.
                  Lembre-se ao excluir sua conta, os seus serviços também serão
                  excluídos.
                </Typography>
              </Grid>
              <div className={styles.buttons}>
                <Button
                  variant="contained"
                  color="secondary"
                  startIcon={<DeleteIcon />}
                  className={styles.button}
                  onClick={handleDelete}
                >
                  Excluir
                </Button>
              </div>

              <Grid className={styles.expansionPanel}>
                <Typography variant="h6" gutterBottom className={styles.title}>
                  Editar serviços
                </Typography>
                <Accordion fullWidth elevation={3}>
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                  >
                    <Typography className={styles.heading}>
                      Meus serviços ({myServices.length})
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <List className={styles.servicesGrid}>
                      {myServices.map((service) => (
                        <React.Fragment>
                          <ListItem>
                            <ListItemAvatar>
                              <Avatar>
                                <Work />
                              </Avatar>
                            </ListItemAvatar>
                            <Grid className={styles.listItemText}>
                              <ListItemText
                                primary={service.name}
                                secondary={service.category.name}
                              />
                            </Grid>

                            <Grid
                              container
                              direction="row"
                              justify="flex-end"
                              alignItems="flex-end"
                            >
                              <IconButton onClick={() => editService()}>
                                <EditIcon className={styles.editButton} />
                              </IconButton>
                              <IconButton onClick={() => removeService(service)}>
                                <DeleteForeverIcon
                                  className={styles.deleteButton}
                                />
                              </IconButton>
                            </Grid>
                          </ListItem>
                          <Divider />
                        </React.Fragment>
                      ))}
                    </List>
                  </AccordionDetails>
                </Accordion>
              </Grid>
            </Paper>
          </main>
        </Grid>
      </Grid>
      <Footer />
    </React.Fragment>
  );
}

const useStyles = makeStyles((theme) => ({
  mainGrid: {
    minHeight: "100vh",
    backgroundColor: "#e4fdff",
  },
  mainContainer: {
    padding: theme.spacing(6, 0, 6),
    alignItems: "center",
    display: "flex",
    flexDirection: "column",
  },
  layout: {
    width: "auto",
    marginLeft: theme.spacing(2),
    marginRight: theme.spacing(2),
    [theme.breakpoints.up(600 + theme.spacing(2) * 2)]: {
      width: 600,
      marginLeft: "auto",
      marginRight: "auto",
    },
  },
  mainTitle: {
    fontWeight: "bold",
    color: "#322153",
    fontFamily: "Ubuntu",
  },
  paper: {
    marginBottom: theme.spacing(8),
    padding: theme.spacing(2),
    [theme.breakpoints.up(600 + theme.spacing(3) * 2)]: {
      padding: theme.spacing(3),
    },
  },
  buttons: {
    display: "flex",
    justifyContent: "flex-end",
  },
  button: {
    marginTop: theme.spacing(3),
    marginLeft: theme.spacing(1),
  },
  title: {
    marginTop: theme.spacing(2),
    fontWeight: "bold",
  },
  typography: {
    fontWeight: "bold",
    marginRight: 5,
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.primary.main,
  },
  expansionPanel: {
    marginTop: theme.spacing(4),
  },
  input: {
    display: "none",
  },
  servicesGrid: {
    width: "100%",
    justifyContent: "space-between",
  },
  listItemText: {
    width: "100%",
  },
  deleteButton: {
    color: "#f50057",
  },
  editButton: {
    color: "#0d6bde",
  },
}));
