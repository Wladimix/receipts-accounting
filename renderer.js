document.getElementById('uploadButton').addEventListener('click', () => {
    const fileInput = document.getElementById('fileInput')
    const file = fileInput.files[0]
    const year = document.getElementById('year').value
    const month = document.getElementById('month').value
    const receipt = document.getElementById('receipt').value

    if (file && file.type === 'application/pdf') {
        const newFileName = year + '_' + month + '_' + receipt + '.pdf'
        const reader = new FileReader()

        reader.onload = () => {
            window.electron.uploadFile({
                newFileName,
                file: reader.result
            })
        }

        reader.readAsArrayBuffer(file)
    }
})

document.getElementById('checkReceipts').addEventListener('click', async () => {
    const missingReceipts = await window.electron.getMissingReceipts()

    document.getElementById('missingReceipts').innerHTML = ''

    missingReceipts.forEach(elem => {
        const node = document.createElement('li')
        const textnode = document.createTextNode(elem)
        node.appendChild(textnode)
        document.getElementById('missingReceipts').appendChild(node)
    })
})
