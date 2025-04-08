let baseUrlKey = null;
let clientId = null;
let clientSecret = null;
let authToken = null;
let authTokenExpiresAt = null;

const credentialFileName = 'credential.json';


async function getToken() {
    if (authToken != null && (authTokenExpiresAt - 10000 > new Date().getTime())) {
        return authToken;
    }

    const responseToken = await fetch(`https://${baseUrlKey}.auth.marketingcloudapis.com/v2/requestToken`, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            "client_id": clientId,
            "client_secret": clientSecret,
            "grant_type": "client_credentials"
        })
    });

    //{access_token: string, expires_in: seconds, token_type: 'Bearer', rest_instance_url: 'https://www.exacttargetapis.com/'}
    const responseBodyToken = await responseToken.json();

    authToken = responseBodyToken.access_token;
    authTokenExpiresAt = new Date(new Date().getTime() + responseBodyToken.expires_in * 1000);

    return authToken;
}
async function getList(searchKeyword) {
    const responseList = await fetch(`https://${baseUrlKey}.rest.marketingcloudapis.com/messaging/v1/email/definitions/?$pageSize=100&$page=1&$orderBy=name`, {
        method: "GET",
        headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + await getToken()
        }
    });

    // {
    //     "requestId": "e4743dd8-8c0a-4501-9e5a-07f274812ac2",
    //     "definitions": [
    //         {
    //             "name": string,
    //             "definitionKey": string,
    //             "status": string,
    //             "createdDate": string (date),
    //             "modifiedDate": string (date)
    //         }
    //     ],
    //     "count": 1,
    //     "page": 1,
    //     "pageSize": 1
    // }
    const responseBodyList = await responseList.json();

    if (responseList.ok === false) {
        return {
            ok: false,
            body: responseBodyList,
        }
    }

    const definitionKeys = searchKeyword == null || searchKeyword.trim() === ''
        ? responseBodyList.definitions
            .map(def => def.definitionKey)
        : responseBodyList.definitions
            .filter(def => def.definitionKey.includes(searchKeyword) || def.name.includes(searchKeyword))
            .map(def => def.definitionKey);

    const metricList = [];
    for (const definitionKey of definitionKeys) {
        const responseMetric = await fetch(`https://${baseUrlKey}.rest.marketingcloudapis.com/messaging/v1/email/definitions/` + definitionKey, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + await getToken()
            }
        });

        // {
        //     "requestId": string,
        //     "name": string,
        //     "definitionKey": string,
        //     "definitionId": string,
        //     "description": string,
        //     "classification": string,
        //     "status": string,
        //     "createdDate": string,
        //     "modifiedDate": string,
        //     "content": {
        //         "customerKey": string
        //     },
        //     "subscriptions": {
        //         "dataExtension": string,
        //         "list": string,
        //         "autoAddSubscriber": boolean,
        //         "updateSubscriber": boolean
        //     },
        //     "options": {
        //         "trackLinks": true
        //     },
        //     "journey": {}
        // }
        const responseBodyMetric = await responseMetric.json();

        if (responseMetric.ok === false) {
            return {
                ok: false,
                body: responseBodyMetric,
            }
        }

        metricList.push(responseBodyMetric);
    }

    return {
        ok: true,
        body: metricList
    }
}

async function createRecordApi(payload) {
    // payload
    // {
    //     'definitionKey': string,
    //     'name': string,
    //     'description': string,
    //     'classification': string,
    //     'status': string,
    //     'content': {
    //         'customerKey': string,
    //     },
    //     'subscriptions': {
    //         'list': string,
    //         'dataExtension': string,
    //         'autoAddSubscriber': boolean,
    //         'updateSubscriber': boolean,
    //     }
    // }
    const response = await fetch(`https://${baseUrlKey}.rest.marketingcloudapis.com/messaging/v1/email/definitions/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + await getToken()
        },
        body: JSON.stringify(payload)
    });

    return {
        ok: response.ok,
        body: await response.json()
    }
}

async function updateRecordApi(definitionKey, payload) {
    const response = await fetch(`https://${baseUrlKey}.rest.marketingcloudapis.com/messaging/v1/email/definitions/` + definitionKey, {
        method: "PATCH",
        headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + await getToken()
        },
        body: JSON.stringify(payload)
    });

    return {
        ok: response.ok,
        body: await response.json(),
    }
}

async function deleteRecordApi(definitionKey) {
    const response = await fetch(`https://${baseUrlKey}.rest.marketingcloudapis.com/messaging/v1/email/definitions/` + definitionKey, {
        method: "DELETE",
        headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + await getToken()
        }
    });

    return {
        ok: response.ok,
        body: await response.json(),
    }
}