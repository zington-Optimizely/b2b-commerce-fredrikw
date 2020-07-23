import { SafeDictionary } from "@insite/client-framework/Common/Types";
import { getContextualId } from "@insite/client-framework/Store/Data/Pages/PrepareFields";
import Button from "@insite/mobius/Button";
import Checkbox, { CheckboxPresentationProps, CheckboxProps } from "@insite/mobius/Checkbox";
import DatePicker, { DatePickerPresentationProps, DatePickerState } from "@insite/mobius/DatePicker";
import LoadingOverlay from "@insite/mobius/LoadingOverlay";
import Modal from "@insite/mobius/Modal";
import Tooltip from "@insite/mobius/Tooltip";
import Typography from "@insite/mobius/Typography";
import getColor from "@insite/mobius/utilities/getColor";
import BadgeDefault from "@insite/shell/Components/Icons/BadgeDefault";
import { sendToSite } from "@insite/shell/Components/Shell/SiteHole";
import { ContentContextModel, getPageBulkPublishInfo, getPagePublishInfo, publishPages } from "@insite/shell/Services/ContentAdminService";
import { AnyShellAction } from "@insite/shell/Store/Reducers";
import { loadPublishInfo } from "@insite/shell/Store/ShellContext/ShellContextActionCreators";
import { getCurrentPageForShell } from "@insite/shell/Store/ShellSelectors";
import ShellState from "@insite/shell/Store/ShellState";
import ShellThunkAction from "@insite/shell/Store/ShellThunkAction";
import cloneDeep from "lodash/cloneDeep";
import React, { useEffect, useState } from "react";
import { connect, ResolveThunks } from "react-redux";
import styled, { css } from "styled-components";

const mapStateToProps = (state: ShellState) => {
    const {
        shellContext: {
            showModal,
            publishInTheFuture,
            pagePublishInfo,
            languagesById,
            personasById,
            publishOn,
            rollbackOn,
            isPublishEdit,
            failedToPublishPageIds,
        },
    } = state;

    const page = getCurrentPageForShell(state);

    return ({
        visible: showModal === "Publish" || showModal === "Bulk Publish",
        publishImmediately: !publishInTheFuture,
        page,
        pagePublishInfo,
        languagesById,
        personasById,
        permissions: state.shellContext.permissions,
        isPublishEdit,
        publishOn,
        rollbackOn,
        failedToPublishPageIds,
        isBulkPublish: showModal === "Bulk Publish",
    });
};

const mapDispatchToProps = {
    close: (): AnyShellAction => ({
        type: "ShellContext/SetShowModal",
    }),
    togglePublishInTheFuture: (): AnyShellAction => ({
        type: "ShellContext/TogglePublishInTheFuture",
    }),
    publish: (currentPageId: string, pages: PublishPageSelection[], futurePublish: boolean, publishOn?: Date, rollbackOn?: Date): ShellThunkAction => async (dispatch, getState) => {
        const publishResult = await publishPages({ pages, futurePublish, publishOn, rollbackOn });
        const state = getState();

        if (!publishResult.success) {
            const previousIds = state.shellContext.failedToPublishPageIds ? cloneDeep(state.shellContext.failedToPublishPageIds) : {};
            publishResult.ErrorInfos.forEach(o => { previousIds[o.pageId] = true; });
            dispatch({
                type: "ShellContext/SetFailedToPublishPageIds",
                failedPageIds: previousIds,
            });
            return;
        }

        if (state.shellContext.showModal === "Publish") dispatch(loadPublishInfo(pages[0].pageId));

        dispatch({
            type: "ShellContext/SetShowModal",
        });

        for (const page of pages) {
            dispatch({
                type: "PageTree/UpdatePageState",
                pageId: page.pageId,
                parentId: page.parentId,
                publishOn: publishOn && rollbackOn && rollbackOn > publishOn ? rollbackOn : (publishOn || rollbackOn),
            });
        }

        if (!pages.some(o => o.pageId === currentPageId)) {
            return;
        }

        sendToSite({
            type: "CMSPermissions",
            permissions: state.shellContext.permissions,
            canChangePage: Math.max(publishOn?.getTime() || 0, rollbackOn?.getTime() || 0) <= Date.now(),
        });

        sendToSite({ type: "Reload" });
    },
    refresh: (pageId: string): ShellThunkAction => async (dispatch, getState) => {
        dispatch({
            type: "ShellContext/BeginLoadingPublishInfo",
        });

        const state = getState();

        if (state.shellContext.showModal === "Publish") {
            const page = await getPagePublishInfo(pageId);
            const futurePublish = page && page.unpublishedContexts.length && page.unpublishedContexts[0].futurePublishOn && new Date(page.unpublishedContexts[0].futurePublishOn) > new Date();
            const rollback = page && page.unpublishedContexts.length && page.unpublishedContexts[0].rollbackOn && new Date(page.unpublishedContexts[0].rollbackOn) > new Date();
            const isPublishEdit = !!(futurePublish || rollback);

            dispatch({
                type: "ShellContext/CompleteLoadingPublishInfo",
                pages: page ? [page] : [],
                publishOn: futurePublish ? new Date(page.unpublishedContexts[0].futurePublishOn) : null,
                rollbackOn: rollback ? new Date(page.unpublishedContexts[0].rollbackOn) : null,
                isPublishEdit,
                failedPageIds: null,
            });

            if (((futurePublish || rollback) && !state.shellContext.publishInTheFuture) || (!futurePublish && !rollback && state.shellContext.publishInTheFuture)) {
                dispatch({ type: "ShellContext/TogglePublishInTheFuture" });
            }

            dispatch(loadPublishInfo(pageId));
        } else {
            const pages = await getPageBulkPublishInfo();
            dispatch({
                type: "ShellContext/CompleteLoadingPublishInfo",
                pages,
                publishOn: null,
                rollbackOn: null,
                isPublishEdit: false,
                failedPageIds: null,
            });

            if (state.shellContext.publishInTheFuture) {
                dispatch({ type: "ShellContext/TogglePublishInTheFuture" });
            }
        }
    },
    setPublishOn: (publishOn: Date | undefined): ShellThunkAction => dispatch => {
        dispatch({
            type: "ShellContext/SetPublishOn",
            publishOn,
        });
    },
    setRollbackOn: (rollbackOn: Date | undefined): ShellThunkAction => dispatch => {
        dispatch({
            type: "ShellContext/SetRollbackOn",
            rollbackOn,
        });
    },
};

