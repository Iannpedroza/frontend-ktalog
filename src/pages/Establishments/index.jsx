import React, { useState, useEffect, useContext } from "react";
import Footer from "../../components/Footer";
import { UserContext } from "../../UserContext";
import Search from "../../components/Search";
import NewHeader from "../../components/NewHeader";
import Warnings from '../../components/Warnings'
import api from "../../services/api";
import {
  Grid,
  Container,
  CssBaseline,
  Typography,
  Card,
  CardActionArea,
  CardContent,
  Chip,
  CardMedia,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import CallSharp from "@material-ui/icons/CallSharp";
import LocationOn from "@material-ui/icons/LocationOn";
import StarRate from "@material-ui/icons/Star";
import VerifiedUser from "@material-ui/icons/VerifiedUser";

export default function Establishments({ history }) {
  const styles = useStyles();
  const [services, setServices] = useState([]);

  const {
    searchClicked,
    setSearchClicked,
    nameSearch,
    setNameSearch,
    selectedSort,
    setSelectedSort,
    selectedCategories,
    setSelectedCategories,
    selectedRatingFilter,
    setSelectedRatingFilter,
    undoSearchClicked,
    setUndoSearchClicked,
  } = useContext(UserContext);
  
  function handleCard(service) {
    if (!service.verified) {
      alert(
        "Esse serviço não possui uma página de perfil pois não é verificado na plataforma."
      );
      return;
    }
    if (!navigator.onLine) {
      alert(
        "Para utilizar esse recurso é necessário conexão com a internet."
      );
      return;
    }
    history.push({
      pathname: "/serviceProfile",
      idService: service._id,
    });
  }

  function setDefault() {
    setSelectedCategories([]);
    setSelectedRatingFilter({ key: 0, name: "Qualquer" });
    setNameSearch("");
    setSelectedSort({ key: "-avgRating", name: "Avaliação geral" });
  }
  useEffect(() => {
    setDefault();
    if (!navigator.onLine) {
      let allEstablishments = JSON.parse(localStorage.getItem('allEstablishments'));
      if (allEstablishments) {
        setServices(allEstablishments);
      }
    } else {
      api.post("service/getAllServices", {establishment: true}).then((res) => {
        if (!res.data.error) {
          setServices(res.data);
          localStorage.setItem('allEstablishments', JSON.stringify(res.data));
        }
      });
    }
    
  }, []);

  useEffect(() => {
    if (undoSearchClicked) {
      setDefault();
      api.post("service/getAllServices", {establishment: true}).then((res) => {
        if (!res.data.error) {
          setServices(res.data);
        }
      });
      setUndoSearchClicked(false);
    }
  }, [undoSearchClicked]);

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
    if (searchClicked) {
      api
        .post("service/servicesSearch", {
          name: nameSearch,
          sort: selectedSort.key,
          establishment: true,
          categoryFilter: selectedCategories,
          ratingFilter: selectedRatingFilter.key,
        })
        .then((res) => {
          console.log(res);
          if (!res.data.error) {
            console.log(res.data);
            let arrayAux = res.data;
            if (selectedSort.key == "+name") {
              arrayAux.sort(compare);
            }
            
            setServices(arrayAux);
          } else {
            alert(
              "Não encontrei nenhum serviço com esses parâmetros, tente novamente."
            );
          }
        });
      setSearchClicked(false);
    }
  }, [searchClicked]);

  return (
    <React.Fragment>
      <Grid container className={styles.mainGrid}>
        <Grid container direction="column">
          <CssBaseline />
          <Container component="main" maxWidth="lg">
            <NewHeader />
          </Container>
          <Container
            maxWidth="sm"
            component="main"
            className={styles.mainContainer}
          >
            <Typography
              className={styles.mainTitle}
              component="h2"
              variant="h3"
              align="center"
              color="textPrimary"
              gutterBottom
            >
              Lista de estabelecimentos
            </Typography>
            <Typography
              variant="h5"
              align="center"
              color="textSecondary"
              component="p"
            >
              Utilize o recurso de busca avançada para encontrar um
              estabelecimento desejado mais rapidamente.
            </Typography>
          </Container>
          <Search />
          {!navigator.onLine ? (
            <Warnings/>
          ) : (
            null
          )}
          <Container className={styles.cardGrid} maxWidth="md">
            {services.length > 0 ? (
              <Grid container spacing={2}>
                {services.map((service) => (
                  <Grid item key={service._id} xs={12}>
                    <Card className={styles.card} elevation={3}>
                      <CardActionArea
                        className={styles.card}
                        onClick={() => handleCard(service)}
                      >
                        <CardContent className={styles.cardContent}>
                          <div className={styles.teste}>
                            <Typography
                              gutterBottom
                              variant="h5"
                              component="h2"
                            >
                              {service.name}
                            </Typography>
                            {service.verified && (
                              <React.Fragment>
                                <VerifiedUser
                                  className={styles.iconVerified}
                                ></VerifiedUser>

                                <Chip
                                  icon={
                                    <StarRate
                                      fontSize="large"
                                      className={styles.star}
                                    />
                                  }
                                  label={service.averageRating}
                                  className={styles.chip}
                                />
                              </React.Fragment>
                            )}
                          </div>
                          <Typography>{service.category.name}</Typography>
                          <div className={styles.teste}>
                            <CallSharp className={styles.callSharp} />

                            <Typography>{service.phone}</Typography>
                          </div>
                          <div className={styles.teste}>
                            <LocationOn className={styles.locationOn} />

                            <Typography>{service.address.street}</Typography>
                          </div>
                        </CardContent>

                        {service.image && navigator.onLine ? (
                          <CardMedia
                            className={styles.cardMedia}
                            src={
                              process.env.REACT_APP_API_IMAGES_URL +
                              service.image
                            }
                            component="img"
                            title="Image title"
                          />
                        ) : null}
                      </CardActionArea>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            ) : null}
          </Container>
        </Grid>
      </Grid>
      <Footer/>
    </React.Fragment>
  );
}

const useStyles = makeStyles((theme) => ({
  mainGrid: {
    backgroundColor: "#e4fdff",
    minHeight: "100vh",
  },
  mainTitle: {
    fontWeight: "bold",
  },
  secondaryTitle: {
    paddingTop: theme.spacing(3),
    paddingLeft: theme.spacing(3),
  },
  mainContainer: {
    padding: theme.spacing(8, 0, 6),
  },
  cardGrid: {
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(8),
  },
  cardMedia: {
    marginLeft: "auto",
    width: 150,
  },
  card: {
    display: "flex",
  },
  cardContent: {
    flexGrow: 1,
  },
  teste: {
    display: "flex",
  },
  chip: {
    marginLeft: "5px",
    marginTop: "-3px",
    backgroundColor: "white",
  },
  iconVerified: {
    color: "#11b8ea",
    marginLeft: "10px",
  },
  callSharp: {
    paddingRight: "5px",
    color: "#11b8ea",
  },
  star: {
    color: "yellow",
    borderRadius: "10px",
  },
  locationOn: {
    color: "#fd0533",
    paddingRight: "5px",
  },
}));
