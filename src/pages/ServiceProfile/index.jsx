import React, { useEffect, useState, useContext } from "react";
import { useLocation } from "react-router-dom";

import NewHeader from "../../components/NewHeader";
import Footer from "../../components/Footer";
import api from "../../services/api";
import {
  Grid,
  CssBaseline,
  Container,
  Typography,
  Paper,
  Button,
  Avatar,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Box,
} from "@material-ui/core";
import imagemTeste from "../../assets/restTeste.png";
import { DatePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import { Alert, AlertTitle } from "@material-ui/lab";
import StarRate from "@material-ui/icons/Star";
import ReportProblem from "@material-ui/icons/ReportProblem";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import Comment from "@material-ui/icons/Comment";
import { makeStyles } from "@material-ui/core/styles";
import Rating from "@material-ui/lab/Rating";
import StarBorderIcon from "@material-ui/icons/StarBorder";
import { UserContext } from "../../UserContext";
import Info from "@material-ui/icons/Info";

import MomentUtils from "@date-io/moment";
import moment from "moment";
import "moment/locale/pt-br";
import { NightsStay, TramRounded } from "@material-ui/icons";

export default function ServiceProfile({ history }) {
  const styles = useStyles();
  const { idService } = useLocation();
  if (idService) {
    localStorage.setItem("idService", idService);
  }
  /*const initialUserLogged = JSON.parse(window.localStorage.getItem('userLogged'));
  const [userLogged, setUserLogged] = useState(initialUserLogged)*/
  const { userLogged, setUserLogged } = useContext(UserContext);
  const [name, setName] = useState("");
  const [street, setStreet] = useState("");
  const [phone, setPhone] = useState("");
  const [number, setNumber] = useState("");
  const [neighbour, setNeighbour] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [rating, setRating] = useState("");
  const [image, setImage] = useState("");
  const [reason, setReason] = useState("");
  const [category, setCategory] = useState("");
  const [commentaryReport, setCommentaryReport] = useState("");
  const [commentaryRating, setCommentaryRating] = useState("");
  const [ratings, setRatings] = useState([]);
  const [costBenefit, setCostBenefit] = useState(0);
  const [attendance, setAttendance] = useState(0);
  const [quality, setQuality] = useState(0);
  const [products, setProducts] = useState([]);
  const [scheduleItems, setScheduleItems] = useState([]);
  const initialUserLogged = JSON.parse(
    window.localStorage.getItem("userLogged")
  );

  const [openDialog, setOpenDialog] = useState(false);
  const [openRating, setOpenRating] = useState(false);

  const [openDialogConfirm, setOpenDialogConfirm] = useState(false);

  useEffect(() => {
    api
      .post("service/getById", { id: localStorage.getItem("idService") })
      .then((res) => {
        if (!res.data.error) {
          let data = res.data;
          let address = res.data.address;
          if (address) {
            setStreet(address.street);
            setNumber(address.number);
            setNeighbour(address.neighborhood);
            setLocation(address.city + " - " + address.state);
          }
          setPhone(formatPhone(data.phone));
          setName(data.name);
          setDescription(data.description);
          setPrice(data.averagePrice);
          setCategory(data.category);
          setRatings(
            data.rating.sort(function (a, b) {
              return new Date(b.createdAt) - new Date(a.createdAt);
            }) || []
          );
          setRating(data.averageRating || "Sem avaliação");
          setImage(data.image);
          setScheduleItems(data.schedules || []);
          setProducts(data.products || []);
        }
      });
  }, [history]);

  function formatPhone(phone) {
    let formatedPhone = "";
    if (phone.length == 8) {
      formatedPhone = phone.slice(0, 4) + "-" + phone.slice(4, 8);
    } else if (phone.length == 9) {
      formatedPhone = phone.slice(0, 5) + "-" + phone.slice(5, 9);
    } else if (phone.length == 10) {
      formatedPhone =
        "(" +
        phone.slice(0, 2) +
        ") " +
        phone.slice(2, 6) +
        "-" +
        phone.slice(6, 10);
    } else if (phone.length == 11) {
      formatedPhone =
        "(" +
        phone.slice(0, 2) +
        ") " +
        phone.slice(2, 7) +
        "-" +
        phone.slice(7, 11);
    } else {
      formatedPhone = phone;
    }

    return formatedPhone;
  }

  function formatDay(day) {
    if (day == 0) {
      return "Segunda-feira";
    } else if (day == 1) {
      return "Terça-feira";
    } else if (day == 2) {
      return "Quarta-feira";
    } else if (day == 3) {
      return "Quinta-feira";
    } else if (day == 4) {
      return "Sexta-feira";
    } else if (day == 5) {
      return "Sábado";
    } else if (day == 6) {
      return "Domingo";
    }
  }

  function dataAtualFormatada(aux) {
    const data = new Date(aux);
    var dia = data.getDate().toString(),
      diaF = dia.length == 1 ? "0" + dia : dia,
      mes = (data.getMonth() + 1).toString(), //+1 pois no getMonth Janeiro começa com zero.
      mesF = mes.length == 1 ? "0" + mes : mes,
      anoF = data.getFullYear();
    return diaF + "/" + mesF + "/" + anoF;
  }

  const handleReport = () => {
    setOpenDialog(true);
  };

  const handleRating = () => {
    let oneWeekBefore = new Date();
    oneWeekBefore.setDate(oneWeekBefore.getDate() - 7);
    console.log(ratings);
    let ratingsFiltered = ratings.filter(
      (obj) =>
        obj.user._id === initialUserLogged.id &&
        new Date(obj.createdAt) >= oneWeekBefore
    );
    console.log(ratingsFiltered);
    if (ratingsFiltered && ratingsFiltered.length > 0) {
      alert("Você já avaliou esse serviço recentemente");
    } else {
      setOpenRating(true);
    }
  };

  const handleClose = () => {
    setOpenDialog(false);
  };

  const handleRatingClose = () => {
    setOpenRating(false);
  };

  const handleReasonChange = (event) => {
    setReason(event.target.value);
  };

  const handleSendReport = () => {
    if (reason) {
      //TODO

      setReason("");
      setCommentaryReport("");
      handleClose();
    } else {
      alert("O campo 'Motivo' é obrigatório");
    }
  };

  const handleSendRating = () => {
    if (costBenefit >= 0 && quality >= 0 && attendance >= 0) {
      let ratingAux = {
        commentary: commentaryRating,
        costBenefit: costBenefit,
        quality: quality,
        attendance: attendance,
        user: userLogged.id || initialUserLogged.id,
        totalRating: (costBenefit + quality + attendance) / 3,
      };
      api
        .post("service/getById", { id: localStorage.getItem("idService") })
        .then((res) => {
          if (!res.data.error) {
            let allRatings = res.data.rating;
            if (
              true == false /* allRatings.find(el => el.user == userLoggedId) */
            ) {
            } else {
              console.log(ratingAux);
              api
                .post("service/insertRating", {
                  id: localStorage.getItem("idService"),
                  ratingAux,
                })
                .then((res) => {
                  setRating(res.data.averageRating);
                  let array = res.data.rating;
                  array = array.sort(function (a, b) {
                    return new Date(b.createdAt) - new Date(a.createdAt);
                  });
                  setRatings(array);
                  console.log(res.data.rating);
                  console.log(res);
                });
            }
          }
        });
      handleRatingClose();
    } else {
      alert("O campo 'Motivo' é obrigatório");
    }
  };

  return (
    <React.Fragment>
      <div>
        <Dialog open={openDialog} onClose={handleClose}>
          <DialogTitle>Atenção</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Escolha o motivo para reportar esse serviço.
            </DialogContentText>

            <form className={styles.form}>
              <FormControl className={styles.formControl}>
                <InputLabel required htmlFor="reason">
                  Motivo
                </InputLabel>
                <Select
                  autoFocus
                  value={reason}
                  fullWidth
                  onChange={handleReasonChange}
                  inputProps={{
                    name: "reason",
                    id: "reason",
                  }}
                >
                  <MenuItem value="0">
                    O conteúdo do serviço está desatulizado.
                  </MenuItem>
                  <MenuItem value="1">
                    O serviço não corresponde à realidade.
                  </MenuItem>
                  <MenuItem value="2">
                    O serviço cadastrado é meu, gostaria de ter controle dele na
                    plataforma.
                  </MenuItem>
                  <MenuItem value="3">Outro</MenuItem>
                </Select>

                <TextField
                  autoFocus
                  margin="dense"
                  id="commentaryReport"
                  value={commentaryReport}
                  label="Comentário (Opcional)"
                  type="text"
                  fullWidth
                />
              </FormControl>
            </form>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="primary" autoFocus>
              Cancelar
            </Button>
            <Button onClick={handleSendReport} color="primary" autoFocus>
              Enviar
            </Button>
          </DialogActions>
        </Dialog>
      </div>

      <div>
        <Dialog open={openRating} onClose={handleRatingClose}>
          <DialogTitle>Avaliação</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Escolha bem os valores para sua avaliação, uma nova avaliação só
              poderá ser feita daqui 7 dias.
            </DialogContentText>

            <div className={styles.ratings}>
              <Box component="fieldset" mb={3} borderColor="transparent">
                <Typography component="legend">Custo Benefício</Typography>
                <Rating
                  size="large"
                  precision={0.5}
                  value={costBenefit}
                  onChange={(event, newValue) => {
                    setCostBenefit(newValue);
                  }}
                  emptyIcon={<StarBorderIcon fontSize="inherit" />}
                />
              </Box>

              <Box component="fieldset" mb={3} borderColor="transparent">
                <Typography component="legend">Qualidade</Typography>
                <Rating
                  size="large"
                  value={quality}
                  onChange={(event, newValue) => {
                    setQuality(newValue);
                  }}
                  precision={0.5}
                  emptyIcon={<StarBorderIcon fontSize="inherit" />}
                />
              </Box>

              <Box component="fieldset" mb={3} borderColor="transparent">
                <Typography component="legend">Localização</Typography>
                <Rating
                  size="large"
                  value={attendance}
                  onChange={(event, newValue) => {
                    setAttendance(newValue);
                  }}
                  precision={0.5}
                  emptyIcon={<StarBorderIcon fontSize="inherit" />}
                />
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
      <Grid container className={styles.mainGrid} direction="column">
        <Grid container direction="column">
          <CssBaseline />
          <Container component="main" maxWidth="lg">
            <NewHeader />
          </Container>
          <Container>
            <Container
              maxWidth="sm"
              component="main"
              className={styles.mainContainer}
            >
              <div className={styles.toolbar}>
                <Chip
                  disabled={!initialUserLogged || !initialUserLogged.id}
                  icon={<ReportProblem className={styles.report} />}
                  onClick={() => handleReport()}
                  label={"Reportar"}
                  clickable={true}
                  className={styles.chip}
                />
                <Chip
                  disabled={!initialUserLogged || !initialUserLogged.id}
                  icon={<StarRate className={styles.star} />}
                  clickable={true}
                  onClick={() => handleRating()}
                  label={rating}
                  className={styles.chip}
                />
              </div>

              <Grid direction="row">
                <div className={styles.divFlex}>
                  <Typography
                    className={styles.mainTitle}
                    component="h2"
                    variant="h3"
                    align="center"
                    gutterBottom
                  >
                    {name}
                  </Typography>
                  {image ? (
                    <Avatar
                      src={process.env.REACT_APP_API_IMAGES_URL + image}
                      className={styles.sizeAvatar}
                    />
                  ) : (
                    <Avatar className={styles.sizeAvatar} />
                  )}
                </div>

                <Typography
                  component="h5"
                  variant="h6"
                  align="center"
                  color="textSecondary"
                  gutterBottom
                >
                  {description}
                </Typography>
              </Grid>
            </Container>
          </Container>
          <main className={styles.layout}>
            <Paper className={styles.paper} elevation={3}>
              <Grid container direction="row">
                <Typography className={styles.typography} gutterBottom>
                  Endereço:
                </Typography>
                <Typography
                  gutterBottom
                >{`${street}, ${number} - ${neighbour}`}</Typography>
              </Grid>

              <Grid container spacing={1} className={styles.details}>
                <Grid item container direction="column" xs={12} sm={6}>
                  <Grid container direction="row">
                    <Typography className={styles.typography} gutterBottom>
                      Cidade:
                    </Typography>
                    <Typography gutterBottom>{location}</Typography>
                  </Grid>
                </Grid>
                <Grid item container direction="column" xs={12} sm={6}>
                  <Grid container direction="row">
                    <Typography className={styles.typography} gutterBottom>
                      Categoria:
                    </Typography>
                    <Typography gutterBottom>{category.name}</Typography>
                  </Grid>
                </Grid>

                <Grid item container direction="column" xs={12} sm={6}>
                  <Grid container direction="row">
                    <Typography className={styles.typography} gutterBottom>
                      Telefone:
                    </Typography>
                    <Typography gutterBottom>{phone}</Typography>
                  </Grid>
                </Grid>

                {price ? (
                  <Grid item container direction="column" xs={12} sm={6}>
                    <Grid container direction="row">
                      <Typography className={styles.typography} gutterBottom>
                        Preço médio:
                      </Typography>
                      <Typography gutterBottom>R$ {price}</Typography>
                    </Grid>
                  </Grid>
                ) : null}
              </Grid>
            </Paper>
            <Grid className={styles.expansionPanel}>
              <Accordion fullWidth elevation={3}>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel1a-content"
                  id="panel1a-header"
                >
                  <Typography className={styles.heading}>
                    Horário de funcionamento ({scheduleItems.length})
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <List className={styles.commentGrid}>
                    {scheduleItems.map((schedule) => (
                      <React.Fragment>
                        <ListItem>
                          <ListItemText
                            primary={formatDay(schedule.week_day)}
                          />
                          <Grid className={styles.gridTime}>
                            <ListItemText
                              className={styles.gridTimeFirst}
                              primary={schedule.from}
                              secondary="De"
                            />
                            <ListItemText
                              className={styles.gridTimeLast}
                              primary={schedule.to}
                              secondary="Até"
                            />
                          </Grid>
                        </ListItem>
                        <Divider />
                      </React.Fragment>
                    ))}
                  </List>
                </AccordionDetails>
              </Accordion>
              <Accordion fullWidth elevation={3}>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel1a-content"
                  id="panel1a-header"
                >
                  <Typography className={styles.heading}>
                    Avaliações ({ratings.length})
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <List className={styles.commentGrid}>
                    {ratings.map((rating) => (
                      <React.Fragment>
                        <ListItem>
                          <ListItemAvatar>
                            {rating.user.avatar ? (
                              <Avatar
                                src={
                                  process.env.REACT_APP_API_IMAGES_URL +
                                  rating.user.avatar
                                }
                              />
                            ) : (
                              <Avatar />
                            )}
                          </ListItemAvatar>
                          <ListItemText
                            primary={rating.commentary}
                            secondary={
                              rating.user.first_name +
                              " " +
                              rating.user.last_name
                            }
                          />
                          <Grid>
                            <Rating
                              precision={0.5}
                              readOnly={true}
                              value={rating.totalRating}
                              emptyIcon={<StarBorderIcon fontSize="inherit" />}
                            />
                            <Typography
                              variant="subtitle1"
                              align="right"
                              color="textSecondary"
                            >
                              {dataAtualFormatada(rating.createdAt)}
                            </Typography>
                          </Grid>
                        </ListItem>
                        <Divider />
                      </React.Fragment>
                    ))}
                  </List>
                </AccordionDetails>
              </Accordion>
              {category.establishment == true ? (
                <Accordion fullWidth>
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                  >
                    <Typography className={styles.heading}>
                      Produtos ({products.length})
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <List className={styles.servicesGrid}>
                      {products.map((product) => (
                        <React.Fragment>
                          <ListItem>
                            <ListItemAvatar className={styles.listAvatar}>
                              {product.image ? (
                                <Avatar
                                  className={styles.largeAvatar}
                                  src={
                                    process.env.REACT_APP_API_IMAGES_URL +
                                    product.image
                                  }
                                />
                              ) : (
                                <Avatar>
                                  <Info />
                                </Avatar>
                              )}
                            </ListItemAvatar>
                            <Grid className={styles.listItemText}>
                              <ListItemText
                                primary={product.name + " - R$" + product.price}
                                secondary={product.description}
                              />
                            </Grid>
                          </ListItem>
                          <Divider />
                        </React.Fragment>
                      ))}
                    </List>
                  </AccordionDetails>
                </Accordion>
              ) : null}
            </Grid>
          </main>
        </Grid>
      </Grid>
      <Footer />
    </React.Fragment>
  );
}

const useStyles = makeStyles((theme) => ({
  mainGrid: {
    backgroundColor: "#e4fdff",
    minHeight: "100vh",
  },
  rating: {
    fontSize: 40,
  },
  details: {
    marginTop: 10,
  },
  expansionGrid: {
    paddingBottom: theme.spacing(2),
  },
  expansionPanel: {
    marginBottom: theme.spacing(8),
  },
  cardGrid: {
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(8),
  },
  sizeAvatar: {
    width: theme.spacing(15),
    height: theme.spacing(15),
  },
  dates: {
    marginTop: theme.spacing(3),
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightRegular,
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
  paper: {
    marginBottom: theme.spacing(2),
    padding: theme.spacing(2),
    [theme.breakpoints.up(600 + theme.spacing(3) * 2)]: {
      padding: theme.spacing(3),
    },
  },
  title: {
    marginTop: theme.spacing(2),
    fontWeight: "bold",
  },
  typography: {
    fontWeight: "bold",
    marginRight: 5,
  },
  buttons: {
    display: "flex",
    justifyContent: "flex-end",
  },
  button: {
    marginBottom: theme.spacing(3),
  },
  mainContainer: {
    padding: theme.spacing(6, 0, 6),
  },
  resultContainer: {
    paddingTop: theme.spacing(20),
  },
  mainTitle: {
    fontWeight: "bold",
    marginTop: theme.spacing(2),
    color: "#080b57",
    fontFamily: "Ubuntu",
  },
  hourGrid: {
    marginTop: 20,
  },
  commentGrid: {
    width: "100%",
  },
  divFlex: {
    display: "flex",
    justifyContent: "space-between",
  },
  divEnd: {
    display: "flex",
  },
  toolbar: {
    display: "flex",
    justifyContent: "flex-end",
    paddingBottom: "10px",
  },
  chip: {
    backgroundColor: "#ffffff",
    color: "black",
  },
  star: {
    color: "black",
  },
  report: {
    color: "red",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    margin: "auto",
    width: "fit-content",
  },
  ratings: {
    display: "flex",
    flexDirection: "column",
    margin: "auto",
    width: "fit-content",
  },
  gridTime: {
    display: "flex",
    justifyContent: "space-between",
    width: "50%",
  },
  gridTimeLast: {
    marginLeft: "40%",
  },
  largeAvatar: {
    width: theme.spacing(7),
    height: theme.spacing(7),
  },
  listItemText: {
    width: "100%",
  },
  servicesGrid: {
    width: "100%",
    justifyContent: "space-between",
  },
  listAvatar: {
    marginRight: "25px",
  },
}));
