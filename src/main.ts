import 'module-alias/register';
import * as express from 'express';
import { chatRouter, userRouter } from '@framework/web/routes';
import dependency from '@configuration/projectDependencies';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from "swagger-jsdoc";

const options = {
  openapi: "3.0.0",
  info: {
      title: "Seoptimus test app",
      version: "0.1.0",
      description: "API тестового приложения для Seoptimus",
  },
  servers: [
      {
          "url": "/",
          "description": "Local Dev"
      },
  ],
  apis: ["./src/routes/*.ts"],
}

const specs = swaggerJsdoc(options);

const PORT = 3000;
const HOST = '0.0.0.0';
const app: express.Express = express();

app.listen(PORT, HOST, () => {
  console.log(`Running on http://${HOST}:${PORT}`);
});

app.use('/api/users/', userRouter(dependency));
app.use('/api/chats/', chatRouter(dependency));

app.use(
  "/api/docs",
  swaggerUi.serve,
  swaggerUi.setup(specs)
);
