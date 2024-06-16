class APIResponse {
    sendSuccess(res, data, message = 'Request successful') {
        res.status(200).json({
            status: 'success',
            data,
            message: message
        });
    }

    sendValidationError(res, errors) {
        res.status(422).json({
            status: 'error',
            errors
        });
    }

    sendUnauthorized(res, message = 'Unauthorized') {
        res.status(401).json({
            status: 'error',
            message
        });
    }

    sendForbidden(res, message = 'Forbidden') {
        res.status(403).json({
            status: 'error',
            message
        });
    }

    sendInternalServerError(res, message = 'Internal server error') {
        res.status(500).json({
            status: 'error',
            message
        });
    }

}

export default new APIResponse();