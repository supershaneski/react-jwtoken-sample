import fetch from 'isomorphic-unfetch';

const server_config = [
    { key: 'development', host: '192.168.1.80', port: 9000 },
    { key: 'production', host: 'YOUR-IP-ADDRESS', port: 80 },
]

export async function submitLogin({ login, password }) 
{
    
    const config = server_config.find(item => item.key === process.env.NODE_ENV);
    const url = process.env.NODE_ENV === "production" ? `https://${config.host}/test/login.php` : `http://${config.host}:${config.port}/test/login`
    
    let response = await fetch(url, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
            'x-api-key': process.env.REACT_APP_API_KEY,
        },
        body: JSON.stringify({
            id: login,
            pwd: password,
        })
    });

    let result = await response.json();
    return result;
}

export async function getData({ token })
{
    const config = server_config.find(item => item.key === process.env.NODE_ENV);
    const url = process.env.NODE_ENV === "production" ? `https://${config.host}/test/list.php` : `http://${config.host}:${config.port}/test/list`
    
    let response = await fetch(url, {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
            'Authorization': 'Bearer ' + token,
        }
    });

    let result = await response.json();
    return result;
}