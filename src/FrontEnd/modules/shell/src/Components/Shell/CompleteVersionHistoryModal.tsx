import Button from "@insite/mobius/Button";
import LoadingSpinner, { LoadingSpinnerProps } from "@insite/mobius/LoadingSpinner";
import Modal, { ModalPresentationProps } from "@insite/mobius/Modal";
import Pagination, { PaginationPresentationProps } from "@insite/mobius/Pagination";
import Radio from "@insite/mobius/Radio";
import RadioGroup from "@insite/mobius/RadioGroup";
import getColor from "@insite/mobius/utilities/getColor";
import {
    closeCompleteVersionHistoryModal,
    loadPublishedPageVersions,
    restoreVersion,
} from "@insite/shell/Store/CompareModal/CompareModalActionCreators";
import ShellState from "@insite/shell/Store/ShellState";
import React, { ChangeEvent, useEffect } from "react";
import { connect, ResolveThunks } from "react-redux";
import styled, { css } from "styled-components";

const mapStateToProps = (state: ShellState) => {
    const {
        compareModal: { showCompleteVersionHistory, publishedPageVersionsPaginated, compareVersions },
        shellContext: { currentLanguageId, currentPersonaId, currentDeviceType, languages, personas },
    } = state;

    return {
        visible: !!showCompleteVersionHistory,
        publishedPageVersionsPaginated,
        compareVersions,
        currentLanguage: languages?.find(o => o.id === currentLanguageId)?.description,
        currentPersona: personas?.find(o => o.id === currentPersonaId)?.name,
        currentDeviceType,
    };
};

const mapDispatchToProps = {
    closeCompleteVersionHistoryModal,
    loadPublishedPageVersions,
    restoreVersion,
};

interface CompleteVersionHistoryModalStyles {
    modal: ModalPresentationProps;
    pagination: PaginationPresentationProps;
    loadingSpinner: LoadingSpinnerProps;
}

const styles: CompleteVersionHistoryModalStyles = {
    modal: {
        cssOverrides: {
            modalBody: css`
                overflow: visible;
            `,
            modalContent: css`
                overflow: visible;
                padding: 15px;
                background: #fff;
            `,
        },
    },
    pagination: {
        cssOverrides: {
            pagination: css`
                justify-content: flex-start;
                button:hover span,
                span:hover {
                    color: #fff;
                }
            `,
        },
        buttonProps: {
            hoverStyle: {
                color: "#fff",
            },
        },
    },
    loadingSpinner: {
        css: css`
            margin: 40px auto;
            display: block;
        `,
        color: "primary",
        size: 50,
    },
};

type Props = ReturnType<typeof mapStateToProps> & ResolveThunks<typeof mapDispatchToProps>;

