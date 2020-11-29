import React from 'react'

import { Container, Typography, Grid, Card, CardHeader, CardContent } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'

import undrawSearch from '../../assets/undraw_the_search_s0xf.svg'
import undrawReviews from '../../assets/undraw_reviews_lp8w.svg'
import undrawCreate from '../../assets/undraw_publish_post_vowb.svg'

export default function Tips() {
  const styles = useStyles();

  const helpers = [
    {
      title: 'Procure serviços',
      subDescription: ['Faça uma busca', 'Compare os serviços', 'Escolha o que desejar'],
      image: `${undrawSearch}`
    },
    {
      title: 'Crie serviços',
      subDescription: ['Preencha os dados', 'Publique seu serviço', 'Receba feedback dos usuários'],
      image: `${undrawCreate}`
    },
    {
      title: 'Avalie serviços',
      subDescription: ['Escolha um serviço', 'Preencha o formulário', 'Confirme sua avaliação'],
      image: `${undrawReviews}`
    },
  ];

  return (
    <React.Fragment>
      <Container maxWidth="sm" component="main" className={styles.container}>
        <Typography className={styles.mainTitle} component="h2" variant="h3" align="center" color="textPrimary" gutterBottom>
          Como funciona?
                </Typography>
        <Typography variant="h5" align="center" color="textSecondary" component="p">
        Ktalog é um app de buscas de serviços e estabelecimentos em cidades pequenas e do interior, conectando quem procura por informações à quem as disponibiliza, além de permitir a avaliação dos serviços.
                </Typography>
      </Container>
      <Container className={styles.instructions} maxWidth="md" component="main">
        <Grid container spacing={2} alignItems="flex-end">
          {helpers.map(helper => (
            <Grid item xs={12} md={4}>
              <Card>
                <CardHeader
                  title={helper.title}
                  titleTypographyProps={{ align: 'center' }}
                  subheaderTypographyProps={{ align: 'center' }}
                  className={styles.cardHeader}
                />
                <CardContent>
                  <ul>
                    {helper.subDescription.map(line => (
                      <Typography component="li" color="textSecondary" variant="subtitle1" align="center" key={line}>
                        {line}
                      </Typography>
                    ))}
                  </ul>
                  <Grid align="center" className={styles.image}>
                    <img src={helper.image} alt="Imagem" height="150rem" />
                  </Grid>
                </CardContent>

              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </React.Fragment>
  )
}

const useStyles = makeStyles(theme => ({
  '@global': {
    ul: {
      margin: 0,
      padding: 0,
      listStyle: 'none',
    },
  },
  mainTitle: {
    fontWeight: 'bold'
  },
  container: {
    padding: theme.spacing(6, 0, 6),
    backgroundColor: '#e4fdff'
  },
  image: {
    marginTop: theme.spacing(3)
  },
  instructions: {
    paddingBottom: theme.spacing(5),
    backgroundColor: '#e4fdff'
  },
  cardContent: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'baseline',
    marginBottom: theme.spacing(2)
  },
  cardHeader: {
    backgroundColor: theme.palette.grey[200],
  },
}))