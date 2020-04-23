import GridItem from "@insite/mobius/GridItem";
import { css } from "styled-components";
import * as React from "react";
import GridContainer from "@insite/mobius/GridContainer";
import Typography from "@insite/mobius/Typography";
import Link from "@insite/mobius/Link";
import ChevronRight from "@insite/mobius/Icons/ChevronRight";
import translate from "@insite/client-framework/Translate";

interface OwnProps {
    heading: string;
    viewAllUrl?: string;
}

const CardListHeading: React.FunctionComponent<OwnProps> = ({ heading, viewAllUrl }) => {
    return (
        <GridItem width={12}>
            <GridContainer>
                <GridItem width={8}>
                    <Typography variant="h5">{heading}</Typography>
                </GridItem>
                {viewAllUrl
                    && <GridItem width={4}>
                        <Link
                            href={viewAllUrl}
                            icon={{ iconProps: { src: ChevronRight } }}
                            typographyProps={{ size: 15 }}
                            css={css` margin-left: auto; `}
                            data-test-selector="cardListHeadingViewAllLink"
                        >
                            {translate("View All")}
                        </Link>
                    </GridItem>
                }
            </GridContainer>
        </GridItem>
    );
};

export default CardListHeading;
