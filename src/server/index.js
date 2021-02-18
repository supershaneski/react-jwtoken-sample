import fetch from 'isomorphic-unfetch';

const server_config = [
    { key: 'development', host: '192.168.1.80', port: 9000 },
    { key: 'production', host: 'YOUR-IP-ADDRESS', port: 80 },
]

const header = {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
}

const request = {
    url: '',
    method: 'POST',
    headers: null,
    payload: null,
}

export async function submitLogin({ login, password }) 
{
    
    const config = server_config.find(item => item.key === process.env.NODE_ENV);
    const url = process.env.NODE_ENV === "production" ? `https://${config.host}/test/login.php` : `http://${config.host}:${config.port}/test/login`
    
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
    const config = server_config.find(item => item.key === process.env.NODE_ENV);
    const url = process.env.NODE_ENV === "production" ? `https://${config.host}/test/list.php` : `http://${config.host}:${config.port}/test/list`
    
    const my_header = {
        'Accept': 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        'Authorization': 'Bearer ' + token,
    }

    // save
    request.url = url;
    request.method = 'GET';
    request.headers = process.env.NODE_ENV === "production" ? my_header : header;

    let response = await fetch(url, {
        method: 'GET',
        headers: process.env.NODE_ENV === "production" ? my_header : header,
    })

    let result = await response.json();

    //console.log("data...", result);

    const status = typeof result.status !== "undefined" ? parseInt(result.status) : 0;
    if(status === 401) {

        console.log("refresh token...");

        // refresh token
        //return result;

        const url1 = `http://${config.host}:${config.port}/test/refresh/`;
        let responseT = await fetch(url1);
        let resultT = await responseT.json();

        const statusT = typeof resultT.status !== "undefined" ? parseInt(resultT.status) : 0;
        if(statusT === 401) {

            console.log("...expired");

            return resultT;
            
        } else {

            console.log("...okay");

            response = await fetch(url);
            result = await response.json();
            return result;

        }

    } else {

        return result;

    }
    
}