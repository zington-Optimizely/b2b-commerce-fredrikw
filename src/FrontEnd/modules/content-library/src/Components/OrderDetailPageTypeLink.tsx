import { createWidgetElement } from "@insite/client-framework/Components/ContentItemStore";

interface OwnProps {
    title: string;
    orderNumber: string;
}

type Props = OwnProps;

const OrderDetailPageTypeLink: React.FunctionComponent<Props> = ({ title, orderNumber }) => {
    return createWidgetElement(
        "Basic/PageTypeLink",
        {
            fields: {
                pageType: "OrderDetailsPage",
                overrideTitle: title,
                queryString: `orderNumber=${orderNumber}`,
            },
        });
};

export default OrderDetailPageTypeLink;
