import StyledWrapper, { getStyledWrapper } from "@insite/client-framework/Common/StyledWrapper";
import getLocalizedDateTime from "@insite/client-framework/Common/Utilities/getLocalizedDateTime";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import loadMessages from "@insite/client-framework/Store/Data/Messages/Handlers/LoadMessages";
import updateMessageIsRead from "@insite/client-framework/Store/Data/Messages/Handlers/UpdateMessageIsRead";
import { getMessagesDataView } from "@insite/client-framework/Store/Data/Messages/MessagesSelector";
import translate from "@insite/client-framework/Translate";
import { MessageModel } from "@insite/client-framework/Types/ApiModels";
import Accordion from "@insite/mobius/Accordion";
import { AccordionPresentationProps } from "@insite/mobius/Accordion/Accordion";
import { AccordionSectionPresentationProps, ManagedAccordionSection } from "@insite/mobius/AccordionSection";
import Button, { ButtonPresentationProps } from "@insite/mobius/Button";
import GridContainer, { GridContainerProps } from "@insite/mobius/GridContainer";
import GridItem, { GridItemProps } from "@insite/mobius/GridItem";
import LoadingSpinner from "@insite/mobius/LoadingSpinner";
import Radio, { RadioComponentProps } from "@insite/mobius/Radio";
import RadioGroup, { RadioGroupComponentProps } from "@insite/mobius/RadioGroup";
import Typography, { TypographyProps } from "@insite/mobius/Typography";
import FieldSetPresentationProps, { FieldSetGroupPresentationProps } from "@insite/mobius/utilities/fieldSetProps";
import getColor from "@insite/mobius/utilities/getColor";
import InjectableCss from "@insite/mobius/utilities/InjectableCss";
import * as React from "react";
import { connect, ResolveThunks } from "react-redux";
import { css } from "styled-components";

const messagesParameter = {};

const mapStateToProps = (state: ApplicationState) => ({
    messagesDataView: getMessagesDataView(state, messagesParameter),
    byId: state.data.messages.byId,
    language: state.context.session.language,
});

const mapDispatchToProps = {
    updateMessageIsRead,
    loadMessages,
};

type Props = ReturnType<typeof mapStateToProps> & ResolveThunks<typeof mapDispatchToProps>;

export interface AccountMessagesStyles {
    centeringWrapper?: InjectableCss;
    messagesSection?: InjectableCss;
    messagesAccordion?: AccordionPresentationProps;
    messagesAccordionSection?: AccordionSectionPresentationProps;
    messagesGridContainer?: GridContainerProps;
    messageFilterGridItem?: GridItemProps;
    messageFilter?: MessageFilterStyles;
    messageCardGridItem?: GridItemProps;
    messageCard?: MessageCardStyles;
}

interface MessageFilterStyles {
    radioGroup?: FieldSetGroupPresentationProps<RadioGroupComponentProps>;
    radioButton?: FieldSetPresentationProps<RadioComponentProps>;
}

interface MessageCardStyles {
    article?: InjectableCss;
    gridContainer?: GridContainerProps;
    dateTimeGridItem?: GridItemProps;
    dateTimeText?: TypographyProps;
    subjectGridItem?: GridItemProps;
    subjectText?: TypographyProps;
    bodyGridItem?: GridItemProps;
    bodyText?: TypographyProps;
    actionButtonGridItem?: GridItemProps;
    actionButton?: ButtonPresentationProps;
    bottomBorderGridItem?: GridItemProps;
    bottomBorder?: InjectableCss;
}

export const accountMessagesStyles: AccountMessagesStyles = {
    centeringWrapper: {
        css: css`
            display: flex;
            justify-content: center;
            align-items: center;
            height: 300px;
        `,
    },
    messagesSection: { css: css` width: 100%; ` },
    messagesAccordion: { css: css` width: 100%; ` },
    messagesGridContainer: { gap: 15 },
    messageFilterGridItem: { width: 12 },
    messageFilter: {
        radioGroup: {
            css: css`
            display: flex;
            flex-direction: row;
            justify-content: center;
            align-items: center;
        `,
        },
        radioButton: {
            css: css` margin-top: 10px; `,
        },
    },
    messageCardGridItem: { width: 12 },
    messageCard: {
        gridContainer: { gap: 5 },
        article: { css: css` width: 100%; ` },
        dateTimeGridItem: { width: 12 },
        dateTimeText: { weight: "bold" },
        subjectGridItem: { width: 12 },
        bodyGridItem: { width: 12 },
        actionButtonGridItem: {
            width: 12,
            css: css` justify-content: flex-end; `,
        },
        actionButton: {
            variant: "secondary",
        },
        bottomBorderGridItem: { width: 12 },
        bottomBorder: {
            css: css`
                height: 1px;
                width: 100%;
                background: ${getColor("common.accent")};
            `,
        },
    },
};

function filterMessagesBasedOnFilterType(messages: MessageModel[], messagesFilterType: string): MessageModel[] {
    return messages.filter((message) => {
        if (messagesFilterType === "All") {
            return true;
        }

        if (messagesFilterType === "Unread") {
            return !message.isRead;
        }

        return message.isRead;
    });
}

