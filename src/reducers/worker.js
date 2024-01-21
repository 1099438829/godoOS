//eslint-disable-next-line no-undef
//importScripts('./dblib.js');
// import Idb from './db/Idb';
import Idb from './dblib.js';
import { dbConfig } from "./dbConfig";
// import { dbConfig } from "./dbConfig";
import { aes, md5, enc } from 'crypto-js/aes';
import {initData} from "./init.js";
const initLocal = localStorage.getItem('_systemData');
// onmessage = (e) => {
//     initSystem();
//     console.log("Message received from main script");
//     //const workerResult = `Result: ${e.data[0] * e.data[1]}`;
//     console.log("Posting message back to main script");
//     // postMessage(workerResult);
    
// };

var _db;
async function getDb() {
    if (!_db) {
        _db = await Idb(dbConfig);
    }
    return _db;
}

export function initSystem() {
    // if(initLocal) {
    //     return;
    // }
    localStorage.setItem('_systemData', JSON.stringify(initData));
    // const now = Date.now();
    // initData.forEach(d => {
    //     d.isSys = 1;
    //     //d.type = 'folder';
    //     d.createTime = now;
    //     d.updateTime = now;
    //     d.deleteTime = 0;
    // });
    // try {
    //     const db = await getDb();
    //     //console.log(db)
    //     await db.add({
    //         tableName: "filelist",
    //         data: initData
    //     });
    // } catch (e) {
    //     console.log(e)
    // }
    

}
//initSystem()
export async function getApps() {
    const db = await getDb();
    const res = await db.query({
        tableName: "filelist",
        condition: (item, index) => item.type === 'app',
    });
    return res.data
}
export async function readFile(id) {
    const db = await getDb();
    const res = await db.query({
        tableName: "filelist",
        condition: (item, index) => item.id === id,
    });
    return res.data[0]
}
export async function listFilesByTitle(title) {
    const db = await getDb();
    const res = await db.query({
        tableName: "filelist",
        condition: (item, index) => item.title.indexOf(title) > -1,
    });
    return res.data;
}
export async function listFilesByExt(ext) {
    const db = await getDb();
    const res = await db.query({
        tableName: "filelist",
        condition: (item, index) => item.ext === ext,
    });
    return res.data;
}
export async function listFilesByPid(pid) {
    const db = await getDb();
    const res = await db.query({
        tableName: "filelist",
        condition: (item, index) => item.parentId === pid,
    });
    return res.data;
}
export function parseName(name) {
    if(name.indexOf('.') > -1) {
        let arr = name.split(".")
        let ext = arr.pop()
        let title = ext.join('.')
        return { title, ext }
    }else{
        return { title : name, ext : 'unnknow' }
    }
   
}
export async function createPath(data) {
    const db = await getDb();
    let saveData = await parseCreatePath(data);
    await db.add({
        tableName: "filelist",
        data: saveData
    });
}
async function parseCreatePath(data) {
    const parentData = await readFile(data[0]['parentId']);
    const parentPath = parentData.path;
    const pwd = parentData.password;
    const now = Date.now();
    data.forEach(d => {
        d.title = d.name;
        d.ext = 'folder';
        d.path = parentPath + '/' + d.name;
        d.isSys = 0;
        d.type = 'folder';
        d.createTime = now;
        d.updateTime = now;
        d.deleteTime = 0;
        if (pwd !== '') {
            d.password = pwd;
        }
        d.content = '';
    })
    return data;
}
export async function createFile(data) {
    const db = await getDb();
    let saveData = await parseCreateFile(data);
    await db.add({
        tableName: "filelist",
        data: saveData
    });
}
async function parseCreateFile(data) {
    //[{parentId : , name : , content : '', type:'file'}]
    //type: folder file app link 
    //if type=link content = file id
    //if isSys === 3 files is out file isSys === 1 donot delete
    //let keys = ['name', 'title','ext','path','parentId','topId','content','isSys','type', 'password', 'createTime','updateTime','deleteTime']
    const parentData = await readFile(data[0]['parentId']);
    const parentPath = parentData.path;
    const pwd = parentData.password;
    const now = Date.now();
    data.forEach(d => {
        const { title, ext } = parseName(d.name);
        d.title = title;
        d.ext = ext;
        d.path = parentPath + '/' + d.name;
        d.isSys = 0;
        d.type = 'file';
        d.createTime = now;
        d.updateTime = now;
        d.deleteTime = 0;
        if (pwd !== '') {
            d.content = encodeContent(pwd, d.content);
            d.password = pwd;
        }
    })
    return data;
}
async function parseUpdateFile(d) {
    const oldData = await readFile(d.id);
    const { title, ext } = parseName(d.name);
    d.title = title;
    d.ext = ext;
    d.updateTime = Date.now();
    if (oldData.password !== '' && d.content) {
        d.content = encodeContent(oldData.password, d.content);
    }
    return d;
}
function encodeContent(pwd, content) {
    return aes.encrypt(content, pwd).toString();
}
function decodeContent(pwd, content) {
    // Decrypt
    const bytes = aes.decrypt(content, pwd);
    return bytes.toString(enc.Utf8);
}

export async function updateFile(data) {
    let saveData = await parseUpdateFile(data);
    const db = await getDb();
    await db.update({
        tableName: "filelist",
        condition: (item, index) => item.id === data.id,
        handler: (row) => {
            //row.name = "新名字";
            for (let p in saveData) {
                row[p] = saveData[p]
            }
        },
    });
}
// eslint-disable-next-line no-restricted-globals
export default self;

