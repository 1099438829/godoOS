export class Item {
  // constructor({ type, name, info, data, host }) {
    constructor(data) {
    this.type = data.type || "folder";
    this.name = data.name;
    // this.info = info || {};
    // this.info.icon = this.info.icon || this.type;
    this.id = data.id;
    this.data = data.data;
    this.icon = data.icon;
    this.path = data.path;
    this.parentId = data.parentId;
    this.host = data.host;
    // this.id = this.gene();
  }

  // gene() {
  //   return Math.random().toString(36).substring(2, 10).toLowerCase();
  // }

  getId() {
    return this.id;
  }

  getData() {
    return this.data;
  }

  setData(data) {
    this.data = data;
  }
}

export class Bin {
  constructor() {
    this.tree = [];
    this.cache = {};
    this.lookup = {};
    this.special = {};
  }

  setSpecial(spid, id) {
    this.special[spid] = id;
  }

  setId(id, item) {
    let data = this.cache[id];
    //this.lookup[id] = item;
    this.lookup[id] = this.getItem(data, data.name)
  }

  getId(id) {
    //console.log(id)
    //console.log(this.lookup[id])
    let data = this.cache[id]
    //return this.lookup[id];
    return this.getItem(data, data.name)
  }

  getPath(id) {
    //var cpath = "";
    //console.log(id)
    var curr = this.getId(id);
    //console.log(curr)
    return curr.path;

    // while (curr) {
    //   cpath = curr.name + "\\" + cpath;
    //   curr = curr.host;
    // }

    // return cpath.count("\\") > 1 ? cpath.strip("\\") : cpath;
  }

  // parsePath(cpath) {
  //   if (cpath.includes("%")) {
  //     return this.special[cpath.trim()];
  //   }

  //   cpath = cpath
  //     .split("\\")
  //     .filter((x) => x !== "")
  //     .map((x) => x.trim().toLowerCase());
  //   if (cpath.length === 0) return null;

  //   var pid = null,
  //     curr = null;
  //   for (var i = 0; i < this.tree.length; i++) {
  //     if (this.tree[i].name.toLowerCase() === cpath[0]) {
  //       curr = this.tree[i];
  //       break;
  //     }
  //   }

  //   if (curr) {
  //     var i = 1,
  //       l = cpath.length;
  //     while (curr.type === "folder" && i < l) {
  //       var res = true;
  //       for (var j = 0; j < curr.data.length; j++) {
  //         if (curr.data[j].name.toLowerCase() === cpath[i]) {
  //           i += 1;
  //           if (curr.data[j].type === "folder") {
  //             res = false;
  //             curr = curr.data[j];
  //           }

  //           break;
  //         }
  //       }

  //       if (res) break;
  //     }

  //     if (i === l) pid = curr.id;
  //   }

  //   return pid;
  // }
  getChild(id) {
    let rt = [];
    let cache = this.cache;
    for(let p in cache) {
      if(cache[p].parentId === id){
        rt.push(cache[p])
      }
    }
    return rt;
  }
  getItem(data, name) {
    return new Item({
      id: data.id,
      type: data.type,
      icon : data.icon,
      parentId:data.parentId,
      path : data.path,
      name: data.name || name,
      data: this.getChild(data.id),
      host: this.cache[data.parentId]
    });
  }
  parseFolder(data, name, host = null) {
    //console.log(data)
    var item = this.getItem(data, name);
    this.setId(item.id, item);
    if (data.recent && data.recent > 0) {
      this.setSpecial(data.id, item.id);
    }
    // var item = new Item({
    //   type: data.type,
    //   name: data.name || name,
    //   info: data.info,
    //   host: host,
    // });

    // this.setId(item.id, item);

    // if (data.info && data.info.spid) {
    //   this.setSpecial(data.info.spid, item.id);
    // }

    // if (item.type !== "folder") {
    //   item.setData(data.data);
    // } else {
    //   var fdata = [];
    //   if (data.data) {
    //     for (const key of Object.keys(data.data)) {
    //       fdata.push(this.parseFolder(data.data[key], key, item));
    //     }
    //   }

    //   item.setData(fdata);
    // }

    return item;
  }

  parse(data) {
    //console.log(data)
    let cache = {};
    data.forEach(d => {
      cache[d.id] = d;
    })
    this.cache = cache;
    // var drives = Object.keys(data);
    // var tree = [];
    // for (var i = 0; i < drives.length; i++) {
    //   tree.push(this.parseFolder(data[drives[i]]));
    // }
    let tree = [];
    const dataTree = data.filter(d => d.parentId === 0);
    dataTree.forEach(d => {
      tree.push(this.parseFolder(d))
      // tree.push({
      //     id : d.id,
      //     data : data.filter(dd => dd.parentId === d.id),
      //     info : {
      //       icon : d.icon
      //     },
      //     type: d.type,
      //     name : d.name,
      //   })
    })
    let root = data[0];
    root.data = dataTree;
    this.setId(0, root);
    this.tree = tree;
    // this.tree = tree;
    // console.log(data)
    
    // this.tree = {
    //   id : 0,
    //   data : data.filter(d => d.parentId === 0),
    //   info : {
    //     icon : 'desk'
    //   },
    //   type:'folder',
    //   name : '此电脑',
      
    // }
  }
}
