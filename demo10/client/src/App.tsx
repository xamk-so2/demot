import React, { useEffect, useState } from 'react';
import { Alert, Backdrop, Button, CircularProgress, Container, Paper, Stack, Typography} from '@mui/material';
import { format, parseJSON } from 'date-fns';
import Muokkaus from './components/Muokkaus';

interface Blogiteksti {
  id : number
  otsikko : string
  sisalto : string
  createdAt : string
  updatedAt : string
}

interface ApiData {
  blogitekstit : Blogiteksti[]
  virhe : string
  haettu : boolean
}

interface fetchAsetukset {
  method : string
  headers? : any
  body? : string
}

const App : React.FC = () : React.ReactElement => {

  const [dialogiAuki, setDialogiAuki] = useState<boolean>(false);

  const [apiData, setApiData] = useState<ApiData>({
                                                    blogitekstit : [],
                                                    virhe : "",
                                                    haettu : false
                                                  });

  const lisaa = (e: React.FormEvent) => {

    e.preventDefault();

  }

  const apiKutsu = async (metodi? : string, blogiteksti? : Blogiteksti) : Promise<void> => {

    setApiData({
      ...apiData,
      haettu : false
    });

    let url = `/api/blogitekstit`;

    let asetukset : fetchAsetukset = { 
      method : metodi || "GET"
    };

    if (metodi === "POST") {

      asetukset = {
        ...asetukset,
        headers : {
          ...asetukset.headers,
          'Content-Type' : 'application/json'
        },
        body : JSON.stringify(blogiteksti)
      }

    }
    
    try {

      const yhteys = await fetch(url, asetukset);

      if (yhteys.status === 200) {

        setApiData({
          ...apiData,
          blogitekstit : await yhteys.json(),
          haettu : true
        });

      } else {

        let virheteksti :string = "";

        switch (yhteys.status) {

          case 400 : virheteksti = "Virhe pyynnön tiedoissa"; break;
          default : virheteksti = "Palvelimella tapahtui odottamaton virhe"; break;

        }

        setApiData({
          ...apiData,
          virhe : virheteksti,
          haettu : true
        });

      }

    } catch (e : any) {

      setApiData({
        ...apiData,
        virhe : "Palvelimeen ei saada yhteyttä",
        haettu : true
      });

    }

  }

  useEffect(() => {
    apiKutsu();
  }, []);

  return (
      <Container>

        <Typography variant="h5" sx={{marginBottom: 3}}>Demo 10: MySQL-tietokantapalvelin (2)</Typography>
        
        <Typography variant="h6" sx={{marginBottom: 1}}>"Blogi"</Typography>

        <Button 
          onClick={() => { setDialogiAuki(true) }}
          sx={{marginBottom: 2}}>
          Lisää uusi kirjoitus blogiin
        </Button>

        {(Boolean(apiData.virhe))
          ? <Alert severity="error">{apiData.virhe}</Alert>
          : (apiData.haettu) 
            ? <Stack spacing={3}>

                  {apiData.blogitekstit.map((blogiteksti : Blogiteksti, idx : number) => {
                    return <Paper key={idx} sx={{padding : 2}}>

                            <Typography variant="h5">{blogiteksti.otsikko}</Typography>

                            <Typography variant="body2">Julkaistu {format(parseJSON(blogiteksti.createdAt), "dd.MM.yyyy h.mm")}</Typography>

                            <Typography variant="body1" sx={{marginTop : 2}}>
                              <span dangerouslySetInnerHTML={ {__html : blogiteksti.sisalto} }/>
                            </Typography>

                          </Paper>                    
                  })}
                
              </Stack>              
            : <Backdrop open={true}>
                <CircularProgress color='inherit'/>
              </Backdrop>
        }

      <Muokkaus dialogiAuki={dialogiAuki} setDialogiAuki={setDialogiAuki} apiKutsu={apiKutsu}/>

    </Container>
  );
}

export default App;
