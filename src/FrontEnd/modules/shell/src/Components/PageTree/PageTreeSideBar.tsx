import PageTreeFilters from "@insite/shell/Components/PageTree/PageTreeFilters";
import PageTree from "@insite/shell/Components/PageTree/PageTree";
import AddPage from "@insite/shell/Components/PageTree/AddPage";
import ReorderPagesModal from "@insite/shell/Components/Modals/ReorderPagesModal";
import * as React from "react";
import { SideBarStyle } from "@insite/shell/Components/Layout";

const PageTreeSideBar = () => (<>
    <SideBarStyle>
        <PageTreeFilters />
        <PageTree />
        <AddPage />
        <ReorderPagesModal />
    </SideBarStyle>
</>);

export default PageTreeSideBar;
