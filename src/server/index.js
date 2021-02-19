import fetch from 'isomorphic-unfetch';

const server_config = [
    { key: 'development', host: '192.168.1.80', port: 9000 },
    { key: 'production', host: 'YOUR-IP-ADDRESS', port: 80 },
]

const header = {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
}

const config = server_config.find(item => item.key === process.env.NODE_ENV);
const base_url = process.env.NODE_ENV === "production" ? `https://${config.host}` : `http://${config.host}:${config.port}`;

export async function submitLogin({ login, password }) {
    
    const url = `${base_url}/login.php`;
    
    const my_header = {
        'Accept': 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        'x-api-key': process.env.REACT_APP_API_KEY,
    }

    let response = await fetch(url, {
        method: 'POST',
        headers: process.env.NODE_ENV === "production" ? my_header : header,
        body: JSON.stringify({
            id: login,
            pwd: password,
        })
    })

    let result = await response.json();
    return result;
}

export async function getData({ token })
{
    
    const url = `${base_url}/list.php`;

    const my_header = {
        'Accept': 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        'Authorization': 'Bearer ' + token,
    }

    let response = await fetch(url, {
        method: 'GET',
        headers: process.env.NODE_ENV === "production" ? my_header : header,
    })

    let result = await response.json();

    // intercept response from original request
    // to check if server sends an expired token status
    const status = typeof result.status !== "undefined" ? parseInt(result.status) : 0;
    if(status === 401) {
        
        // if the token is expired, send a refresh token request

        const url1 = `${base_url}/refresh.php`;

        let responseT = await fetch(url1, {
            method: 'GET',
            headers: process.env.NODE_ENV === "production" ? my_header : header,
        })
        let resultT = await responseT.json();

        const statusT = typeof resultT.status !== "undefined" ? parseInt(resultT.status) : 0;
        if(statusT !== 200) {

            // if refresh token failed, send back the response

            return resultT;
            
        } else {

            const new_token = typeof resultT.token !== "undefined" ? parseInt(resultT.token) : '';

            // if token is empty, send back original response
            if(!new_token) {

                return result;

            }

            const new_header = {
                'Accept': 'application/json',
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                'Authorization': 'Bearer ' + new_token,
            }

            // prepare the header with the new token and send request again
            response = await fetch(url1, {
                method: 'GET',
                headers: process.env.NODE_ENV === "production" ? new_header : header,
            })

            result = await response.json();
            return result;

        }

    } else {

        return result;

    }
    
}