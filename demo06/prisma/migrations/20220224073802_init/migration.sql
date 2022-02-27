-- CreateTable
CREATE TABLE "Ostos" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "tuote" TEXT NOT NULL,
    "poimittu" BOOLEAN NOT NULL DEFAULT false
);
