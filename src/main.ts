import 'module-alias/register';
import * as express from 'express';
import { transactionRouter, userRouter } from '@framework/web/routes';
import dependency from '@configuration/projectDependencies';



const PORT = 3000;
const HOST = '0.0.0.0';
const app: express.Express = express();

app.listen(PORT, HOST, () => {
  console.log(`Running on http://${HOST}:${PORT}`);
});
app.use('/api/static', express.static(__dirname+'/../static'))
console.log(__dirname+'/../dist')
app.use('/api/users/', userRouter(dependency));
app.use('/api/transactions/', transactionRouter(dependency));



