function traducir(msj) {
    const encodedParams = new URLSearchParams();
    encodedParams.append("q", msj);
    encodedParams.append("target", "es");
    encodedParams.append("source", "en");
    
    const options = {
        method: 'POST',
        headers: {
            'content-type': 'application/x-www-form-urlencoded',
            'Accept-Encoding': 'application/gzip',
            'X-RapidAPI-Key': 'a7773cdfe8msh94146259b0bc8d6p167e9fjsna59fc5c02ecb',
            'X-RapidAPI-Host': 'google-translate1.p.rapidapi.com'
        },
        body: encodedParams
    };
    
    fetch('https://google-translate1.p.rapidapi.com/language/translate/v2', options)
        .then(response => response.json())
        .then(response => {return response.data.translations[0].translatedText})
        .catch(err => console.error(err));
}
