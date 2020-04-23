import React, { FC, useEffect } from "react";
import { connect, ResolveThunks } from "react-redux";
import ShellState from "@insite/shell/Store/ShellState";
import { loadPublishInfo } from "@insite/shell/Store/ShellContext/ShellContextActionCreators";
import styled from "styled-components";

const mapStateToProps = ({
    shellContext: {
        currentLanguageId,
        currentPersonaId,
        currentDeviceType,
        pagePublishInfo,
        contentMode,
    },
    currentPage: {
        page: {
            id,
        },
    },
    pageEditor: {
        isEditingNewPage,
    },
}: ShellState) => ({
    id,
    contentMode,
    loaded: pagePublishInfo.value,
    hasDraft: isEditingNewPage || (pagePublishInfo.value && !!pagePublishInfo.value
        .find(page => page.pageId === id && page.unpublishedContexts
            .find(({ languageId, personaId, deviceType }) => (!languageId || languageId === currentLanguageId) && (!personaId || personaId === currentPersonaId) && (!deviceType || deviceType === currentDeviceType)),
        )),
});

const mapDispatchToProps = ({
    loadPublishInfo,
});

type Props = ReturnType<typeof mapStateToProps> & ResolveThunks<typeof mapDispatchToProps>;

const HeaderPublishStatus: FC<Props> = ({
    id,
    contentMode,
    loaded,
    hasDraft,
    loadPublishInfo,
}) => {
    useEffect(() => loadPublishInfo(id), [id]);

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

    return <StyledSpan data-test-selector="publishStatus">{value || "..."}</StyledSpan>; 41;
};

export default connect(mapStateToProps, mapDispatchToProps)(HeaderPublishStatus);

const StyledSpan = styled.span`
    background: ${({ theme }) => theme.colors.common.backgroundContrast};
    color: ${({ theme }) => theme.colors.common.accent};
    font-family: ${({ theme }) => theme.typography.body.fontFamily};
    font-size: ${({ theme }) => theme.modal.defaultProps.headlineTypographyProps.size};
`;
