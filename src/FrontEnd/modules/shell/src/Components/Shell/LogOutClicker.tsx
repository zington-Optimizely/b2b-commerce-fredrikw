import Clickable from "@insite/mobius/Clickable";
import Modal from "@insite/mobius/Modal";
import OverflowMenu from "@insite/mobius/OverflowMenu";
import getColor from "@insite/mobius/utilities/getColor";
import About from "@insite/shell/Components/Shell/About";
import { logOut, toggleMobileCmsMode } from "@insite/shell/Store/ShellContext/ShellContextActionCreators";
import ShellState from "@insite/shell/Store/ShellState";
import * as React from "react";
import { connect, ResolveThunks } from "react-redux";
import { css } from "styled-components";

const mapStateToProps = ({ shellContext: { mobileCmsModeActive, enableMobileCms } }: ShellState) => ({
    mobileCmsModeActive,
    enableMobileCms,
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

type Props = ReturnType<typeof mapStateToProps> & ResolveThunks<typeof mapDispatchToProps>;

const LogOutClicker = ({ mobileCmsModeActive, enableMobileCms, toggleMobileCmsMode, logOut }: Props) => {
    const [showAbout, setShowAbout] = React.useState(false);

    // TODO ISC-13946 - Remove the style={{ display: "none" }} to make the option available again for mobile-CMS-enabled sites.
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
                        style={{ display: "none" }}
                        onClick={toggleMobileCmsMode}
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

export default connect(mapStateToProps, mapDispatchToProps)(LogOutClicker);
