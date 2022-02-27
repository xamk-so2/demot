import express from "express";
import { PrismaClient } from "@prisma/client";
import { Virhe } from "../errors/virhekasittelija";
import sanitizeHtml from "sanitize-html";

const prisma : PrismaClient = new PrismaClient();

const apiBlogitekstitRouter : express.Router = express.Router();

apiBlogitekstitRouter.use(express.json());

apiBlogitekstitRouter.post("/", async (req : express.Request, res : express.Response, next : express.NextFunction) => {
    
    try {

        await prisma.blogiteksti.create({
            data : {
                otsikko : req.body.otsikko,
                sisalto : sanitizeHtml(req.body.sisalto)
            }
        });

        res.json(await prisma.blogiteksti.findMany());

    } catch (e : any) {
        next(new Virhe());
    }


});

apiBlogitekstitRouter.get("/", async (req : express.Request, res : express.Response, next : express.NextFunction) => {

    try {

        res.json(await prisma.blogiteksti.findMany());

    } catch (e : any) {
        next(new Virhe());
    }

});

export default apiBlogitekstitRouter;