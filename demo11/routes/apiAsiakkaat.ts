import express from "express";
import { Prisma, PrismaClient } from "@prisma/client";
import { Virhe } from "../errors/virhekasittelija";

const prisma : PrismaClient = new PrismaClient();

const apiAsiakkaatRouter : express.Router = express.Router();

apiAsiakkaatRouter.get("/", async (req : express.Request, res : express.Response, next : express.NextFunction) => {

    try {

        if (typeof req.query.hakusana === "string" && String(req.query.hakusana).length > 0) {

            let hakusana : string = `%${req.query.hakusana}%`;

            let sukupuoli : string = String(req.query.sukupuoli);

            let asiakkaat = await prisma.$queryRaw`SELECT * FROM asiakas WHERE
                                                    (etunimi LIKE ${hakusana} OR
                                                    sukunimi LIKE ${hakusana})
                                                    ${ (sukupuoli !== "undefined") ? Prisma.sql`AND sukupuoli = ${sukupuoli}` : Prisma.empty}
                                                    LIMIT 10`;

            res.json(asiakkaat);

        } else {
            next(new Virhe(400))
        }

       

    } catch (e : any) {
        next(new Virhe());
    }

});

export default apiAsiakkaatRouter;