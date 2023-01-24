-- CreateTable
CREATE TABLE "PhobiaList" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "PhobiaList_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TopicList" (
    "id" SERIAL NOT NULL,
    "label" TEXT NOT NULL,
    "question" TEXT NOT NULL,
    "options" TEXT[],

    CONSTRAINT "TopicList_pkey" PRIMARY KEY ("id")
);
