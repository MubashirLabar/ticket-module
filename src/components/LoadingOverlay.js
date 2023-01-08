import React from "react";
import { Loader } from "components";

function LoadingOverlay() {
  return (
    <div className="loading-overlay">
      <Loader size={40} />
    </div>
  );
}

export default LoadingOverlay;
