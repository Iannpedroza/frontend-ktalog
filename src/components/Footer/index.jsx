import React from 'react'
import logo from '../../assets/logo-texto.png'

import { Link, Container, Typography, Grid } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'

export default function Footer() {
  const styles = useStyles();

  return (
    <footer className={styles.footer}>
      <Container maxWidth="lg">
        <Grid container direction="column" alignItems="center" justify="center">
          <img src={logo} alt="Ktalog" height="50em" />
          <Typography variant="body2" color="inherit" align="center">
            Made by: Iann Pedroza
          </Typography>
        </Grid>
      </Container>
    </footer>
  );
}

const useStyles = makeStyles(theme => ({
  footer: {
    backgroundColor: '#7c7571',
    padding: theme.spacing(6, 0),
    color: '#fdfdfd'
  }
}));
