import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Icon, Image, ToolBar } from "../../../utils/general";
import { dispatchAction, handleFileOpen } from "../../../actions";
//import ActMenu from "../../../components/menu";
import "./assets/fileexpo.scss";

const NavTitle = (props) => {
  var src = props.icon || "folder";

  return (
    <div
      className="navtitle flex prtclk"
      data-action={props.action}
      data-payload={props.payload}
      onClick={dispatchAction}
    >
      <Icon
        className="mr-1"
        src={"win/" + src + "-sm"}
        width={props.isize || 16}
      />
      <span>{props.title}</span>
    </div>
  );
};

const FolderDrop = ({ dir }) => {
  const files = useSelector((state) => state.files);
  const folder = files.data.getId(dir);

  return (
    <>
      {folder.data &&
        // eslint-disable-next-line array-callback-return
        folder.data.map((item, i) => {
          if (item.type === "folder") {
            return (
              <Dropdown
                key={i}
                icon={item.icon}
                title={item.name}
                notoggle={item.data.length === 0}
                dir={item.id}
              />
            );
          }
        })}
    </>
  );
};

const Dropdown = (props) => {
  const [open, setOpen] = useState(props.isDropped != null);
 
  const special = useSelector((state) => state.files.data.special);
  //console.log(special)
  const [fid, setFID] = useState(() => {
    // if (props.spid) return special[props.spid];
    // else return props.dir;
    return props.dir;
  });
  const toggle = () => setOpen(!open);
  //console.log(fid)
  return (
    <div className="dropdownmenu">
      <div className="droptitle">
        {!props.notoggle ? (
          <Icon
            className="arrUi"
            fafa={open ? "faChevronDown" : "faChevronRight"}
            width={10}
            onClick={toggle}
            pr
          />
        ) : (
          <Icon className="arrUi opacity-0" fafa="faCircle" width={10} />
        )}
        <NavTitle
          icon={props.icon}
          title={props.title}
          isize={props.isize}
          action={props.action !== "" ? props.action || "FILEDIR" : null}
          payload={fid}
        />
        {props.pinned != null ? (
          <Icon className="pinUi" src="win/pinned" width={16} />
        ) : null}
      </div>
      {!props.notoggle ? (
        <div className="dropcontent">
          {open ? props.children : null}
          {open && fid != null ? <FolderDrop dir={fid} /> : null}
        </div>
      ) : null}
    </div>
  );
};

