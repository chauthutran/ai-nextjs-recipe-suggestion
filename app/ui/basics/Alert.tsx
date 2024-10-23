import * as Constant from "@/lib/constant";
import { useState } from "react";

export default function Alert({type = "", message=""}) {

    const [visible, setVisible] = useState(true);


    const getColorByType = (): string => {
        switch( type ) {
            case Constant.ALERT_TYPE_SUCCESS: 
                return "border-green-500 bg-green-100 text-blue-700";
            case Constant.ALERT_TYPE_WARNNG: 
                return "border-yellow-500 bg-yellow-100 text-green-700";
            case Constant.ALERT_TYPE_ERROR: 
                return "border-red-500 bg-red-100 text-red-700";
            default:
                return "border-blue-600 bg-blue-200 text-blue-800";
        } 
    }

    const getHeaderByType = (): string => {
        switch( type ) {
            case Constant.ALERT_TYPE_SUCCESS: 
                return "Success";
            case Constant.ALERT_TYPE_WARNNG: 
                return "Warning";
            case Constant.ALERT_TYPE_ERROR: 
                return "Error";
            default:
                return "Info";
        }
    }

    const color = getColorByType();

    return (
        <div style={{display: visible ? "": "none"}} className={`slide-down rounded-md shadow-sm fixed top-0 left-1/2  mt-2 px-3 py-2 border-2 ${color} z-50 flex items-center`}>
        <span className="flex-1">{message}</span>
        <button
          className="ml-4 text-red-500 font-bold text-xl"
          onClick={() => setVisible(false)}
        >
          &times;
        </button>
      </div>
    )
}