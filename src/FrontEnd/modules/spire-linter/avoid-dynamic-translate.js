/* eslint-disable */
module.exports = {
    meta: {
        messages: {
            avoid: "Avoid passing dynamic values to translate.",
            avoidUnsupported: "Avoid passing dynamic values to translate (unsupported case)",
        }
    },
    create(context) {
        const filename = context.getFilename().replace(/\\/g, "/");
        if (filename.indexOf("/modules/content-library/src/Widgets") === -1
            && filename.indexOf("/modules/content-library/src/Components") === -1
            && filename.indexOf("/modules/content-library/src/Pages") === -1) {
            return {};
        }

        return {
            CallExpression(node) {
                if (!node.callee || node.callee.name !== "translate"
                    || !node.arguments || node.arguments.length === 0) {
                    return;
                }

                const argument = node.arguments[0];
                if (argument.type === "MemberExpression") {
                    const variable = findVariable(context.getScope(), argument.object.name);
                    if (variable && variable.defs[0].type === "EnumName") {
                        return ;
                    }
                    context.report({ node, messageId: "avoid" });
                    return;
                }
                if (argument.type === "Identifier") {
                    const variable = findVariable(context.getScope(), argument.name);
                    const init = variable.defs[0].node.init;
                    if (!init) {
                        context.report({ node, messageId: "avoidUnsupported" });
                        return;
                    }
                    const isInitLiteral = isLiteral(init)
                    if (typeof isInitLiteral === "undefined") {
                        context.report({ node, messageId: "avoidUnsupported" });
                    } else if (!isInitLiteral) {
                        context.report({ node, messageId: "avoid" });
                    }
                }
            },
        };
    },
};

function isLiteral(value) {
    if (value.type === "Literal") {
        return true;
    }
    if (value.type === "ConditionalExpression") {
        return isLiteral(value.consequent) && isLiteral(value.alternate);
    }
    if (value.type === "BinaryExpression" || value.type === "LogicalExpression") {
        return isLiteral(value.left) && isLiteral(value.right);
    }
    if (value.type === "MemberExpression") {
        return isLiteral(value.object);
    }
    if (value.type === "Identifier") {
        if (value.name === "fields") {
            return false;
        }
        return;
    }

    // we are probably missing lots of cases here
    return;
}

function findVariable(scope, variableName) {
    let variable = undefined;
    while (typeof variable === "undefined" && scope) {
        variable = scope.set.get(variableName)
        scope = scope.upper;
    }

    return variable;
}
