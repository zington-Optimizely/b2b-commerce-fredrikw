import { DeviceType } from "@insite/client-framework/Types/ContentItemModel";
import Button from "@insite/mobius/Button";
import getColor from "@insite/mobius/utilities/getColor";
import ContextHeader from "@insite/shell/Components/CompareModal/ContextHeader";
import ArrowDown from "@insite/shell/Components/Icons/ArrowDown";
import Stage, { DeviceContent } from "@insite/shell/Components/Shell/Stage";
import { PageVersionInfoModel } from "@insite/shell/Services/ContentAdminService";
import shellTheme from "@insite/shell/ShellTheme";
import {
    closeComparison,
    loadPublishedPageVersions,
    restoreVersion,
    showCompleteVersionHistoryModal,
} from "@insite/shell/Store/CompareModal/CompareModalActionCreators";
import ShellState from "@insite/shell/Store/ShellState";
import React from "react";
import { connect, ResolveThunks } from "react-redux";
import styled from "styled-components";

const mapStateToProps = (state: ShellState) => {
    const {
        compareModal: { compareVersions, publishedPageVersions, isSideBySide, isShowingLeftSide },
    } = state;

    return {
        compareVersions,
        publishedPageVersions,
        isSideBySide,
        isShowingLeftSide,
    };
};

const mapDispatchToProps = {
    loadPublishedPageVersions,
    showCompleteVersionHistoryModal,
    restoreVersion,
    closeComparison,
};

type Props = ReturnType<typeof mapStateToProps> & ResolveThunks<typeof mapDispatchToProps>;

const primaryContrast = shellTheme.colors.primary.contrast;

interface State {
    selectionOpened: boolean;
    versionsLoaded: boolean;
}

class PublishComparer extends React.Component<Props, State> {
    private readonly pageVersionOptionsElement = React.createRef<HTMLDivElement>();

    constructor(props: Props) {
        super(props);

        this.state = {
            selectionOpened: false,
            versionsLoaded: false,
        };
    }

    toggleSelectionClickHandler = () => {
        this.setState({ selectionOpened: !this.state.selectionOpened });
    };

    showAllVersionsHandler = () => {
        this.setState({ selectionOpened: false });
        this.props.showCompleteVersionHistoryModal();
    };

    closeModalHandler = () => {
        this.props.closeComparison();
        this.setState({ selectionOpened: false, versionsLoaded: false });
    };

    restorePageVersionHandler = (pageVersion: PageVersionInfoModel) => {
        this.setState({ selectionOpened: false });
        if (this.props.compareVersions) {
            this.props.restoreVersion(pageVersion, this.props.compareVersions.pageId);
        }
    };

    componentDidMount() {
        this.loadPageVersionsIfNeeded();
        document.addEventListener("mousedown", this.handleClickOutside);
    }

    componentWillUnmount() {
        document.removeEventListener("mousedown", this.handleClickOutside);
    }

    handleClickOutside = (event: MouseEvent) => {
        if (
            this.state.selectionOpened &&
            this.pageVersionOptionsElement.current &&
            !this.pageVersionOptionsElement.current.contains(event.target as Node)
        ) {
            this.setState({ selectionOpened: false });
        }
    };

    componentDidUpdate() {
        this.loadPageVersionsIfNeeded();
    }

    loadPageVersionsIfNeeded() {
        if (
            !this.state.versionsLoaded &&
            this.props.compareVersions?.unpublished &&
            this.props.compareVersions?.published
        ) {
            this.setState({ versionsLoaded: true });
            this.props.loadPublishedPageVersions(this.props.compareVersions.pageId, 1, 5);
        }
    }

    render() {
        const { compareVersions, publishedPageVersions, isSideBySide, isShowingLeftSide } = this.props;

        if (!compareVersions) {
            return null;
        }

        const { unpublished, published, languageId, deviceType, personaId, stageMode } = compareVersions;

        if (!unpublished || !published || !publishedPageVersions) {
            return null;
        }

        const forcedContext = `&languageId=${languageId}&deviceType=${deviceType}&personaId=${personaId}`;

        return (
            <FullScreenModal data-test-selector="publishCompareModal">
                <ContextHeader closeModal={this.closeModalHandler} />
                <VersionsHeader isSideBySide={isSideBySide}>
                    {(isSideBySide || isShowingLeftSide) && (
                        <CurrentlyPublishedHeader>
                            <VersionSelectionWrapper ref={this.pageVersionOptionsElement}>
                                <VersionSelector
                                    title="Version Selection"
                                    data-test-selector="publishCompareModal_toggleSelection"
                                    onClick={this.toggleSelectionClickHandler}
                                >
                                    <span>Currently Published: </span>
                                    <span>{new Date(published.publishOn).toLocaleString()}</span>
                                    <ArrowDownWrapper>
                                        <ArrowDown color1={primaryContrast} height={7} />
                                    </ArrowDownWrapper>
                                </VersionSelector>
                                <PageVersionOptions isActive={this.state.selectionOpened}>
                                    {publishedPageVersions?.pageVersions?.map((o, index) => (
                                        <PageVersionOption key={o.versionId}>
                                            <PageVersionPublishInfo>
                                                <div>
                                                    <span>Published On:</span>
                                                    {new Date(o.publishOn).toLocaleString()}
                                                </div>
                                                <div>
                                                    <span>Published By:</span>
                                                    {o.modifiedBy}
                                                </div>
                                            </PageVersionPublishInfo>
                                            <div>
                                                <RestoreButton
                                                    size={22}
                                                    sizeVariant="small"
                                                    data-test-selector={`publishCompareModal_view_${index}`}
                                                    onClick={() => this.restorePageVersionHandler(o)}
                                                >
                                                    View
                                                </RestoreButton>
                                            </div>
                                        </PageVersionOption>
                                    ))}
                                    {publishedPageVersions && publishedPageVersions.totalItemCount > 5 && (
                                        <ShowCompleteHistoryButton onClick={this.showAllVersionsHandler}>
                                            Show Complete History
                                        </ShowCompleteHistoryButton>
                                    )}
                                </PageVersionOptions>
                            </VersionSelectionWrapper>
                        </CurrentlyPublishedHeader>
                    )}
                    {(isSideBySide || !isShowingLeftSide) && (
                        <ToBePublishedHeader>
                            <div>
                                <span>Version From: </span>
                                <span>{new Date(unpublished.modifiedOn).toLocaleString()}</span>
                            </div>
                        </ToBePublishedHeader>
                    )}
                </VersionsHeader>
                <PreviewRow isSideBySide={isSideBySide}>
                    <StageWrapper isVisible={isSideBySide || isShowingLeftSide}>
                        <Stage stageMode={stageMode}>
                            <PreviewFrame
                                id="leftSiteIFrame"
                                stageMode={stageMode}
                                src={`/.spire/GetContentByVersion?pageVersionId=${published.versionId}${forcedContext}`}
                            />
                        </Stage>
                    </StageWrapper>
                    <StageWrapper isVisible={isSideBySide || !isShowingLeftSide}>
                        <Stage stageMode={stageMode}>
                            <PreviewFrame
                                id="rightSiteIFrame"
                                stageMode={stageMode}
                                src={`/.spire/GetContentByVersion?pageVersionId=${unpublished.versionId}${forcedContext}`}
                            />
                        </Stage>
                    </StageWrapper>
                </PreviewRow>
            </FullScreenModal>
        );
    }
}

