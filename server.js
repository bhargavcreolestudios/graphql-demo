const Express = require('express');
const GraphHTTP = require('express-graphql');
const Schema = require('./schema');
const cors = require('cors')
// Config
const APP_PORT = 5000;

// Start
const app = Express();
app.use(cors());

// GraphQL
app.use('/graphql', GraphHTTP({
  schema: Schema,
  pretty: true,
  graphiql: true
}));

app.listen(APP_PORT, ()=> {
  console.log(`App listening on port ${APP_PORT}`);
});