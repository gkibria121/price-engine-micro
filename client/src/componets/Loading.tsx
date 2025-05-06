import React from "react";

function Loading({
  isFullScreen = false,
  radius = 6,
}: {
  isFullScreen?: boolean;
  radius?: number;
}) {
  return (
    <div className="relative w-10 h-10 flex justify-center ">
      {" "}
      <div
        className={`${
          isFullScreen &&
          "flex items-center justify-center  h-full absolute top-0 left-0 w-full z-10"
        }`}
      >
        <div
          className={`w-${radius * 2} h-${
            radius * 2
          } border-4 border-blue-500 border-t-transparent rounded-full animate-spin`}
        ></div>
      </div>
    </div>
  );
}

export default Loading;
