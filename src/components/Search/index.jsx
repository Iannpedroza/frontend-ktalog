import React, { useState, useEffect, useContext } from "react";
import { UserContext } from "../../UserContext";
import api from "../../services/api";
import { useLocation } from "react-router-dom";
import axios from "axios";

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
  const [openDialog, setOpenDialog] = useState(false);
  
  const sortValues = [
    {
      key: "-averageRating",
      name: "Avaliação geral"
    },
    {
      key: "attendance",
      name: "Atendimento"
    },
    {
      key: "costBenefit",
      name: "Custo-benefício"
    },
    {
      key: "quality",
      name: "Qualidade"
    },
    {
      key: "+name",
      name: "Ordem alfabética"
    }
  ];

  const ratingsFilter = [
    {
      key: 0,
      name: "Qualquer"
    },
    {
      key: 4,
      name: "Acima de 4 estrelas"
    },
    {
      key: 3,
      name: "Acima de 3 estrelas"
    },
    {
      key: 2,
      name: "Acima de 2 estrelas"
    },
    {
      key: 1,
      name: "Acima de 1 estrelas"
    }
  ];
  const {
    //price, setPrice,
    rating,
    setRating,
    setLocation,
    setSpeciality,
    speciality,
    globalLocation,
    globalSpeciality,
    searchClicked, setSearchClicked,
    nameSearch, setNameSearch,
    selectedSort, setSelectedSort,
    selectedCategories, setSelectedCategories,
    selectedRatingFilter, setSelectedRatingFilter,
    undoSearchClicked, setUndoSearchClicked
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
            filtered.push({name: option.name, id: option._id});
          }
          return filtered;
        }, []);
      } else if (location.pathname === "/services") {
        var reduced = aux.reduce(function (filtered, option) {
          if (!option.establishment) {
            filtered.push({name: option.name, id: option._id});
          }
          return filtered;
        }, []);
      }
      reduced.sort(compare);
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

  const handleAdvancedSearch = () => {
    setSearchClicked(true);
  };
  
  const handleUndoAdvancedSearch = () => {
    setUndoSearchClicked(true);
  }
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
                        getOptionLabel={(category) => category.name}
                        filterSelectedOptions
                        value={selectedCategories}
                        onChange={(event, value) =>
                          setSelectedCategories(value)
                        }
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
                        options={ratingsFilter}
                        getOptionLabel={(ratingFilter) => ratingFilter.name}
                        filterSelectedOptions
                        value={selectedRatingFilter}
                        onChange={(event, value) =>
                          value != null ? setSelectedRatingFilter(value) : null
                        }
                        renderInput={(params) => (
                          <TextField
                            fullWidth
                            {...params}
                            label="Avaliação geral"
                            variant="outlined"
                          />
                        )}
                      />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <Autocomplete
                        fullWidth
                        options={sortValues}
                        getOptionLabel={(sort) => sort.name}
                        filterSelectedOptions
                        value={selectedSort}
                        onChange={(event, value) => value != null ? setSelectedSort(value) : null}
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
                  </Grid>
                </ExpansionPanelDetails>
                <div className={styles.buttons}>
                  <Button
                    disabled={!navigator.onLine}
                    variant="outlined"
                    color="secondary"
                    onClick={handleUndoAdvancedSearch}
                    className={styles.button}
                  >
                    Desfazer busca
                  </Button>
                  <Button
                    disabled={!navigator.onLine}
                    variant="contained"
                    color="inherit"
                    onClick={handleAdvancedSearch}
                    className={styles.buttonSearch}
                  >
                    Buscar
                  </Button>
                </div>
              </ExpansionPanel>
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
  buttonSearch: {
    marginBottom: theme.spacing(3),
    marginRight: theme.spacing(3),
    color: '#fff',
    backgroundColor: '#080b57'
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
  mainTitle: {
    fontWeight: "bold",
  },
}));