export const Explorer = () => {
  const apps = useSelector((state) => state.apps);
  const wnapp = useSelector((state) => state.apps.explorer);
  const files = useSelector((state) => state.files);
  const fdata = files.data.getId(files.cdir);
  const [cpath, setPath] = useState(files.cpath);
  const [searchtxt, setShText] = useState("");
  const dispatch = useDispatch();

  const handleChange = (e) => setPath(e.target.value);
  const handleSearchChange = (e) => setShText(e.target.value);

  const handleEnter = (e) => {
    if (e.key === "Enter") {
      dispatch({ type: "FILEPATH", payload: cpath });
    }
  };

  const DirCont = () => {
    var arr = [],
      curr = fdata,
      index = 0;
    //console.log(fdata)
    while (curr) {
      arr.push(
        <div key={index++} className="dirCont flex items-center">
          <div
            className="dncont"
            onClick={dispatchAction}
            tabIndex="-1"
            data-action="FILEDIR"
            data-payload={curr.id}
          >
            {curr.name}
          </div>
          <Icon className="dirchev" fafa="faChevronRight" width={8} />
        </div>,
      );

      curr = curr.host;
    }

    arr.push(
      <div key={index++} className="dirCont flex items-center">
        <div className="dncont" tabIndex="-1" onClick={dispatchAction} data-action="FILEDIR" data-payload="0">
          This PC
        </div>
        <Icon className="dirchev" fafa="faChevronRight" width={8} />
      </div>,
    );

    arr.push(
      <div key={index++} className="dirCont flex items-center">
        <Icon
          className="pr-1 pb-px"
          src={"win/" + fdata.icon + "-sm"}
          width={16}
        />
        <Icon className="dirchev" fafa="faChevronRight" width={8} />
      </div>,
    );

    return (
      <div key={index++} className="dirfbox h-full flex">
        {arr.reverse()}
      </div>
    );
  };

  useEffect(() => {
    setPath(files.cpath);
    setShText("");
  }, [files.cpath]);

  return (
    <div
      className="msfiles floatTab dpShad"
      data-size={wnapp.size}
      data-max={wnapp.max}
      style={{
        ...(wnapp.size === "cstm" ? wnapp.dim : null),
        zIndex: wnapp.z,
      }}
      data-hide={wnapp.hide}
      id={wnapp.icon + "App"}
    >
      <ToolBar
        app={wnapp.action}
        icon={wnapp.icon}
        size={wnapp.size}
        name="文件管理器"
      />
      <div className="windowScreen flex flex-col">
        <Ribbon />
        <div className="restWindow flex-grow flex flex-col">
          <div className="sec1">
            <Icon
              className={
                "navIcon hvtheme" + (files.hid == 0 ? " disableIt" : "")
              }
              fafa="faArrowLeft"
              width={14}
              click="FILEPREV"
              pr
            />
            <Icon
              className={
                "navIcon hvtheme" +
                (files.hid + 1 == files.hist.length ? " disableIt" : "")
              }
              fafa="faArrowRight"
              width={14}
              click="FILENEXT"
              pr
            />
            <Icon
              className="navIcon hvtheme"
              fafa="faArrowUp"
              width={14}
              click="FILEBACK"
              pr
            />
            <div className="path-bar noscroll" tabIndex="-1">
              <input
                className="path-field"
                type="text"
                value={cpath}
                onChange={handleChange}
                onKeyDown={handleEnter}
              />
              <DirCont />
            </div>
            <div className="srchbar">
              <Icon className="searchIcon" src="search" width={12} />
              <input
                type="text"
                onChange={handleSearchChange}
                value={searchtxt}
                placeholder="搜索"
              />
            </div>
          </div>
          <div className="sec2">
            <NavPane />
            <ContentArea searchtxt={searchtxt} />
          </div>
          <div className="sec3">
            <div className="item-count text-xs">{fdata.data.length} 个项目</div>
            <div className="view-opts flex">
              <Icon
                className="viewicon hvtheme p-1"
                click="FILEVIEW"
                payload="5"
                open={files.view == 5}
                src="win/viewinfo"
                width={16}
              />
              <Icon
                className="viewicon hvtheme p-1"
                click="FILEVIEW"
                payload="1"
                open={files.view == 1}
                src="win/viewlarge"
                width={16}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ContentArea = ({ searchtxt }) => {
  const files = useSelector((state) => state.files);
  //const special = useSelector((state) => state.files.data.special);
  const [selected, setSelect] = useState(null);
  //console.log(files)
  const fdata = files.data.getId(files.cdir);
  const dispatch = useDispatch();

  const handleClick = (e) => {
    e.stopPropagation();
    console.log(e) 
    setSelect(e.target.dataset.id);
  };

  const handleDouble = (e) => {
    e.stopPropagation();
    //console.log(e.target.dataset)
    handleFileOpen(e.target.dataset.id);
  };

  const emptyClick = (e) => {
    
    setSelect(null);
  };

  const handleKey = (e) => {
    if (e.key === "Backspace") {
      dispatch({ type: "FILEPREV" });
    }
  };
  const contextMenu = (e) => {
    e.preventDefault();
    //dispatch({ type: 'GARBAGE'});
    var data = {
      top: e.clientY,
      left: e.clientX,
    };
    //console.log(e.target.dataset)
    if (e.target.dataset.menu != null) {
      //data.menu = 'app';
      data.menu = e.target.dataset.menu;
      data.attr = e.target.attributes;
      data.dataset = e.target.dataset;
      //onsole.log(data)
      dispatch({
        type: "MENUSHOW",
        payload: data,
      });
    }
  }

  return (
    <div
      className="contentarea"
      onClick={emptyClick}
      onKeyDown={handleKey}
      onContextMenu={contextMenu}
      tabIndex="-1"
      
    >
      <div className="contentwrap win11Scroll" data-menu="explorer">
        <div className="gridshow" data-size="lg">
          {fdata.data.map((item, i) => {
            //console.log(item)
            let icon = `icon/win/${item.icon}`;
            if(item.type !== 'folder') {
              icon = `icon/${item.icon}`;
            }
            return (
              item.name.indexOf(searchtxt) > -1 && (
                <div
                  key={i}
                  className="conticon hvtheme flex flex-col items-center prtclk"
                  data-id={item.id}
                  data-focus={selected == item.id}
                  onClick={handleClick}
                  onDoubleClick={handleDouble}
                  data-menu="file"
                >
                  <Image src={icon} />
                  <span>{item.name}</span>
                </div>
              )
            );
          })}
        </div>
        {fdata.data.length === 0 ? (
          <span className="text-xs mx-auto"></span>
        ) : null}
      </div>
      {/* <ActMenu /> */}
    </div>
  );
};

const NavPane = ({}) => {
  const files = useSelector((state) => state.files);
  const special = useSelector((state) => state.files.data.special);

  return (
    <div className="navpane win11Scroll">
      <div className="extcont">
        <Dropdown icon="star" title="快速访问" action="" isDropped>
          <Dropdown
            icon="down"
            title="下载"
            dir="16"
            notoggle
            pinned
          />
          <Dropdown icon="user" title="用户" dir="5" notoggle pinned />
          <Dropdown
            icon="docs"
            title="文档"
            dir="12"
            notoggle
            pinned
          />
          {/* <Dropdown title="Github" spid="%github%" notoggle /> */}
          <Dropdown icon="pics" title="图片" dir="13" notoggle />
        </Dropdown>
        {/* <Dropdown icon="onedrive" title="OneDrive" spid="%onedrive%" /> */}
        <Dropdown icon="thispc" title="此电脑" action="" isDropped>
          <Dropdown icon="desk" title="桌面" dir="11" />
          <Dropdown icon="docs" title="文档" dir="12" />
          <Dropdown icon="down" title="下载" dir="16" />
          <Dropdown icon="music" title="音乐" dir="14" />
          <Dropdown icon="pics" title="图片" dir="13" />
          <Dropdown icon="vid" title="视频" dir="15" />
          <Dropdown icon="disc" title="系统 (C:)" dir="1" />
          <Dropdown icon="disk" title="软件 (D:)" dir="2" />
        </Dropdown>
      </div>
    </div>
  );
};

// eslint-disable-next-line no-empty-pattern
const Ribbon = ({}) => {
  return (
    <div className="msribbon flex">
      <div className="ribsec">
        <div className="drdwcont flex">
          <Icon src="new" ui width={18} margin="0 6px" />
          <span>新建</span>
        </div>
      </div>
      <div className="ribsec">
        <Icon src="cut" ui width={18} margin="0 6px" />
        <Icon src="copy" ui width={18} margin="0 6px" />
        <Icon src="paste" ui width={18} margin="0 6px" />
        <Icon src="rename" ui width={18} margin="0 6px" />
	   <Icon src="share" ui width={18} margin="0 6px" />
      </div>
      <div className="ribsec">
        <div className="drdwcont flex">
          <Icon src="sort" ui width={18} margin="0 6px" />
          <span>排序</span>
        </div>
        <div className="drdwcont flex">
          <Icon src="view" ui width={18} margin="0 6px" />
          <span>查看</span>
        </div>
      </div>
    </div>
  );
};
