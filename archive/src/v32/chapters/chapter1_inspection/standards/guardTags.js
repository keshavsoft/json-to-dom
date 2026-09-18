export const guardTags = ({ inTags, inGuards, inSchema } = {}) => {
    const localTags = inTags;
    const localGuards = inGuards ?? inSchema;
    const localErrors = [];

    if (!localTags || typeof localTags !== "object") {
        localErrors.push("Level 0: tags must be a non-null object");
        return { isValid: false, errors: localErrors };
    }

    if (!localGuards || typeof localGuards !== "object") {
        localErrors.push("Level 0: guards definition must be a non-null object");
        return { isValid: false, errors: localErrors };
    }

    const localLevel0 = localGuards.level_0 || {};
    const localLevel1 = localGuards.level_1 || {};
    const localLevel2 = localGuards.level_2 || {};

    const localAllowedRootTypes = new Set(localLevel0.allowedValueTypes || ["string", "object"]);
    const localSchemaKey = localLevel0.schemaKey || "$schema";

    const localAllowedL1Types = new Set(localLevel1.allowedValueTypes || ["boolean", "array"]);
    const localAllowedL1Keys = localLevel1.allowedKeys ? new Set(localLevel1.allowedKeys) : null;
    const localRequiredL1Keys = localLevel1.requiredKeys || [];

    const localAllowedL2ItemTypes = new Set(localLevel2.allowedItemTypes || ["string"]);

    for (const [localKey, localValue] of Object.entries(localTags)) {
        if (localKey === localSchemaKey) {
            if (typeof localValue !== "string") {
                localErrors.push(`Level 0: '${localKey}' value must be a string, got ${typeof localValue}`);
            }
            continue;
        }

        const localValueType = Array.isArray(localValue) ? "array" : typeof localValue;
        if (!localAllowedRootTypes.has(localValueType)) {
            localErrors.push(`Level 0: '${localKey}' value must be object, got ${localValueType}`);
            continue;
        }

        if (localValue === null || typeof localValue !== "object" || Array.isArray(localValue)) {
            localErrors.push(`Level 0: Tag '${localKey}' must be an object`);
            continue;
        }

        if (localRequiredL1Keys.length > 0) {
            for (const localReqKey of localRequiredL1Keys) {
                if (!(localReqKey in localValue)) {
                    localErrors.push(`Level 1: Tag '<${localKey}>' is missing required key '${localReqKey}'`);
                }
            }
        }

        for (const [localPropName, localPropValue] of Object.entries(localValue)) {
            if (localAllowedL1Keys && !localAllowedL1Keys.has(localPropName)) {
                localErrors.push(`Level 1: Tag '<${localKey}>' has unrecognized key '${localPropName}'`);
                continue;
            }

            const localPropType = Array.isArray(localPropValue) ? "array" : typeof localPropValue;
            if (!localAllowedL1Types.has(localPropType)) {
                localErrors.push(`Level 1: Tag '<${localKey}>.${localPropName}' must be boolean or array, got ${localPropType}`);
                continue;
            }

            if (Array.isArray(localPropValue)) {
                localPropValue.forEach((localItem, localIndex) => {
                    const localItemType = typeof localItem;
                    if (!localAllowedL2ItemTypes.has(localItemType)) {
                        localErrors.push(`Level 2: Tag '<${localKey}>.${localPropName}[${localIndex}]' must be string, got ${localItemType}`);
                    }
                });
            }
        }
    }

    return {
        isValid: localErrors.length === 0,
        errors: localErrors
    };
};

export default guardTags;
