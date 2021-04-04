import express from 'express';
import { Command, createCommand, psCommand } from './modules/command';
import { rmCommand } from './modules/command/rm';
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

  let result = {
    errors: [] as string[],
    data: null as unknown
  };

  try {
    switch (command) {
      case Command.ProcessStatus:
        result.data = await psCommand(context, args, payload);
        break;
        case Command.Create:
          result.data = await createCommand(context, args, payload);
        break;
        case Command.Remove:
          result.data = await rmCommand(context, args, payload);
          break;
      default:
        logError(`[cloudev] unknown command ${command}`)
    }
  }
  catch (e) {
    result.errors.push(e.toString());
  }

  res.json(result);
});

// ----------------------------------------------------------------------------
// Entrypoint
// ----------------------------------------------------------------------------
app.listen(port, () => console.log(`Agent listening on port ${port}`));