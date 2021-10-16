function getResponseForm(data, error, message) {
    const errorObject = error ? error.details[0] : null;

    return {
        data: data,
        [errorObject ? errorObject.context.label : "error"]: errorObject ? errorObject.message.replace("\"" + errorObject.context.label + "\" ", "").replace("must", "should") : null,
        message: message
    };
}

exports.getResponseForm = getResponseForm;