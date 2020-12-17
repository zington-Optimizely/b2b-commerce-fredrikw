import { changeContext } from "@insite/client-framework/Store/Data/Pages/PagesActionCreators";
import { DeviceType } from "@insite/client-framework/Types/ContentItemModel";
import Button from "@insite/mobius/Button";
import Icon from "@insite/mobius/Icon";
import Globe from "@insite/mobius/Icons/Globe";
import Monitor from "@insite/mobius/Icons/Monitor";
import Smartphone from "@insite/mobius/Icons/Smartphone";
import Tablet from "@insite/mobius/Icons/Tablet";
import Users from "@insite/mobius/Icons/Users";
import getColor from "@insite/mobius/utilities/getColor";
import ArrowDown from "@insite/shell/Components/Icons/ArrowDown";
import Stage, { DeviceContent } from "@insite/shell/Components/Shell/Stage";
import ViewPortClicker from "@insite/shell/Components/Shell/ViewPortClicker";
import { PageVersionInfoModel } from "@insite/shell/Services/ContentAdminService";
import shellTheme, { ShellThemeProps } from "@insite/shell/ShellTheme";
import {
    configureComparison,
    loadPublishedPageVersions,
    restoreVersion,
} from "@insite/shell/Store/PublishModal/PublishModalActionCreators";
import { getCurrentPageForShell } from "@insite/shell/Store/ShellSelectors";
import ShellState from "@insite/shell/Store/ShellState";
import React from "react";
import { connect, ResolveThunks } from "react-redux";
import styled from "styled-components";

const mapStateToProps = (state: ShellState) => {
    const {
        publishModal: { compareVersions, publishedPageVersionsState },
        shellContext: { languages, personas, deviceTypes },
    } = state;

    return {
        compareVersions,
        publishedPageVersionsState,
        languages,
        personas,
        deviceTypes,
    };
};

const mapDispatchToProps = {
    configureComparison,
    loadPublishedPageVersions,
    restoreVersion,
};

type Props = ReturnType<typeof mapStateToProps> & ResolveThunks<typeof mapDispatchToProps>;

const primaryContrast = shellTheme.colors.primary.contrast;

interface State {
    selectionOpened: boolean;
    showAllVersions: boolean;
    versionsLoaded: boolean;
}

class PublishComparer extends React.Component<Props, State> {
    private readonly pageVersionOptionsElement = React.createRef<HTMLDivElement>();

    constructor(props: Props) {
        super(props);

        this.state = {
            selectionOpened: false,
            showAllVersions: false,
            versionsLoaded: false,
        };
    }

    toggleSelectionClickHandler = () => {
        this.setState({ selectionOpened: !this.state.selectionOpened });
    };

    showAllVersionsHandler = () => {
        this.setState({ showAllVersions: true });
    };

    closeModalHandler = () => {
        this.props.configureComparison();
        this.setState({ selectionOpened: false, showAllVersions: false, versionsLoaded: false });
    };