export interface PublishPageSelection {
    pageId: string;
    parentId: string | null;
    contexts: ContentContextModel[];
}

export interface PublishModalStyles {
    datePicker?: DatePickerPresentationProps;
    selectAllCheckbox?: CheckboxPresentationProps;
}

const styles: PublishModalStyles = {
    datePicker: {
        cssOverrides: {
            formInputWrapper: css` width: 70%; `,
            inputSelect: css` padding: 0 9px 0 9px; `,
        },
        calendarIconProps: {
            color: "text.main",
            css: css` margin-right: -9px; `,
            src: "Calendar",
        },
        clearIconProps: {
            color: "text.main",
            src: "X",
        },
    },
    selectAllCheckbox: { css: css`
        span {
            background: #fff;
        }

        padding-top: 2px;
    ` },
};

type Props = ReturnType<typeof mapStateToProps> & ResolveThunks<typeof mapDispatchToProps>;

const PublishModal: React.FC<Props> = ({
                                           visible,
                                           close,
                                           refresh,
                                           publishImmediately,
                                           togglePublishInTheFuture,
                                           pagePublishInfo,
                                           page: { id, parentId, fields: { title } },
                                           publish,
                                           languagesById,
                                           personasById,
                                           permissions,
                                           publishOn,
                                           rollbackOn,
                                           setPublishOn,
                                           setRollbackOn,
                                           isPublishEdit,
                                           failedToPublishPageIds,
                                           isBulkPublish,
                                       }) => {
    const [contextsToPublish, setContextsToPublish] = useState<SafeDictionary<ContentContextModel>>({});
    const [selectAll, setSelectAll] = React.useState<boolean | "indeterminate">(isPublishEdit || false);

    useEffect(
        () => {
            if (!visible) {
                setContextsToPublish({});
                return;
            }

            refresh(id);
            setSelectAll(isPublishEdit || false);
        },
        [visible, id],
    );

    const nothingToPublish = pagePublishInfo.value
        && pagePublishInfo.value.length < 1
        &&  (isBulkPublish ? "There is no content to publish." : "There is no content on this page to publish.");

    const allPagesSkipped = (failedToPublishPageIds && Object.keys(failedToPublishPageIds).length
        && Object.keys(contextsToPublish).every(o => failedToPublishPageIds[o.split("|")[3] || id])) || false;

    const hasFailedToPublishPages = failedToPublishPageIds && Object.keys(failedToPublishPageIds).length > 0;

    const totalNumberOfContexts = pagePublishInfo?.value?.reduce((acc, val) => acc + val.unpublishedContexts.length, 0);

    const publishOnChangeHandler = ({ selectedDay }: Pick<DatePickerState, "selectedDay">) => {
        setPublishOn(selectedDay);
    };

    const rollbackOnChangeHandler = ({ selectedDay }: Pick<DatePickerState, "selectedDay">) => {
        setRollbackOn(selectedDay);
    };

    const selectAllChangeHandler: CheckboxProps["onChange"] = (_, value) => {
        const clone = { ...contextsToPublish };
        pagePublishInfo?.value?.map(({ pageId, name, unpublishedContexts }) =>
            unpublishedContexts.forEach(context => {
            const { languageId, personaId, deviceType, modifiedBy, modifiedOn } = context;
            const contextString = getContextualId(languageId, deviceType, personaId, isBulkPublish ? pageId : "");
            if (value) {
                clone[contextString] = context;
            } else {
                delete clone[contextString];
            }
        }));

        setContextsToPublish(clone);
        setSelectAll(value);
    };

    return <Modal
        data-test-selector="publishModal"
        size={nothingToPublish || hasFailedToPublishPages ? 350 : (isBulkPublish ? 960 : undefined)}
        isOpen={visible}
        handleClose={close}
        headline="Publish Page"
        cssOverrides={{
            modalBody: css` overflow: visible; `,
            modalContent: css`
        overflow: visible;
        padding: 15px;
        background: #fff;
    `,
        }}
    >
        <LoadingOverlay
            loading={pagePublishInfo.isLoading}
            css={css` display: block; `}
        >
            <MessageContainer>
                {nothingToPublish && <Typography color="danger" data-test-selector="publishModal_message">{nothingToPublish}</Typography>}
                {hasFailedToPublishPages
                && <Typography color="danger" data-test-selector="publishModal_failed_pages_message">
                    Publication of selected page(s) has failed. Would you like to skip these pages and continue publishing?
                    <ul>
                        {pagePublishInfo?.value?.map(({ pageId, name }) => {
                            return failedToPublishPageIds?.[pageId] ? <li key={pageId}>{name}</li> : null;
                        })}
                    </ul>
                </Typography>}
            </MessageContainer>
            {!nothingToPublish && !hasFailedToPublishPages && <>
                <PublishableContextTable cellSpacing={0}>
                    <thead>
                        <tr>
                            <th>
                                <Checkbox data-test-selector="publishModal_selectAll" {...styles.selectAllCheckbox} disabled={isPublishEdit} checked={selectAll} onChange={selectAllChangeHandler}></Checkbox>
                            </th>
                            <th>Page</th>
                            <th>Customer Segment</th>
                            <th>Language</th>
                            <th>Device</th>
                            <th>Edited By</th>
                            <th>Edited On</th>
                            <th>Compare</th>
                            {isBulkPublish && <th>Notes</th>}
                        </tr>
                    </thead>
                    <tbody data-test-selector="publishModal_contextsAvailableToPublish">
                        {
                            pagePublishInfo?.value?.map(({ pageId, name, unpublishedContexts }) =>
                                unpublishedContexts.map(context => {
                                    const { languageId, personaId, deviceType, modifiedBy, modifiedOn } = context;
                                    const contextString = getContextualId(languageId, deviceType, personaId, isBulkPublish ? pageId : "");
                                    return <tr key={contextString} data-test-selector={contextString}>
                                        <td>
                                            <Checkbox
                                                data-test-selector={`${contextString}_check`}
                                                checked={!!contextsToPublish[contextString] || isPublishEdit}
                                                disabled={isPublishEdit}
                                                onChange={(_, value) => {
                                                    const clone = { ...contextsToPublish };
                                                    if (value) {
                                                        clone[contextString] = context;
                                                    } else {
                                                        delete clone[contextString];
                                                    }
                                                    setContextsToPublish(clone);

                                                    const contextsSelected = Object.keys(clone).length;
                                                    if (contextsSelected === 0) {
                                                        setSelectAll(false);
                                                    } else if (totalNumberOfContexts === contextsSelected) {
                                                        setSelectAll(true);
                                                    } else {
                                                        setSelectAll("indeterminate");
                                                    }
                                                }}
                                            />
                                        </td>
                                        <td data-test-selector={`${contextString}_title`}>{isBulkPublish ? name : title} <BadgeDefault /></td>
                                        <td data-test-selector={`${contextString}_persona`}>{!personaId ? "All" : personasById[personaId]?.name ?? personaId}</td>
                                        <td data-test-selector={`${contextString}_language`}>{!languageId ? "All" : languagesById[languageId]?.description ?? languageId}</td>
                                        <td data-test-selector={`${contextString}_device`}>{deviceType || "All"}</td>
                                        <td data-test-selector={`${contextString}_modifiedBy`}>{modifiedBy}</td>
                                        <td data-test-selector={`${contextString}_modifiedOn`}>{new Date(modifiedOn).toLocaleString()}</td>
                                        <td>
                                            <ButtonInTable
                                                data-test-selector={`${contextString}_compareButton`}
                                                variant="tertiary"
                                                disabled // TODO ISC-11132
                                            >Compare</ButtonInTable>
                                        </td>
                                        {isBulkPublish && <td>
                                            <ButtonInTable
                                                data-test-selector={`${contextString}_addNotesButton`}
                                                variant="tertiary"
                                                disabled // TODO ISC-12159
                                            >Add Notes</ButtonInTable>
                                        </td>}
                                    </tr>;
                                }))
                        }
                    </tbody>
                </PublishableContextTable>
                <Checkbox
                    checked={publishImmediately}
                    onChange={togglePublishInTheFuture}
                >Publish Immediately</Checkbox>
                <PublishLaterContainer>
                    <div>
                        <DatePicker
                            {...styles.datePicker}
                            disabled={publishImmediately || !permissions?.canPublishContent}
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
                            disabled={publishImmediately || !permissions?.canPublishContent}
                            selectedDay={rollbackOn}
                            onDayChange={rollbackOnChangeHandler}
                            dateTimePickerProps={{
                                minDate: publishOn || new Date(),
                            }}
                            format="MM/dd/y hh:mm a"
                            label={<>
                                Rollback On (Optional)
                                <Tooltip
                                    cssOverrides={{
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
                                    }}
                                    typographyProps={{ css: css`
        white-space: break-spaces;
        font-weight: 400;
        font-size: 15px;
        line-height: 18px;
    `,
                                    }}
                                    text={"When this time is reached the published changes will be rolled back "
                                    + "and the previously published version of the page will display."}
                                />
                            </>}
                        />
                    </div>
                </PublishLaterContainer>
            </>}
            <PublishCancelButtonContainer>
                <CancelButton
                    variant="tertiary"
                    onClick={close}
                >Cancel</CancelButton>
                {!nothingToPublish && <Button
                    variant="primary"
                    data-test-selector="publishModal_publish"
                    disabled={!pagePublishInfo.value || !!nothingToPublish || !permissions?.canPublishContent || (Object.keys(contextsToPublish).length === 0 && !isPublishEdit)
                        || (!publishImmediately && !publishOn && !rollbackOn && !isPublishEdit) || allPagesSkipped}
                    onClick={() => {
                        const pages: SafeDictionary<PublishPageSelection> = {};
                        if (isPublishEdit) {
                            pagePublishInfo?.value?.map(({ unpublishedContexts }) =>
                                unpublishedContexts.forEach(context => {
                                    const { languageId, personaId, deviceType } = context;
                                    const contextString = getContextualId(languageId, deviceType, personaId);
                                    contextsToPublish[contextString] = context;
                            }));
                            setContextsToPublish(contextsToPublish);
                        }
                        for (const key in contextsToPublish) {
                            const parts = key.split("|");
                            const pageId = isBulkPublish ? parts[3] : id;
                            let pageGroup = pages[pageId];

                            if (failedToPublishPageIds && failedToPublishPageIds[pageId]) {
                                continue;
                            }

                            if (!pageGroup) {
                                pageGroup = pages[pageId] = {
                                    pageId,
                                    parentId: isBulkPublish ? null : parentId,
                                    contexts: [],
                                };
                            }

                            pageGroup.contexts.push(contextsToPublish[key]!);
                        }

                        const pagesToPublish = [];
                        for (const val of Object.values(pages)) {
                            if (val) {
                                pagesToPublish.push(val);
                            }
                        }

                        if (publishImmediately) {
                            publish(id, pagesToPublish, false);
                        } else {
                            publish(id, pagesToPublish, isPublishEdit || !!publishOn, publishOn, rollbackOn);
                        }
                    }}
                >{hasFailedToPublishPages ? "Skip and publish" : "Publish"}</Button>}
            </PublishCancelButtonContainer>
        </LoadingOverlay>
    </Modal>;
};

const MessageContainer = styled.div`
    display: flex;
    justify-content: space-between;
`;

const PublishableContextTable = styled.table`
    width: 100%;
    margin-bottom: 30px;
    display: block;
    max-height: 250px;
    overflow-y: auto;

    th {
        background: ${getColor("common.backgroundContrast")};
        color: ${getColor("common.accent")};
        padding-left: 9px;
        padding-right: 9px;
        text-align: left;

        &:not(:first-child) {
            border-left: 1px solid rgba(255, 255, 255, 0.3);
        }
    }

    td {
        border-bottom: 1px solid rgba(155, 155, 155, 0.3);
        padding-left: 9px;
        padding-right: 9px;

        &:not(:first-child) {
            border-left: 1px solid rgba(155, 155, 155, 0.3);
        }
    }

    td:last-child {
        text-align: center;
    }
`;

const ButtonInTable = styled(Button)`
    height: 20px;
    white-space: nowrap;
    padding-top: 1px;
`;

const PublishLaterContainer = styled.div`
    background: ${getColor("common.background")};
    border-radius: 4px;
    padding: 15px 13px;
    display: flex;

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
    height: 32px;
`;

export default connect(mapStateToProps, mapDispatchToProps)(PublishModal);
