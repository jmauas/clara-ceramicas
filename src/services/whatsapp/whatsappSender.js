
import https from 'https';
import FormData from 'form-data';
import fs from'fs';
import path from 'path';
import fetch from 'node-fetch';

const agent = new https.Agent({  
  rejectUnauthorized: false
});

const url = process.env.URL_WHATSAPP;
const urlApp = process.env.URL_APP;
const token = process.env.TOKEN_WHATSAPP;
const root = process.cwd();

export const validarYEnviarWhatsapp = async (cel, mensaje, media) => {
    if (cel == '') return false;
    cel = cel.toString();
    cel = cel.toString().replace(/\D/g, '')//QUITO CUALQUIER COSA QUE NO SEA NUMERO
    if (cel.length < 8) return false;
    if (cel.length === 8) cel = '54911' + cel;
    if (cel.substr(0, 2) == '15') cel = '54911' + cel.substr(2);
    cel = cel.replace('0011', '11')
    cel = cel.replace('011', '11')
    if (cel.substr(0, 2) != '54') cel = '54' + cel;
    if (cel.substr(0, 3) != '549') cel = '549' + cel.substr(2);

    if (mensaje == '' && (!media || media === '')) return false;
    return await postMessage(cel, mensaje, media,  url, token);
}

export const postMessage = async (numero, mensaje, media, url, token) => {
    try {
        let data = {
            numero,
            mensaje,
            media,
            token
        };
        data = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });
        const res = await data.json();
        return res;
    } catch (error) {
        console.error('Error:', error);
        return false
    }
}


export const postAdjunto = async (cel, adj, ruta, externa, urlAdj) => {
    try {
        let media = '';
        let res = '';
        if (!externa === true) {
            // let urlWa = url;
            // urlWa = urlWa.substring(0, urlWa.lastIndexOf('/'))+'/upload';
            // const formData = new FormData();
            // const filePath = path.join(root, 'locales', ruta, adj);
            // formData.append('myFile', fs.createReadStream(filePath));
            // const data = await fetch(urlWa, {
            //     method: 'POST',
            //     body: formData,
            //     headers: {               
            //         ...formData.getHeaders()
            //     },
            // });
            //res = await data.json();
            media = [adj]
        } else {
            media = [urlAdj];
        }        
        res = await validarYEnviarWhatsapp(cel, ``, media)
        console.log(adj)
        const ext = adj.substring(adj.lastIndexOf('.')+1);
        if (ext === 'html') {
           await validarYEnviarWhatsapp(cel, `Para ver el Diseño, hacé click en el siguiente Link: 
            ${externa === true ? urlAdj : `${urlApp}/api/files/scans/${adj}`}`, '')
        }
        return res;
    } catch (error) {
        console.error('Error:', error);
        return false
    }
}