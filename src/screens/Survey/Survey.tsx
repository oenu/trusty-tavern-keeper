import { PrismaClient } from '@prisma/client';
import React from 'react';
import { useParams } from 'react-router-dom';

function Survey() {
  // Prisma client
  const prisma = new PrismaClient();

  // Get the id from the url
  const { id } = useParams<{ id: string }>();

  // Get the phobia data - all the phobias
  const survey = prisma.phobiaList.findMany();

  return <div>Survey id: {id}</div>;
}

export default Survey;
