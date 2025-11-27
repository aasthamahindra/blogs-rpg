import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@as-integrations/express4';
import { createServer } from 'http';
import { WebSocketServer } from 'ws';
import { useServer } from 'graphql-ws/lib/use/ws';
import jwt from 'jsonwebtoken';
import { schema } from './schema.js';

dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET;

const app = express();
app.use(cors());
app.use(express.json());

const apolloServer = new ApolloServer({ schema });
await apolloServer.start();

app.use(
  '/graphql',
  expressMiddleware(apolloServer, {
    context: async ({ req }) => {
      const authHeader = req.headers.authorization || '';
      const token = authHeader.replace('Bearer ', '');
      if (!token) return {};

      try {
        const decoded = jwt.verify(token, JWT_SECRET);
        return { user: { id: decoded.userId } };
      } catch {
        return {};
      }
    },
  })
);

const httpServer = createServer(app);

const wsServer = new WebSocketServer({
  server: httpServer,
  path: '/graphql',
});

// attach subscription server
useServer(
  {
    schema,
    context: async (ctx) => {
      const auth = ctx.connectionParams?.Authorization;

      if (!auth) return {};

      try {
        const token = auth.replace('Bearer ', '');
        const decoded = jwt.verify(token, JWT_SECRET);
        return { user: { id: decoded.userId } };
      } catch {
        return {};
      }
    },
  },
  wsServer
);

httpServer.listen(4000, () => {
  console.log('Server ready at http://localhost:4000/graphql');
  console.log('Subscriptions ready at ws://localhost:4000/graphql');
});
