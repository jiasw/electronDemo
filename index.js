const information = document.getElementById('info')

console.log(information)
information.innerHTML = `本应用正在使用 Chrome (v${versions.chrome()}), Node.js (v${versions.node()}), 和 Electron (v${versions.electron()})`