const CompleteVersionHistoryModal: React.FC<Props> = ({
    visible,
    publishedPageVersionsPaginated,
    closeCompleteVersionHistoryModal,
    loadPublishedPageVersions,
    restoreVersion,
    compareVersions,
    currentLanguage,
    currentPersona,
    currentDeviceType,
}) => {
    const [selectedVersion, setSelectedVersion] = React.useState<string>("");
    const pageSize = 12;

    useEffect(() => {
        if (!visible || !compareVersions) {
            return;
        }
        loadPublishedPageVersions(compareVersions.pageId, 1, pageSize);
    }, [visible, compareVersions?.pageId]);

    const pageVersionChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
        setSelectedVersion(event.currentTarget.value);
    };

    const changePage = (newPageIndex: number) => {
        setSelectedVersion("");
        if (compareVersions) {
            loadPublishedPageVersions(compareVersions.pageId, newPageIndex, pageSize, true);
        }
    };

    const restorePageVersionHandler = () => {
        closeCompleteVersionHistoryModal();
        if (compareVersions && selectedVersion) {
            const pageVersion = publishedPageVersionsPaginated?.pageVersions.find(o => o.versionId === selectedVersion);
            if (pageVersion) {
                restoreVersion(pageVersion, compareVersions.pageId);
            }
        }
    };

    return (
        <ModalStyle
            isCloseable={false}
            data-test-selector="completeVersionHistoryModal"
            size={900}
            isOpen={visible}
            handleClose={closeCompleteVersionHistoryModal}
            headline={`Complete history - ${compareVersions?.name}`}
            {...styles.modal}
        >
            <>
                {publishedPageVersionsPaginated && (
                    <VersionHistoryTableWrapper>
                        <>
                            <ContextInfoWrapper>
                                <span>Customer Segment:</span> {currentPersona}
                            </ContextInfoWrapper>
                            <ContextInfoWrapper>
                                <span>Language:</span> {currentLanguage}
                            </ContextInfoWrapper>
                            <ContextInfoWrapper>
                                <span>Device:</span> {currentDeviceType}
                            </ContextInfoWrapper>
                        </>
                        <RadioGroup onChangeHandler={pageVersionChangeHandler} value={selectedVersion}>
                            <VersionHistoryTable cellSpacing={0}>
                                <thead>
                                    <tr>
                                        <th>Published Version</th>
                                        <th>Published By</th>
                                        <th>Notes</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {publishedPageVersionsPaginated?.pageVersions.map(pageVersion => {
                                        const { modifiedBy, modifiedOn, versionId } = pageVersion;
                                        return (
                                            <tr key={versionId}>
                                                <td>
                                                    <Radio value={versionId}>
                                                        {new Date(modifiedOn).toLocaleString()}
                                                    </Radio>
                                                </td>
                                                <td>{modifiedBy}</td>
                                                <td></td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </VersionHistoryTable>
                        </RadioGroup>
                    </VersionHistoryTableWrapper>
                )}
                {!publishedPageVersionsPaginated && (
                    <>
                        <LoadingSpinner {...styles.loadingSpinner} />
                    </>
                )}
            </>
            <>
                {publishedPageVersionsPaginated && (
                    <Pagination
                        {...styles.pagination}
                        resultsCount={publishedPageVersionsPaginated.totalItemCount}
                        currentPage={publishedPageVersionsPaginated.page}
                        resultsPerPage={pageSize}
                        resultsPerPageOptions={[]}
                        onChangePage={changePage}
                        onChangeResultsPerPage={() => {}}
                    />
                )}
                <Button disabled={!selectedVersion} variant="primary" onClick={restorePageVersionHandler}>
                    View
                </Button>
                <CancelButton variant="tertiary" onClick={closeCompleteVersionHistoryModal}>
                    Cancel
                </CancelButton>
            </>
        </ModalStyle>
    );
};

const ModalStyle = styled(Modal)`
    &[data-hide="true"] > div {
        display: none;
    }
`;

const VersionHistoryTable = styled.table`
    width: 100%;
    display: table;
    padding-top: 10px;

    th {
        background: ${getColor("common.backgroundContrast")};
        color: ${getColor("common.accent")};
        padding-left: 9px;
        padding-right: 9px;
        text-align: left;
        font-weight: normal;
        white-space: nowrap;

        &:first-child {
            padding-top: 4px;
        }

        &:not(:first-child) {
            border-left: 1px solid rgba(255, 255, 255, 0.3);
        }
    }

    td {
        border-bottom: 1px solid rgba(155, 155, 155, 0.3);
        padding: 4px 9px;

        &:first-child {
            padding-top: 7px;
            padding-bottom: 0;
        }

        &:not(:first-child) {
            border-left: 1px solid rgba(155, 155, 155, 0.3);
        }
    }

    tr:nth-child(even) {
        background: #f2f2f2;
    }
`;

const VersionHistoryTableWrapper = styled.div`
    max-height: 450px;
    overflow-y: auto;
`;

const CancelButton = styled(Button)`
    margin-top: 20px;
    margin-left: 10px;
`;

const ContextInfoWrapper = styled.span`
    span {
        font-weight: 600;
    }
    margin-right: 20px;
`;

export default connect(mapStateToProps, mapDispatchToProps)(CompleteVersionHistoryModal);
