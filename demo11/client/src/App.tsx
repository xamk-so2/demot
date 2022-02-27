import React, { useRef, useState } from 'react';
import {Alert, Button, Container, FormControl, List, ListItem, ListItemText, FormLabel, FormControlLabel, RadioGroup, Grid, Radio, Typography, Paper, Stack, TextField} from '@mui/material'; 

interface Asiakas {
  id : number
  sukunimi : string
  etunimi : string
  sukupuoli : string
  kaupunki : string
  maa : string
  sahkoposti : string
  ip_osoite : string
  luottokorttityyppi : string
  luottokortin_numero : string
  kayttajatunnus : string
  salasana : string
}

const App : React.FC = () : React.ReactElement => {

  const lomakeRef = useRef<any>();
  const [asiakkaat, setAsiakkaat] = useState<any[]>([]);
  const [virhe, setVirhe] = useState<string>("");

  const kaynnistaHaku = async (e : React.FormEvent) : Promise<void> => {

    e.preventDefault();


    try {

        let url : string = `/api/asiakkaat?hakusana=${lomakeRef.current.hakusana.value}&sukupuoli=${lomakeRef.current.sukupuoli.value}`;

        const yhteys = await fetch(url);
 
        
        if (yhteys.ok) {

          setAsiakkaat(await yhteys.json());

        } else {

          switch (yhteys.status) {

            case 400 : setVirhe("Virheellinen hakusana"); break;
            default : setVirhe("Palvelimella tapahtui odottamaton virhe"); break;
  
          }

        }

        

    } catch (e: any) {

      setVirhe("Palvelimelle ei saada yhteyttä.")

    } 

  }


  return (
    <Container>

      <Typography variant="h5" sx={{marginBottom: 2}}>Demo 11: SQL-kyselyt</Typography>
      
      <Typography variant="h6" sx={{marginBottom: 2}}>Asiakashaku</Typography>

      <Paper 
        component="form"
        onSubmit={kaynnistaHaku}
        ref={lomakeRef}
        elevation={2}
        sx={{ padding : 2 , marginBottom: 2}}
      >
        <Stack spacing={2}>

          <Grid container spacing={1}>

            <Grid item xs={10}>

              <TextField 
                name="hakusana"
                variant="outlined"
                size="small"
                fullWidth={true}
                placeholder="Hae asiakkaan nimellä..."
              />

            </Grid>
            <Grid item xs={2}>

              <Button
                type="submit"
                variant="contained"
                size="large"
                fullWidth={true}
              >Hae</Button>

            </Grid>
          </Grid>

          <FormControl>
            <FormLabel>Sukupuoli</FormLabel>
            <RadioGroup
              row
              name="sukupuoli"
            >
              <FormControlLabel value="nainen" control={<Radio />} label="Nainen" />
              <FormControlLabel value="mies" control={<Radio />} label="Mies" />
              <FormControlLabel value="" control={<Radio />} label="Ei merkitystä" />
            </RadioGroup>
          </FormControl>

        </Stack>

      </Paper>

      {(Boolean(virhe)) 
        ? <Alert severity="error">{virhe}</Alert>
        : <List>{asiakkaat.map((asiakas : Asiakas, idx : number) => {
          return <ListItem key={idx}>
                    <ListItemText 
                      primary={`${asiakas.etunimi} ${asiakas.sukunimi}`}
                      secondary={`${asiakas.kaupunki}, ${asiakas.maa} ${asiakas.sahkoposti}`}  
                    />
                  </ListItem>
        })}</List>
      }

    </Container>
  );
}

export default App;
