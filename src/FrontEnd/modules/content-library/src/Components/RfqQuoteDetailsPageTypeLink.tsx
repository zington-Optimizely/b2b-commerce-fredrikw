import { createWidgetElement } from "@insite/client-framework/Components/ContentItemStore";

interface OwnProps {
    title: string;
    quoteId: string;
}

type Props = OwnProps;

const RfqQuoteDetailsPageTypeLink: React.FunctionComponent<Props> = ({ title, quoteId }) => {
    return createWidgetElement(
        "Basic/PageTypeLink",
        {
            fields: {
                pageType: "RfqQuoteDetailsPage",
                overrideTitle: title,
                queryString: `quoteId=${quoteId}`,
            },
        });
};

export default RfqQuoteDetailsPageTypeLink;
