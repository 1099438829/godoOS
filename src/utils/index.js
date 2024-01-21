import icons from "./apps";


export const taskApps = icons.filter(d => d.parentId === 32);
export const pinnedApps = icons.filter(d => d.parentId === 33);
export const desktopApps = icons.filter(d => d.parentId === 11);
export const recentApps = icons.filter(d => d.parentId === 34);
export const allApps = icons.filter(d => d.type === 'app');
//console.log(allApps)
const getName = (arr) => {
  return arr.map( d => d.name )
}
export const dfApps = {
  taskbar : getName(taskApps),
  desktop : getName(desktopApps),
  pinned : getName(pinnedApps),
  recent : getName(recentApps),
};