const styles = accountMessagesStyles;
const StyledSection = getStyledWrapper("section");
const StyledArticle = getStyledWrapper("article");

interface State {
    messagesFilterType: string,
    isMessagesPreview: boolean,
}

class AccountMessages extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            messagesFilterType: "All",
            isMessagesPreview: true,
        };
    }

    componentDidMount() {
        if (!this.props.messagesDataView.value) {
            this.props.loadMessages(messagesParameter);
        }
    }

    render() {
        let title = "Messages";
        const { messagesDataView, updateMessageIsRead, language } = this.props;
        const { messagesFilterType, isMessagesPreview } = this.state;
        const messages = messagesDataView.value ? messagesDataView.value : [];

        if (messagesDataView.value) {
            const countUnreadMessages = messages.filter(message => !message.isRead).length;
            title = `Messages (${countUnreadMessages})`;
        }

        let filteredMessages = filterMessagesBasedOnFilterType(messages, messagesFilterType);
        if (isMessagesPreview) {
            filteredMessages = filteredMessages.slice(0, 3);
        }
        const componentStyles: MessageFilterStyles = styles.messageFilter || {};

        return (
            <StyledSection {...styles.messagesSection} data-test-selector="myAccountMessagesSection">
                <Accordion
                    {...styles.messagesAccordion}
                    headingLevel={2}
                >
                    <ManagedAccordionSection
                        title={title}
                        onTogglePanel={() => { this.setState({ isMessagesPreview: false }); }}
                        {...styles.messagesAccordionSection}
                        initialExpanded
                    >
                        <GridContainer {...styles.messagesGridContainer}>
                            <GridItem {...styles.messageFilterGridItem}>
                                {messagesDataView.value && <RadioGroup
                                    {...componentStyles.radioGroup}
                                    value={messagesFilterType}
                                    onChangeHandler={(event: any) => this.setState({ messagesFilterType: event.target.value })}
                                >
                                    <Radio {...componentStyles.radioButton} key="All">{translate("All")}</Radio>
                                    <Radio {...componentStyles.radioButton} key="Unread">{translate("Unread")}</Radio>
                                    <Radio {...componentStyles.radioButton} key="Read">{translate("Read")}</Radio>
                                </RadioGroup>}
                            </GridItem>
                            {filteredMessages && filteredMessages.map(message => (
                                <GridItem {...styles.messageCardGridItem} key={`${message.id}`}>
                                    <MessageCard message={message} updateMessageIsRead={updateMessageIsRead} language={language} />
                                </GridItem>
                            ))}
                        </GridContainer>
                        {messagesDataView.isLoading
                        && <StyledWrapper {...styles.centeringWrapper}>
                            <LoadingSpinner />
                        </StyledWrapper>
                        }
                    </ManagedAccordionSection>
                </Accordion>
            </StyledSection>
        );
    }
}

type MessageCardProps = {
    message: MessageModel;
} & Pick<Props, "updateMessageIsRead" | "language">;

const MessageCard: React.FunctionComponent<MessageCardProps> = (props: MessageCardProps) => {
    const { message, language } = props;

    const handleClickMessageReadStatus = () => props.updateMessageIsRead({
        message,
        isRead: !message.isRead,
    });

    const dateDisplay = getLocalizedDateTime({
        dateTime: message.dateToDisplay,
        language,
        options: {
            year: "numeric", month: "numeric", day: "numeric",
        },
    });
    const timeDisplay = getLocalizedDateTime({
        dateTime: message.dateToDisplay,
        language,
        options: {
            hour: "numeric", minute: "numeric",
        },
    });
    const componentStyles: MessageCardStyles = styles.messageCard || {};

    return (
        <StyledArticle {...styles.messageCard?.article}>
            <GridContainer {...componentStyles.gridContainer}>
                {message.dateToDisplay
                && <GridItem {...componentStyles.dateTimeGridItem}>
                    <Typography {...componentStyles.dateTimeText}>
                        {dateDisplay}&nbsp;{timeDisplay}
                    </Typography>
                </GridItem>}
                <GridItem {...componentStyles.subjectGridItem}>
                    <Typography {...componentStyles.subjectText}>{message.subject}</Typography>
                </GridItem>
                <GridItem {...componentStyles.bodyGridItem}>
                    <Typography {...componentStyles.bodyText}>{message.body}</Typography>
                </GridItem>
                <GridItem {...componentStyles.actionButtonGridItem}>
                    <Button {...componentStyles.actionButton} onClick={handleClickMessageReadStatus}>
                        {message.isRead ? translate("Mark as Unread") : translate("Mark as Read")}
                    </Button>
                </GridItem>
                <GridItem {...componentStyles.bottomBorderGridItem}>
                    <StyledWrapper {...styles.messageCard?.bottomBorder} />
                </GridItem>
            </GridContainer>
        </StyledArticle>
    );
};

export default connect(mapStateToProps, mapDispatchToProps)(AccountMessages);
