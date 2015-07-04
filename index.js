var fs = require("fs"),
    path = require("path"),
    os = require("os"),
    childProcess = require("child_process"),
    eol = os.EOL,
    promise = require("promised-io"),
    Deferred = promise.Deferred,
    all = promise.all;

/**
 * Constructor for descent3launcher.
 * @returns {Launcher} The instantiated launcher.
 * @constructor
 */
function Launcher() {
    "use strict";

    return this;
}

/**
 * Constants for tracker regions.
 */
Launcher.regions = Object.freeze({
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
});

/**
 * Constants for game difficulties.
 */
Launcher.difficulties = Object.freeze({
    Trainee: 0,
    Rookie: 1,
    Hotshot: 2,
    Ace: 3,
    Insane: 4
});

/**
 * Default options.
 */
Launcher.defaultOptions = Object.freeze({
    server: {
        directory: null,
        port: 2092,
        framerate: 250,
        ip: null,
        trackers: [
            {
                region: Launcher.regions.noRegion,
                server: "tracker.kali.net",
                port: 22999
            },
            {
                region: Launcher.regions.noRegion,
                server: "tracker.descent.cx",
                port: 27900
            },
            {
                region: Launcher.regions.noRegion,
                server: "descentservers.net",
                port: 27900
            },
            {
                region: Launcher.regions.noRegion,
                server: "tsetsefly.de",
                port: 27900
            },
            {
                region: Launcher.regions.noRegion,
                server: "gsm.qtracker.com",
                port: 27900
            }
        ],
        gamespyport: 20143,
        noMultiBmp: false,
        playerMessages: true
    },
    game: {
        // Settings available through the CFG file.
        accurateCollisions: true,
        allowMouselook: false,
        allowRemoteConsole: false,
        audioTauntDelay: 5,
        brightPlayers: false,
        connectionName: "Direct TCP~IP",
        consolePassword: null,
        gameName: "Descent 3 Dedicated Server",
        killGoal: null,
        maxPlayers: 8,
        missionName: null,
        motd: null,
        numTeams: 2,
        peer2peer: null,
        permissible: null,
        pps: 20,
        randomizeRespawn: true,
        remoteConsolePort: null,
        respawnTime: 30,
        scriptName: "anarchy",
        sendRotVel: true,
        setDifficulty: Launcher.difficulties.Insane,
        setLevel: 1,
        timeLimit: null,
        useSmoothing: false,

        // Settings available through autoexec file.  Anything set here will override the settings above.
        allowTeamChange: true,
        autoBalance: true,
        autoSaveDisconnect: false,
        autoSaveLevel: false,
        killMsgFilter: "full",
        remoteAdmin: false,
        remoteAdminPass: null,
        serverHudNames: "none",
        setTeamName: [
            "Red",
            "Blue",
            "Green",
            "Yellow"
        ],
        statMsgs: true,

        // Other settings to add to the autoexec file manually.
        otherCommands: []
    },
    allowed: {
        // Ships are disallowed in the MPS file.
        ships: {
            blackpyro: true, // Black Pyro
            magnumaht: true, // Magnum-AHT
            phoenix: true, // Phoenix
            pyrogl: true // Pyro-GL
        },

        // Everything else is disallowed in the CFG file.
        primaries: {
            emdlauncher: true,
            fusioncannon: true,
            massdriver: true,
            microwave: true,
            napalm: true,
            omegacannon: false,
            plasmacannon: true,
            superlaser: true,
            vauss: true
        },
        secondaries: {
            fourpackconc: true, // 4packConc
            fourpackfrag: true, // 4packFrag
            fourpackguided: true, // 4packGuided
            fourpackhoming: true, //4packHoming
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
        },
        powerups: {
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
            vaussclip: true // Vauss clip
        },
        miscellaneous: {
            antivirusprogram: true, // Anti-Virus Program
            bivouackey: true,
            blackbox: true,
            buddyantivirus: true,
            buddyassist: true,
            buddycontrol: true,
            buddyextinguisher: true,
            buddyspeed: true,
            buddywingnut: true,
            buildersicon: true, // Builders' Icon
            bypassconnector: true, // Bypass Connector
            cameramonitor: true, // Camera Monitor
            collectorsicon: true, // Collectors' Icon
            coverttransmitter: true, // Covert Transmitter
            damkey: true,
            damkey2: true, // Damkey-2
            damkey3: true, // Damkey-3
            damkey4: true, // Damkey-4
            datacartridge: true, // Data Cartridge
            datainterface: true, // Data Interface
            datajournal: true, // Data Journal
            datavaultkey: true, // Data Vault Key
            emitterlens: true, // Emitter Lens
            enginepieceblower: true,
            enginepiecesquare: true,
            entropyvirus: true,
            equipmentroomkey: true, // Equipment Room Key
            flagblue: true,
            flaggreen: true,
            flagred: true,
            flagyellow: true,
            forcefieldpasskey1: true,
            fuse: true,
            g1securitypass: true, // G-1 Security Pass
            hoardorb: true,
            hyperorb: true,
            keycardindustrial: true,
            landpoint: true,
            lev1badkey: true,
            level0key: true,
            memoryplasma: true,
            mystery: true,
            powerball: true,
            priestsicon: true, // Priest's Icon
            r1securitypass: true, // R-1 Security Pass
            reconinterface: true, // Recon Interface
            rgcartridge: true,
            sanctumkey: true,
            seismicdisruptor: true, // Seismic Disruptor
            shipblueflag: true,
            shipgreenflag: true,
            shipredflag: true,
            shipyellowflag: true,
            sweitzer: true,
            thiefautomap: true,
            virussample: true, // Virus Sample
            x1securitypass: true, // X-1 Security Pass
            y1securitypass: true // Y-1 Security Pass
        }
    }
});

