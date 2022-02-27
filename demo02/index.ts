import express from 'express';
import path from 'path';
import kayttajat, {Kayttaja} from './models/kayttajat';

const app : express.Application = express();

const portti : number = Number(process.env.PORT) || 3002;

interface Kayttajatieto {
    id : number,
    nimi : string,
    sahkoposti : string,
    kayttajatunnus : string,
    rekisteroitymisPvm : string
 }

 interface Yhteystieto {
    id : number,
    nimi : string,
    sahkoposti : string
 }


app.use(express.static(path.resolve(__dirname, "public")));

app.get("/yhteystiedot/:id", (req: express.Request, res : express.Response) : void => {

    let yhteystieto : Yhteystieto | undefined = kayttajat.map((kayttaja : Kayttaja) => {
        return {
            id : kayttaja.id,
            nimi : `${kayttaja.etunimi} ${kayttaja.sukunimi}`,
            sahkoposti : kayttaja.sahkoposti
        }
    }).find((yhteystieto : Yhteystieto) => yhteystieto.id === Number(req.params.id));

    if (yhteystieto) {
        res.json(yhteystieto);
    } else {
        res.json({virhe : `Käyttäjää id : ${req.params.id} ei löytynyt`});
    }
    

});

app.get("/yhteystiedot", (req: express.Request, res : express.Response) : void => {

    let yhteystiedot : Yhteystieto[] = kayttajat.map((kayttaja : Kayttaja) => {
        return {
            id : kayttaja.id,
            nimi : `${kayttaja.etunimi} ${kayttaja.sukunimi}`,
            sahkoposti : kayttaja.sahkoposti
        }
    });

    res.json(yhteystiedot);

});

app.get("/kayttajatiedot", (req: express.Request, res : express.Response) : void => {

    let kayttajatiedot : Kayttajatieto[] = kayttajat.map((kayttaja : Kayttaja) => {
        return {
            id : kayttaja.id,
            nimi : `${kayttaja.etunimi} ${kayttaja.sukunimi}`,
            sahkoposti : kayttaja.sahkoposti,
            kayttajatunnus : kayttaja.kayttajatunnus,
            rekisteroitymisPvm : kayttaja.rekisteroitymisPvm    
        }
    });

    if (typeof req.query.vuosi === "string") {

        kayttajatiedot = kayttajatiedot.filter((kayttajatieto : Kayttajatieto) => kayttajatieto.rekisteroitymisPvm.substring(0, 4) === req.query.vuosi);

    }

    res.json(kayttajatiedot);

});

app.listen(portti, () => {

    console.log(`Palvelin käynnistyi porttiin : ${portti}`);    

});