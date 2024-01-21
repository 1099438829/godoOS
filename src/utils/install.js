import { gene_name } from "./apps";
import store from "../reducers";
let installed = JSON.parse(localStorage.getItem("installed") || "[]");


let myApps = [{
    "name": "testmy",
    "icon": "github",
    "type": "app",
    "data": {
      "type": "IFrame",
      "url": "https://smashkarts.io"
    },
    "pwa": true,
    "invert": true,
    show:{
      taskbar : 0,
      desktop : 1,
      pinned : 0,
      recent : 0
    } 
  },
  {
    "name": "testmy22",
    "icon": "cortana",
    "type": "app",
    "data": {
      "type": "IFrame",
      "url": "https://smashkarts.io"
    },
    "pwa": true,
    //"invert": true,
    show:{
      taskbar : 0,
      desktop : 1,
      pinned : 0,
      recent : 0
    } 
  }];
export function istallPlugin(){
  if(installed.length > 0) return false;
  let installNames = installed.map( d => d.name )
  let has = false;
  let useDesk = [];
  myApps.forEach(d => {
    if(!installNames.includes(d.name)){
      installed.push(d);
      useDesk.push(d);
      has = true;
    }
  })
  if(has){
    localStorage.setItem('installed', JSON.stringify(installed));
    let desk = JSON.parse(localStorage.getItem("desktop") || "[]");
    useDesk.forEach(app => {
      if(!desk.includes(app.name)) {
        desk.push(app.name);
      }
    })
    localStorage.setItem("desktop", JSON.stringify(desk));
    useDesk.forEach(app => {
      app.action = gene_name();
      store.dispatch({ type: "ADDAPP", payload: app });
      store.dispatch({ type: "DESKADD", payload: app });
      store.dispatch({ type: "WNSTORE", payload: "mnmz" });
    })

  }
  return has;
}
