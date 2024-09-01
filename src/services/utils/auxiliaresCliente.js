

export const formatoFecha = (sfecha, hs, americana, sec, dia) => {
    if (sfecha != undefined) {
		let fh;
        try {
            fh = new Date(sfecha.toString().replace(/\s/, 'T'));
            if (fh.toString()=="Invalid Date") {
                fh = sfecha;
            }
        } catch {
            fh = sfecha;
        }				
		let fhtxt = zfill(parseInt(fh.getDate()), 2) + '/' + zfill((parseInt(fh.getMonth()) + 1), 2) + "/" + parseInt(fh.getFullYear());
        if (americana){ fhtxt = fechaAmericana(fhtxt)}
        if (hs == 1) { fhtxt +=  ' ' + zfill(parseInt(fh.getHours()), 2) + ':' + zfill(parseInt(fh.getMinutes()), 2) };
        if (sec) { fhtxt += ':' + zfill(parseInt(fh.getSeconds()), 2) };
        if (dia) { fhtxt += ' ' + diaSemana(fh.getDay()) }
        return fhtxt;
    } else {
        return '01/01/1900';   }
}

export const diaSemana = (dia) => {
    switch (dia) {
        case 0: return 'Domingo';
        case 1: return 'Lunes';
        case 2: return 'Martes';
        case 3: return 'Miércoles';
        case 4: return 'Jueves';
        case 5: return 'Viernes';
        case 6: return 'Sábado';
        default: return '';
    }
}

export const fechaAmericana = (f) => {
	let ano = f.substring(6, 10) * 1;
	let mes = f.substring(3, 5) * 1;
	let dia = f.substring(0, 2) * 1;
	let fecha = zfill(ano, 4)+'-'+zfill(mes, 2)+'-'+zfill(dia, 2)
	return fecha;
}

function fechaValida(d) {
	if (Object.prototype.toString.call(d) === "[object Date]") {
		// it is a date
		if (isNaN(d.getTime())) {
		  return false
		} else {
		  return true
		}
	  } else {
		return false
	  }
}

const zfill = (number, width, deci) => {
    let numberOutput = Math.abs(number); /* Valor absoluto del n�mero */
    if (deci!=undefined|| deci>0) {
        numberOutput = Number.parseFloat(numberOutput).toFixed(deci).toString();
    }
    let length = numberOutput.toString().length; /* Largo del n�mero */
    let zero = "0"; /* String de cero */
    if (width <= length) {
        if (number < 0) {			
            return ("-" + numberOutput.toString());
        } else {
            return numberOutput.toString();
        }
    } else {
        if (number < 0) {
            return ("-" + (zero.repeat(width - length - 1)) + numberOutput.toString());
        } else {
            return zero.repeat(width - length) + numberOutput.toString();
        }
    }
}

export const esNumero = (txt) => {
	if (txt == undefined){txt = ''}
	txt = txt.toString();
	let num = txt.replaceAll(',', '.');
	var rsdo = true;
	if (isNaN(num)) {rsdo = false;} 
	if (num == '') {rsdo = false;}
	return rsdo
}



export const formatoSepMiles = (valor, deci=0) => {
	valor = Number(valor);
    if (isNaN(valor)) {valor = 0;}
    return new Intl.NumberFormat("de-DE", {style: 'decimal', minimumFractionDigits: deci, maximumFractionDigits: deci}).format(valor);
}


