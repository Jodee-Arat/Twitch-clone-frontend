import { PropsWithChildren } from "react";

import LayoutContainer from "@/components/layouts/LayoutContainer";
import Header from "@/components/layouts/header/Header";
import Sidebar from "@/components/layouts/sidebar/Sidebar";

const SiteLayout = ({ children }: PropsWithChildren<unknown>) => {
  return (
    <div className="flex h-full flex-col">
      <div className="flex-1">
        <div className="fixed inset-y-0 z-50 h-[75px] w-full">
          <Header />
        </div>
        <Sidebar />
        <LayoutContainer>{children}</LayoutContainer>
      </div>
    </div>
  );
};

export default SiteLayout;
