import { createServer } from 'https';
import next from 'next';
import express from 'express';
import { readFileSync } from 'fs';
import dotenv  from 'dotenv';
import { agendarLimpieza } from './services/archivos/limpieza.mjs';

dotenv.config();
const hostname = 'http://localhost';
const port = 3006;
const dev = false;
const app = next({ dev })
const handle = app.getRequestHandler()

agendarLimpieza();

const httpsOptions = {
  key: readFileSync(process.env.PRIVATE_KEY, 'utf8'),
  cert: readFileSync(process.env.CERTIFICATE, 'utf8')
};

app.prepare().then(() => {
  const server = express();

  server.all('*', (req, res) => {
    return handle(req, res);
  });

  createServer(httpsOptions, server).listen(port, (err) => {
    if (err) throw err;
    console.log(` Ready on ${hostname}:${port}`);
  });
});