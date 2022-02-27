import express from 'express';
import { Virhe } from '../errors/virhekasittelija';
import { PrismaClient } from '@prisma/client';

const prisma : PrismaClient = new PrismaClient();

const apiOstoksetRouter : express.Router = express.Router();

apiOstoksetRouter.use(express.json());

apiOstoksetRouter.delete("/:id", async (req : express.Request, res : express.Response, next : express.NextFunction) => {

     if (await prisma.ostos.count({
           where : {
                id : Number(req.params.id)
            }
        }))  {
        try {

            await prisma.ostos.delete({
                where : {
                    id : Number(req.params.id)
                }
            });

            res.json(await prisma.ostos.findMany());

        } catch (e : any) {
            next(new Virhe())
        }
    } else {
        next(new Virhe(400, "Virheellinen id"));
    }

});


apiOstoksetRouter.put("/:id", async (req : express.Request, res : express.Response, next : express.NextFunction) => {

    if (await prisma.ostos.count({
        where : {
            id : Number(req.params.id)
        }
        })) {
        if (req.body.tuote?.length > 0 && (req.body.poimittu === true || req.body.poimittu === false)) {

            try {

                await prisma.ostos.update({
                    where : {
                        id : Number(req.params.id)
                    },
                    data : {
                        tuote : req.body.tuote,
                        poimittu : req.body.poimittu
                    }
                });
        
                res.json(await prisma.ostos.findMany());
        
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
 
      if (req.body.tuote?.length > 0) {

        try {

            await prisma.ostos.create({
                data : {
                    tuote : req.body.tuote,
                    poimittu : Boolean(req.body.poimittu)
                }
            });
    
            res.json(await prisma.ostos.findMany());
    
        } catch (e : any) {
            next(new Virhe())
        }

    } else {
        next(new Virhe(400, "Virheellinen pyynnön body"));
    } 

});

apiOstoksetRouter.get("/:id", async (req : express.Request, res : express.Response, next : express.NextFunction) => {

     try {

        if (await prisma.ostos.count({
            where : {
                id : Number(req.params.id)
            }
        }) === 1) {
            res.json(await prisma.ostos.findUnique({
                where : {
                    id : Number(req.params.id)
                }
            }))
        } else {
            next(new Virhe(400, "Virheelinen id"));
        }
        
    } catch (e: any) {
        next(new Virhe());
    }
    

});

apiOstoksetRouter.get("/", async (req : express.Request, res : express.Response, next : express.NextFunction) => {

    try {
        res.json(await prisma.ostos.findMany());
    } catch (e : any) {
        next(new Virhe());
    }

});

export default apiOstoksetRouter;