const FullScreenModal = styled.div`
    padding-top: 40px;
    position: absolute;
    top: 0;
    left: 0;
    background-color: #f4f4f4;
    width: 100vw;
    height: 100vh;
    display: flex;
    flex-direction: column;
`;

const VersionsHeader = styled.div<{ isSideBySide: boolean }>`
    display: flex;
    height: 40px;
    > div {
        width: ${props => (props.isSideBySide ? "50%" : "100%")};
    }
`;

const PreviewRow = styled.div<{ isSideBySide: boolean }>`
    display: flex;
    flex-direction: row;
    height: 100%;

    > div {
        width: ${props => (props.isSideBySide ? "50%" : "100%")};
        overflow: auto;
    }
`;

const StageWrapper = styled.div<{ isVisible: boolean }>`
    display: ${props => (props.isVisible ? "block" : "none")};
    padding: 5px;
    iframe {
        margin: 0;
    }
    ${DeviceContent} {
        text-align: center;
    }
`;

const PreviewFrame = styled.iframe<{ stageMode: DeviceType }>`
    border: 0 none;

    ${({ stageMode, theme }) => {
        if (stageMode === "Desktop") {
            return `
                box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.15);
                min-width: calc(20px + ${theme.breakpoints.values[3]}px);
                margin: 10px;
                width: calc(100% - 20px);
                height: calc(100% - 30px);`;
        }

        return `
            width: 100%;
            height: 100%;
        `;
    }}
`;

const PublishHeader = styled.div`
    color: white;
    font-size: 18px;
    display: flex;

    > *:first-child {
        padding-top: 5px;

        > *:first-child {
            margin-left: 10px;
            font-weight: 700;
        }
    }
`;

const CurrentlyPublishedHeader = styled(PublishHeader)`
    background: ${getColor("common.backgroundContrast")};
`;

const ToBePublishedHeader = styled(PublishHeader)`
    background: #f5a623;
    > *:first-child {
        color: ${getColor("common.accentContrast")};
    }
`;

const VersionSelectionWrapper = styled.div`
    width: auto;
    position: relative;
`;

const VersionSelector = styled.div`
    cursor: pointer;
    &:hover {
        opacity: 0.9;
    }
`;

const ArrowDownWrapper = styled.span`
    margin-left: 10px;
    position: relative;
    top: -2px;
`;

const PageVersionOptions = styled.div<{ isActive: boolean }>`
    position: absolute;
    z-index: 1;
    top: 35px;
    ${props => (props.isActive ? "display: block;" : "display: none;")}
    color: ${getColor("common.accentContrast")};
    font-size: 0.8em;
    background: ${getColor("common.background")};
    border: 1px solid #cacaca;
    overflow-y: auto;
    overflow-x: hidden;
`;

const PageVersionOption = styled.div`
    display: flex;
    border-bottom: 1px solid #cacaca;
    padding: 5px 0 5px 10px;
    white-space: nowrap;
    span {
        font-weight: 600;
        margin-right: 3px;
    }
`;

const RestoreButton = styled(Button)`
    background: ${getColor("common.background")};
    color: ${getColor("common.accentContrast")};
    border-color: ${getColor("common.backgroundContrast")};
    &:hover {
        opacity: 0.9;
        background: ${getColor("common.background")};
    }
    &:disabled {
        background: ${getColor("common.backgroundContrast")};
    }
    height: 22px;
    margin: 10px 20px;
`;

const PageVersionPublishInfo = styled.div`
    width: 270px;
    > div {
        text-overflow: ellipsis;
        overflow: hidden;
    }
`;

const ShowCompleteHistoryButton = styled(Button)`
    width: 100%;
`;

export default connect(mapStateToProps, mapDispatchToProps)(PublishComparer);
