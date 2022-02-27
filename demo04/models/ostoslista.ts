import {readFile, writeFile} from 'fs/promises';
import path from 'path';

export interface Ostos {
    id : number,
    tuote : string,
    poimittu : boolean
}

class Ostoslista {

    private ostokset : Ostos[] = [];
    private tiedosto : string[] = [__dirname, "ostokset.json"];

    constructor() {

        readFile(path.resolve(...this.tiedosto), "utf8")
            .then((data : string) => {
                this.ostokset = JSON.parse(data);
            })
            .catch((e : any) => {
                throw new Error(e);
            });

    }

    public haeKaikki = () : Ostos[] => {

        try {
           return this.ostokset;
        } catch (e : any) {
            throw new Error(e);
        }         

    }

    public haeYksi = (id : number) : Ostos | undefined => {

        try {
            return this.ostokset.find((ostos : Ostos) => ostos.id === id);
        } catch (e : any) {
            throw new Error(e);
        }         

    }

    public lisaa = async (uusiOstos : Ostos) : Promise<void> => {

        try {

            this.ostokset = [
                ...this.ostokset,
                {
                    id : this.ostokset.sort((a : Ostos,b : Ostos) => a.id - b.id)[this.ostokset.length - 1].id + 1,
                    tuote : uusiOstos.tuote,
                    poimittu : uusiOstos.poimittu
                }                
            ];

            await this.tallenna();

        } catch (e : any) {
            throw new Error(e);
        }         

    }

    public muokkaa = async (muokattuOstos : Ostos, id : number) : Promise<void> => {

        try {
            
            this.ostokset = this.ostokset.filter((ostos : Ostos) => ostos.id !== id);

            this.ostokset = [
                ...this.ostokset,
                {
                    id : id,
                    tuote : muokattuOstos.tuote,
                    poimittu : muokattuOstos.poimittu
                }    
            ].sort((a : Ostos, b : Ostos) => a.id - b.id);

            await this.tallenna();

        } catch (e : any) {
            throw new Error(e);
        }         

    }

    public poista = async (id : number) : Promise<void> => {

        try {
            
            this.ostokset = this.ostokset.filter((ostos : Ostos) => ostos.id !== id);

            await this.tallenna();

        } catch (e : any) {
            throw new Error(e);
        }         

    }

    private tallenna = async () : Promise<void> => {

        try {
            await writeFile(path.resolve(...this.tiedosto), JSON.stringify(this.ostokset, null, 2), "utf8");
        } catch (e : any) {
            throw new Error();
        }
    }

}

export default Ostoslista;