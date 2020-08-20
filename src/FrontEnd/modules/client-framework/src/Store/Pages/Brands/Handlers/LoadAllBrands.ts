import { createHandlerChainRunnerOptionalParameter, HandlerWithResult } from "@insite/client-framework/HandlerCreator";
import { getBrands, GetBrandsApiParameter } from "@insite/client-framework/Services/BrandService";
import { BrandCollectionModel, BrandModel } from "@insite/client-framework/Types/ApiModels";

type HandlerType = HandlerWithResult<GetBrandsApiParameter, BrandModel[]>;

export const DispatchBeginLoadBrands: HandlerType = props => {
    props.dispatch({
        type: "Data/Brands/BeginLoadBrands",
        parameter: { key: "AllBrands" },
    });
};

export const RequestDataFromApi: HandlerType = async props => {
    let runApiRequest = true;
    let page = props.parameter.page || 1;
    let collection: BrandModel[] = [];
    const pageSize = props.parameter.pageSize || 500;
    while (runApiRequest) {
        const parameter = {
            ...props.parameter,
            pageSize,
            page,
        };
        const apiResult = await getBrands(parameter);
        if (apiResult.pagination!.totalItemCount < (page * pageSize)) {
            runApiRequest = false;
        }
        page = page + 1;
        collection = [
            ...collection,
            ...apiResult.brands || [],
        ];
    }
    props.result = collection;
};

export const DispatchCompleteLoadBrands: HandlerType = props => {
    props.dispatch({
        type: "Data/Brands/CompleteLoadBrands",
        collection: { brands: props.result } as BrandCollectionModel,
        parameter: { key: "AllBrands" },
    });
};

export const chain = [
    DispatchBeginLoadBrands,
    RequestDataFromApi,
    DispatchCompleteLoadBrands,
];

const loadAllBrands = createHandlerChainRunnerOptionalParameter(chain, {
    page: 1,
    pageSize: 500,
}, "LoadAllBrands");
export default loadAllBrands;