    restorePageVersionHandler = (pageVersion: PageVersionInfoModel) => {
        this.setState({ selectionOpened: false });
        this.props.restoreVersion(pageVersion, this.props.compareVersions!.pageId);
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
            this.props.loadPublishedPageVersions(this.props.compareVersions!.pageId);
        }
    }
    onLanguageChange = (event: React.FormEvent<HTMLSelectElement>) => {
        const compareVersions = { ...this.props.compareVersions!, languageId: event.currentTarget.value };
        this.props.configureComparison(compareVersions);
    };

    onPersonaChange = (event: React.FormEvent<HTMLSelectElement>) => {
        const compareVersions = { ...this.props.compareVersions!, personaId: event.currentTarget.value };
        this.props.configureComparison(compareVersions);
    };

    onDeviceTypeChange = (event: React.FormEvent<HTMLSelectElement>) => {
        const compareVersions = { ...this.props.compareVersions!, deviceType: event.currentTarget.value };
        this.props.configureComparison(compareVersions);
    };

    changeStageMode = (stageMode: DeviceType) => {
        const compareVersions = { ...this.props.compareVersions!, stageMode };
        this.props.configureComparison(compareVersions);
    };

    render() {
        const { compareVersions, publishedPageVersionsState, languages, personas, deviceTypes } = this.props;

        if (!compareVersions) {
            return null;
        }

        const { unpublished, published, languageId, deviceType, personaId, stageMode } = compareVersions;

        if (!unpublished || !published || !publishedPageVersionsState || publishedPageVersionsState.isLoading) {
            return null;
        }

        let versions = publishedPageVersionsState.value;
        if (!this.state.showAllVersions && versions && versions.length > 5) {
            versions = versions.slice(0, 5);
        }

        const { hasDeviceSpecificContent, hasPersonaSpecificContent } = languages.filter(o => o.id === languageId)[0];

        const forcedContext = `&languageId=${languageId}&deviceType=${deviceType}&personaId=${personaId}`;

        const clicker = (targetStageMode: DeviceType) => (
            <ViewPortClicker
                targetStageMode={targetStageMode}
                currentStageMode={stageMode}
                changeStageMode={this.changeStageMode}
            />
        );

        return (
            <FullScreenModal data-test-selector="publishCompareModal">
                <ContextHeader>
                    <ContextSelects>
                        <Icon src={Globe} size={20} color="#000" />
                        <select
                            onChange={this.onLanguageChange}
                            data-test-selector="publishCompareModal_languageSelect"
                            value={languageId}
                        >
                            {languages.map(({ id, description }) => (
                                <option key={id} value={id}>
                                    {description}
                                </option>
                            ))}
                        </select>
                        {hasDeviceSpecificContent && (
                            <>
                                <Icon src={Monitor} size={20} color="#000" />
                                <select
                                    onChange={this.onDeviceTypeChange}
                                    value={deviceType}
                                    data-test-selector="publishCompareModal_deviceSelect"
                                >
                                    {deviceTypes.map(deviceType => (
                                        <option key={deviceType} value={deviceType}>
                                            {deviceType}
                                        </option>
                                    ))}
                                </select>
                            </>
                        )}
                        {hasPersonaSpecificContent && (
                            <>
                                <Icon src={Users} size={20} color="#000" />
                                <select
                                    onChange={this.onPersonaChange}
                                    data-test-selector="publishCompareModal_personaSelect"
                                    value={personaId}
                                >
                                    {personas.map(({ id, name }) => (
                                        <option key={id} value={id}>
                                            {name}
                                        </option>
                                    ))}
                                </select>
                            </>
                        )}
                    </ContextSelects>
                    <RightSideStuff>
                        {clicker("Phone")}
                        {clicker("Tablet")}
                        {clicker("Desktop")}

                        <CloseButton
                            size={30}
                            data-test-selector="publishCompareModal_close"
                            onClick={this.closeModalHandler}
                        >
                            Close
                        </CloseButton>
                    </RightSideStuff>
                </ContextHeader>
                <VersionsHeader>
                    <CurrentlyPublishedHeader>
                        <VersionSelectionWrapper ref={this.pageVersionOptionsElement}>
                            <VersionSelector title="Version Selection" onClick={this.toggleSelectionClickHandler}>
                                <span>Currently Published: </span>
                                <span>{new Date(published.publishOn).toLocaleString()}</span>
                                <ArrowDownWrapper>
                                    <ArrowDown color1={primaryContrast} height={7} />
                                </ArrowDownWrapper>
                            </VersionSelector>
                            <PageVersionOptions isActive={this.state.selectionOpened}>
                                {versions?.map(o => {
                                    return (
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
                                            {/* <div>
                                                <RestoreButton
                                                    size={22}
                                                    sizeVariant="small"
                                                    onClick={() => this.restorePageVersionHandler(o)}
                                                >
                                                    Restore
                                                </RestoreButton>
                                            </div> */}
                                        </PageVersionOption>
                                    );
                                })}
                                {!this.state.showAllVersions &&
                                    publishedPageVersionsState.value &&
                                    publishedPageVersionsState.value.length > 5 && (
                                        <ShowCompleteHistoryButton onClick={this.showAllVersionsHandler}>
                                            Show Complete History
                                        </ShowCompleteHistoryButton>
                                    )}
                            </PageVersionOptions>
                        </VersionSelectionWrapper>
                    </CurrentlyPublishedHeader>
                    <ToBePublishedHeader>
                        <div>
                            <span>Version From: </span>
                            <span>{new Date(unpublished.modifiedOn).toLocaleString()}</span>
                        </div>
                    </ToBePublishedHeader>
                </VersionsHeader>
                <PreviewRow>
                    <StageWrapper>
                        <Stage stageMode={stageMode}>
                            <PreviewFrame
                                stageMode={stageMode}
                                src={`/.spire/GetContentByVersion?pageVersionId=${published.versionId}${forcedContext}`}
                            />
                        </Stage>
                    </StageWrapper>
                    <StageWrapper>
                        <Stage stageMode={stageMode}>
                            <PreviewFrame
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
    position: absolute;
    top: 0;
    left: 0;
    background-color: #f4f4f4;
    width: 100vw;
    height: 100vh;
    z-index: 1400;
    display: flex;
    flex-direction: column;
`;

const VersionsHeader = styled.div`
    display: flex;
    height: 40px;
    > div {
        width: 50%;
    }
`;

const ContextHeader = styled.div`
    display: flex;

    > * {
        width: 50%;
    }
`;

const ContextSelects = styled.div`
    display: flex;
    align-items: center;
    margin-left: 10px;
    > select {
        font-weight: bold;
        border: none;
        background: transparent;
        margin-right: 16px;
        height: 32px;
        cursor: pointer;
    }
`;

const RightSideStuff = styled.div`
    display: flex;
    justify-content: flex-end;
    margin-right: 10px;
    align-items: center;
    padding: 1px 0;
`;

const PreviewRow = styled.div`
    display: flex;
    flex-direction: row;
    height: 100%;

    > * {
        width: 50%;
        overflow: auto;
    }
`;

const StageWrapper = styled.div`
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

const CloseButton = styled(Button)`
    margin-left: 10px;
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
    top: 40px;
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
    width: 250px;
    > div {
        text-overflow: ellipsis;
        overflow: hidden;
    }
`;

const ShowCompleteHistoryButton = styled(Button)`
    width: 100%;
`;

export default connect(mapStateToProps, mapDispatchToProps)(PublishComparer);
