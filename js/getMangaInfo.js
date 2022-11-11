async function getMangaInfo(){
    let resp = await fetch("https://api.jikan.moe/v4/manga"); //respuesta de la api
    let json = await resp.json(); // capturo la promesa y la convierto en .json
    let data = json.data;
    const mangaData = [];
    
    //desestructuro el array recibido como respuesta de la API para generar un nuevo array con los datos que necesito.
    data.forEach(manga => {
        let {images: {jpg: {image_url}}, title, authors, status, themes, volumes, synopsis} = manga;

        let arrAuthors = [];
        authors.forEach(author =>{
            let {name} = author;
            arrAuthors.push(name);
        })

        let arrThemes = [];
        themes.forEach(theme => {
            let {name} = theme;
            arrThemes.push(name);
        });
        
        //push de los arrays con los datos de cada manga
        mangaData.push([image_url, title, arrAuthors, arrThemes, volumes, status, synopsis]);
    })  
    
    return mangaData
}