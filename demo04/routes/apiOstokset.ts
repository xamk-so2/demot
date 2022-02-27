import express from 'express';
import { Virhe } from '../errors/virhekasittelija';
import Ostoslista, { Ostos } from '../models/ostoslista';

const ostoslista : Ostoslista = new Ostoslista();

const apiOstoksetRouter : express.Router = express.Router();

apiOstoksetRouter.use(express.json());

apiOstoksetRouter.delete("/:id", async (req : express.Request, res : express.Response, next : express.NextFunction) => {

    if (ostoslista.haeYksi(Number(req.params.id))) {
        try {

            await ostoslista.poista(Number(req.params.id));

            res.json(ostoslista.haeKaikki());

        } catch (e : any) {
            next(new Virhe())
        }
    } else {
        next(new Virhe(400, "Virheellinen id"));
    }

});


apiOstoksetRouter.put("/:id", async (req : express.Request, res : express.Response, next : express.NextFunction) => {

    let muokattuOstos : Ostos = {
        id : req.body.id,
        tuote : req.body.tuote,
        poimittu : req.body.poimittu
    }

    if (ostoslista.haeYksi(Number(req.params.id))) {
        if (req.body.tuote?.length > 0 && (req.body.poimittu === true || req.body.poimittu === false)) {

            try {

                await ostoslista.muokkaa(muokattuOstos, Number(req.params.id));
        
                res.json(ostoslista.haeKaikki());
        
            } catch (e : any) {
                next(new Virhe())
            }

        } else {
            next(new Virhe(400, "Virheellinen pyynnön body"));
        }
    } else {
        next(new Virhe(400, "Virheellinen id"));
    }

});

apiOstoksetRouter.post("/", async (req : express.Request, res : express.Response, next : express.NextFunction) => {

    let uusiOstos : Ostos = {
                        id : 0,
                        tuote : req.body.tuote,
                        poimittu : Boolean(req.body.poimittu)
                    }

    if (req.body.tuote?.length > 0) {

        try {

            await ostoslista.lisaa(uusiOstos);
    
            res.json(ostoslista.haeKaikki());
    
        } catch (e : any) {
            next(new Virhe())
        }

    } else {
        next(new Virhe(400, "Virheellinen pyynnön body"));
    }

});

apiOstoksetRouter.get("/:id", (req : express.Request, res : express.Response, next : express.NextFunction) => {

    try {

        if (ostoslista.haeYksi(Number(req.params.id))) {
            res.json(ostoslista.haeYksi(Number(req.params.id)));
        } else {
            next(new Virhe(400, "Virheelinen id"));
        }
        
    } catch (e: any) {
        next(new Virhe());
    }
    

});

apiOstoksetRouter.get("/", (req : express.Request, res : express.Response, next : express.NextFunction) => {

    try {
        res.json(ostoslista.haeKaikki());
    } catch (e : any) {
        next(new Virhe());
    }

    

});

export default apiOstoksetRouter;