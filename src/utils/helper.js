function getResponseForm(data, error, message) {
    const errorObject = error.details[0];

    return {
        data: data,
        [errorObject.context.label]: errorObject.message.replace("\"" + errorObject.context.label + "\" ", "").replace("must", "should"),
        message: message
    };
}

exports.getResponseForm = getResponseForm;