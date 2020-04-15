# About this fork
This fork is designed to remove features some might not need.  

Added features:
- Display file extension
<br/>

Removed features:
- RPC Images
- Comments
- Autoquit (for 24/7 use)
<br/>

Changed features:
- Reduced codebase
- Updated code styling
<br/>
<br/>

# MPC-DiscordRPC
Discord Rich Presence for Media Player Classic

## How does this work?
This program simply fetches playback data from MPC-HC / MPC-BE Web Interface, and displays it in your Discord profile through their wonderful [Rich Presence](https://discordapp.com/rich-presence) API.

Please note that this only works with [Discord desktop client](https://discordapp.com/download), not with the web app.

## How to install
1. Open your Media Player Classic, go to `View > Options > Player > Web Interface` and enable `Listen on port:` option. The default port is `13579`, but if you have changed it, please edit the `config.js` file after you download the project.

![Enable the option "Listen on port"](https://cdn.discordapp.com/attachments/416273308540207116/428748994307424256/unknown.png)

2. Install [`Node.JS`](https://nodejs.org/en/download/current/) (we recommend using the latest version).

3. [Download this project as a .zip file](https://github.com/angeloanan/MPC-DiscordRPC/archive/master.zip), extract it and open a terminal window in the project directory. Otherwise, if you have [Git](https://git-scm.com/) installed, run `git clone https://github.com/Encode42/Simple-MPC-DiscordRPC.git && cd MPC-DiscordRPC`

4. Install dependencies using `npm i`.

> Note: You can safely ignore all peer and optional dependencies warnings as they are not required for the program to work.

5. Start the program by using any of the scripts, or `npm start`.

## How to update

1. Navigate to the directory where did you cloned/downloaded this project and open a terminal window.

2. Stop the program using:

```sh
npm stop
```

3. Update this project by [redownloading this project as a .zip file](https://github.com/Encode42/Simple-MPC-DiscordRPC/archive/master.zip) and replacing the old files. Otherwise, if you have Git installed, run `git pull`.

4. Start the program again using any of the scripts, or `npm start`.
