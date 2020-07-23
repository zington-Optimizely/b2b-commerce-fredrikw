import { getPageState } from "@insite/shell/Services/ContentAdminService";
import { loadPublishInfo } from "@insite/shell/Store/ShellContext/ShellContextActionCreators";
import { getCurrentPageForShell } from "@insite/shell/Store/ShellSelectors";
import ShellState from "@insite/shell/Store/ShellState";
import React, { FC, useEffect } from "react";
import { connect, ResolveThunks } from "react-redux";
import styled from "styled-components";

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
        pageTree: {
            treeNodesByParentId,
            headerTreeNodesByParentId,
            footerTreeNodesByParentId,
        },
    } = state;

    const page = getCurrentPageForShell(state);
    const pageId = page.id;

    return ({
        pageId,
        futurePublishOn: getPageState(pageId, treeNodesByParentId[page.parentId], headerTreeNodesByParentId[page.parentId],
            footerTreeNodesByParentId[page.parentId])?.futurePublishOn,
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
                                            futurePublishOn,
                                        }) => {
    useEffect(() => loadPublishInfo(pageId), [pageId]);

    let value: "Published" | "Draft" | "Scheduled" | undefined;

    if (loaded) {
        switch (contentMode) {
        case "Previewing":
        case "Editing":
            value = (futurePublishOn && futurePublishOn > new Date()) ? "Scheduled" : (hasDraft ? "Draft" : "Published");
            break;
        default:
            value = "Published";
            break;
        }
    }

    return <StyledSpan data-test-selector="publishStatus">{value || "..."}</StyledSpan>;
};

export default connect(mapStateToProps, mapDispatchToProps)(HeaderPublishStatus);

const StyledSpan = styled.span`
    background: ${({ theme }) => theme.colors.common.backgroundContrast};
    color: ${({ theme }) => theme.colors.common.accent};
    font-family: ${({ theme }) => theme.typography.body.fontFamily};
    font-size: ${({ theme }) => theme.modal.defaultProps.headlineTypographyProps.size};
`;
