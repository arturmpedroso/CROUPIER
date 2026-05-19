import { defineConfig } from '@prisma/config';
import * as dotenv from 'dotenv';

// Força o Node a ler o arquivo .env da raiz do projeto
dotenv.config();

export default defineConfig({
  schema: './prisma/schema.prisma',
  datasource: {
    url: process.env.DATABASE_URL,
  },
});