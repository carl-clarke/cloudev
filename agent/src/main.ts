import { psCommand } from '@/modules/commands/ps';
import express from 'express';
// import webpack from 'webpack';
// const config = require('@/../webpack.config');
// const webpackDevMiddleware = require('webpack-dev-middleware');

// const compiler = webpack(config);
const app = express();
const port = 2020;

// ----------------------------------------------------------------------------
// Middleware
// ----------------------------------------------------------------------------

// Tell express to use the webpack-dev-middleware and use the webpack.config.js
// configuration file as a base.
// app.use(
//   webpackDevMiddleware(compiler, {
//     publicPath: config.output.publicPath,
//   })
// );

app.use(express.json({}));

// ----------------------------------------------------------------------------
// Routes
// ----------------------------------------------------------------------------
app.post('/', async (req, res) => {
  const { command, args, payload } = req.body;
  const context = {
    username: 'cclarke'
  };

  let result: {};
  
  switch (command) {
    case 'ps':
      result = await psCommand(context, args, payload);
      break;
    default:
      console.error(`[Agent] unknown command ${command}`)
  }

  res.json(result);
});

// ----------------------------------------------------------------------------
// Entrypoint
// ----------------------------------------------------------------------------
app.listen(port, () => console.log(`Agent listening on port ${port}`));