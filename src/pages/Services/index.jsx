import React, { useState, useEffect, useContext } from "react";
import { UserContext } from '../../UserContext'
import Footer from "../../components/Footer";
import Search from "../../components/Search"
import NewHeader from "../../components/NewHeader";

import {
  Grid,
  Container,
  CssBaseline,
  Typography,
  Divider,
  FormControl,
  Select,
  InputLabel,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

import logo from "../../assets/logo-texto.png";
import search from "../../assets/search.svg";

export default function Services({ history }) {
    const styles = useStyles();
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
                    Lista de Serviços
                    </Typography>
                    <Typography variant="h5" align="center" color="textSecondary" component="p">
                        Utilize o recurso de busca avançada para encontrar um serviço desejado rapidamente. 
                    </Typography>   
                </Container>
                <Search/>
            </Grid>
        </Grid>
        
        </React.Fragment>
    );
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
    mainContainer: {
        padding: theme.spacing(8, 0, 6),
    },
  }))