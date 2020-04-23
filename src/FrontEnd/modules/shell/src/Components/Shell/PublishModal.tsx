import React, { useEffect } from "react";
import { connect, ResolveThunks } from "react-redux";
import styled, { css } from "styled-components";
import ShellState from "@insite/shell/Store/ShellState";
import Modal from "@insite/mobius/Modal";
import { AnyShellAction } from "@insite/shell/Store/Reducers";
import Button from "@insite/mobius/Button";
import BadgeDefault from "@insite/shell/Components/Icons/BadgeDefault";
import Checkbox from "@insite/mobius/Checkbox";
import DatePicker from "@insite/mobius/DatePicker";
import Tooltip from "@insite/mobius/Tooltip";
import getColor from "@insite/mobius/utilities/getColor";
import { getPagePublishInfo, publishPages } from "@insite/shell/Services/ContentAdminService";
import LoadingOverlay from "@insite/mobius/LoadingOverlay";
import Typography from "@insite/mobius/Typography";
import { loadPublishInfo } from "@insite/shell/Store/ShellContext/ShellContextActionCreators";
import ShellThunkAction from "@insite/shell/Store/ShellThunkAction";

const mapStateToProps = ({
    shellContext: {
        showModal,
        publishInTheFuture,
        pagePublishInfo,
        languagesById,
        personasById,
},
    currentPage: {
        page,
    },
}: ShellState) => ({
    visible: showModal === "Publish",
    publishImmediately: !publishInTheFuture,
    page,
    pagePublishInfo,
    languagesById,
    personasById,
});

const mapDispatchToProps = {
    close: (): AnyShellAction => ({
        type: "ShellContext/SetShowModal",
    }),
    togglePublishInTheFuture: (): AnyShellAction => ({
        type: "ShellContext/TogglePublishInTheFuture",
    }),
    publish: (pageId: string, publishOn?: Date): ShellThunkAction => async dispatch => {
        await publishPages({ pages: [{ pageId }], publishOn });

        dispatch(loadPublishInfo(pageId));

        dispatch({
            type: "ShellContext/SetShowModal",
        });
    },
    refresh: (pageId: string): ShellThunkAction => async dispatch => {
        dispatch({
            type: "ShellContext/BeginLoadingPublishInfo",
        });

        const page = await getPagePublishInfo(pageId);
        dispatch({
            type: "ShellContext/CompleteLoadingPublishInfo",
            pages: page ? [page] : [],
        });

        dispatch(loadPublishInfo(pageId));
    },
};

type Props = ReturnType<typeof mapStateToProps> & ResolveThunks<typeof mapDispatchToProps>;

const PublishModal: React.FC<Props> = ({
    visible,
    close,
    refresh,
    publishImmediately,
    togglePublishInTheFuture,
    pagePublishInfo,
    page,
    publish,
    languagesById,
    personasById,
}) => {
    const { id, fields: { title } } = page;

    useEffect(
        () => {
            if (!visible) {
                return;
            }

            refresh(id);
        },
        [visible, id]);

    const nothingToPublish = pagePublishInfo.value
        && pagePublishInfo.value.length < 1
        && "There is no content on this page to publish.";

    return <Modal
        isOpen={visible}
        handleClose={close}
        headline="Publish Page"
    >
        <LoadingOverlay
            loading={pagePublishInfo.isLoading}
            css={css` display: block; `}
        >
            <MessageContainer>
                <Typography color="danger" data-test-selector="publishModal_message">{nothingToPublish || ""}</Typography>
            </MessageContainer>
            <PublishableContextTable cellSpacing={0} data-test-selector="publishModal">
                <thead>
                    <tr>
                        <th>Page</th>
                        <th>Language</th>
                        <th>Customer Segment</th>
                        <th>Device</th>
                        <th>Edited By</th>
                        <th>Edited On</th>
                        <th>Compare</th>
                    </tr>
                </thead>
                <tbody>
                    {
                    !pagePublishInfo ? <tr><td>...</td></tr>
                    : pagePublishInfo.value && pagePublishInfo.value.map(({ unpublishedContexts }) =>
                    // eslint-disable-next-line react/no-array-index-key
                    unpublishedContexts.map(({ languageId, personaId, deviceType, modifiedBy, modifiedOn }, index) => <tr key={index}>
                        <td>{title} <BadgeDefault /></td>
                        <td>{!languageId ? "All" : languagesById[languageId]?.description ?? languageId}</td>
                        <td>{!personaId ? "All" : personasById[personaId]?.name ?? personaId}</td>
                        <td>{deviceType || "All"}</td>
                        <td>{modifiedBy}</td>
                        <td>{new Date(modifiedOn).toLocaleString()}</td>
                        <td>
                            <ButtonInTable
                                variant="tertiary"
                                disabled // TODO ISC-11132
                            >Compare</ButtonInTable>
                        </td>
                    </tr>))
                    }
                </tbody>
            </PublishableContextTable>
            <Checkbox
                checked={publishImmediately}
                onChange={togglePublishInTheFuture}
                disabled // TODO ISC-11129
            >Publish Immediately</Checkbox>
            <PublishLaterContainer>
                <div>
                    <DatePicker
                        disabled={publishImmediately}
                        label="Publish On"
                        format="MM/dd/y hh:mm a"
                    />
                </div>
                <div>
                    <DatePicker
                        disabled={publishImmediately}
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
    > button > span {
        margin-top: -0.125em;
        > svg {
            position: relative;
            top: 0.125em;
        }
    }
`,
                                }}
                                text={"When this time is reached the published changes will be rolled back "
                                + "and the previously published version of the page will display."}
                            />
                        </>}
                    />
                </div>
            </PublishLaterContainer>
            <PublishCancelButtonContainer>
                <CancelButton
                    variant="tertiary"
                    onClick={close}
                >Cancel</CancelButton>
                <Button
                    variant="primary"
                    data-test-selector="publishModal_publish"
                    disabled={!pagePublishInfo.value || !!nothingToPublish}
                    onClick={() => {
                        publish(page.id);
                    }}
                >Publish</Button>
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
    margin-top: 22px;
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
