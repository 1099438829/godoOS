import { combineReducers, createStore } from "redux";


import wallReducer from "./wallpaper";//壁纸
import taskReducer from "./taskbar";//任务栏
import deskReducer from "./desktop";//桌面
import menuReducer from "./startmenu";//开始菜单
import paneReducer from "./sidepane";//电池
import widReducer from "./widpane";//左侧底部小组件
import appReducer from "./apps";//程序
import menusReducer from "./menu";//桌面右击菜单
import globalReducer from "./globals";
import settReducer from "./settings";//设置
import fileReducer from "./files";//文件管理


const allReducers = combineReducers({
  wallpaper: wallReducer,
  taskbar: taskReducer,
  desktop: deskReducer,
  startmenu: menuReducer,
  sidepane: paneReducer,
  widpane: widReducer,
  apps: appReducer,
  menus: menusReducer,
  globals: globalReducer,
  setting: settReducer,
  files: fileReducer,
});

var store = createStore(allReducers);

export default store;
