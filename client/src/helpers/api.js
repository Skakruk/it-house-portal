const getHeaders = (headers = {}) => {
    const authorization = localStorage.getItem('accessToken');

    return {
        Accept: 'application/json, text/plain, */*',
        'Content-Type': 'application/json',
        ...headers,
        ...(authorization ? {
            'Authorization': `Bearer ${authorization}`,
        } : {}),
    };
};

const host = `${process.env.REACT_APP_API_URL}`;

const AUTH_TOKEN_EXPIRED = 'AUTH_TOKEN_EXPIRED';
const BAD_CREDENTIALS = 'BAD_CREDENTIALS';
const FORBIDDEN_ACCESS = 'FORBIDDEN_ACCESS';

const api = {
    get: (url, headers) => {
        return fetch(host + url, {
            method: 'GET',
            headers: getHeaders(headers),
            mode: 'cors',
        }).then(response => api._handleErrors(response, api.get, url));
    },

    post: (url, payload, headers) => {
        return fetch(host + url, {
            method: 'POST',
            headers: getHeaders(headers),
            mode: 'cors',
            body: JSON.stringify(payload),
        }).then(response => api._handleErrors(response, api.post, url, payload));
    },

    put: (url, payload, headers) => {
        return fetch(host + url, {
            method: 'PUT',
            headers: getHeaders(headers),
            mode: 'cors',
            body: JSON.stringify(payload),
        }).then(response => api._handleErrors(response, api.put, url, payload));
    },

    delete: (url, payload, headers) => {
        return fetch(host + url, {
            method: 'DELETE',
            headers: getHeaders(headers),
            mode: 'cors',
            body: JSON.stringify(payload),
        }).then(response => api._handleErrors(response, api.delete, url, payload));
    },

    _handleErrors: (response, cb, ...params) => {
        if (response.ok) return response.json();

        return response.json().then((body) => {
            const { url, status, statusText } = response;

            if (body.errorCode === BAD_CREDENTIALS) {
                localStorage.removeItem('accessToken');
                return Promise.reject({ url, status, statusText, body });
            }

            if (
                body.errorCode === FORBIDDEN_ACCESS ||
                body.errorCode === AUTH_TOKEN_EXPIRED
            ) {
                localStorage.removeItem('accessToken');
                return api._retryOnFailure(body, cb, params, response);
            }

            return Promise.reject({ url, status, statusText, body });
        });
    },

    _retryOnFailure: (body, cb, params, response) => {
        const { url, status, statusText } = response;

        const refreshToken = localStorage.getItem('accessToken');

        if (!refreshToken) return Promise.reject({ url, status, statusText, body });

        return api.post('/auth/token', { refreshToken })
            .then((res) => {
                localStorage.setItem('accessToken', res.authToken);
                return cb(...params);
            })
            .catch(() => {
                localStorage.removeItem('refresh-token');
                return Promise.reject({ url, status, statusText, body });
            });
    },
};


export default api;
