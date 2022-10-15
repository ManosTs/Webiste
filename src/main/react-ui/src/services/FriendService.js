const url = "http://localhost:8080"


export async function addFriend(data){

    return await fetch(url + '/api/addFriend', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            friendId: data.friendId,
            userId: data.userId

        }),
    });
}

export async function getFriends(userId){

    return await fetch(url + '/api/' + userId +'/friends', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    });
}
