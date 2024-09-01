import { jsPDF } from "jspdf";
import { formatoFecha } from "./auxiliaresCliente.js";


export default async function generarPDF(orden, user) {
    let hoja = 1;
    const margen = 25;
    const logo = new Image();
    logo.src="/img/logo.png";
    let y = 70;    
    const xMax = 150;
    const yMax = 275;
    const seccion = 18;
    let doc = new jsPDF();
    let x = 15;

    doc = nuevaPagina(doc, orden, hoja, logo);        
    y += 12;
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    let piezas = orden.piezasSup.filter(p => p.value)
    if (piezas.length > 0) {
        doc.text('Piezas Superiores:', 10, y);
        x = 10;
        orden.piezasSup.map(item => {
            if (item.value) {
                doc.rect(x, y + 2, 8, 8);
                doc.text(item.label, x + 1, y + 7.5);
                x += 10;
            }
        })
    }
    piezas = orden.piezasInf.filter(p => p.value)
    if (piezas.length > 0) {
        y += 18
        doc.text('Piezas Inferiores:', 10, y);
        x = 10;
        orden.piezasInf.map(item => {
            if (item.value) {
                doc.rect(x, y + 2, 8, 8);
                doc.text(item.label, x + 1, y + 7.5);
                x += 10;
            }
        })
    }
    y += 3
    const fuenteGrande = 10;
    const fuentePequena = 8;
    doc.setFontSize(fuenteGrande);
       
    y += seccion;
    doc.line(10, y - 7, 80, y - 7);
    doc.line(100, y - 7, 190, y - 7);
    x = 40;
    doc.setFont('helvetica', 'normal');
    doc.text('TRABAJO', 11, y - 1);
    doc.text('A REALIZAR', 10, y + 4);
    doc.setFont('helvetica', 'bold');
    orden.trabajo.map(item => {
        if (item.value) {
            if (x > xMax) {
                x = 40;
                y += 8;
            }
            doc.text(item.label, x, y);
            item.detalle && item.detalle !== '' && doc.text(item.detalle, 40, y + 5);
            const textoAncho = doc.getStringUnitWidth(item.label) * doc.internal.getFontSize() / doc.internal.scaleFactor;
            x += textoAncho + 10;
        }
    })
    y -= 5;
    //MATERIAL
    y += seccion;
    if (y > yMax) {
        hoja++;
        y = margen + 60;
        doc = nuevaPagina(doc, orden, hoja, logo);
    } else {    
        doc.line(10, y - 7, 80, y - 7);
        doc.line(100, y - 7, 190, y - 7);
    }
    x = 40;
    doc.setFont('helvetica', 'normal');
    doc.text('MATERIAL', 11, y - 1);
    doc.text('A UTILIZAR', 10, y + 4);
    doc.setFont('helvetica', 'bold');
    orden.material.map(item => {
        if (item.value) {
            if (x > xMax) {
                x = 40;
                y += 8;
            }
            doc.text(item.label, x, y);
            item.detalle && item.detalle !== '' && doc.text(item.detalle, 40, y + 5);
            const textoAncho = doc.getStringUnitWidth(item.label) * doc.internal.getFontSize() / doc.internal.scaleFactor;
            x += textoAncho + 10;
        }
    })
    //PROCESO
    y -= 5;
    y += seccion;
    if (y > yMax) {
        hoja++;
        y = margen + 60;
        doc = nuevaPagina(doc, orden, hoja, logo);
    } else {    
        doc.line(10, y - 7, 80, y - 7);
        doc.line(100, y - 7, 190, y - 7);
    }
    x = 40;
    doc.setFont('helvetica', 'normal');
    doc.text('PROCESO', 10, y);
    doc.setFont('helvetica', 'bold');
    orden.proceso && 
    orden.proceso.map(item => {
        if (item.value) {
            if (x > xMax) {
                x = 40;
                y += 8;
            }
            doc.text(item.label, x, y);
        }
    })
    //IMPRESION
    if (orden.impresion) {
        const impre = orden.impresion.filter(i => i.value);
        if (impre.length > 0) {
            y -= 8;
            y += seccion;
            if (y > yMax) {
                hoja++;
                y = margen + 60;
                doc = nuevaPagina(doc, orden, hoja, logo);
            } else {    
                doc.line(10, y - 7, 80, y - 7);
                doc.line(100, y - 7, 190, y - 7);
            }
            x = 40;
            doc.setFont('helvetica', 'normal');
            doc.text('IMPRESION', 10, y - 1);
            doc.text('3 D', 17, y + 4);
            doc.setFont('helvetica', 'bold');
            impre.map(item => {
                if (item.value) {
                    if (x > xMax) {
                        x = 40;
                        y += 8;
                    }
                    doc.text(item.label, x, y);
                    const textoAncho = doc.getStringUnitWidth(item.label) * doc.internal.getFontSize() / doc.internal.scaleFactor;
                    x += textoAncho + 10;
                }
            })
        }
        y -= 6;
    }
    y += seccion;
    if (y > yMax) {
        hoja++;
        y = margen + 60;
        doc = nuevaPagina(doc, orden, hoja, logo);
    } else {    
        doc.line(10, y - 7, 80, y - 7);
        doc.line(100, y - 7, 190, y - 7);
    }      
    x = 40;           
    doc.setFont('helvetica', 'normal');
    doc.text('IMPLANTES', 10, y + 10);
    doc.setFont('helvetica', 'bold');
    orden.coronas.map(item => {   
        doc.setFont('helvetica', 'normal');
        doc.text(`${item.label}:`, x, y - 1);
        doc.setFont('helvetica', 'bold');
        doc.text(`${item.value}`, x + 30, y - 1);
        y += 6;
    })
    y -= 16;       
    y += seccion;
    if (y > yMax) {
        hoja++;
        y = margen + 60;
        doc = nuevaPagina(doc, orden, hoja, logo);
    } else {    
        doc.line(10, y - 7, 80, y - 7);
        doc.line(100, y - 7, 190, y - 7);
    }
    x = 10;
    doc.line(10, y - 7, 80, y - 7);
    doc.line(100, y - 7, 190, y - 7);
    doc.setFont('helvetica', 'normal');
    doc.text('COLOR FINAL: ', x, y);
    let txt = doc.splitTextToSize(orden.color_final, 140);
    txt.map(line => {
        doc.setFont('helvetica', 'bold');
        doc.text(line, x + 40, y);
        if (y > yMax) {
            hoja++;
            y = margen + 60;
            doc = nuevaPagina(doc, orden, hoja, logo);
        }
        y += 7;
    });
    doc.setFont('helvetica', 'normal');
    doc.text('REMANENTE:', x, y);
    doc.setFont('helvetica', 'bold');
    txt = doc.splitTextToSize(orden.remanente, 140);
    txt.map(line => {
        doc.setFont('helvetica', 'bold');
        doc.text(line, x + 40, y);
        if (y > yMax) {
            hoja++;
            y = margen + 60;
            doc = nuevaPagina(doc, orden, hoja, logo);
        }
        y += 7;
    });
    y -= 15;
    y += seccion;
    if (y > yMax) {
        hoja++;
        y = margen + 60;
        doc = nuevaPagina(doc, orden, hoja, logo);
    } else {    
        doc.line(10, y - 7, 80, y - 7);
        doc.line(100, y - 7, 190, y - 7);
    }
    doc.setFont('helvetica', 'normal');
    doc.text('DESCRIPCIÓN: ', x, y);
    doc.setFont('helvetica', 'bold');
    y += 7;
    txt = doc.splitTextToSize(orden.descripcion, 180);
    txt.map(line => {
        doc.setFont('helvetica', 'bold');
        doc.text(line, 10, y);
        y += 5;
        if (y > yMax) {
            hoja++;
            y = margen + 60;
            doc = nuevaPagina(doc, orden, hoja, logo);
        }
    });
    y -= 15;
    y += seccion;
    if (y + 15 > yMax) {
        hoja++;
        y = margen + 60;
        doc = nuevaPagina(doc, orden, hoja, logo);
    } else {    
        doc.line(10, y - 7, 80, y - 7);
        doc.line(100, y - 7, 190, y - 7);
    }
    x = 10;
    doc.setFont('helvetica', 'bold');
    doc.text(`RETIRAR ADITAMENTOS: ${orden.aditamentos ? '-- SI --' : '-- NO --'}`, x, y);
    y += 7;
    doc.setFont('helvetica', 'normal');
    doc.text('ENTREGA:', 10, y);
    doc.setFont('helvetica', 'bold');
    y += 7;
    txt = doc.splitTextToSize(orden.entrega, 180);
    txt.map(line => {
        doc.setFont('helvetica', 'bold');
        doc.text(line, 10, y);
        y += 7;
        if (y > yMax) {
            hoja++;
            y = margen + 60;
            doc = nuevaPagina(doc, orden, hoja, logo);
        }
    });
    
    doc.line(10, y - 5, 80, y - 5);
    doc.line(100, y - 5, 190, y - 5);
    doc.setFontSize(fuentePequena);
    doc.setFont('helvetica', 'normal');
    doc.text(`Domicilio: ${orden.odontologo.domicilio} ${orden.odontologo.localidad} -  Celular: ${orden.odontologo.celular}`, 10, y);
    y += 5;
    doc.text(`Impresa: ${formatoFecha(new Date(), true, false, false, false)}  -  Usuario: ${user.nombre} ${user.apellido}`, 20, y);
    doc.setFont('helvetica', 'bold');
    doc.text('FIN IMPRESIÓN', 160, y);
    doc.line(10, y + 3, 190, y + 3);
    doc.save(`Orden_${orden.orderNumber}_${orden.odontologo.nombre.replaceAll(' ', '-')}_${orden.odontologo.apellido.replaceAll(' ', '-')}.pdf`);
}



