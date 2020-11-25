import React, { useState, useEffect, useContext } from "react";
import { UserContext } from "../../UserContext";
import api from "../../services/api"
import {useLocation} from 'react-router-dom'
import axios from 'axios';

import Footer from "../../components/Footer";

import {
  Grid,
  Chip,
  Container,
  CircularProgress,
  CssBaseline,
  Card,
  Typography,
  Button,
  CardMedia,
  Slide,
  InputLabel,
  CardContent,
  CardActions,
  ExpansionPanel,
  ExpansionPanelSummary,
  ExpansionPanelDetails,
  Select,
  MenuItem,
  TextField,
} from "@material-ui/core";
import { Autocomplete, Alert, AlertTitle } from "@material-ui/lab";

import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import StarRate from "@material-ui/icons/Star";
import { makeStyles } from "@material-ui/core/styles";

export default function Search({ history }) {
  const styles = useStyles();
  const location = useLocation();
  const [fetchData, setFetchData] = useState(false);
  const [doctors, setDoctors] = useState([]);
  const [ufs, setUfs] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [nameSearch, setNameSearch] = useState('')
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedSort, setSelectedSort] = useState("Avaliação geral")
  const sortValues = [
    "Avaliação geral",
    "Atendimento",
    "Custo-benefício",
    "Qualidade",
    "Ordem alfabética",
  ]
  const {
    //price, setPrice,
    rating,
    setRating,
    setLocation,
    setSpeciality,
    speciality,
    globalLocation,
    globalSpeciality,
    //date, setDate
  } = useContext(UserContext);
  //localStorage.setItem("price", price)

  //if (parseInt(localStorage.getItem("price")) === 0) {
  //    alert("Você não pode voltar para essa página novamente. Realize uma nova pesquisa.")
  //    history.push("/home")
  // }

  const handleClose = () => {
    setOpenDialog(false);
  };

  function compare(a, b) {
    // Use toUpperCase() to ignore character casing
    const nameA = a.name.toUpperCase();
    const nameB = b.name.toUpperCase();

    let comparison = 0;
    if (nameA > nameB) {
    comparison = 1;
    } else if (nameA < nameB) {
    comparison = -1;
    }
    return comparison;
  }

  useEffect(() => {
    api.get("category/").then((res) => {
      const aux = res.data;
      if (location.pathname === "/establishments") {
        var reduced = aux.reduce(function (filtered, option) {
          if (option.establishment) {
            filtered.push(option.name);
          }
          return filtered;
        }, []);
      } else if (location.pathname === "/services") {
        var reduced = aux.reduce(function (filtered, option) {
          if (!option.establishment) {
            filtered.push(option.name);
          }
          return filtered;
        }, []);
      }
      reduced.sort();
      setCategories(reduced || []);
    });
  }, []); 

  // Busca os médicos de acordo com a pesquisa na tela inicial
  /*  useEffect(() => {
    firebase.db.collection('doctors')
      .where("location", "==", globalLocation)
      .where("speciality", "==", globalSpeciality)
      .get().then(snapshot => {
        if (snapshot) {
          let doctors = []
          snapshot.forEach(doctor => {
            doctors.push({
              key: doctor.id,
              ...doctor.data()
            })
          })
          setDoctors(doctors)
          setFetchData(true)
        }
      })
  }, [globalLocation, globalSpeciality]) */

  useEffect(() => {
    axios
      .get("https://servicodados.ibge.gov.br/api/v1/localidades/estados")
      .then((res) => {
        //const states = res.data.map(uf => new Object({ 'initial': `${uf.sigla}`, 'name': `${uf.nome}` }))
        const states = res.data.map((uf) => uf.sigla);
        setUfs(states);
      });
  }, []);

  /*  useEffect(() => {
    firebase.db.collection("specialities").orderBy("name")
      .get().then(snapshot => {
        if (snapshot) {
          let specialities = []
          snapshot.forEach(speciality => {
            specialities.push({
              ...speciality.data()
            })
          })
          const specialityNames = specialities.map(speciality => speciality.name)
          setSpecialities(specialityNames)
        }
      })
  }, []) */

  // Busca os médicos de acordo com a pesquisa avançada na tela de busca
  const handleAdvancedSearch = () => {
    console.log(selectedCategories)
    /* if (location === "" || speciality === "" || rating === 0) {
      setOpenDialog(true)
    } else {
      setFetchData(false)
      firebase.db.collection('doctors')
        .where("location", "==", location)
        .where("speciality", "==", speciality)
        //.where("price", "<=", price)
        //.where("date", "==", date)
        .where("rating", "==", rating)
        .get().then(snapshot => {
          if (snapshot) {
            let doctors = []
            snapshot.forEach(doctor => {
              doctors.push({
                key: doctor.id,
                ...doctor.data()
              })
            })
            setDoctors(doctors)
            setFetchData(true)
          }
        })
    } */
  };

  return (
    <React.Fragment>
      <Grid container className={styles.mainGrid}>
        <Grid container direction="column">
          <CssBaseline />
          <Grid container>
            <Container className={styles.expansionGrid} maxWidth="md">
              <ExpansionPanel
                defaultExpanded
                elevation={3}
                style={{ marginBottom: 20 }}
              >
                <ExpansionPanelSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel1a-content"
                  id="panel1a-header"
                >
                  <Typography className={styles.heading}>
                    Busca avançada
                  </Typography>
                </ExpansionPanelSummary>
                <ExpansionPanelDetails>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        autoFocus
                        color="primary"
                        label="Nome do serviço"
                        variant="outlined"
                        value={nameSearch}
                        onChange={(event) => setNameSearch(event.target.value)}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Autocomplete
                        fullWidth
                        multiple
                        options={categories}
                        getOptionLabel={(category) => category}
                        filterSelectedOptions
                        value={selectedCategories}
                        onChange={(event, value) => setSelectedCategories(value)}
                        renderInput={(params) => (
                          <TextField
                          fullWidth
                            {...params}
                            label="Categorias"
                            variant="outlined"
                          />
                        )}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                    <Autocomplete
                        fullWidth
                        options={sortValues}
                        getOptionLabel={(sort) => sort}
                        filterSelectedOptions
                        value={selectedSort}
                        onChange={(event, value) => setSelectedSort(value)}
                        renderInput={(params) => (
                          <TextField
                          fullWidth
                            {...params}
                            label="Ordenar por:"
                            variant="outlined"
                          />
                        )}
                      />
                    </Grid>

                    <Grid item xs={12} sm={4}>
                     <Autocomplete
                        fullWidth
                        multiple
                        id="autocomplete1"
                        options={categories}
                        getOptionLabel={(category) => category}
                        filterSelectedOptions
                        value={selectedCategories}
                        onChange={(event, value) => setSelectedCategories(value)}
                        renderInput={(params) => (
                          <TextField
                          fullWidth
                            {...params}
                            label="Categorias"
                            variant="outlined"
                          />
                        )}
                      />
                    </Grid>
                  </Grid>
                </ExpansionPanelDetails>
                <div className={styles.buttons}>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleAdvancedSearch}
                    className={styles.button}
                  >
                    Buscar
                  </Button>
                </div>
              </ExpansionPanel>
              {doctors.length === 0 && (
                <Alert severity="warning" variant="standard" elevation={3}>
                  <AlertTitle>Atenção</AlertTitle>
                  Essa pesquisa não retornou nenhum resultado!
                </Alert>
              )}
            </Container>
            <Container className={styles.cardGrid} maxWidth="md">
              {doctors.length !== 0 && (
                <Grid container spacing={4}>
                  {doctors.map((doc) => (
                    <Grid item key={doc.key} xs={12} sm={6} md={4}>
                      <Card className={styles.card} elevation={3}>
                        <CardMedia
                          className={styles.cardMedia}
                          image={doc.image}
                          title="Image title"
                        />
                        <CardContent className={styles.cardContent}>
                          <Typography gutterBottom variant="h5" component="h2">
                            {doc.name}
                          </Typography>
                          <Typography>{doc.description}</Typography>
                          <Grid className={styles.rating}>
                            <Chip icon={<StarRate />} label={doc.rating} />
                          </Grid>
                        </CardContent>
                        <CardActions>
                          <Button
                            size="small"
                            color="primary"
                            onClick={() => history.push(`/doctor/${doc.key}`)}
                            className={styles.details}
                          >
                            Ver Detalhes
                          </Button>
                        </CardActions>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              )}
            </Container>
          </Grid>
        </Grid>
      </Grid>
    </React.Fragment>
  );
}

const useStyles = makeStyles((theme) => ({
  mainGrid: {
    backgroundColor: "#e4fdff",
    minHeight: "100vh",
  },
  expansionGrid: {
    paddingBottom: theme.spacing(2),
  },
  rating: {
    marginTop: 10,
  },
  details: {
    justifyContent: "flex-end",
  },
  cardGrid: {
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(8),
  },
  card: {
    height: "100%",
    display: "flex",
    flexDirection: "column",
  },
  buttons: {
    display: "flex",
    justifyContent: "flex-end",
  },
  button: {
    marginBottom: theme.spacing(3),
    marginRight: theme.spacing(3),
  },
  cardMedia: {
    paddingTop: "56.25%",
  },
  cardContent: {
    flexGrow: 1,
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightRegular,
  },
  mainContainer: {
    padding: theme.spacing(8, 0, 6),
  },
  resultContainer: {
    paddingTop: theme.spacing(20),
  },
  resultTypography: {
    paddingTop: 20,
    paddingBottom: 20,
    paddingLeft: 20,
    paddingRight: 20,
    fontWeight: "bold",
  },
  mainTitle: {
    fontWeight: "bold",
  },
}));
