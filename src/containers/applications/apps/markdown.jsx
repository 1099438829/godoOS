import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { ToolBar } from "../../../utils/general";

export const Markdown = () => {
  const wnapp = useSelector((state) => state.apps.markdown);
  if(!wnapp)return;
  return (
    <div
      className="notepad floatTab dpShad"
      data-size={wnapp.size}
      data-max={wnapp.max}
      style={{
        ...(wnapp.size == "cstm" ? wnapp.dim : null),
        zIndex: wnapp.z,
      }}
      data-hide={wnapp.hide}
      id={wnapp.icon + "App"}
    >
      <ToolBar
        app={wnapp.action}
        icon={wnapp.icon}
        size={wnapp.size}
        name="无标题 - 记事本"
      />
      <div className="windowScreen flex flex-col" data-dock="true">
        <div className="flex text-xs py-2 topBar">
          <div className="mx-2">文件</div>
          <div className="mx-4">编辑</div>
          <div className="mx-4">查看</div>
        </div>
        <div className="restWindow h-full flex-grow">
          <div className="w-full h-full overflow-hidden">
            <textarea className="noteText win11Scroll" id="textpad" />
          </div>
        </div>
      </div>
    </div>
  );
};