const nuevaPagina = (doc, orden, hoja, logo) => {
    let y = 65;   
    if (hoja>1) doc.addPage();
    doc.addImage(logo, 'PNG', 10, 8, 40, 18);
    doc.setLineWidth(1);
    doc.rect(5, 5, 190, 25);
    doc.setFontSize(20);
    doc.text('Laboratorio Clara Cerámicas', 75, 15);
    doc.setFontSize(10);
    doc.text(`Página: ${hoja}`, 160, 25);

    doc.setLineWidth(0.2);              
    doc.rect(5, 30, 190, 260);

          
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('Órden de Trabajo', 80, y - 25);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'normal');
    doc.text(`Ingreso: ${formatoFecha(orden.createdAt, true, false, false, true)}`, 10, y - 15);
    
    doc.line(110, y - 21, 190, y - 21);
    doc.text(`Nro. Órden:`, 120, y - 15);
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text(`${orden.orderNumber}`, 150, y - 15);
    doc.line(110, y - 12, 190, y - 12);
    
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(14);
    doc.text(`Odontologo:`, 10, y - 5);
    doc.setFont('helvetica', 'bold');
    let txt = orden.odontologo.nombre ? orden.odontologo.nombre : ''
    txt += orden.odontologo.apellido ? orden.odontologo.apellido : '';
    doc.text(`${txt.substr(0, 25)}`, 40, y - 5);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text(`Solicitada Para: ${formatoFecha(orden.fechaSolicitada, false, false, false, true)}`, 120, y - 5);
    doc.setFontSize(14);
    doc.text(`Paciente:`, 10, y + 5);
    doc.setFont('helvetica', 'bold');
    doc.text(`${orden.paciente ? orden.paciente.substr(0, 30) : ''}`, 35, y + 5);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(12);
    doc.text(`Edad: ${orden.edad}  -  Sexo: ${orden.sexo}`, 130, y + 5);
    doc.line(10, y + 10, 190, y + 10);
    return doc;
}