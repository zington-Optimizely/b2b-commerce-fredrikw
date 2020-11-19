import { Dictionary } from "@insite/client-framework/Common/Types";
import { getContextualId } from "@insite/client-framework/Store/Data/Pages/PrepareFields";
import Button from "@insite/mobius/Button";
import Checkbox, { CheckboxPresentationProps, CheckboxProps } from "@insite/mobius/Checkbox";
import DatePicker, { DatePickerPresentationProps, DatePickerState } from "@insite/mobius/DatePicker";
import Modal, { ModalPresentationProps } from "@insite/mobius/Modal";
import ToasterContext from "@insite/mobius/Toast/ToasterContext";
import Tooltip, { TooltipPresentationProps } from "@insite/mobius/Tooltip";
import Typography from "@insite/mobius/Typography";
import getColor from "@insite/mobius/utilities/getColor";
import BadgeDefault from "@insite/shell/Components/Icons/BadgeDefault";
import { ContentContextModel } from "@insite/shell/Services/ContentAdminService";
import {
    closePublishModal,
    loadAllPagePublishInfo,
    publish,
    setIsSelected,
    setIsSelectedForAll,
    setPublishOn,
    setRollbackOn,
    togglePublishInTheFuture,
} from "@insite/shell/Store/PublishModal/PublishModalActionCreators";
import { getCurrentPageForShell } from "@insite/shell/Store/ShellSelectors";
import ShellState from "@insite/shell/Store/ShellState";
import React, { useEffect } from "react";
import { connect, ResolveThunks } from "react-redux";
import styled, { css } from "styled-components";

const mapStateToProps = (state: ShellState) => {
    const {
        shellContext: { languagesById, personasById, permissions },
        publishModal: {
            showModal,
            publishInTheFuture,
            pagePublishInfosState,
            publishOn,
            rollbackOn,
            isEditingExistingPublish,
            failedToPublishPageIds,
            pagePublishInfoIsSelected,
            isBulkPublish,
        },
    } = state;

    const page = getCurrentPageForShell(state);

    return {
        visible: !!showModal,
        publishImmediately: !publishInTheFuture,
        page,
        pagePublishInfosState,
        languagesById,
        personasById,
        permissions,
        isEditingExistingPublish,
        publishOn,
        rollbackOn,
        failedToPublishPageIds,
        isBulkPublish,
        pagePublishInfoIsSelected,
    };
};

const mapDispatchToProps = {
    closePublishModal,
    togglePublishInTheFuture,
    publish,
    loadAllPagePublishInfo,
    setPublishOn,
    setRollbackOn,
    setIsSelected,
    setIsSelectedForAll,
};

export interface PublishPageSelection {
    pageId: string;
    parentId: string | null;
    contexts: ContentContextModel[];
}

interface PublishModalStyles {
    datePicker: DatePickerPresentationProps;
    modal: ModalPresentationProps;
    rollbackOnTooltip: TooltipPresentationProps;
    selectAllCheckbox: CheckboxPresentationProps;
}

const styles: PublishModalStyles = {
    datePicker: {
        labelProps: {
            size: 15,
        },
        cssOverrides: {
            formInputWrapper: css`
                width: 70%;
                margin-top: 2px !important;
            `,
            inputSelect: css`
                padding: 0 9px 0 9px;
            `,
            datePicker: css`
                span {
                    background-color: transparent;
                }
            `,
        },
        calendarIconProps: {
            color: "text.main",
            css: css`
                margin-right: -9px;
            `,
            src: "Calendar",
        },
        clearIconProps: {
            color: "text.main",
            src: "X",
        },
    },
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
    rollbackOnTooltip: {
        cssOverrides: {
            tooltipBody: css`
                font-weight: normal;
                text-transform: none;
            `,
            tooltipClickable: css`
                padding: 0;
            `,
            tooltipWrapper: css`
                margin-left: 5px;
                > button > span {
                    margin-top: -0.125em;
                    > svg {
                        position: relative;
                        top: 0.125em;
                    }
                }
            `,
        },
        typographyProps: {
            css: css`
                white-space: break-spaces;
                font-weight: 400;
                font-size: 15px;
                line-height: 18px;
            `,
        },
    },
    selectAllCheckbox: {
        css: css`
            span {
                background: #fff;
            }

            padding-top: 2px;
        `,
    },
};

