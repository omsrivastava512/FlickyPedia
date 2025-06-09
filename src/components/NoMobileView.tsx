import { ReactNode } from "react";
import { useIsMobileView } from "../hooks/useIsMobileView.tsx";

export const NoMobileView = ({ children }: { children?: ReactNode }) => {

  const isMobileView = useIsMobileView()

  return isMobileView ?
    (<div className=".overlay">
      <div className="modal">
        <h1 style={{ fontSize: '10vw' }}>Destop Mode Required</h1>
        <p style={{ fontSize: '5vw' }}>Please open this app on a desktop device or request desktop view through your browser settings.</p>
      </div>
    </div>)
    : children
};
