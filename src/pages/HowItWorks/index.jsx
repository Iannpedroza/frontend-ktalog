import React, { useState, useContext } from 'react'
import Footer from '../../components/Footer'
import NewHeader from '../../components/NewHeader'
import Tips from '../../components/Tips'
import { UserContext } from '../../UserContext'
import api from "../../services/api"

import {
    Typography, Container, Grid, CssBaseline, Divider
} from '@material-ui/core'

import { Visibility, VisibilityOff } from '@material-ui/icons';
import { makeStyles } from '@material-ui/core/styles'

import logo from '../../assets/logo-texto.png'

export default function HowItWorks({ history }) {
    const styles = useStyles();

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
      <Grid className={styles.mainGrid}>
        <Tips/>
      </Grid>
    
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
}));