type Props = ReturnType<typeof mapStateToProps> & ResolveThunks<typeof mapDispatchToProps>;

const PublishModal: React.FC<Props> = ({
    visible,
    closePublishModal,
    loadAllPagePublishInfo,
    publishImmediately,
    togglePublishInTheFuture,
    pagePublishInfosState,
    page: {
        id,
        fields: { title },
    },
    publish,
    languagesById,
    personasById,
    permissions,
    publishOn,
    rollbackOn,
    setPublishOn,
    setRollbackOn,
    isEditingExistingPublish,
    failedToPublishPageIds,
    isBulkPublish,
    pagePublishInfoIsSelected,
    setIsSelected,
    setIsSelectedForAll,
}) => {
    const [selectAll, setSelectAll] = React.useState<boolean | "indeterminate">(true);
    const toasterContext = React.useContext(ToasterContext);

    useEffect(() => {
        if (!visible) {
            return;
        }
        loadAllPagePublishInfo(id);
    }, [visible, id]);

    useEffect(() => {
        if (pagePublishInfoIsSelected.every(o => o)) {
            setSelectAll(true);
        } else if (pagePublishInfoIsSelected.every(o => !o)) {
            setSelectAll(false);
        } else {
            setSelectAll("indeterminate");
        }
    }, [pagePublishInfoIsSelected, setIsSelected]);

    const nothingToPublish =
        pagePublishInfosState.value &&
        pagePublishInfosState.value.length < 1 &&
        (isBulkPublish ? "There is no content to publish." : "There is no content on this page to publish.");

    const allPagesSkipped =
        !!failedToPublishPageIds &&
        Object.keys(failedToPublishPageIds).length > 0 &&
        !!pagePublishInfosState.value &&
        pagePublishInfoIsSelected.every(
            (o, index) => !o || failedToPublishPageIds[pagePublishInfosState.value![index].pageId],
        );

    const isApprover =
        permissions?.canApproveContent && pagePublishInfosState?.value?.some(o => o.isWaitingForApproval);

    let hasFewPagesForApproval = false;
    if (isApprover && isBulkPublish) {
        const pageIds: Dictionary<boolean> = {};
        pagePublishInfosState?.value?.forEach(o => {
            pageIds[o.pageId] = true;
        });
        hasFewPagesForApproval = Object.keys(pageIds).length > 1;
    }

    const hasFailedToPublishPages = failedToPublishPageIds && Object.keys(failedToPublishPageIds).length > 0;

    const publishOnChangeHandler = ({ selectedDay }: Pick<DatePickerState, "selectedDay">) => {
        setPublishOn(selectedDay);
    };

    const rollbackOnChangeHandler = ({ selectedDay }: Pick<DatePickerState, "selectedDay">) => {
        setRollbackOn(selectedDay);
    };

    const selectAllChangeHandler: CheckboxProps["onChange"] = (_, value) => {
        setIsSelectedForAll(value);
        setSelectAll(value);
    };

    const size =
        nothingToPublish || hasFewPagesForApproval || hasFailedToPublishPages ? 350 : isBulkPublish ? 980 : undefined;

    return (
        <ModalStyle
            isCloseable={false}
            data-test-selector="publishModal"
            size={size}
            isOpen={visible}
            handleClose={closePublishModal}
            headline="Publish Page"
            data-hide={pagePublishInfosState.isLoading}
            {...styles.modal}
        >
            <MessageContainer>
                {nothingToPublish && (
                    <Typography color="danger" data-test-selector="publishModal_message">
                        {nothingToPublish}
                    </Typography>
                )}
                {hasFailedToPublishPages && (
                    <Typography color="danger" data-test-selector="publishModal_failed_pages_message">
                        Publication of selected page(s) has failed. Would you like to skip these pages and continue
                        publishing?
                        <ul>
                            {pagePublishInfosState?.value?.map(({ pageId, name }) => {
                                return failedToPublishPageIds?.[pageId] ? <li key={pageId}>{name}</li> : null;
                            })}
                        </ul>
                    </Typography>
                )}
                {hasFewPagesForApproval && (
                    <Typography color="danger" data-test-selector="publishModal_hasFewPagesForApproval">
                        It is not possible to approve and publish multiple pages, please, use Publish instead.
                    </Typography>
                )}
            </MessageContainer>
            {!nothingToPublish && !hasFewPagesForApproval && !hasFailedToPublishPages && (
                <>
                    <PublishableContextTableWrapper>
                        <PublishableContextTable cellSpacing={0}>
                            <thead>
                                <tr>
                                    <th>
                                        <Checkbox
                                            data-test-selector="publishModal_selectAll"
                                            {...styles.selectAllCheckbox}
                                            disabled={isEditingExistingPublish}
                                            checked={selectAll}
                                            onChange={selectAllChangeHandler}
                                        ></Checkbox>
                                    </th>
                                    <th>Page</th>
                                    <th>Language</th>
                                    <th>Device</th>
                                    <th>Customer Segment</th>
                                    <th>Edited By</th>
                                    <th>Edited On</th>
                                    <th>Compare</th>
                                    {isBulkPublish && <th>Notes</th>}
                                </tr>
                            </thead>
                            <tbody data-test-selector="publishModal_contextsAvailableToPublish">
                                {pagePublishInfosState?.value?.map((pagePublishInfo, index) => {
                                    const {
                                        languageId,
                                        personaId,
                                        deviceType,
                                        modifiedBy,
                                        modifiedOn,
                                        pageId,
                                        name,
                                    } = pagePublishInfo;
                                    const contextString = getContextualId(
                                        languageId,
                                        deviceType,
                                        personaId,
                                        isBulkPublish ? pageId : "",
                                    );
                                    const testSelector = `publishContextRow${index}`;
                                    return (
                                        <tr key={contextString} data-test-selector={testSelector}>
                                            <td>
                                                <Checkbox
                                                    data-test-selector={`${testSelector}_check`}
                                                    checked={
                                                        pagePublishInfoIsSelected[index] || isEditingExistingPublish
                                                    }
                                                    disabled={isEditingExistingPublish}
                                                    onChange={(_, value) => {
                                                        setIsSelected(index, value);
                                                    }}
                                                />
                                            </td>
                                            <td data-test-selector={`${testSelector}_title`}>
                                                <NameStyle>
                                                    {isBulkPublish ? name : title} <BadgeDefault />
                                                </NameStyle>
                                            </td>
                                            <td data-test-selector={`${testSelector}_language`}>
                                                {!languageId
                                                    ? "All"
                                                    : languagesById[languageId]?.description ?? languageId}
                                            </td>
                                            <td data-test-selector={`${testSelector}_device`}>{deviceType || "All"}</td>
                                            <td data-test-selector={`${testSelector}_persona`}>
                                                {!personaId ? "All" : personasById[personaId]?.name ?? personaId}
                                            </td>
                                            <td data-test-selector={`${testSelector}_modifiedBy`}>{modifiedBy}</td>
                                            <td data-test-selector={`${testSelector}_modifiedOn`}>
                                                {new Date(modifiedOn).toLocaleString()}
                                            </td>
                                            <td>
                                                <ButtonInTable
                                                    data-test-selector={`${contextString}_compareButton`}
                                                    variant="tertiary"
                                                    disabled // TODO ISC-11132
                                                >
                                                    Compare
                                                </ButtonInTable>
                                            </td>
                                            {isBulkPublish && (
                                                <td>
                                                    <ButtonInTable
                                                        data-test-selector={`${contextString}_addNotesButton`}
                                                        variant="tertiary"
                                                        disabled // TODO ISC-12159
                                                    >
                                                        Add Notes
                                                    </ButtonInTable>
                                                </td>
                                            )}
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </PublishableContextTable>
                    </PublishableContextTableWrapper>
                    <PublishLaterContainer>
                        <div>
                            <Checkbox checked={publishImmediately} onChange={togglePublishInTheFuture}>
                                Publish Immediately
                            </Checkbox>
                            <br />
                        </div>
                        <div>
                            <DatePicker
                                {...styles.datePicker}
                                disabled={publishImmediately}
                                selectedDay={publishOn}
                                onDayChange={publishOnChangeHandler}
                                dateTimePickerProps={{
                                    minDate: new Date(),
                                    maxDate: rollbackOn,
                                }}
                                label="Publish On"
                                format="MM/dd/y hh:mm a"
                            />
                        </div>
                        <div>
                            <DatePicker
                                {...styles.datePicker}
                                disabled={publishImmediately}
                                selectedDay={rollbackOn}
                                onDayChange={rollbackOnChangeHandler}
                                dateTimePickerProps={{
                                    minDate: publishOn || new Date(),
                                }}
                                format="MM/dd/y hh:mm a"
                                label={
                                    <>
                                        Rollback On (Optional)
                                        <Tooltip
                                            {...styles.rollbackOnTooltip}
                                            text={
                                                "When this time is reached the published changes will be rolled back " +
                                                "and the previously published version of the page will display."
                                            }
                                        />
                                    </>
                                }
                            />
                        </div>
                    </PublishLaterContainer>
                </>
            )}
            <PublishCancelButtonContainer>
                <CancelButton variant="tertiary" onClick={closePublishModal}>
                    Cancel
                </CancelButton>
                {!nothingToPublish && (
                    <Button
                        variant="primary"
                        data-test-selector="publishModal_publish"
                        disabled={
                            !pagePublishInfosState.value ||
                            !!nothingToPublish ||
                            hasFewPagesForApproval ||
                            (pagePublishInfoIsSelected.every(o => !o) && !isEditingExistingPublish) ||
                            (!publishImmediately && !publishOn && !isEditingExistingPublish) ||
                            allPagesSkipped
                        }
                        onClick={() => publish(toasterContext)}
                    >
                        {hasFailedToPublishPages
                            ? permissions?.canPublishContent
                                ? "Skip and publish"
                                : "Skip and submit for approval"
                            : permissions?.canPublishContent
                            ? isApprover
                                ? "Approve and Publish"
                                : "Publish"
                            : "Submit for Approval"}
                    </Button>
                )}
            </PublishCancelButtonContainer>
        </ModalStyle>
    );
};

const ModalStyle = styled(Modal)`
    &[data-hide="true"] > div {
        display: none;
    }
`;

const MessageContainer = styled.div`
    display: flex;
    justify-content: space-between;
`;

const PublishableContextTable = styled.table`
    width: 100%;
    display: table;

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

    td:last-child {
        text-align: center;
    }
`;

const PublishableContextTableWrapper = styled.div`
    margin-bottom: 30px;
    max-height: 450px;
    overflow-y: auto;
`;

const ButtonInTable = styled(Button)`
    padding: 1px 4px 0;
    height: 20px;
    white-space: nowrap;
    > span {
        font-size: 13px;
    }
`;

const PublishLaterContainer = styled.div`
    padding: 15px 9px;
    display: flex;
    flex-wrap: wrap;

    > div:first-child {
        flex-basis: 100%;
    }

    > div {
        width: 50%;
    }
`;

const PublishCancelButtonContainer = styled.div`
    text-align: right;
`;

const CancelButton = styled(Button)`
    margin-top: 20px;
    margin-right: 10px;
`;

const NameStyle = styled.div`
    display: flex;
    align-items: center;

    > svg {
        margin-left: 4px;
    }
`;

export default connect(mapStateToProps, mapDispatchToProps)(PublishModal);
