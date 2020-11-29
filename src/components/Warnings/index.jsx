import React from 'react'
import { Autocomplete, Alert, AlertTitle } from '@material-ui/lab'
import { Container} from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'

export default function Warnings() {
  const styles = useStyles();

  return (
    <Container maxWidth="md" className={styles.alert}>
        {!navigator.onLine && (
        <Alert severity="warning" variant="standard" elevation={3}>
            <AlertTitle>Atenção</AlertTitle>
            Você está navegando no modo Offline, alguns recursos estão indisponíveis no momento. <br/>
            Ative sua internet para utilizar todos os recursos do App.
        </Alert>
        )}
    </Container>
  );
}

const useStyles = makeStyles(theme => ({
    alert: {
        marginTop: theme.spacing(2)
    },
}));
