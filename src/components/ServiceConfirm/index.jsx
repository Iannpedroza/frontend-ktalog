import React, { useContext } from "react";
import { UserContext } from "../../UserContext";

import { Typography, Grid } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

export default function ServiceConfirm() {
  const styles = useStyles();
  const {
    serviceName,
    cpf,
    phone,
    description,
    city,
    street,
    streetNumber,
    neighbour,
    verificado,
    serviceType,
    cnpj,
    averagePrice,
    scheduleItems
  } = useContext(UserContext);

  console.log(scheduleItems)

  function formatDay(day) {
    if (day == 0) {
      return ("Segunda-feira");
    } else if (day == 1) {
      return ("Terça-feira");
    } else if (day == 2) {
      return ("Quarta-feira");
    } else if (day == 3) {
      return ("Quinta-feira");
    } else if (day == 4) {
      return ("Sexta-feira");
    } else if (day == 5) {
      return ("Sábado");
    } else if (day == 6) {
      return ("Domingo");
    }
    
  }
  return (
    <React.Fragment>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Typography variant="h6" gutterBottom className={styles.title}>
            Informações do serviço
          </Typography>
          <Grid container direction="row">
            <Typography className={styles.typography} gutterBottom>
              Nome:
            </Typography>
            <Typography gutterBottom>{serviceName}</Typography>
          </Grid>
          <Grid container direction="row">
            <Typography className={styles.typography} gutterBottom>
              Descrição:
            </Typography>
            <Typography gutterBottom>{description}</Typography>
          </Grid>
          <Grid container direction="row">
            <Typography className={styles.typography} gutterBottom>
              Telefone:
            </Typography>
            <Typography gutterBottom>{phone}</Typography>
          </Grid>
          {verificado ? (
            <Grid container direction="row">
              <Typography className={styles.typography} gutterBottom>
                {serviceType == 0 ? "CPF:" : "CNPJ"}
              </Typography>
              <Typography gutterBottom>
                {serviceType == 0 ? cpf : cnpj}
              </Typography>
            </Grid>
          ) : null}

          {serviceType == 0 ? (
            <Grid container direction="row">
              <Typography className={styles.typography} gutterBottom>
                Preço médio:
              </Typography>
              <Typography gutterBottom>{averagePrice}</Typography>
            </Grid>
          ) : null}
        </Grid>

        <Grid item container direction="column" xs={12}>
          <Typography variant="h6" gutterBottom className={styles.title}>
            Informações do local
          </Typography>
          <Grid container direction="row">
            <Typography className={styles.typography} gutterBottom>
              Cidade:
            </Typography>
            <Typography gutterBottom>{city}</Typography>
          </Grid>
          <Grid container direction="row">
            <Typography className={styles.typography} gutterBottom>
              Rua:
            </Typography>
            <Typography gutterBottom>{street}</Typography>
          </Grid>
          <Grid container direction="row">
            <Typography className={styles.typography} gutterBottom>
              Número:
            </Typography>
            <Typography gutterBottom>{streetNumber}</Typography>
          </Grid>

          <Grid container direction="row">
            <Typography className={styles.typography} gutterBottom>
              Bairro:
            </Typography>
            <Typography gutterBottom>{neighbour}</Typography>
          </Grid>
        </Grid>

        {verificado && scheduleItems.length > 0 ? (
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom className={styles.title}>
              Informações de horário
            </Typography>
            {scheduleItems.map(schedule => {
              return (
              <Grid container direction="row">
                <Typography className={styles.typography} gutterBottom>
                  {formatDay(schedule.week_day) + " - "}
                </Typography>
                <Typography gutterBottom>{"De: " + schedule.from + " - Até: " + schedule.to}</Typography>
              </Grid>
              )
            })}
          </Grid>
        ) : null}
      </Grid>
    </React.Fragment>
  );
}

const useStyles = makeStyles((theme) => ({
  listItem: {
    padding: theme.spacing(1, 0),
  },
  total: {
    fontWeight: 700,
  },
  title: {
    marginTop: theme.spacing(2),
    fontWeight: "bold",
  },
  typography: {
    fontWeight: "bold",
    marginRight: 5,
  },
}));
