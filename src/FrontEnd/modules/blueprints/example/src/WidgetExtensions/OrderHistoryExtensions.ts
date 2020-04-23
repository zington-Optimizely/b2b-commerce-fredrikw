import { css } from "styled-components";
import { searchFieldWrapperStyles }  from "@insite/content-library/Widgets/OrderHistory/SearchFieldWrapper";
import { orderTotalOperatorStyles }  from "@insite/content-library/Widgets/OrderHistory/OrderHistorySearchFieldOrderTotalOperator";
import { orderHistoryTableStyles }  from "@insite/content-library/Widgets/OrderHistory/OrderHistoryTable";
import translate from "@insite/client-framework/Translate";

searchFieldWrapperStyles.wrapper = {
    css: css`
        width: 100%;
        padding: 5px;
    `,
};

orderTotalOperatorStyles.select = {
    label: translate("The Order Total"),
};

orderHistoryTableStyles.reorderButton = {
    color: "blue",
    sizeVariant: "medium",
};
