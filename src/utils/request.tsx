
const baseUrl = 'http://localhost:5000';


export async function post(url = '', data= {}, isToken: boolean = true){
    const header = new Headers({
        'Content-Type': 'application/json'
    });
    if (isToken) {
        const token = localStorage.getItem('token');
        if (token) {
            header.append('Authorization', `Bearer ${token}`);
        }
        else {
            throw new Error('No token found');
        }
    }
    const response = await fetch(`${baseUrl}${url}`, {
        method: 'POST',
        headers: header,
        body: JSON.stringify(data)
    });
    // console.log(response);

    if (!response.ok) {
        if (response.status === 400 || response.status === 401 || response.status === 403 || response.status === 409
            || response.status === 500) {
            const error = await response.json();
            throw new Error(error.message);
        }
    }
    return await response.json();
}

export async function postImg(url = '', file = new FormData()) {

    const response = await fetch(`${baseUrl}${url}`, {
        method: 'POST',
        body: file
    });
    console.log([...file.entries()]);

    if (!response.ok) {
        if (response.status === 400 || response.status === 401 || response.status === 403 || response.status === 409
            || response.status === 500) {
            const error = await response.json();
            throw new Error(error.message);
        }
    }
    return await response.blob();
}

