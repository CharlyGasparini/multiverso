async function getUsuario () {
    let resp = await fetch('https://jsonplaceholder.typicode.com/users');
    let data = await resp.json();
    let users = [];

    
    data.forEach(user => {
        users.push(new Usuario(user))
    });

    return users;
}