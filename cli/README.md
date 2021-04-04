cloudev
=======

Cloud DEV environments, automated!

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/cloudev.svg)](https://npmjs.org/package/cloudev)
[![CircleCI](https://circleci.com/gh/carl-clarke/cloudev/tree/master.svg?style=shield)](https://circleci.com/gh/carl-clarke/cloudev/tree/master)
[![Downloads/week](https://img.shields.io/npm/dw/cloudev.svg)](https://npmjs.org/package/cloudev)
[![License](https://img.shields.io/npm/l/cloudev.svg)](https://github.com/carl-clarke/cloudev/blob/master/package.json)

<!-- toc -->
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->
# Usage
<!-- usage -->
```sh-session
$ npm install -g cloudev
$ cloudev COMMAND
running command...
$ cloudev (-v|--version|version)
cloudev/0.0.0 linux-x64 node-v14.16.0
$ cloudev --help [COMMAND]
USAGE
  $ cloudev COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`cloudev hello [FILE]`](#cloudev-hello-file)
* [`cloudev help [COMMAND]`](#cloudev-help-command)

## `cloudev hello [FILE]`

describe the command here

```
USAGE
  $ cloudev hello [FILE]

OPTIONS
  -f, --force
  -h, --help       show CLI help
  -n, --name=name  name to print

EXAMPLE
  $ cloudev hello
  hello world from ./src/hello.ts!
```

_See code: [src/commands/hello.ts](https://github.com/carl-clarke/cloudev/blob/v0.0.0/src/commands/hello.ts)_

## `cloudev help [COMMAND]`

display help for cloudev

```
USAGE
  $ cloudev help [COMMAND]

ARGUMENTS
  COMMAND  command to show help for

OPTIONS
  --all  see all commands in CLI
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v3.2.2/src/commands/help.ts)_
<!-- commandsstop -->
