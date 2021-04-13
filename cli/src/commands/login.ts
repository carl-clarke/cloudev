import { Command, flags } from '@oclif/command';
import chalk from 'chalk';
import cli from 'cli-ux';
import getPort from 'get-port';
import http from 'http';
import open from 'open';
import querystring from 'querystring';
import { CLIENT_ID, saveToken } from '../modules/core';

const nonce = require('nonce');

export default class Login extends Command {
  static description = 'Login to the DEV server.'

  static aliases = [];

  static examples = [
    `$ cloudev login
`,
  ];

  static flags = {
    help: flags.help({ char: 'h' }),
  }

  static args = [];

  async run() {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { args, flags } = this.parse(Login);
    const port = await getPort();
    let success = false;

    cli.action.start('Opening your browser to sign into your Microsoft account');
    await cli.wait(2000);

    try {
      await open(`https://login.microsoftonline.com/common/oauth2/authorize\
?client_id=${CLIENT_ID}\
&redirect_uri=http://localhost:${port}\
&response_type=id_token\
&scope=openid profile\
&response_mode=form_post\
&nonce=${nonce()}\
&prompt=select_account
    `);

      const { id_token: idToken } = await this.startServer(port);
      await saveToken(idToken);

      success = true;
    } catch (e) {
      console.log(e);
      cli.anykey();
    }

    cli.action.stop();

    if (success) {
      this.log(chalk.greenBright('Login was successful!'));
    } else {
      this.log(chalk.red('Login failed! Please try again.'));
    }
  }

  async startServer(port: number) {
    return new Promise<{ id_token: string }>((accept, reject) => {
      const app = http.createServer((req, res) => {
        let data = '';
        // eslint-disable-next-line no-return-assign
        req.on('data', chunk => data += chunk);
        req.on('end', () => {
          app.close();

          accept(querystring.parse(data) as { id_token: string });

          res.writeHead(200);
          res.write('<div style="font-size: 14pt">Login successful!</div><br/>Please close this tab and return to your terminal to continue.');
          res.end();
        });
        req.on('error', err => reject(err));
      });

      // Start the server on port 3000
      app.listen(port, '127.0.0.1');
    });
  }
}
