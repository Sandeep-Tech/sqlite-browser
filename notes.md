my-electron-app
- basic app created by following the official guide

electron-vite-react
- created using `npm create electron-vite`
- has react setup already


todos
===================
1. scaffold the app
===================
1.1 have it run react

- DONE, this was achieved with electron forge `yarn create electron-app sqlite-browser --template=webpack`.

1.2 have it render a window
- DONE, works with `yarn start`

1.3 have node process talk to react process
- this is done with ipcMain and ipcRenderer
- ipcMain - communication channel of the `main` process 
- ipcRenderer - communication channnel of the `renderer` process
==================
2. setup sqlite db
==================
- this is achieved with 

===========================
3. talk to db with electron (main process probabaly -fig this out)
===========================
