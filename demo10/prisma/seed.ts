import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {

    await prisma.blogiteksti.createMany({
        data : [
            {otsikko : "Eka otsikko", sisalto : "Sisältöä..."},
            {otsikko : "Toinen otsikko", sisalto : "Toimiiko??"}
        ]
    });

}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
