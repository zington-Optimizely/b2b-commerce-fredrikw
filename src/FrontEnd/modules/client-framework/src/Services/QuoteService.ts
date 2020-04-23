import { get, ApiParameter, HasPagingParameters } from "@insite/client-framework/Services/ApiService";
import { QuoteCollectionModel, QuoteModel } from "@insite/client-framework/Types/ApiModels";

export interface GetQuotesApiParameter extends ApiParameter, HasPagingParameters {
}

export async function getQuotes(getQuotesParameter: GetQuotesApiParameter) {
    const quotes = await get<QuoteCollectionModel>("/api/v1/quotes", getQuotesParameter);
    quotes.quotes?.forEach(cleanQuote);
    return quotes;
}

function cleanQuote(quoteModel: QuoteModel) {
    quoteModel.orderDate = quoteModel.orderDate ? new Date(quoteModel.orderDate) : null;
    quoteModel.expirationDate = quoteModel.expirationDate ? new Date(quoteModel.expirationDate) : null;
}
