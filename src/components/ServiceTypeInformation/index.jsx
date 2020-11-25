import React, { useContext, useState} from 'react'
import { withStyles } from '@material-ui/core/styles';
import { makeStyles } from '@material-ui/core/styles'
import { UserContext } from '../../UserContext'
import InputMask from 'react-input-mask'
import Switch from '@material-ui/core/Switch';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { Grid, TextField, Select, FormControl, InputLabel, Typography} from '@material-ui/core'

const IOSSwitch = withStyles((theme) => ({
  root: {
    width: 42,
    height: 26,
    padding: 0,
    margin: theme.spacing(1),
  },
  switchBase: {
    padding: 1,
    '&$checked': {
      transform: 'translateX(16px)',
      color: theme.palette.common.white,
      '& + $track': {
        backgroundColor: '#52d869',
        opacity: 1,
        border: 'none',
      },
    },
    '&$focusVisible $thumb': {
      color: '#52d869',
      border: '6px solid #fff',
    },
  },
  thumb: {
    width: 24,
    height: 24,
  },
  track: {
    borderRadius: 26 / 2,
    border: `1px solid ${theme.palette.grey[400]}`,
    backgroundColor: theme.palette.grey[50],
    opacity: 1,
    transition: theme.transitions.create(['background-color', 'border']),
  },
  checked: {},
  focusVisible: {},
}))(({ classes, ...props }) => {
  return (
    <Switch
      focusVisibleClassName={classes.focusVisible}
      disableRipple
      classes={{
        root: classes.root,
        switchBase: classes.switchBase,
        thumb: classes.thumb,
        track: classes.track,
        checked: classes.checked,
      }}
      {...props}
    />
  );
});



export default function ServiceTypeInformation() {
  const { cpf, setCpf, cnpj, setCnpj, verificado, setVerificado, serviceType, setServiceType} = useContext(UserContext)
  const styles = useStyles();
  const handleChange = (event) => {
    setServiceType(event.target.value);
    console.log(event.target.value);
  };
  

  return (
    <React.Fragment>
      <Grid container alignItems="center" justify="center" >
        <Grid item xs={12}>
          <FormControl required variant="outlined" className={styles.formControl}>
            <InputLabel htmlFor="selected-city">Escolha o tipo do serviço</InputLabel>
            <Select
              native
              value={serviceType}
              onChange={handleChange}
              label="Escolha o tipo do serviço"
              inputProps={{
                name: 'age',
                id: 'outlined-age-native-simple',
              }}
            >
              <option value={0}>Serviços Gerais</option>
              <option value={1}>Estabelecimento</option>
            </Select>
        </FormControl>
        </Grid>
        <Grid item xs={12}>
          <FormControlLabel
            control={<IOSSwitch checked={verificado} onChange={event => setVerificado(event.target.checked)} name="checkedA" />}
            label="Gostaria de ter seu serviço verificado pela plataforma?"
            labelPlacement= 'start'
            className={styles.formControlLabel}
          />
        </Grid>
        {verificado === true ?
        (
          <React.Fragment>
            {serviceType == 0 ?
            (
            
            <Grid >
              <Typography className={styles.typography} gutterBottom>Informe um CPF válido para poder cadastrar um serviço com mais benefícios.</Typography>
              <InputMask mask="999.999.999-99" value={cpf} onChange={event => setCpf(event.target.value)}  >
                {() => <TextField required label='CPF'  />}
              </InputMask>
            </Grid>
            )
            :
            (
            
            <Grid >
              <Typography className={styles.typography} gutterBottom>Informe um CNPJ válido para poder cadastrar um serviço com mais benefícios.</Typography>
              <InputMask mask="99.999.999/9999-99" value={cnpj} onChange={event => setCnpj(event.target.value)}  >
                {() => <TextField required label='CNPJ'  />}
              </InputMask>
            </Grid>
            )
            }  
            
          </React.Fragment>
        )
        :
        (null)
        }
        
      </Grid>
    </React.Fragment>
  )
}

const useStyles = makeStyles(theme => ({
  formControl: {
    margin: 0,
    marginTop: 25,
    minWidth: 200,
    backgroundColor: '',
    display: 'flex',
    wrap: 'nowrap'
  },
  formControlLabel: {
    marginLeft: '0px'
  }

}))