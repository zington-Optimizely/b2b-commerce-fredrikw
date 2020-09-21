import Clickable from "@insite/mobius/Clickable";
import Modal from "@insite/mobius/Modal";
import OverflowMenu from "@insite/mobius/OverflowMenu";
import getColor from "@insite/mobius/utilities/getColor";
import About from "@insite/shell/Components/Shell/About";
import { logOut, toggleMobileCmsMode } from "@insite/shell/Store/ShellContext/ShellContextActionCreators";
import ShellState from "@insite/shell/Store/ShellState";
import * as React from "react";
import { connect, ResolveThunks } from "react-redux";
import { RouteComponentProps, withRouter } from "react-router";
import { css } from "styled-components";

const mapStateToProps = ({
    shellContext: { mobileCmsModeActive, enableMobileCms, homePageId, mobileHomePageId },
}: ShellState) => ({
    mobileCmsModeActive,
    enableMobileCms,
    homePageId,
    mobileHomePageId,
});

const mapDispatchToProps = {
    logOut,
    toggleMobileCmsMode,
};

/** Fixes blackout caused by `OverflowMenu` using `common.border` for the background color, which in the Shell, is the same as the text. */
const overflowHoverFix = css`
    padding: 0;
    &:hover {
        color: ${getColor("common.background")};
        background: ${getColor("common.backgroundContrast")};
    }
` as any; // The type on the overflow menu doesn't like this but it works.

const overflowWrapperFix = css`
    width: 24px;
    height: 30px;
`;

type Props = RouteComponentProps & ReturnType<typeof mapStateToProps> & ResolveThunks<typeof mapDispatchToProps>;

const LogOutClicker = ({
    mobileCmsModeActive,
    enableMobileCms,
    homePageId,
    mobileHomePageId,
    history,
    toggleMobileCmsMode,
    logOut,
}: Props) => {
    const [showAbout, setShowAbout] = React.useState(false);

    return (
        <>
            <OverflowMenu
                position="end"
                iconProps={{ src: "Settings", color: "#999" }}
                cssOverrides={{ menuItem: overflowHoverFix, wrapper: overflowWrapperFix }}
                data-test-selector="expand_shellSettings"
            >
                {enableMobileCms && (
                    <Clickable
                        data-test-selector="shellSettings_switchCms"
                        onClick={() =>
                            toggleMobileCmsMode(mobileCmsModeActive ? homePageId : mobileHomePageId, history)
                        }
                    >
                        {mobileCmsModeActive ? "Switch to Desktop CMS" : "Switch to Mobile CMS"}
                    </Clickable>
                )}
                <Clickable data-test-selector="shellSettings_logOut" onClick={logOut}>
                    Log Out
                </Clickable>
                <Clickable data-test-selector="shellSettings_showAbout" onClick={() => setShowAbout(true)}>
                    About
                </Clickable>
            </OverflowMenu>
            <Modal isOpen={showAbout} isCloseable handleClose={() => setShowAbout(false)}>
                <About />
            </Modal>
        </>
    );
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(LogOutClicker));
