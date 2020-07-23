import ContentItemModel, { DeviceType } from "@insite/client-framework/Types/ContentItemModel";

export function createContextualIds(languageId: string, defaultLanguageId: string, deviceType: DeviceType, personaIds: string[], defaultPersonaId: string) {
    const ids: string[] = [];

    const doWork = (theLanguageId: string) => {
        let hasDefaultPersona = false;
        for (const personaId of personaIds) {
            if (personaId === defaultPersonaId) {
                hasDefaultPersona = true;
            }
            ids.push(getContextualId(theLanguageId, deviceType, personaId));
        }

        if (deviceType !== "Desktop") {
            for (const personaId of personaIds) {
                ids.push(getContextualId(theLanguageId, "Desktop", personaId));
            }
        }

        if (!hasDefaultPersona) {
            ids.push(getContextualId(theLanguageId, deviceType, defaultPersonaId));

            if (deviceType !== "Desktop") {
                ids.push(getContextualId(theLanguageId, "Desktop", defaultPersonaId));
            }
        }
    };

    doWork(languageId);

    if (languageId !== defaultLanguageId) {
        doWork(defaultLanguageId);
    }

    return ids;
}

export function prepareFields(contentItem: ContentItemModel, languageId: string, defaultLanguageId: string, contextualIds: string[]) {
    let { generalFields, fields, translatableFields, contextualFields } = contentItem;
    if (!fields) {
        fields = contentItem.fields = {};
    }
    if (!generalFields) {
        generalFields = contentItem.generalFields = {};
    }
    if (!translatableFields) {
        translatableFields = contentItem.translatableFields = {};
    }
    if (!contextualFields) {
        contextualFields = contentItem.contextualFields = {};
    }

    for (const field in generalFields) {
        fields[field] = generalFields[field];
    }

    for (const field in translatableFields) {
        const value = translatableFields[field][languageId];
        if (value || value === "") {
            fields[field] = value;
            continue;
        }
        if (translatableFields[field][defaultLanguageId]) {
            fields[field] = translatableFields[field][defaultLanguageId];
            continue;
        }
        // if we can't find anything else, just grab the first one we find
        const keys = Object.keys(translatableFields[field]);
        fields[field] = keys.length === 0 ? "" : translatableFields[field][keys[0]];
    }

    for (const field in contextualFields) {
        for (const contextualId of contextualIds) {
            const value = contextualFields[field][contextualId];
            if (value || value === "") {
                fields[field] = value;
                break;
            }

            // if we can't find anything else, just grab the first one we find
            const keys = Object.keys(contextualFields[field])[0];
            fields[field] = keys.length === 0 ? "" : contextualFields[field][keys];
        }
    }
}

export function getContextualId(languageId: string, deviceType: DeviceType, personaId: string, pageId = "") {
    const baseContextualId = `${languageId}|${deviceType}|${personaId}`;
    return pageId ? `${baseContextualId}|${pageId}` : baseContextualId;
}
