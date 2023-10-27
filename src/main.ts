import 'module-alias/register';
import * as express from 'express';
import { chatRouter, userRouter } from '@framework/web/routes';
import dependency from '@configuration/projectDependencies';
import * as swaggerUi from 'swagger-ui-express';
import * as swaggerDocument from './swagger.ts';

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
  swaggerUi.setup(swaggerDocument)
);
