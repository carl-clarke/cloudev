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
cloudev/0.1.6 linux-x64 node-v14.16.1
$ cloudev --help [COMMAND]
USAGE
  $ cloudev COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`cloudev backup [NAME] [DESCRIPTION]`](#cloudev-backup-name-description)
* [`cloudev clone [NAME]`](#cloudev-clone-name)
* [`cloudev create [NAME]`](#cloudev-create-name)
* [`cloudev help [COMMAND]`](#cloudev-help-command)
* [`cloudev list`](#cloudev-list)
* [`cloudev login`](#cloudev-login)
* [`cloudev logout [NAME]`](#cloudev-logout-name)
* [`cloudev remove [NAME]`](#cloudev-remove-name)
* [`cloudev restore [NAME]`](#cloudev-restore-name)
* [`cloudev share [NAME] [RECIPIENT]`](#cloudev-share-name-recipient)
* [`cloudev start [NAME]`](#cloudev-start-name)
* [`cloudev stop [NAME]`](#cloudev-stop-name)

## `cloudev backup [NAME] [DESCRIPTION]`

[Coming Soon] Save snapshot your workspace which can be restored later.

```
USAGE
  $ cloudev backup [NAME] [DESCRIPTION]

OPTIONS
  -h, --help  show CLI help

EXAMPLE
  $ cloudev backup <name> <description>
```

_See code: [src/commands/backup.ts](https://github.com/carl-clarke/cloudev/blob/v0.1.6/src/commands/backup.ts)_

## `cloudev clone [NAME]`

[Coming Soon] Create a duplicate of your workspace.

```
USAGE
  $ cloudev clone [NAME]

OPTIONS
  -h, --help  show CLI help

EXAMPLE
  $ cloudev clone <name>
```

_See code: [src/commands/clone.ts](https://github.com/carl-clarke/cloudev/blob/v0.1.6/src/commands/clone.ts)_

## `cloudev create [NAME]`

Create a new DEV workspace.

```
USAGE
  $ cloudev create [NAME]

OPTIONS
  -h, --help  show CLI help

EXAMPLE
  $ cloudev stop <name>
```

_See code: [src/commands/create.ts](https://github.com/carl-clarke/cloudev/blob/v0.1.6/src/commands/create.ts)_

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

## `cloudev list`

List all your DEV workspaces

```
USAGE
  $ cloudev list

OPTIONS
  -h, --help  show CLI help

ALIASES
  $ cloudev ls
```

_See code: [src/commands/list.ts](https://github.com/carl-clarke/cloudev/blob/v0.1.6/src/commands/list.ts)_

## `cloudev login`

Login to the DEV server.

```
USAGE
  $ cloudev login

OPTIONS
  -h, --help  show CLI help

EXAMPLE
  $ cloudev login
```

_See code: [src/commands/login.ts](https://github.com/carl-clarke/cloudev/blob/v0.1.6/src/commands/login.ts)_

## `cloudev logout [NAME]`

Start a previously stopped workspace.

```
USAGE
  $ cloudev logout [NAME]

OPTIONS
  -h, --help  show CLI help

EXAMPLE
  $ cloudev logout
```

_See code: [src/commands/logout.ts](https://github.com/carl-clarke/cloudev/blob/v0.1.6/src/commands/logout.ts)_

## `cloudev remove [NAME]`

Permanently delete a workspace. All apps and data - except those stored in your cloud-drive - will be removed.

```
USAGE
  $ cloudev remove [NAME]

OPTIONS
  -h, --help  show CLI help

ALIASES
  $ cloudev rm

EXAMPLE
  $ cloudev remove <name>
```

_See code: [src/commands/remove.ts](https://github.com/carl-clarke/cloudev/blob/v0.1.6/src/commands/remove.ts)_

## `cloudev restore [NAME]`

[Coming Soon] Restore your workspace to a prior point in time from snapshot.

```
USAGE
  $ cloudev restore [NAME]

OPTIONS
  -h, --help  show CLI help

EXAMPLE
  $ cloudev restore <name>
```

_See code: [src/commands/restore.ts](https://github.com/carl-clarke/cloudev/blob/v0.1.6/src/commands/restore.ts)_

## `cloudev share [NAME] [RECIPIENT]`

[Coming Soon] Share a copy of your workspace with someone else.

```
USAGE
  $ cloudev share [NAME] [RECIPIENT]

OPTIONS
  -h, --help  show CLI help

EXAMPLE
  $ cloudev share <name> <recipient>
```

_See code: [src/commands/share.ts](https://github.com/carl-clarke/cloudev/blob/v0.1.6/src/commands/share.ts)_

## `cloudev start [NAME]`

Start a previously stopped workspace.

```
USAGE
  $ cloudev start [NAME]

OPTIONS
  -h, --help  show CLI help

EXAMPLE
  $ cloudev start <name>
```

_See code: [src/commands/start.ts](https://github.com/carl-clarke/cloudev/blob/v0.1.6/src/commands/start.ts)_

## `cloudev stop [NAME]`

Stop an active workspace. Can be restarted later to pickup where you left off.

```
USAGE
  $ cloudev stop [NAME]

OPTIONS
  -h, --help  show CLI help

EXAMPLE
  $ cloudev stop <name>
```

_See code: [src/commands/stop.ts](https://github.com/carl-clarke/cloudev/blob/v0.1.6/src/commands/stop.ts)_
<!-- commandsstop -->
