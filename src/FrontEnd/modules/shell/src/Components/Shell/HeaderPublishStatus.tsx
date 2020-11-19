import { getPageState } from "@insite/shell/Services/ContentAdminService";
import { loadPublishInfo } from "@insite/shell/Store/PublishModal/PublishModalActionCreators";
import { getCurrentPageForShell } from "@insite/shell/Store/ShellSelectors";
import ShellState from "@insite/shell/Store/ShellState";
import React, { FC, useEffect } from "react";
import { connect, ResolveThunks } from "react-redux";
import styled from "styled-components";

const mapStateToProps = (state: ShellState) => {
    const {
        publishModal: { pagePublishInfosState },
        shellContext: { currentLanguageId, currentPersonaId, currentDeviceType, contentMode },
        pageEditor: { isEditingNewPage },
        pageTree: { treeNodesByParentId, headerTreeNodesByParentId, footerTreeNodesByParentId },
    } = state;

    const page = getCurrentPageForShell(state);
    const pageId = page.id;

    return {
        pageId,
        futurePublishOn: getPageState(
            pageId,
            treeNodesByParentId[page.parentId],
            headerTreeNodesByParentId[page.parentId],
            footerTreeNodesByParentId[page.parentId],
        )?.futurePublishOn,
        contentMode,
        loaded: pagePublishInfosState.value,
        hasDraft:
            isEditingNewPage ||
            (pagePublishInfosState.value &&
                !!pagePublishInfosState.value.find(
                    ({ pageId: publishPageId, languageId, personaId, deviceType }) =>
                        publishPageId === pageId &&
                        (!languageId || languageId === currentLanguageId) &&
                        (!personaId || personaId === currentPersonaId) &&
                        (!deviceType || deviceType === currentDeviceType),
                )),
    };
};

const mapDispatchToProps = {
    loadPublishInfo,
};

type Props = ReturnType<typeof mapStateToProps> & ResolveThunks<typeof mapDispatchToProps>;

const HeaderPublishStatus: FC<Props> = ({
    pageId,
    contentMode,
    loaded,
    hasDraft,
    loadPublishInfo,
    futurePublishOn,
}) => {
    useEffect(() => {
        loadPublishInfo(pageId);
    }, [pageId]);

    let value: "Published" | "Draft" | "Scheduled" | undefined;

    if (loaded) {
        switch (contentMode) {
            case "Previewing":
            case "Editing":
                value =
                    futurePublishOn && futurePublishOn > new Date() ? "Scheduled" : hasDraft ? "Draft" : "Published";
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
    width: 72px;
    background: ${({ theme }) => theme.colors.common.background};
    color: ${({ theme }) => theme.colors.text.accent};
    font-family: ${({ theme }) => theme.typography.body.fontFamily};
    font-size: ${({ theme }) => theme.modal.defaultProps.headlineTypographyProps.size};
    font-weight: bold;
`;
