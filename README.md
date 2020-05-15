# Simple MPC-DiscordRPC
Discord Rich Presence for Media Player Classic

## About this fork
This fork is designed to remove features some might not need.  

Added features:
- Display file extension
- Simple Windows scripts
<br/>

Removed features:
- RPC Images
- Comments
- Autoquit (for 24/7 use)
<br/>

Changed features:
- Reduced codebase
- Changed config a bit
- Updated code styling

#### MPC-DiscordRPC -> Simple-MPC-DiscordRPC Stats:  
**core.js**  
before: 166 lines, 7,783 chars, 5.64kb  
after: 86 lines, 3,001 chars, 2.93kb  

**index.js**  
before: 115 lines, 3,765 chars, 3.67kb  
after: 68 lines, 2,011 chars, 1.96kb  

**Total**  
before: 231 lines, 11,548 chars, 9.31kb  
after: 154 lines, 5,012 chars, 4.89kb  
-77 lines, -6,536 chars, -4.42kb  

## How does this work?
This program simply fetches playback data from MPC-HC / MPC-BE Web Interface, and displays it in your Discord profile through their wonderful [Rich Presence](https://discord.com/rich-presence) API.

Please note that this only works with [Discord desktop client](https://discord.com/download), not with the web app.

## How to install
1. Open your Media Player Classic, go to `View > Options > Player > Web Interface` and enable `Listen on port:` option. The default port is `13579`, but if you have changed it, please edit the `config.js` file after you download the project.
![Enable the option "Listen on port"](https://cdn.discordapp.com/attachments/416273308540207116/428748994307424256/unknown.png)
2. Install [`Node.JS`](https://nodejs.org/en/download/current/) (we recommend using the latest version).
3. [Download this project as a .zip file](https://github.com/angeloanan/MPC-DiscordRPC/archive/master.zip), extract it and open a terminal window in the project directory. Otherwise, if you have [Git](https://git-scm.com/) installed, run `git clone https://github.com/Encode42/Simple-MPC-DiscordRPC.git && cd MPC-DiscordRPC`
4. Install dependencies using `npm i`.  
<sub>_You can safely ignore all peer and optional dependencies warnings as they are not required for the program to work._</sub>
5. Start the program by using the start script, or `npm start`.

## How to update
1. Navigate to the directory where did you cloned/downloaded this project and open a terminal window.
2. Stop the program using the stop script, or `npm stop`
3. Update this project by [redownloading this project as a .zip file](https://github.com/Encode42/Simple-MPC-DiscordRPC/archive/master.zip) and replacing the old files. Otherwise, if you have Git installed, run `git pull`.
4. Start the program again using the start script, or `npm start`.