export const calculoPrecioList = (data, prod) => {
    const pr = Number(prod.precio)
    const boniSet = Number(prod.boniSet / 100)
    const boniProdCli = Number(prod.boniProdCli / 100)
    const boniRubroCli = Number(prod.boniRubroCli / 100)
    const boniProd = Number(prod.boniProd / 100)
    let tuPrecio = false
    const boniCli = Math.max(boniProdCli, boniRubroCli, boniProd)
    let boni = boniSet
    if (boniCli>boniSet) {
        boni = boniCli
        tuPrecio = true
    }
    let precio = pr * (1 - boni)
    if (data && data.user && data.user.renta) {
        let porc = Number(data.user.renta)
        if (esNumero(data.user.precios)) {
            porc = porc * data.user.precios
        }
        precio = Number(precio) * (1 + (porc / 100));
    }
    if (prod.compuesto) {
        return {precio: pr, boni: parseInt(boniSet*100), tuPrecio: false}    
    } else {
        return {precio: Number(precio), boni: parseInt(boni*100), tuPrecio: tuPrecio}
    }
}

export const calculoPrecio = (data, precio) => {
    if (data && data.user && data.user.renta) {
        let porc = Number(data.user.renta)
        if (esNumero(data.user.precios)) {
            porc = porc * data.user.precios
        }
        precio = Number(precio) * (1 + (porc / 100));
    }
    return precio;
}

export const horasTranscurridas = (fhActual, fhAnterior) => {
    const fh1 = new Date(fhActual);
    const fh2 = new Date(fhAnterior);
    const dif = fh1.getTime() - fh2.getTime();
    const horas = dif / (1000 * 60 * 60);
    return horas;
}
export const revisarImgPortada = (img, imgs, nroF) => {
    if (img && imgs && imgs.length > 0) {
        if (imgs.includes(img) && nroF===1) {
            return {img: img, nroF: nroF};
        } else {
            if (nroF===1) {nroF=2}
            for (let nroFoto = nroF; nroFoto <= 5; nroFoto++) {
                nroFoto>1 && (img = img.replace(`_${nroFoto-1}.`, '_'+nroFoto+'.'))
                if (imgs.includes(img)) {
                    return {img: img, nroF: nroFoto};
                } else {
                    for (let i = 1; i < 100; i++) {
                        const nro1 = img.indexOf('-')
                        let nro2 = img.indexOf('_')
                        if (nro1<0 || nro2<0) {
                            return {img: '', nroF: nroFoto};
                        } else {
                            nro2-nro1<=0 ? nro2 = nro1 + 1 : nro2+=1 
                            const vte = img.substring(nro1, nro2)
                            const img2 = img.replace(vte, '-'+i+'_')
                            if (imgs.includes(img2)) {
                                return  {img: img2, nroF: nroFoto};
                            }
                        }
                    }
                }
            }
            return {img: '', nroF: nroF};
        }
    } else {
        return {img: '', nroF: nroF};
    }
}

export const revisarImg = (img, imgs, portada, ext) => {
    if (img && imgs && imgs.length > 0) {
        if (imgs.includes(img)) {
            return img;
        } else {
            for (let nroFoto = 1; nroFoto <= 3; nroFoto++) {
                nroFoto>1 && (img = img.replace(`_${nroFoto-1}.`, '_'+nroFoto+'.'))
                if (imgs.includes(img)) {
                    return img;
                } else if (portada) {
                    for (let i = 1; i < 100; i++) {
                        const nro1 = img.indexOf('-')
                        let nro2 = img.indexOf('_')
                        if (nro1<0 || nro2<0) {
                            return '';
                        } else {
                            nro2-nro1<=0 ? nro2 = nro1 + 1 : nro2+=1 
                            const vte = img.substring(nro1, nro2)
                            const img2 = img.replace(vte, '-'+i+'_')
                            if (imgs.includes(img2)) {
                                return  img2;
                            }
                        }
                    }
                } else {
                    return '';
                }
            }
            return '';
        }
    } else {
        return '';
    }
}

export const primeraMayuscula = (txt) => {
    txt = txt.toString().toLowerCase();
    txt = txt.charAt(0).toUpperCase() + txt.slice(1)
    return txt;
}

export const isValidURL = (string) => {
    if (!string) return false;
    if (string.length < 5) return false;
    if (string === undefined) return false;
    var res = string.match(/^(http|https):\/\/[^ "]+$/);
    return (res !== null);
};
