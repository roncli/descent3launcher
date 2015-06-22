# Descent 3 Launcher

A cross-platform launcher for Descent 3 dedicated servers implemented in node.js.

## Usage

This is the minimum required code to start a Descent 3 server 

```
var Launcher = require("./index"),
    server = new Launcher();

server.options.server.directory = "c:\\Games\\Descent3";
server.options.game.missionName = "indika3.mn3";

server.createServer(function(err) {
    if (err) {
        console.log("There was an error launching the server!");
        console.log(err);
    }
});
```

`server.options` has many options which will be documented in a later release.  In the meantime, you can `console.log` the variable to see all the available options that the launcher recognizes.

## History

### Version 0.1.1 - 6/22/2015

* Change `killgoal` to `killGoal`.
* Add `remoteAdmin` and `remoteAdminPass` options.
* Fix bug with `remoteConsolePort` causing an error.

### Version 0.1 - 6/13/2015

* Initial version.
