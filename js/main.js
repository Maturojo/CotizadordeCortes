// Para activar el mensaje arriba del boton 
$(function () {
    $('[data-toggle="tooltip"]').tooltip()
})

$(document).ready(function() {
            // Actualizar el precio, imagen y descripción cuando se selecciona un tipo de madera
            $("#tipoMadera").change(function() {
                var precio = $(this).val();
                var imagen = $(this).find('option:selected').data('image');
                var descripcion = $(this).find('option:selected').data('description');
                
                // Actualizar el precio en el input correspondiente
                $("#preciometromadera").val(precio);
                
                // Actualizar la imagen y mostrarla
                if (imagen) {
                    $("#descripcionM").show();
                    $("#imagenMadera").attr("src", imagen).show();

                } else {
                    $("#imagenMadera").hide();
                    $("#descripcionM").hide();
                }

                // Actualizar la descripción y mostrarla
                if (descripcion) {
                    $("#descripcionMadera").text(descripcion).show();
                } else {
                    $("#descripcionMadera").hide();
                }
                
                
            });

            // Calcular el costo total cuando se hace clic en el botón
            $("#CALCULAR").click(function() {
                    // Obtener los valores de los inputs
                    var largo = parseFloat($("#alto").val());
                    var ancho = parseFloat($("#ancho").val());
                    var cantidad = parseFloat($("#cantidad").val());
                    var precioPorMetro = parseFloat($("#preciometromadera").val());
                    var tipoMadera = $("#tipoMadera option:selected").text();
                    var referenciaMinima = ((10 * 10) * precioPorMetro) / 10000; //se usa para poner un minimo de cobro
                    
                    // Validar que los valores sean correctos
                    if (isNaN(largo) || isNaN(ancho) || isNaN(precioPorMetro) || precioPorMetro === 0) {
                        alert("Por favor, ingrese valores válidos para el largo, ancho y seleccione un tipo de madera.");
                        return;
                    }
                    
                    // Limpiar los campos después de agregar la fila
                    $("#alto").val('');
                    $("#ancho").val('');
                    $("#cantidad").val('')
                    $("#costototalcorte").text('0.00');

                    var largoEnMetros = largo / 100;
                    var anchoEnMetros = ancho / 100;

                    // Calcular el área en metros cuadrados
                    var area = largoEnMetros * anchoEnMetros;

                    // Calcular el costo total y por unidad de corte
                    var costoUnidad = area * precioPorMetro
                    if (costoUnidad < referenciaMinima) {
                        costoUnidad = referenciaMinima;
                    }
                    var costoTotal = (costoUnidad) * cantidad;

                    // Mostrar el costo total en el elemento correspondiente
                    $("#costototalcorte").text(costoTotal.toFixed(2));
                    $("#costounidadalcorte").text(costoUnidad.toFixed(2));
                    $("#costeUnidad").show();

                    // Mostrar mensaje de agradecimiento
                    $("#agradecimiento").show();

                    $("#especificacion").show();

                    var numFila = 1 ;
                    var precioPorUnidad = parseFloat($("#costounidadalcorte").text());
                    var contar = $('.subtotal').length + 1;
                    var nuevaFila = `
                    
                        <tr>
                            <div class='flex-items'>
                            <td class='col'> <div class='form-check text-center'><input class='form-check-input row-item' type='checkbox'></div> </td>
                            <td class='col'>${cantidad}</td>
                            <td class='col' style="text-align: center;">${tipoMadera}</td>
                            <td class='col' >${largo} cm x ${ancho} cm</td>
                            <td class="col text-center" style="text-align: center;" >$ ${precioPorUnidad.toFixed(2)}</td>
                            <td class="col text-end subtotal">${costoTotal.toFixed(2)}</td>
                            </div>
                        </tr>
                    ` ;

                    // Agregar la fila a la tabla
                    $("#misCortes tbody").append(nuevaFila) ;

                    //Suma los sub totales y genera el total
                    // console.log(sum);
                    // $('#resultado_total').html(sum.toFixed(2));

                    // Row Item Change Event Listener

                    $('tr').find('.row-item').change(function() {
                        if ($(".row-item").length == $(".row-item:checked").length) {
                            $('#SelectAll').prop('checked', true)
                        } else {
                            $('#SelectAll').prop('checked', false)
                        }
                    })

                    sumar();


                    
                })

                // Remove Selected Table Row(s)
                $('#delete_selected').click(function() {
                        var count = $('.row-item:checked').length
                        if (count <= 0) {
                            alert("Por favor, seleccione una fila para eliminar")
                        } else {
                            $('.row-item:checked').closest('tr').remove()
                        }

                        sumar();

                        var contar = $('.subtotal').length;

                })

                $('#finpedido').click(function() {

                    // Swal.fire({
                    // position: "top-end",
                    // icon: "success",
                    // title: "Sus cortes han sido guardados",
                    // showConfirmButton: false,
                    // timer: 2500
                    // });

                    $(".botones").hide();
                    $(".logo").css("display","block");
                    printDiv("misCortes");

                    


                    var sum=0;
                    var contar = $('.subtotal').length;
                    //alert(contar);

                    $('.subtotal').each(function(){  
                    sum += parseFloat($(this).text().replace(/,/g, ''), 10); 

                    }); 

                    console.log(sum);
                    $('#resultado_total').html(sum.toFixed(2));




                    })

                function sumar(){
                    var sum=0;
                    // var valor="";
                    var contar = $('.subtotal').length;
                    //alert(contar);

                    $('.subtotal').each(function(){  
                    
                    // valor =($(this).text()).substring(1);
                    // valor =valor.replace(/./g, '');

                    // console.log("valor :", valor);

                    sum += parseFloat($(this).text().replace(/,/g, ''), 10); 
                    // sum += parseFloat(valor, 10); 
                    


                    }); 

                    console.log(sum);

                    $('#resultado_total').html(sum.toFixed(2));
                }

                function printDiv(nombreDiv) {
                    const divToPrint = document.getElementById(nombreDiv);
                    
                    // Clonamos el contenido a imprimir
                    const contenido = divToPrint.cloneNode(true);

                    // Le sacamos el scroll horizontal y forzamos el ancho completo
                    contenido.classList.add('tabla-pdf'); // aplicamos clase de impresión sin scroll

                    // Creamos una nueva ventana temporal para imprimir
                    const ventana = window.open('', '_blank');
                    ventana.document.write(`
                        <html>
                            <head>
                                <title>Impresión</title>
                                <style>
                                    body {
                                        font-family: 'Poppins', sans-serif;
                                        padding: 20px;
                                    }

                                    table {
                                        border-collapse: collapse;
                                        width: 100%;
                                        font-size: 0.9rem;
                                    }

                                    th, td {
                                        border: 1px solid #ddd;
                                        padding: 8px;
                                        text-align: center;
                                    }

                                    th {
                                        background-color: #f2f2f2;
                                    }

                                    .tabla-pdf {
                                        overflow: visible !important;
                                        max-width: none !important;
                                    }

                                    .tabla-pdf table {
                                        min-width: 1000px !important;
                                    }
                                </style>
                            </head>
                            <body>
                                ${contenido.innerHTML}
                            </body>
                        </html>
                    `);
                    ventana.document.close();
                    ventana.focus();
                    ventana.print();
                    ventana.close();
                }


                
        });

        function generatePDF() {
            const tablaContainer = document.querySelector('.tabla-scroll');

            // Clonar la tabla y hacerla visible y sin scroll
            const tablaClon = tablaContainer.cloneNode(true);
            tablaClon.classList.add('tabla-pdf');
            tablaClon.style.position = 'absolute';
            tablaClon.style.top = '-9999px'; // la escondemos visualmente
            document.body.appendChild(tablaClon);

            html2canvas(tablaClon).then((canvas) => {
                const imgData = canvas.toDataURL('image/png');
                const pdf = new jsPDF('p', 'mm', 'a4');
                const imgProps = pdf.getImageProperties(imgData);
                const pdfWidth = pdf.internal.pageSize.getWidth();
                const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

                pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
                pdf.save('cotizacion.pdf');

                document.body.removeChild(tablaClon); // limpiar clon
            });
        }

        function enviarWhatsapp() {
            const filas = document.querySelectorAll("#tabla tbody tr");
            if (filas.length === 0) {
                alert("No hay cortes cargados para enviar.");
                return;
            }

            let mensaje = "📦 *Resumen de cortes*%0A";

            filas.forEach((fila, index) => {
                const celdas = fila.querySelectorAll("td");
                const cantidad = celdas[1]?.textContent.trim();
                const material = celdas[2]?.textContent.trim();
                const medida = celdas[3]?.textContent.trim();
                const precio = celdas[5]?.textContent.trim();

                mensaje += `%0A🔹 *Corte ${index + 1}*%0A`;
                mensaje += `Material: ${material}%0A`;
                mensaje += `Medida: ${medida}%0A`;
                mensaje += `Cantidad: ${cantidad}%0A`;
                mensaje += `Subtotal: $${precio}%0A`;
            });

            const total = document.getElementById("resultado_total")?.textContent.trim();
            mensaje += `%0A💰 *Total: $${total}*`;

            const telefono = "2234383262"; // Cambiar por tu número
            const url = `https://wa.me/${telefono}?text=${mensaje}`;

            window.open(url, "_blank");
        }




    