// Copy the default options to the prototype.
Launcher.prototype.options = JSON.parse(JSON.stringify(Launcher.defaultOptions));

/**
 * Creates a new Descent 3 server.
 * @param {function()|function(string)} callback The callback function.
 */
Launcher.prototype.createServer = function(callback) {
    "use strict";

    var launcher = this,
        index;

    // Validate settings
    if (Object.prototype.toString.call(this.options.server) !== "[object Object]") {
        callback("Missing option server.  Make sure that this object does not get overridden when the launcher object is created.");
        return;
    }

    if (Object.prototype.toString.call(this.options.game) !== "[object Object]") {
        callback("Missing option game.  Make sure that this object does not get overridden when the launcher object is created.");
        return;
    }

    if (Object.prototype.toString.call(this.options.allowed) !== "[object Object]") {
        callback("Missing option allowed.  Make sure that this object does not get overridden when the launcher object is created.");
        return;
    }

    if (Object.prototype.toString.call(this.options.allowed.ships) !== "[object Object]") {
        callback("Missing option allowed.ships.  Make sure that this object does not get overridden when the launcher object is created.");
        return;
    }

    if (Object.prototype.toString.call(this.options.allowed.primaries) !== "[object Object]") {
        callback("Missing option allowed.primaries.  Make sure that this object does not get overridden when the launcher object is created.");
        return;
    }

    if (Object.prototype.toString.call(this.options.allowed.secondaries) !== "[object Object]") {
        callback("Missing option allowed.seconds.  Make sure that this object does not get overridden when the launcher object is created.");
        return;
    }

    if (Object.prototype.toString.call(this.options.allowed.powerups) !== "[object Object]") {
        callback("Missing option allowed.powerups.  Make sure that this object does not get overridden when the launcher object is created.");
        return;
    }

    if (Object.prototype.toString.call(this.options.allowed.miscellaneous) !== "[object Object]") {
        callback("Missing option allowed.miscellaneous.  Make sure that this object does not get overridden when the launcher object is created.");
        return;
    }

    if (typeof this.options.server.directory !== "string") {
        callback("Invalid option server.directory.  Set this to the directory that contains " + (os.platform() === "win32" ? "main.exe" : "main") + ".");
        return;
    }

    if (typeof this.options.server.port !== "number" || this.options.server.port < 0 || this.options.server.port > 65535 || this.options.server.port % 1 !== 0) {
        callback("Invalid option server.port.  Valid values are integers 0 through 65535.");
        return;
    }

    if (typeof this.options.server.framerate !== "number" || this.options.server.framerate < 1 || this.options.server.framerate > 999) {
        callback("Invalid option server.framerate.  Valid values are integers 1 through 999.");
        return;
    }

    if (this.options.server.ip !== null) {
        if (typeof this.options.server.ip !== "string" || /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(this.options.server.ip)) {
            callback("Invalid option server.ip.  Set this to null unless you need to bind Descent 3 to a specific IP address.");
            return;
        }
    }

    if (this.options.server.trackers !== null) {
        if (Object.prototype.toString.call(this.options.server.trackers) !== "[object Array]") {
            for (index in this.options.server.trackers) {
                if (this.options.server.trackers.hasOwnProperty(index)) {
                    if (typeof this.options.server.trackers[index].region !== "number" || this.options.server.trackers[index].region < 0 || this.options.server.trackers[index].region > 12 || this.options.server.trackers[index].region % 1 !== 0) {
                        callback("Invalid option server.trackers region.  Valid values are integers 0 through 12.");
                        return;
                    }

                    if (typeof this.options.server.trackers[index].server !== "string") {
                        callback("Invalid option server.trackers server.  You must include the server address of the tracker to use.");
                        return;
                    }

                    if (typeof this.options.server.trackers[index].port !== "number" || this.options.server.trackers[index].port < 0 || this.options.server.trackers[index].port > 65535 || this.options.server.trackers[index].port % 1 !== 0) {
                        callback("Invalid option server.trackers port.  Valid values are integers 0 through 65535.");
                        return;
                    }
                }
            }
        }
    }

    if (this.options.server.gamespyport !== null) {
        if (typeof this.options.server.gamespyport !== "number" || this.options.server.gamespyport < 0 || this.options.server.gamespyport > 65535 || this.options.server.gamespyport % 1 !== 0) {
            callback("Invalid option server.gamespyport.  Set to null if you do not wish to use a gamespy port, otherwise valid values are integers 0 through 65535.");
            return;
        }
    }

    if (typeof this.options.server.noMultiBmp !== "boolean") {
        callback("Invalid option server.noMultiBmp.  Valid values are true and false.");
        return;
    }

    if (typeof this.options.server.playerMessages !== "boolean") {
        callback("Invalid option server.playerMessages.  Valid values are true and false.");
        return;
    }

    if (typeof this.options.game.accurateCollisions !== "boolean") {
        callback("Invalid option game.accurateCollisions.  Valid values are true and false.");
        return;
    }

    if (typeof this.options.game.allowMouselook !== "boolean") {
        callback("Invalid option game.allowMouselook.  Valid values are true and false.");
        return;
    }

    if (typeof this.options.game.allowRemoteConsole !== "boolean") {
        callback("Invalid option game.allowRemoteConsole.  Valid values are true and false.");
        return;
    }

    if (typeof this.options.game.audioTauntDelay !== "number" || this.options.game.audioTauntDelay < 1 || this.options.game.audioTauntDelay % 1 !== 0) {
        callback("Invalid option game.audioTauntDelay.  Valid values are integers greater than 0.");
        return;
    }

    if (typeof this.options.game.brightPlayers !== "boolean") {
        callback("Invalid option game.brightPlayers.  Valid values are true and false.");
        return;
    }

    if (typeof this.options.game.connectionName !== "string") {
        callback("Invalid option game.connectionName.  Check your Descent 3 online folder for possible connection types.");
        return;
    }

    if (this.options.game.consolePassword !== null) {
        if (typeof this.options.game.consolePassword !== "string") {
            callback("Invalid option game.consolePassword.  Set this to null if you don't need to use the remote console, or a string if you do.");
            return;
        }
    }

    if (typeof this.options.game.gameName !== "string" || this.options.game.gameName.length === 0) {
        callback("Invalid option game.gameName.  This must be a nonzero-length string.");
        return;
    }

    if (this.options.game.killGoal !== null) {
        if (typeof this.options.game.killGoal !== "number" || this.options.game.killGoal < 1 || this.options.game.killGoal % 1 !== 0) {
            callback("Invalid option game.killGoal.  Set this to null if you don't want to use a kill goal, otherwise valid values are integers greater than 0.");
            return;
        }
    }

    if (typeof this.options.game.maxPlayers !== "number" || this.options.game.maxPlayers < 1 || this.options.game.maxPlayers > 32 || this.options.game.maxPlayers % 1 !== 0) {
        callback("Invalid option game.maxPlayers.  Valid values are integers between 1 and 32.");
        return;
    }

    if (typeof this.options.game.missionName !== "string" || this.options.game.missionName.length === 0) {
        callback("Invalid option game.missionName.  You must enter the name of the mission file.");
        return;
    }

    if (this.options.game.motd !== null) {
        if (typeof this.options.game.motd !== "string") {
            callback("Invalid option game.motd.  Set this to null if you don't want a message of the day, or a string if you do.");
            return;
        }
    }

    if (this.options.game.numTeams !== null) {
        if (typeof this.options.game.numTeams !== "number" || this.options.game.numTeams < 2 || this.options.game.numTeams > 4 || this.options.game.numTeams % 1 !== 0) {
            callback("Invalid option game.numTeams.  Set this to null if you don't need teams, otherwise valid values are 2, 3, and 4.");
            return;
        }
    }

    if (this.options.game.peer2peer !== null) {
        if (typeof this.options.game.peer2peer !== "boolean" || (this.options.game.peer2peer === true && this.options.game.permissible)) {
            callback("Invalid option game.peer2peer.  Set this to null if you are using client/server or permissible client/server, otherwise set to true and do not set both game.peer2peer and game.permissible to true.");
            return;
        }
    }

    if (this.options.game.permissible !== null) {
        if (typeof this.options.game.permissible !== "boolean") {
            callback("Invalid option game.permissible.  Set this to null if you are using client/server or peer to peer, otherwise set to true.");
            return;
        }
    }

    if (typeof this.options.game.pps !== "number" || this.options.game.pps < 1 || this.options.game.pps > 20) {
        callback("Invalid option game.pps.  Valid values are integers between 1 and 20.");
        return;
    }

    if (typeof this.options.game.randomizeRespawn !== "boolean") {
        callback("Invalid option game.randomizeRespawn.  Valid values are true and false.");
        return;
    }

    if (this.options.game.remoteConsolePort !== null) {
        if (typeof this.options.game.remoteConsolePort !== "number" || this.options.game.remoteConsolePort < 0 || this.options.game.remoteConsolePort > 65535 || this.options.game.remoteConsolePort % 1 !== 0) {
            callback("Invalid option game.remoteConsolePort.  Valid values are integers 0 through 65535.");
            return;
        }
    }

    if (typeof this.options.game.respawnTime !== "number" || this.options.game.respawnTime < 1 || this.options.game.respawnTime % 1 !== 0) {
        callback("Invalid option game.respawnTime.  Valid values are integers greater than 0.");
        return;
    }

    if (typeof this.options.game.scriptName !== "string" || this.options.game.scriptName.length === 0) {
        callback("Invalid option game.scriptName.  Check your Descent 3 netgames folder for possible connection types.");
        return;
    }

    if (typeof this.options.game.sendRotVel !== "boolean") {
        callback("Invalid option game.sendRotVel.  Valid values are true and false.");
        return;
    }

    if (typeof this.options.game.setDifficulty !== "number" || this.options.game.setDifficulty < 0 || this.options.game.setDifficulty > 4 || this.options.game.setDifficulty % 1 !== 0) {
        callback("Invalid option game.setDifficulty.  Valid values are integers between 0 and 4.");
        return;
    }

    if (typeof this.options.game.setLevel !== "number" || this.options.game.setLevel < 1 || this.options.game.setLevel % 1 !== 0) {
        callback("Invalid option game.setLevel.  Valid values are integers greater than 0.");
        return;
    }

    if (this.options.game.timeLimit !== null) {
        if (typeof this.options.game.timeLimit !== "number" || this.options.game.timeLimit < 1 || this.options.game.timeLimit % 1 !== 0) {
            callback("Invalid option game.timeLimit.  Set this to null if you don't want to use a time limit, otherwise valid values are integers greater than 0.");
            return;
        }
    }

    if (typeof this.options.game.useSmoothing !== "boolean") {
        callback("Invalid option game.useSmoothing.  Valid values are true and false.");
        return;
    }

    if (typeof this.options.game.allowTeamChange !== "boolean") {
        callback("Invalid option game.allowTeamChange.  Valid values are true and false.");
        return;
    }

    if (typeof this.options.game.autoBalance !== "boolean") {
        callback("Invalid option game.autoBalance.  Valid values are true and false.");
        return;
    }

    if (typeof this.options.game.autoSaveDisconnect !== "boolean") {
        callback("Invalid option game.autoSaveDisconnect.  Valid values are true and false.");
        return;
    }

    if (typeof this.options.game.autoSaveLevel !== "boolean") {
        callback("Invalid option game.autoSaveLevel.  Valid values are true and false.");
        return;
    }

    if (typeof this.options.game.killMsgFilter !== "string" || ["none", "simple", "full"].indexOf(this.options.game.killMsgFilter) === -1) {
        callback("Invalid option game.killMsgFilter.  Valid values are none, simple, and full.");
        return;
    }

    if (typeof this.options.game.serverHudNames !== "string" || ["none", "team", "full"].indexOf(this.options.game.serverHudNames) === -1) {
        callback("Invalid option game.serverHudNames.  Valid values are none, team, and full.");
        return;
    }

    if (this.options.game.setTeamName !== null) {
        if (Object.prototype.toString.call(this.options.game.setTeamName) !== "[object Array]" || this.options.game.setTeamName.length > 4) {
            callback("Invalid option game.setTeamName.  Must be an array of up to four strings indicating the team names to use.");
            return;
        }

        for (index in this.options.game.setTeamName) {
            if (this.options.game.setTeamName.hasOwnProperty(index)) {
                if (typeof this.options.game.setTeamName[index] !== "string" || this.options.game.setTeamName[index].length === 0) {
                    callback("Invalid option game.setTeamName.  Must be an array of up to four strings indicating the team names to use.");
                    return;
                }
            }
        }
    }

    if (typeof this.options.game.statMsgs !== "boolean") {
        callback("Invalid option game.statMsgs.  Valid values are true and false.");
        return;
    }

    fs.exists(path.join(this.options.server.directory, (os.platform() === "win32" ? "main.exe" : "main")), function(directoryExists) {
        if (!directoryExists) {
            callback("Invalid option server.directory.  Set this to the directory that contains " + (os.platform() === "win32" ? "main.exe" : "main") + ".");
            return;
        }

        all(
            // Check connectionName.
            (function() {
                var deferred = new Deferred();

                fs.exists(path.join(launcher.options.server.directory, "online", launcher.options.game.connectionName + ".d3c"), function(connectionExists) {
                    if (connectionExists) {
                        deferred.resolve();
                    } else {
                        callback("Invalid option game.connectionName.  Check your Descent 3 online folder for possible connection types.");
                        deferred.reject();
                    }
                });

                return deferred.promise;
            }()),

            // Check missionName.
            (function() {
                var deferred = new Deferred();

                fs.exists(path.join(launcher.options.server.directory, "missions", launcher.options.game.missionName), function(missionExists) {
                    if (missionExists) {
                        deferred.resolve();
                    } else {
                        callback("Invalid option game.missionName.  You must enter the name of the mission file, without the extension.");
                        deferred.reject();
                    }
                });

                return deferred.promise;
            }()),

            // Check scriptName.
            (function() {
                var deferred = new Deferred();

                fs.exists(path.join(launcher.options.server.directory, "netgames", launcher.options.game.scriptName + ".d3m"), function(scriptExists) {
                    if (scriptExists) {
                        deferred.resolve();
                    } else {
                        callback("Invalid option game.scriptName.  Check your Descent 3 netgames folder for possible connection types.");
                        deferred.reject();
                    }
                });

                return deferred.promise;
            }())
        ).then(
            // Start server
            function() {
                var fileDirectory = path.join(launcher.options.server.directory, "custom", "cache", launcher.options.server.port.toString()),
                    descentConfig, gamespyConfig, multiplayerSettings, autoexecConfig, key;

                // Create the Descent CFG file.
                descentConfig = "[server config file]" + eol +
                    "MultiSettingsFile=" + path.join(fileDirectory, "multisettings.mps") + eol +
                    "AccurateCollisions=" + (launcher.options.game.accurateCollisions ? "1" : "0") + eol +
                    "AllowMouselook=" + (launcher.options.game.allowMouselook ? "1" : "0") + eol +
                    "AllowRemoteConsole=" + (launcher.options.game.allowRemoteConsole ? "1" : "0") + eol +
                    "AudioTauntDelay=" + launcher.options.game.audioTauntDelay.toString() + eol +
                    "BrightPlayers=" + (launcher.options.game.brightPlayers ? "1" : "0") + eol +
                    "ConnectionName=" + launcher.options.game.connectionName + eol +
                    (launcher.options.game.consolePassword === null ? "" : "ConsolePassword=" + launcher.options.game.consolePassword + eol) +
                    "GameName=" + launcher.options.game.gameName + eol +
                    (launcher.options.game.killGoal === null ? "" : "KillGoal=" + launcher.options.game.killGoal.toString() + eol) +
                    "MaxPlayers=" + launcher.options.game.maxPlayers.toString() + eol +
                    "MissionName=" + launcher.options.game.missionName + eol +
                    (launcher.options.game.motd === null ? "" : "MOTD=" + launcher.options.game.motd + eol) +
                    (launcher.options.game.numTeams === null ? "" : "NumTeams=" + launcher.options.game.numTeams.toString() + eol) +
                    (launcher.options.game.peer2peer === null ? "" : "Peer2Peer=" + (launcher.options.game.peer2peer ? "1" : "0") + eol) +
                    (launcher.options.game.permissible === null ? "" : "Permissable=" + (launcher.options.game.permissible ? "1" : "0") + eol) +
                    "PPS=" + launcher.options.game.pps.toString() + eol +
                    "RandomizeRespawn=" + (launcher.options.game.randomizeRespawn ? "1" : "0") + eol +
                    (launcher.options.game.remoteConsolePort === null ? "" : "RemoteConsolePort=" + launcher.options.game.remoteConsolePort.toString() + eol) +
                    "RespawnTime=" + launcher.options.game.respawnTime.toString() + eol +
                    "ScriptName=" + launcher.options.game.scriptName + eol +
                    "SendRotVel=" + (launcher.options.game.sendRotVel ? "1" : "0") + eol +
                    "SetDifficulty=" + launcher.options.game.setDifficulty.toString() + eol +
                    "SetLevel=" + launcher.options.game.setLevel.toString() + eol +
                    (launcher.options.game.timeLimit === null ? "" : "TimeLimit=" + launcher.options.game.timeLimit.toString() + eol) +
                    "UseSmoothing=" + (launcher.options.game.useSmoothing ? "1" : "0") + eol;

                for (key in launcher.options.allowed.primaries) {
                    if (launcher.options.allowed.primaries.hasOwnProperty(key)) {
                        if (launcher.options.allowed.primaries[key] === false) {
                            descentConfig += "DisallowPowerup=" + key + eol;
                        }
                    }
                }

                for (key in launcher.options.allowed.secondaries) {
                    if (launcher.options.allowed.secondaries.hasOwnProperty(key)) {
                        if (launcher.options.allowed.secondaries[key] === false) {
                            switch (key) {
                                case "fourpackcon":
                                    key = "4packConc";
                                    break;
                                case "fourpackfrag":
                                    key = "4packFrag";
                                    break;
                                case "fourpackguided":
                                    key = "4packGuided";
                                    break;
                                case "fourpackhoming":
                                    key = "4packHoming";
                                    break;
                            }
                            descentConfig += "DisallowPowerup=" + key + eol;
                        }
                    }
                }

                for (key in launcher.options.allowed.powerups) {
                    if (launcher.options.allowed.powerups.hasOwnProperty(key)) {
                        if (launcher.options.allowed.powerups[key] === false) {
                            switch (key) {
                                case "vaussclip":
                                    key = "vauss clip";
                                    break;
                            }
                            descentConfig += "DisallowPowerup=" + key + eol;
                        }
                    }
                }

                for (key in launcher.options.allowed.miscellaneous) {
                    if (launcher.options.allowed.miscellaneous.hasOwnProperty(key)) {
                        if (launcher.options.allowed.miscellaneous[key] === false) {
                            switch (key) {
                                case "antivirusprogram":
                                    key = "Anti-Virus Program";
                                    break;
                                case "buildersicon":
                                    key = "Buiders' Icon";
                                    break;
                                case "bypassconnector":
                                    key = "Bypass Connector";
                                    break;
                                case "cameramonitor":
                                    key = "Camera Monitor";
                                    break;
                                case "collectorsicon":
                                    key = "Collectors' Icon";
                                    break;
                                case "coverttransmitter":
                                    key = "Covert Transmitter";
                                    break;
                                case "damkey2":
                                    key = "Damkey-2";
                                    break;
                                case "damkey3":
                                    key = "Damkey-3";
                                    break;
                                case "damkey4":
                                    key = "Damkey-4";
                                    break;
                                case "datacartridge":
                                    key = "Data Cartridge";
                                    break;
                                case "datainterface":
                                    key = "Data Interface";
                                    break;
                                case "datajournal":
                                    key = "Data Journal";
                                    break;
                                case "datavaultkey":
                                    key = "Data Vault Key";
                                    break;
                                case "emitterlens":
                                    key = "Emitter Lens";
                                    break;
                                case "equipmentroomkey":
                                    key = "Equipment Room Key";
                                    break;
                                case "g1securitypass":
                                    key = "G-1 Security Pass";
                                    break;
                                case "priestsicon":
                                    key = "Priest's Icon";
                                    break;
                                case "r1securitypass":
                                    key = "R-1 Security Pass";
                                    break;
                                case "reconinterface":
                                    key = "Recon Interface";
                                    break;
                                case "seismicdisruptor":
                                    key = "Seismic Disruptor";
                                    break;
                                case "virussample":
                                    key = "Virus Sample";
                                    break;
                                case "x1securitypass":
                                    key = "X-1 Security Pass";
                                    break;
                                case "y1securitypass":
                                    key = "Y-1 Security Pass";
                                    break;
                            }
                            descentConfig += "DisallowPowerup=" + key + eol;
                        }
                    }
                }

                // Create the Gamespy CFG file.
                if (launcher.options.server.trackers !== null && launcher.options.server.trackers.length > 0) {
                    gamespyConfig = "";
                    launcher.options.server.trackers.forEach(function(tracker) {
                        gamespyConfig +=
                            " " + tracker.region.toString() + " " + eol +
                            tracker.server + ":" + tracker.port.toString() + eol;
                    });
                }

                // Create the MPS file.
                multiplayerSettings = "name\t" + launcher.options.game.gameName + eol +
                    (launcher.options.allowed.ships.blackpyro === false ? "ShipBan\tBlack Pyro" + eol : "") +
                    (launcher.options.allowed.ships.magnumaht === false ? "ShipBan\tMagnum-AHT" + eol : "") +
                    (launcher.options.allowed.ships.phoenix === false ? "ShipBan\tPhoenix" + eol : "") +
                    (launcher.options.allowed.ships.pyrogl === false ? "ShipBan\tPyro-GL" + eol : "");

                // Create the DMFC file.
                autoexecConfig =
                    "AllowTeamChange " + (launcher.options.game.allowTeamChange ? "ON" : "OFF") + eol +
                    "AutoBalance " + (launcher.options.game.autoBalance ? "ON" : "OFF") + eol +
                    "AutoSaveDisconnect " + (launcher.options.game.autoSaveDisconnect ? "ON" : "OFF") + eol +
                    "AutoSaveLevel " + (launcher.options.game.autoSaveLevel ? "ON" : "OFF") + eol +
                    "KillMsgFilter " + launcher.options.game.killMsgFilter.toUpperCase() + eol +
                    "RemoteAdmin " + (launcher.options.game.remoteAdmin ? "ON" : "OFF") + eol +
                    (launcher.options.game.remoteAdminPass === null ? "" : "RemoteAdminPass " + launcher.options.game.remoteAdminPass + eol) +
                    "ServerHudNames " + launcher.options.game.serverHudNames.toUpperCase() + eol +
                    "StatMsgs " + (launcher.options.game.statMsgs ? "ON" : "OFF") + eol;

                if (launcher.options.game.setTeamName !== null) {
                    launcher.options.game.setTeamName.forEach(function(team, index) {
                        autoexecConfig += "SetTeamName " + index.toString() + " " + team + eol;
                    });
                }

                if (launcher.options.game.otherCommands !== null) {
                    launcher.options.game.otherCommands.forEach(function(command) {
                        autoexecConfig += command + eol;
                    });
                }

                // Write the files.
                fs.mkdir(fileDirectory, function(err) {
                    if (err && err.code !== "EEXIST") {
                        callback("There was an error creating the following directory: " + fileDirectory + ": " + err.toString());
                        return;
                    }

                    all(
                        (function() {
                            var deferred = new Deferred();

                            fs.writeFile(path.join(fileDirectory, "descent.cfg"), descentConfig, {}, function(err) {
                                if (err) {
                                    callback("There was an error while writing descent.cfg. " + err.toString());
                                    deferred.reject();
                                } else {
                                    deferred.resolve();
                                }
                            });

                            return deferred.promise;
                        }()),

                        (function() {
                            var deferred = new Deferred();

                            fs.writeFile(path.join(fileDirectory, "gamespy.cfg"), gamespyConfig, {}, function(err) {
                                if (err) {
                                    callback("There was an error while writing gamespy.cfg. " + err.toString());
                                    deferred.reject();
                                } else {
                                    deferred.resolve();
                                }
                            });

                            return deferred.promise;
                        }()),

                        (function() {
                            var deferred = new Deferred();

                            fs.writeFile(path.join(fileDirectory, "descent.mps"), multiplayerSettings, {}, function(err) {
                                if (err) {
                                    callback("There was an error while writing descent.mps. " + err.toString());
                                    deferred.reject();
                                } else {
                                    deferred.resolve();
                                }
                            });

                            return deferred.promise;
                        }()),

                        (function() {
                            var deferred = new Deferred();

                            fs.writeFile(path.join(fileDirectory, "descent.dmfc"), autoexecConfig, {}, function(err) {
                                if (err) {
                                    callback("There was an error while writing descent.dmfc. " + err.toString());
                                    deferred.reject();
                                } else {
                                    deferred.resolve();
                                }
                            });

                            return deferred.promise;
                        }())
                    ).then(
                        function() {
                            var options;

                            // Start the server.
                            fs.mkdir(path.join(fileDirectory, "temp"), function(err) {
                                if (err && err.code !== "EEXIST") {
                                    callback("There was an error creating the following directory: " + path.join(fileDirectory, "temp") + ": " + err.toString());
                                    return;
                                }

                                if (os.platform() === "win32") {
                                    // Windows
                                    options = [
                                        "/c",
                                        "start",
                                        "/D",
                                        launcher.options.server.directory,
                                        "/min",
                                        "main.exe",
                                        "-launched",
                                        "-dedicated",
                                        path.join(fileDirectory, "descent.cfg"),
                                        "-useport",
                                        launcher.options.server.port.toString(),
                                        "-framecap",
                                        launcher.options.server.framerate.toString(),
                                        "-setdir",
                                        launcher.options.server.directory,
                                        "-tempdir",
                                        path.join(fileDirectory, "temp") + "/",
                                        "-autoexec",
                                        path.join(fileDirectory, "descent.dmfc")
                                    ];
                                    if (gamespyConfig) {
                                        options.push("-gspyfile");
                                        options.push(path.join(fileDirectory, "gamespy.cfg"));
                                        options.push("-gamespyport");
                                        options.push(launcher.options.server.gamespyport.toString());
                                    }
                                    if (launcher.options.server.ip !== null) {
                                        options.push("-useip");
                                        options.push(launcher.options.server.ip);
                                    }
                                    if (launcher.options.server.noMultiBmp) {
                                        options.push("-nomultibmp");
                                    }
                                    if (launcher.options.server.playerMessages) {
                                        options.push("-playermessages");
                                    }
                                    try {
                                        childProcess.spawn("cmd", options, {});
                                    } catch (spawnErr) {
                                        callback("There was an error while creating the server: " + spawnErr.toString());
                                    }
                                } else {
                                    // Linux/Mac
                                    options = [
                                        "-launched",
                                        "-dedicated " + path.join(fileDirectory, "descent.cfg"),
                                        "-useport " + launcher.options.server.port.toString(),
                                        "-framecap " + launcher.options.server.framerate.toString(),
                                        "-setdir " + launcher.options.server.directory,
                                        "-tempdir " + path.join(fileDirectory, "temp") + "/",
                                        "-autoexec " + path.join(fileDirectory, "descent.dmfc")
                                    ];
                                    if (gamespyConfig) {
                                        options.push("-gspyfile " + path.join(fileDirectory, "gamespy.cfg"));
                                        options.push("-gamespyport " + launcher.options.server.gamespyport.toString());
                                    }
                                    if (launcher.options.server.ip !== null) {
                                        options.push("-useip " + launcher.options.server.ip);
                                    }
                                    if (launcher.options.server.noMultiBmp) {
                                        options.push("-nomultibmp");
                                    }
                                    if (launcher.options.server.playerMessages) {
                                        options.push("-playermessages");
                                    }
                                    try {
                                        childProcess.spawn("main", options, {cwd: launcher.options.server.directory});
                                    } catch (spawnErr) {
                                        callback("There was an error while creating the server: " + spawnErr.toString());
                                    }
                                }
                                callback();
                            });
                        },

                        function() {
                            return this;
                        }
                    );
                });
            },

            function() {
                return this;
            }
        );
    });
};

module.exports = Launcher;
