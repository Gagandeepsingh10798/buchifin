module.exports = {
    /* AUTH APIs */
    '/api/v1/auth/login': {
        "ALL": {
            "POST": {
                "auth": false,
                "value": true,
                "code": 0
            }
        }
    },
    '/api/v1/auth/logout': {
        "ALL": {
            "POST": {
                "auth": true,
                "value": true,
                "code": 1
            }
        }
    },
    '/api/v1/auth/refresh_token': {
        "ALL": {
            "POST": {
                "auth": true,
                "value": true,
                "code": 2
            }
        }
    },
    '/api/v1/auth/password/change': {
        "ALL": {
            "POST": {
                "auth": true,
                "value": true,
                "code": 3
            }
        }
    },
    '/api/v1/auth/password/forgot': {
        "ALL": {
            "POST": {
                "auth": false,
                "value": true,
                "code": 4
            }
        }
    },
    '/api/v1/auth/password/reset': {
        "ALL": {
            "POST": {
                "auth": false,
                "value": true,
                "code": 5
            }
        }
    },
}