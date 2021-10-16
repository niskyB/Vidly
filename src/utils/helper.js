function getResponseForm(data, error, message) {
    return {
        data: data,
        [error.details[0].context.label]: error.details[0].message.replace("\"" + error.details[0].context.label + "\" ", "").replace("must", "should"),
        message: message
    };
}

exports.getResponseForm = getResponseForm;