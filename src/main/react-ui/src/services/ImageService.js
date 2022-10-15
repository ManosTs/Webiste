const url = "http://localhost:8080"


export async function uploadImage(data){
    return await fetch(url + '/api/upload-image', {
        method: 'POST',
        body: data
    });
}
