const { app, BrowserWindow , Menu } = require('electron')

const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600
  })

  win.loadFile('index.html')
   //定义菜单
   const mainMenu = Menu.buildFromTemplate(  menuTemplate  );
   //设置菜单，才展示出来
   Menu.setApplicationMenu( mainMenu );
}

const createAddWindow = ()=>{
    
    const wins = new BrowserWindow({
        width: 800,
        height: 600
    })
    
    wins.loadFile('add.html');

}
//定义菜单
const menuTemplate = [
    {
        label:'文件',
        submenu:[
            {
                label:'新增一条记录',
                click:()=>{
                    createAddWindow();
                }
            },
            {
                label:'退出程序',
                accelerator:process.platform=='darwin'?'Command + W' : 'ctrl + W',
                click:()=>{
                    app.quit();
                }
            }
        ]
    },
    {
        label:'开发者工具',
        submenu:[
            {
                label:'打开/关闭',
                //设定快捷键
                accelerator:process.platform=='darwin'?'Command + I' : 'ctrl + I',
                //菜单事件
                click:( item , focusedWindow )=>{
                    focusedWindow.toggleDevTools();
                }
            },
            {
                label:'刷新页面',
                role:'reload',
                accelerator:process.platform=='darwin'?'Command + T' : 'ctrl + T',
            }
        ]
    }
];


app.whenReady().then(() => {
  createWindow()
})