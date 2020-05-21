import React, { FC, useEffect } from "react";
import { connect, ResolveThunks } from "react-redux";
import ShellState from "@insite/shell/Store/ShellState";
import { loadPublishInfo } from "@insite/shell/Store/ShellContext/ShellContextActionCreators";
import styled from "styled-components";
import { getCurrentPageForShell } from "@insite/shell/Store/ShellSelectors";

const mapStateToProps = (state: ShellState) => {
    const {
        shellContext: {
            currentLanguageId,
            currentPersonaId,
            currentDeviceType,
            pagePublishInfo,
            contentMode,
        },
        pageEditor: {
            isEditingNewPage,
        },
    } = state;

    const pageId = getCurrentPageForShell(state).id;

    return ({
        pageId,
        contentMode,
        loaded: pagePublishInfo.value,
        hasDraft: isEditingNewPage || (pagePublishInfo.value && !!pagePublishInfo.value
            .find(page => page.pageId === pageId && page.unpublishedContexts
                .find(({ languageId, personaId, deviceType }) => (!languageId || languageId === currentLanguageId) && (!personaId || personaId === currentPersonaId) && (!deviceType || deviceType === currentDeviceType)),
            )),
    });
};

const mapDispatchToProps = ({
    loadPublishInfo,
});

type Props = ReturnType<typeof mapStateToProps> & ResolveThunks<typeof mapDispatchToProps>;

const HeaderPublishStatus: FC<Props> = ({
                                            pageId,
                                            contentMode,
                                            loaded,
                                            hasDraft,
                                            loadPublishInfo,
                                        }) => {
    useEffect(() => loadPublishInfo(pageId), [pageId]);

    let value: "Published" | "Draft" | "Scheduled" | undefined;

    // TODO ISC-11129: Implement the "scheduled" option.
    if (loaded) {
        switch (contentMode) {
        case "Previewing":
        case "Editing":
            value = hasDraft ? "Draft" : "Published";
            break;
        default:
            value = "Published";
            break;
        }
    }

    return <StyledSpan data-test-selector="publishStatus">{value || "..."}</StyledSpan>;
    41;
};

export default connect(mapStateToProps, mapDispatchToProps)(HeaderPublishStatus);

const StyledSpan = styled.span`
    background: ${({ theme }) => theme.colors.common.backgroundContrast};
    color: ${({ theme }) => theme.colors.common.accent};
    font-family: ${({ theme }) => theme.typography.body.fontFamily};
    font-size: ${({ theme }) => theme.modal.defaultProps.headlineTypographyProps.size};
`;
