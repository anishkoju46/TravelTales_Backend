//handle email or usename duplicates
const handleDuplicateKeyError = (err, res) => {

    const field = Object.keys(err.keyValue);
    const code = 409;
    const error = `An account with that ${field} already exists.`;
    res.status(code).send({ message: error, fields: field });
}

const handleDuplicateMongoError = (err, res) => {

        // const field = Object.keys(err.keyValue);

        var e = err.message;
        e = e.split(':');
        var eu = e[2];

        const code = 409;
        const error = `Duplicate Value`;
        res.status(code).send({ message: error, fields: [eu] });
    }
    //handle field formatting, empty fields, and mismatched passwords
const handleValidationError = (err, res) => {
    //console.log(err);
    let errors = Object.values(err.errors).map(el => el.message);

    let fields = Object.values(err.errors).map(el => el.path);
    let code = 400;
    if (errors.length > 1) {
        const formattedErrors = errors.join(' ');
        return res.status(code).send({ message: formattedErrors, fields: fields });
    } else {

        return res.status(code).send({ message: errors, fields: fields })
    }
}

module.exports = (err, req, res, next) => {
    try {
        //console.log(err);
        if (err.name === 'ValidationError') return err = handleValidationError(err, res);
        if (err.name === 'CastError') return res.status(400).send({ messages: "Invalid input is provided", });
        if (err.name === 'MongoServerError' && err.code && err.code == 11000) return err = handleDuplicateMongoError(err, res);
        if (err.name === 'MongoBulkWriteError' && err.code && err.code == 11000) return err = handleDuplicateMongoError(err, res);
        if (err.code && err.code == 11000) return err = handleDuplicateKeyError(err, res);
        return res
            .status(err.code)
            .json({ "message": err.name });


    } catch (err) {
        return res
            .status(500)
            .json({ "message": 'An unknown error occurred.' });
    }
}