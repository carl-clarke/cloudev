import express from 'express';
import { Command, createCommand, psCommand, startCommand, stopCommand } from './modules/command';
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
    data: null as unknown,
    success: true
  };

  try {
    switch (command) {
      case Command.List:
        result.data = await psCommand(context, args, payload);
        break;
      case Command.Create:
        result.data = await createCommand(context, args, payload);
        break;
      case Command.Remove:
        await rmCommand(context, args, payload);
        break;
      case Command.Start:
        await startCommand(context, args, payload);
        break;
      case Command.Stop:
        await stopCommand(context, args, payload);
        break;
      default:
        logError(`[cloudev] unknown command ${command}`)
    }
  }
  catch (e) {
    result.success = false;
    result.errors.push(e.toString());
  }

  res.json(result);
});

// ----------------------------------------------------------------------------
// Entrypoint
// ----------------------------------------------------------------------------
app.listen(port, () => console.log(`Agent listening on port ${port}`));