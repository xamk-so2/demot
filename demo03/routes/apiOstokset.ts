import express from 'express';
import Ostoslista, { Ostos } from '../models/ostoslista';

const ostoslista : Ostoslista = new Ostoslista();

const apiOstoksetRouter : express.Router = express.Router();

apiOstoksetRouter.use(express.json());

apiOstoksetRouter.delete("/:id", async (req : express.Request, res : express.Response) => {

    await ostoslista.poista(Number(req.params.id));

    res.json(ostoslista.haeKaikki());

});


apiOstoksetRouter.put("/:id", async (req : express.Request, res : express.Response) => {

    let muokattuOstos : Ostos = {
        id : req.body.id,
        tuote : req.body.tuote,
        poimittu : req.body.poimittu
    }

    await ostoslista.muokkaa(muokattuOstos, Number(req.params.id));

    res.json(ostoslista.haeKaikki());

});

apiOstoksetRouter.post("/", async (req : express.Request, res : express.Response) => {

    let uusiOstos : Ostos = {
                        id : 0,
                        tuote : req.body.tuote,
                        poimittu : req.body.poimittu
                    }

    await ostoslista.lisaa(uusiOstos);

    res.json(ostoslista.haeKaikki());

});

apiOstoksetRouter.get("/:id", (req : express.Request, res : express.Response) => {

    res.json(ostoslista.haeYksi(Number(req.params.id)));

});

apiOstoksetRouter.get("/", (req : express.Request, res : express.Response) => {

    res.json(ostoslista.haeKaikki());

});

export default apiOstoksetRouter;