# Descent 3 Launcher

A cross-platform launcher for Descent 3 dedicated servers implemented in node.js.

## Usage

This is the minimum required code to start a Descent 3 server:

```
var Launcher = require("descent3launcher"),
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

Here are the steps required to start a Descent 3 server:

* First, you must require the descent3launcher module.
* Next, create a new server from the Launcher object.
* Set the options that you wish for the server to launch with.
* Call the createServer method with a callback that handles errors.

## Options

The `server.options` object is divided into three categories: Server, Game, and Allowed Objects.

### Server Options

The server options are options that are applied directly to the command line upon launch.

`server.options.server.directory` - The directory that you will find the main executable for Descent 3.  A trailing slash is not required.  This is a required field.

`server.options.server.framerate` - The frame rate in frames per second that the server will run under.  Default is 250.

`server.options.server.gamespyport` - The port number that trackers will query the server on.  Default is 20143.  This needs to be a different port for each server that is launched.

`server.options.server.ip` - The IP address that the server will listen on.  Default is to listen on the default network adapter.

`server.options.server.noMultiBmp` - A boolean value that determines whether custom ship logos are allowed.  Default is false.

`server.options.server.playerMessages` - A boolean value that determines whether weapon-related HUD messages are displayed.  Default is false.  (Not sure if this has any effect on a dedicated server.)

`server.options.server.port` - The port number that the server will listen on.  Default is 2092.  This needs to be a different port for each server that is launched.

`server.options.server.trackers` - An array of tracker objects that the server will broadcast to.  See the Trackers section for information on this.  Default is to broadcast to the 5 currently active trackers with no region: tracker.kali.net:22999, tracker.descent.cx:27900, descentservers.net:27900, tsetsefly.de:27900, and gsm.qtracker.com:27900.

### Game Options

The game options control the behavior of a multiplayer game, and are applied in configuration files.

`server.options.game.accurateCollisions` - A boolean that determines whether accurate weapon collisions are required to score a hit.  Default is true.

`server.options.game.allowMouselook` - A boolean that determines whether mouselook is allowed.  Default is false.

`server.options.game.allowRemoteConsole` - A boolean that determines whether the server can be accessed via telnet.  Default is false.

`server.options.game.allowTeamChange` - A boolean that determines whether players can freely change teams.  Default is true.

`server.options.game.audioTauntDelay` - The amount of time in seconds that players must wait before playing successive audio taunts.  Default is 5.

`server.options.game.autoBalance` - A boolean that determines whether new players will be placed on teams that need more players to balance the game out.  Default is true.

`server.options.game.autoSaveDisconnect` - A boolean that determines whether a stats file is written to the `netgames` directory when the server disconnects.  Default is false.

`server.options.game.autoSaveLevel` - A boolean that determines whether a stats file is written to the `netgames` directory when the level ends.  Default is false.

`server.options.game.brightPlayers` - A boolean that determines whether to use bright player ships.  Default is false.

`server.options.game.connectionName` - The connection that players will use to connect to the server.  Default is "Direct TCP~IP".  Check the `online` folder in your Descent 3 directory for available connection types that can be used in this setting.

`server.options.game.consolePassword` - The password to connect to the remote console, if allowed.  Default is no password.  Note that you cannot connect to a remote server when `server.options.game.allowRemoteConsole` is true and `server.options.game.consolePassword` is false.

`server.options.game.gameName` - The name of the game as displayed in Descent 3 and to the trackers.  Default is "Descent 3 Dedicated Server".

`server.options.game.killGoal` - The number of points it takes to end the current level.  Default is null, which disables the kill goal.

`server.options.game.killMsgFilter` - Determines the type of kill messages to display.  Default is "full".  Valid values are "full", "simple", or "none".

`server.options.game.maxPlayers` - The number of players allowed on the server at any given time.  Default is 8.  Note that this includes the dedicated server as a player.

`server.options.game.missionName` - The name of the mission, with the file extension included.  This is a required field.  The file must exist in the `missions` folder in your Descent 3 directory.

`server.options.game.motd` - The message of the day, which is displayed to pilots upon joining the game.  Default is null.

`server.options.game.numTeams` - The number of teams to include if this is a team game.  Default is 2.

`server.options.game.peer2peer` - A boolean that determines whether to use a peer to peer architecture rather than a client/server architecture.  Default is false.

`server.options.game.permissible` - A boolean that determines whether to use a permissible client/server architecture rather than a client/server architecture.  Default is false.

`server.options.game.pps` - The maximum packets per second that the server supports.  Default is 20.  Note that most clients will only send 12.

`server.options.game.randomizeRespawn` - A boolean that determines whether to randomize powerup respawn locations.  Default is true.

`server.options.game.remoteAdmin` - A boolean that determines whether players can have access to the server.  Default is false.

`server.options.game.remoteAdminPass` - The password required to use when a player tries to access the server.  Default is null.

`server.options.game.remoteConsolePort` - The port number to connect to the remote console on.  Default is null.  Note that this can match the port number the game is played on as well.

`server.options.game.respawnTime` - The number of seconds that a powerup will respawn after being picked up.  Default is 30.

`server.options.game.scriptName` - The game type to use.  Default is "anarchy".  Check the `netgames` folder in your Descent 3 directory for available game types that can be used in this settings.  Game types use the .d3m file extension.

`server.options.game.sendRotVel` - A boolean that determines whether to send rotational velocity over the network.  Default is true.

`server.options.game.serverHudNames` - The maximum level of HUD names allowed for all players in the game.  Default is "none".  Valid values are "full", "team", or "none".

`server.options.game.setDifficulty` - The difficulty the game will be played on.  Default is 4 for insane.  Valid values are 0 to 4, or you can use one of the `Launcher.difficulties` constants.

`server.options.game.setLevel` - The level of the mission set to start on.  Default is 1.

`server.options.game.setTeamName` - An array of 4 strings that correspond to the team names that will be displayed in game.  Default values are "Red", "Blue", "Green", or "Yellow".

`server.options.game.statMsgs` - A boolean that determines whether to include random statistical messages for kills throughout the game.  Default is true.

`server.options.game.timeLimit` - The amount of time to play before the current level is ended.  Default is null, which disables the time limit.

`server.options.game.useSmoothing` - A boolean that determines whether to smooth fast-moving objects on the screen.  Default is false, since it has no effect on the server.

### Allowed Object Options

The allowed objects are divided into 5 categories: Ships, Primaries, Secondaries, Powerups, and Miscellaneous.  Each of these is an object that contains a number of keys with a value of true if the object is allowed, or false if the object is not allowed.

`server.options.allowed.ships` - These are the ships that are allowed in the game.  At least one ship must be allowed.  Here are the default options:

```
{
    blackpyro: true
    magnumaht: true
      phoenix: true
       pyrogl: true
}
```

`server.options.allowed.primaries` - These are the primary weapons that are allowed in the game.  Here are the default options, with the omega disabled by default due to a bug with energy consumption on clients that run at a higher frame rate:

```
{
     emdlauncher: true,
    fusioncannon: true,
      massdriver: true,
       microwave: true,
          napalm: true,
     omegacannon: false,
    plasmacannon: true,
      superlaser: true,
           vauss: true
}
```

`server.options.allowed.secondaries` - These are the secondary weapons that are allowed in the game.  Here are the default options:

```
{
      fourpackconc: true,
      fourpackfrag: true,
    fourpackguided: true,
    fourpackhoming: true,
        blackshark: true,
        concussion: true,
           cyclone: true,
              frag: true,
            guided: true,
            homing: true,
      impactmortar: true,
              mega: true,
      napalmrocket: true,
             smart: true
}
```

`server.options.allowed.powerups` - These are the powerups that are allowed in the game.  Here are the default options, many of which are disabled due to their extreme negative effect on latency or balance of the game:

```
{
         afterburner: true,
          betty4pack: false,
               chaff: false,
               cloak: false,
           converter: true,
              energy: true,
       gunboypowerup: false,
    headlightpowerup: false,
    invisiblepowerup: false,
     invulnerability: false,
      massdriverammo: true,
          napalmtank: true,
     proxminepowerup: false,
           quadlaser: true,
           rapidfire: true,
         seeker3pack: false,
              shield: true,
           vaussclip: true
}
```

`server.options.allowed.miscellaneous` - These are the miscellaneous powerups that are allowed in the game.  Turn these off if you really want to mess with co-op or robo-anarchy games!  Here are the default options:

```
{
      antivirusprogram: true,
            bivouackey: true,
              blackbox: true,
        buddyantivirus: true,
           buddyassist: true,
          buddycontrol: true,
     buddyextinguisher: true,
            buddyspeed: true,
          buddywingnut: true,
          buildersicon: true,
       bypassconnector: true,
         cameramonitor: true,
        collectorsicon: true,
     coverttransmitter: true,
                damkey: true,
               damkey2: true,
               damkey3: true,
               damkey4: true,
         datacartridge: true,
         datainterface: true,
           datajournal: true,
          datavaultkey: true,
           emitterlens: true,
     enginepieceblower: true,
     enginepiecesquare: true,
          entropyvirus: true,
      equipmentroomkey: true,
              flagblue: true,
             flaggreen: true,
               flagred: true,
            flagyellow: true,
    forcefieldpasskey1: true,
                  fuse: true,
        g1securitypass: true,
              hoardorb: true,
              hyperorb: true,
     keycardindustrial: true,
             landpoint: true,
            lev1badkey: true,
             level0key: true,
          memoryplasma: true,
               mystery: true,
             powerball: true,
           priestsicon: true,
        r1securitypass: true,
        reconinterface: true,
           rgcartridge: true,
            sanctumkey: true,
      seismicdisruptor: true,
          shipblueflag: true,
         shipgreenflag: true,
           shipredflag: true,
        shipyellowflag: true,
              sweitzer: true,
          thiefautomap: true,
           virussample: true,
        x1securitypass: true,
        y1securitypass: true
}
```

#### Custom commands

For advanced users (for example, if you are using SuperSheep's Anti Cheat mod), you can send your own commands to the server beyond the default list here by using the `server.options.game.otherCommands` array.  Each item is a string that is appended to the autoexec file that is run when the server is launched.  You do not need to precede these commands with the dollar sign.

## Methods

`server.createServer(callback)` - When you have set all of the options, you can launch your server.  Use the callback method to determine if any errors occurred.  The callback will be called with no arguments if launching the server was successful, and with one string argument if there was an error, with the argument describing the problem.  Note that this does not account for problems you may have in launching Descent 3 itself, such as errors with the port already in use.

## Constants

`Launcher.defaultOptions` - This is the default options for the launcher.  See the Options section for information on what options are available.

`Launcher.difficulties` - This is an enumeration of the game difficulties.  The difficulties are:

```
{
    Trainee: 0,
     Rookie: 1,
    Hotshot: 2,
        Ace: 3,
     Insane: 4
}
```

`Launcher.regions` - This is an enumeration of region names that you can use for the tracker region.  The default and most common setting is `noRegion` so that the game is visible across all regions.  The available regions are:

```
{
                      noRegion: 0,
                   southeastUS: 1,
                     westernUS: 2,
                     midwestUS: 3,
      northwestUSWesternCanada: 4,
      northeastUSEasternCanada: 5,
                 unitedKingdom: 6,
             continentalEurope: 7,
         centralAsiaMiddleEast: 8,
          southeastAsiaPacific: 9,
                        africa: 10,
           australiaNewZealand: 11,
    centralAmericaSouthAmerica: 12
}
```

## Trackers

Each element in the `server.options.server.trackers` array should have the following 3 keys:

`tracker.region` - This is the region that the server is wanting to be listed in.  Valid values are 0 to 12, or you can use one of the `Launcher.regions` constants.

`tracker.server` - This is the server address of the tracker to use.

`tracker.port` - This is the port of the tracker to use.

## History

### Version 0.1.3 - 7/4/2015

* Fix `omegacannon` to be disabled by default.

### Version 0.1.2 - 6/24/2015

* Change `gamename` to `gameName`.
* Change `permissable` to `permissible`.  However, the .cfg options is still named `Permissable`, as that is a misspelling within the game itself.
* Added `superlaser` to the allowed primary weapons list.
* Added documentation.
* Code cleanup per JSlint.

### Version 0.1.1 - 6/22/2015

* Change `killgoal` to `killGoal`.
* Add `remoteAdmin` and `remoteAdminPass` options.
* Fix bug with `remoteConsolePort` causing an error.

### Version 0.1 - 6/13/2015

* Initial version.
