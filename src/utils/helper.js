function getResponseForm(data, error, message) {
    return {
        "data": data,
        "detail": {
            "error": error,
            "message": message
        }
    };
}

exports.getResponseForm = getResponseForm;