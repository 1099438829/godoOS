import { Bin } from "../utils/bin";
//import fdata from "./dir.json";
import icons from "../utils/apps";
const defState = {
  //cdir: "%user%",
  cdir: "0",
  hist: [],
  hid: 0,
  view: 1,
};

defState.hist.push(defState.cdir);
defState.data = new Bin();
defState.data.parse(icons);

const fileReducer = (state = defState, action) => {
  var tmp = { ...state };
  var navHist = false;
  //console.log(tmp)
  if (action.type === "FILEDIR") {
    tmp.cdir = action.payload;
    //console.log("FILEDIR",action.payload)
  } else if (action.type === "FILEPATH") {
    //console.log("FILEPATH",action.payload)
    //var pathid = tmp.data.parsePath(action.payload);
    var pathid = tmp.data.id;
    if (pathid) tmp.cdir = pathid;
  } else if (action.type === "FILEBACK") {
    var item = tmp.data.getId(tmp.cdir);
    tmp.cdir = item.parentId;
    // if (item.host) {
    //   tmp.cdir = item.host.id;
    // }
  } else if (action.type === "FILEVIEW") {
    tmp.view = action.payload;
  } else if (action.type === "FILEPREV") {
    tmp.hid--;
    if (tmp.hid < 0) tmp.hid = 0;
    navHist = true;
  } else if (action.type === "FILENEXT") {
    //console.log("FILENEXT",action)
    tmp.hid++;
    if (tmp.hid > tmp.hist.length - 1) tmp.hid = tmp.hist.length - 1;
    navHist = true;
  }

  if (!navHist && tmp.cdir != tmp.hist[tmp.hid]) {
    tmp.hist.splice(tmp.hid + 1);
    tmp.hist.push(tmp.cdir);
    tmp.hid = tmp.hist.length - 1;
  }
  //console.log(tmp)
  tmp.cdir = tmp.hist[tmp.hid];
  //console.log(tmp.cdir,tmp.hid)
  // if (tmp.cdir > -1) {
  //   if (tmp.data.special[tmp.cdir] != null) {
  //     tmp.cdir = tmp.data.special[tmp.cdir];
  //     tmp[tmp.hid] = tmp.cdir;
  //   }
  // }
  // if (tmp.cdir.includes("%")) {
  //   if (tmp.data.special[tmp.cdir] != null) {
  //     tmp.cdir = tmp.data.special[tmp.cdir];
  //     tmp[tmp.hid] = tmp.cdir;
  //   }
  // }

  tmp.cpath = tmp.data.getPath(tmp.cdir);
  return tmp;
};

export default fileReducer;
