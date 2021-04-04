import express from 'express';
import { Command, createCommand, psCommand } from './modules/command';
import { logError } from './modules/core';

const app = express();
const port = 2020;

// ----------------------------------------------------------------------------
// Middleware
// ----------------------------------------------------------------------------
app.use(express.json({}));

// ----------------------------------------------------------------------------
// Routes
// ----------------------------------------------------------------------------
app.post('/', async (req, res) => {
  const { command, args = {}, payload = {} } = req.body;
  const context = {
    username: 'cclarke',
    config: require('../assets/config.json')
  };

  let result: {};
  
  switch (command) {
    case Command.PS:
      result = await psCommand(context, args, payload);
      break;
    case Command.Create:
      result = await createCommand(context, args, payload);
      break;
    default:
      logError(`[cloudev] unknown command ${command}`)
  }

  res.json(result);
});

// ----------------------------------------------------------------------------
// Entrypoint
// ----------------------------------------------------------------------------
app.listen(port, () => console.log(`Agent listening on port ${port}`));