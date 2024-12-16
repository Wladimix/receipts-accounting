const fs = require('fs')
const path = require('path')

const { app, BrowserWindow, ipcMain } = require('electron')

const APP_PATH = path.join(app.getPath("home"), 'receipts')
const CONFIG_FILE = path.join(APP_PATH, 'config.json')

const createWindow = () => {
    const win = new BrowserWindow({
        width: 400,
        height: 600,
        minWidth: 400,
        minHeight: 300,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js')
        }
    })

    win.setTitle("Квитанции")
    win.setMenu(null)
    win.loadFile('index.html')
}

app.whenReady().then(() => {
    checkAndCreateDirectory()
    checkAndCreateConfigFile()

    ipcMain.on('upload-file', uploadFile)
    ipcMain.handle('get-missing-receipts', getMissingReceipts)

    createWindow()
})

function checkAndCreateDirectory() {
    if (!fs.existsSync(APP_PATH)) {
        fs.mkdirSync(APP_PATH)
    }
}

function checkAndCreateConfigFile() {
    if (!fs.existsSync(CONFIG_FILE)) {
        fs.open(CONFIG_FILE, 'w', (err) => {
            if (err) console.error('Ошибка:', err)
            console.log('Создан файл конфигурации')
        })
    }
}

function uploadFile(event, data) {
    fs.writeFile(

        getFilePath(data.newFileName),
        Buffer.from(data.file),

        err => {
            if (err) {
                console.error('Ошибка:', err)
            } else {
                console.log('Файл успешно загружен')
            }
        }
    )
}

function getFilePath(fileName) {
    return path.join(APP_PATH, fileName)
}

function getMissingReceipts() {
    const config = JSON.parse(fs.readFileSync(CONFIG_FILE, 'utf8'))
    const missingReceipts = []
    const filesList = []

    fs.readdirSync(APP_PATH).forEach(file => {
        filesList.push(file);
    })

    for (let receipt in config) {
        for (let year in config[receipt]) {
            config[receipt][year].forEach(month => {

                const currentReceipt = `${year}_${month}_${receipt}.pdf`

                if (!filesList.includes(currentReceipt)) {
                    missingReceipts.push(currentReceipt)
                }

            })
        }
    }

    return missingReceipts
}
