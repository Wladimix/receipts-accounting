const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electron', {
    getMissingReceipts: () => ipcRenderer.invoke('get-missing-receipts'),
    uploadFile: data => ipcRenderer.send('upload-file', data)
})
