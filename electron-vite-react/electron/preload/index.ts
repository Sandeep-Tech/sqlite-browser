import { contextBridge, ipcRenderer  } from 'electron';

function domReady(condition: DocumentReadyState[] = ['complete', 'interactive']) {
  return new Promise(resolve => {
    if (condition.includes(document.readyState)) {
      resolve(true)
    } else {
      document.addEventListener('readystatechange', () => {
        if (condition.includes(document.readyState)) {
          resolve(true)
        }
      })
    }
  })
}

const safeDOM = {
  append(parent: HTMLElement, child: HTMLElement) {
    if (!Array.from(parent.children).find(e => e === child)) {
      return parent.appendChild(child)
    }
  },
  remove(parent: HTMLElement, child: HTMLElement) {
    if (Array.from(parent.children).find(e => e === child)) {
      return parent.removeChild(child)
    }
  },
}

/**
 * https://tobiasahlin.com/spinkit
 * https://connoratherton.com/loaders
 * https://projects.lukehaas.me/css-loaders
 * https://matejkustec.github.io/SpinThatShit
 */
function useLoading() {
  const className = `loaders-css__square-spin`
  const styleContent = `
@keyframes square-spin {
  25% { transform: perspective(100px) rotateX(180deg) rotateY(0); }
  50% { transform: perspective(100px) rotateX(180deg) rotateY(180deg); }
  75% { transform: perspective(100px) rotateX(0) rotateY(180deg); }
  100% { transform: perspective(100px) rotateX(0) rotateY(0); }
}
.${className} > div {
  animation-fill-mode: both;
  width: 50px;
  height: 50px;
  background: #fff;
  animation: square-spin 3s 0s cubic-bezier(0.09, 0.57, 0.49, 0.9) infinite;
}
.app-loading-wrap {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #282c34;
  z-index: 9;
}
    `
  const oStyle = document.createElement('style')
  const oDiv = document.createElement('div')

  oStyle.id = 'app-loading-style'
  oStyle.innerHTML = styleContent
  oDiv.className = 'app-loading-wrap'
  oDiv.innerHTML = `<div class="${className}"><div></div></div>`

  return {
    appendLoading() {
      safeDOM.append(document.head, oStyle)
      safeDOM.append(document.body, oDiv)
    },
    removeLoading() {
      safeDOM.remove(document.head, oStyle)
      safeDOM.remove(document.body, oDiv)
    },
  }
}

// ----------------------------------------------------------------------

const { appendLoading, removeLoading } = useLoading()
domReady().then(appendLoading)

window.onmessage = (ev) => {
  ev.data.payload === 'removeLoading' && removeLoading()
}

setTimeout(removeLoading, 4999)

// ----------------------------------------------------------------------


const handleSaveDbConfig = (details) => {
  const isSaved = ipcRenderer.invoke('app-data', {
    type: 'save-external-db-config',
    data: details
  });
  ipcRenderer.invoke('external-db',{
    type: 'setup-config',
    data: details
  });
  if (isSaved) return true;
  return false;
}
const testConnection = async () => {
  try {
    const res = await ipcRenderer.invoke('external-db', { type: 'connect' });
    if (res) {
      ipcRenderer.invoke('external-db', { type: 'disconnect' })
      return true;
    }
    return false;
  } catch (err) {
    console.error('Error: failed in testing external db connection');
    console.error(err);
    return false;
  }
}
const saveMonitoringCriteria = (criteria) => {
  const res = ipcRenderer.invoke('app-data', {
    type: 'save-monitoring-criteria',
    data: criteria,
  });
  if (res) return true;
  return false;
}

contextBridge.exposeInMainWorld('mainAPI', {
  testConnection: testConnection,
  getDbConfig: () => ipcRenderer.invoke('app-data', { type: 'fetch-external-db-config' }),
  saveDbConfig: handleSaveDbConfig,
  getMonitoringCriteria: () => ipcRenderer.invoke('app-data', { type: 'fetch-monitoring-criteria' }),
  saveMonitoringCriteria: saveMonitoringCriteria,
  onTableUpdate: (callback) => ipcRenderer.on('table-update', callback),
  offTableUpdate: (callback) => ipcRenderer.off('table-update', callback),
});

