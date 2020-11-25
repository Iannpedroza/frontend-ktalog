import React, { useContext, useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { UserContext } from "../../UserContext";
import InputMask from "react-input-mask";
import api from "../../services/api"
import DeleteIcon from "@material-ui/icons/Delete";
import AddIcon from "@material-ui/icons/Add";
import axios from 'axios';
import {
  Grid,
  TextField,
  Typography,
  Button,
  Select,
  Input,
  FormControl,
  InputLabel,
  InputAdornment,
  IconButton,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  Divider
} from "@material-ui/core";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import { Autocomplete } from "@material-ui/lab";
import PhotoCamera from "@material-ui/icons/PhotoCamera";
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import Info from "@material-ui/icons/Info";
export default function ServiceDetails() {
  const {
    serviceName,
    setServiceName,
    description,
    setDescription,
    city,
    setCity,
    street,
    setStreet,
    streetNumber,
    setStreetNumber,
    neighbour,
    setNeighbour,
    selectedUf,
    setSelectedUf,
    phone,
    setPhone,
    cep,
    setCEP,
    category,
    setCategory,
    serviceType,
    averagePrice,
    setAveragePrice,
    serviceImage,
    setServiceImage,
    verificado,
    productItems, 
    setProductItems, 
    scheduleItems, 
    setScheduleItems
  } = useContext(UserContext);

  const styles = useStyles();
  const [ufs, setUfs] = useState([]);
  const [cities, setCities] = useState([]);
  const [categories, setCategories] = useState([]);
  
  const [product, setProduct] = useState({ name: "", price: "", description: "", image: "" })

  function addNewScheduleItem() {
    if (scheduleItems.length < 7) {
      setScheduleItems([
        ...scheduleItems,
        {
          week_day:
            (scheduleItems[scheduleItems.length - 1] &&
              scheduleItems[scheduleItems.length - 1].week_day + 1) ||
            0,
          from: "",
          to: "",
        },
      ]);
    }
  }

  function removeProduct(indice){
    let productItemsAux = [...productItems];
    productItemsAux.splice(indice, 1);
    setProductItems(productItemsAux)
  }

  function addNewProduct() {
    if (product.name && product.price) {
      setProductItems([
        ...productItems,
        { name: product.name, price: product.price, description: product.description, image: product.image }
      ])
      setProduct({ name: "", price: "", description: "", image: "" })
    } else {
      alert("Para adicionar um produto é necessário preencher o Nome e o Preço.")
    }
    
  }

  function clearSchedule() {
    setScheduleItems([]);
  }

  function setScheduleItemValue(position, field, value) {
    const updatedScheduleItems = scheduleItems.map((scheduleItem, index) => {
      if (index === position) {
        return { ...scheduleItem, [field]: value };
      }

      return scheduleItem;
    });

    setScheduleItems(updatedScheduleItems);
  }

  function setProductItemValue(field, value) {
    let productAux = Object.assign({}, product);
    productAux[field] = value;
    console.log(productAux)
    setProduct(productAux);
  }

  useEffect(() => {
    axios
      .get("https://servicodados.ibge.gov.br/api/v1/localidades/estados")
      .then((res) => {
        //const states = res.data.map(uf => new Object({ 'initial': `${uf.sigla}`, 'name': `${uf.nome}` }))
        const states = res.data.map((uf) => uf.sigla);
        setUfs(states);
      });
  }, []);

  useEffect(() => {
    api.get("category/").then((res) => {
      const aux = res.data;
      if (serviceType == 1) {
        var reduced = aux.reduce(function (filtered, option) {
          if (option.establishment) {
            filtered.push(option.name);
          }
          return filtered;
        }, []);
      } else if (serviceType == 0) {
        var reduced = aux.reduce(function (filtered, option) {
          if (!option.establishment) {
            filtered.push(option.name);
          }
          return filtered;
        }, []);
      }
      setCategories(reduced || []);
    });
  }, []);

  useEffect(() => {
    // Carregar as cidades sempre que a UF mudar
    if (selectedUf === "0") {
      return;
    }

    axios
      .get(
        `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUf}/municipios`
      )
      .then((res) => {
        const cityNames = res.data.map((city) => city.nome);
        setCities(cityNames);
      });
  }, [selectedUf]);

  const pesquisaCEP = (cepAux) => {
    //Verifica se campo cep possui valor informado.
    if (cepAux !== "") {
      cepAux = cepAux.replace(/\D/g, "");
      //Expressão regular para validar o CEP.
      var validacep = /^[0-9]{8}$/;

      //Valida o formato do CEP.
      if (validacep.test(cepAux)) {
        axios.get(`https://viacep.com.br/ws/${cepAux}/json/`).then((res) => {
          console.log(res);
          const { bairro, localidade, logradouro, uf } = res.data;
          setSelectedUf(uf);
          setCity(localidade);
          setStreet(logradouro);
          setNeighbour(bairro);
        });
      }
    }
  };

  return (
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Typography variant="h5" gutterBottom>
            Informações do Serviço
          </Typography>
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            required
            label="Nome"
            value={serviceName}
            onChange={(event) => setServiceName(event.target.value)}
            inputProps={{ maxLength: 40 }}
            fullWidth
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            label="Descrição"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            fullWidth
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <InputMask
            mask="(99) 99999-9999"
            defaultValue={phone}
            onChange={(event) =>
              setPhone(event.target.value.replace(/\D/g, ""))
            }
          >
            {() => <TextField required label="Telefone" fullWidth />}
          </InputMask>
        </Grid>

        <Grid item xs={12} sm={6}>
          <Autocomplete
            fullWidth
            options={categories}
            getOptionLabel={(categories) => categories}
            value={category}
            onChange={(event, newValue) => {
              setCategory(newValue);
            }}
            renderInput={(params) => (
              <TextField required {...params} label="Categoria" variant="standard" />
            )}
          />
        </Grid>
        {serviceType == 0 ? (
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel htmlFor="averagePrice">Preço médio</InputLabel>
              <Input
                type="number"
                id="averagePrice"
                value={averagePrice}
                onChange={(e) => setAveragePrice(e.target.value)}
                startAdornment={
                  <InputAdornment position="start">R$</InputAdornment>
                }
              />
            </FormControl>
          </Grid>
        ) : null}

        <Grid item xs={12} sm={6} className={styles.photo}>
          <input
            accept="image/*"
            onChange={(event) => setServiceImage(event.target.files[0])}
            className={styles.input}
            id="icon-button-file"
            type="file"
          />

          <label htmlFor="icon-button-file">
            Insira uma foto do serviço
            <IconButton
              color="primary"
              aria-label="upload picture"
              component="span"
            >
              <PhotoCamera />
            </IconButton>
          </label>
        </Grid>

        <Grid item xs={12}>
          <Typography variant="h5" gutterBottom>
            Informações do local
          </Typography>
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            required
            label="CEP"
            value={cep}
            type="number"
            onChange={(event) => {
              setCEP(event.target.value);
              if (event.target.value.length >= 8) {
                pesquisaCEP(event.target.value);
              }
            }}
            inputProps={{ maxLength: 9 }}
            fullWidth
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <Autocomplete
            fullWidth
            options={ufs}
            getOptionLabel={(uf) => uf}
            value={selectedUf}
            onChange={(event, newValue) => {
              setSelectedUf(newValue);
            }}
            renderInput={(params) => (
              <TextField required {...params} label="Estado" variant="standard" />
            )}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <Autocomplete
            fullWidth
            options={cities}
            getOptionLabel={(cities) => cities}
            value={city}
            onChange={(event, newValue) => {
              setCity(newValue);
            }}
            renderInput={(params) => (
              <TextField required {...params} label="Cidade" variant="standard" />
            )}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            required
            label="Bairro"
            value={neighbour}
            onChange={(event) => setNeighbour(event.target.value)}
            inputProps={{ maxLength: 20 }}
            fullWidth
          />
        </Grid>
        <Grid item xs={12} md={9}>
          <TextField
            required
            label="Rua"
            value={street}
            onChange={(event) => setStreet(event.target.value)}
            inputProps={{ maxLength: 50 }}
            fullWidth
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <TextField
            required
            label="Número"
            type="number"
            value={streetNumber}
            onChange={(event) => setStreetNumber(event.target.value)}
            inputProps={{ maxLength: 5 }}
            fullWidth
          />
        </Grid>

        {verificado ? (
          <React.Fragment>
            <Grid item xs={12}>
              <Typography variant="h5" gutterBottom>
                Informações adicionais
              </Typography>
            </Grid>
            <Grid item xs={12} className={styles.scheduleHeader}>
              <Typography variant="h6" gutterBottom>
                Horários disponíveis
              </Typography>
              <Button
                disabled={scheduleItems.length === 0}
                variant="outlined"
                color="secondary"
                onClick={clearSchedule}
                startIcon={<DeleteIcon />}
              >
                Limpar horários
              </Button>
              <Button
                variant="outlined"
                color="primary"
                onClick={addNewScheduleItem}
                startIcon={<AddIcon />}
              >
                Novo horário
              </Button>
            </Grid>

            {scheduleItems.map((scheduleItem, index) => {
              return (
                <Grid item xs={12} className={styles.scheduleBody}>
                  <FormControl
                    required
                    variant="outlined"
                    className={styles.formControl}
                  >
                    <InputLabel shrink htmlFor="week_day">
                      Dia da semana
                    </InputLabel>
                    <Select
                      native
                      id="week_day"
                      label="Dia da semana"
                      value={scheduleItem.week_day}
                      onChange={(e) =>
                        setScheduleItemValue(index, "week_day", e.target.value)
                      }
                    >
                      <option
                        disabled={scheduleItems.find((el) => el.week_day == 0)}
                        value={0}
                      >
                        Segunda-feira
                      </option>
                      <option
                        disabled={scheduleItems.find((el) => el.week_day == 1)}
                        value={1}
                      >
                        Terça-feira
                      </option>
                      <option
                        disabled={scheduleItems.find((el) => el.week_day == 2)}
                        value={2}
                      >
                        Quarta-feira
                      </option>
                      <option
                        disabled={scheduleItems.find((el) => el.week_day == 3)}
                        value={3}
                      >
                        Quinta-feira
                      </option>
                      <option
                        disabled={scheduleItems.find((el) => el.week_day == 4)}
                        value={4}
                      >
                        Sexta-feira
                      </option>
                      <option
                        disabled={scheduleItems.find((el) => el.week_day == 5)}
                        value={5}
                      >
                        Sábado
                      </option>
                      <option
                        disabled={scheduleItems.find((el) => el.week_day == 6)}
                        value={6}
                      >
                        Domingo
                      </option>
                    </Select>
                  </FormControl>
                  <FormControl
                    required
                    variant="outlined"
                    className={styles.formControl}
                  >
                    <InputLabel shrink htmlFor="from">
                      Das
                    </InputLabel>
                    <Input
                      id="from"
                      label="Das"
                      type="time"
                      value={scheduleItem.from}
                      onChange={(e) =>
                        setScheduleItemValue(index, "from", e.target.value)
                      }
                    />
                  </FormControl>
                  <FormControl
                    required
                    variant="outlined"
                    className={styles.formControl}
                  >
                    <InputLabel shrink htmlFor="to">
                      Até
                    </InputLabel>
                    <Input
                      id="to"
                      label="Até"
                      type="time"
                      value={scheduleItem.to}
                      onChange={(e) =>
                        setScheduleItemValue(index, "to", e.target.value)
                      }
                    />
                  </FormControl>
                </Grid>
              );
            })}
            {
              serviceType == 1 ? (
                <React.Fragment>
                <Grid item xs={12} className={styles.productHeader}>
                  <Typography variant="h6" gutterBottom>
                    Catálogo de Produtos
                  </Typography>
                  
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    required
                    label="Nome"
                    value={product.name}
                    onChange={(event) => setProductItemValue("name", event.target.value)}
                    inputProps={{ maxLength: 40 }}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    label="Descrição"
                    value={product.description}
                    onChange={(event) => setProductItemValue("description", event.target.value)}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel required htmlFor="price">Preço</InputLabel>
                    <Input
                      required
                      id="price"
                      type="number"
                      value={product.price}
                      onChange={(e) => setProductItemValue("price", e.target.value)}
                      startAdornment={
                        <InputAdornment position="start">R$</InputAdornment>
                      }
                    />
                  </FormControl>
                </Grid>

                <Grid item xs={12} sm={6} className={styles.photo}>
                  <input
                    accept="image/*"
                    onChange={(event) => setProductItemValue("image", event.target.files[0])}
                    className={styles.input}
                    id="icon-button-file2"
                    type="file"
                  />

                  <label htmlFor="icon-button-file2">
                    Insira uma foto do produto
                    <IconButton
                      color="primary"
                      aria-label="upload picture"
                      component="span"
                    >
                      <PhotoCamera />
                    </IconButton>
                  </label>
                </Grid>
                <Grid container direction="row" justify="center" >
                    <Button
                      variant="outlined"
                      color="primary"
                      onClick={addNewProduct}
                      startIcon={<AddIcon />}
                    >
                      Adicionar o produto 
                    </Button>
                </Grid>

                <Grid className={styles.expansionPanel}>
                <Accordion fullWidth>
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                  >
                    <Typography className={styles.heading}>
                      Meus produtos ({productItems.length})
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <List className={styles.servicesGrid}>
                      {productItems.map((product, index) => (
                        <React.Fragment>
                          <ListItem>
                            <ListItemAvatar>
                              <Avatar>
                                <Info/>
                              </Avatar>
                            </ListItemAvatar>
                            <Grid className={styles.listItemText}>
                              <ListItemText
                                primary={product.name + " - R$" + product.price}
                                secondary={product.description}
                              />
                            </Grid>
                            

                            <Grid container direction="row" justify="flex-end" alignItems="flex-end" >
                              <IconButton onClick={() => removeProduct(index)}>
                                <DeleteForeverIcon className={styles.deleteButton}/>
                              </IconButton>
                            </Grid>
                          </ListItem>
                          <Divider />
                        </React.Fragment>
                      ))}
                    </List>
                  </AccordionDetails>
                </Accordion>
              </Grid>

                </React.Fragment>
              ) :
              (
                null
              )
            }
            
          </React.Fragment>
        ) : null}
      </Grid>
  );
}

const useStyles = makeStyles((theme) => ({
  scheduleHeader: {
    display: "flex",
    justifyContent: "space-between",
  },
  scheduleBody: {
    display: "flex",
    justifyContent: "space-between",
  },
  input: {
    display: "none",
  },
  productHeader: {
    display: "flex",
    justifyContent: "space-between",
  },
  expansionPanel: {
    marginTop: theme.spacing(4),
    width: '100%'
  },
  deleteButton: {
    color: '#f50057'
  },
  servicesGrid: {
    width: '100%',
    justifyContent: "space-between"
  },
  listItemText: {
    width: '100%'
  }
  
}));
