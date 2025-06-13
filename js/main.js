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
            //alert(nombreDiv);
                var contenido = document.getElementById(nombreDiv).innerHTML;
                var contenidoOriginal= document.body.innerHTML;
                document.body.innerHTML = contenido;
                
                window.print();
                
                document.body.innerHTML = contenidoOriginal;


                $(".botones").show();
                
            }

                
        });

        function generatePDF() {

            $("#TituloMisCortes").css("display","inline");

            $("#misCortes").css("color","black");

            

            $(".botones").hide();

            $("#logo1").show();


            const { jsPDF } = window.jspdf;
            const doc = new jsPDF();
            
            html2canvas(document.querySelector("#misCortes"), { useCORS: true } ).then(canvas => {
                const imgData = canvas.toDataURL('image/png');
                const imgWidth = 190; // Ancho de la imagen en el PDF
                const pageHeight = 290; // Altura de la página en mm
                const imgHeight = canvas.height * imgWidth / canvas.width;
                let heightLeft = imgHeight;
                let position = 10; // Espacio inicial desde el margen superior

                doc.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
                heightLeft -= pageHeight;

                while (heightLeft >= 0) {
                    position = heightLeft - imgHeight;
                    doc.addPage();
                    doc.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
                    heightLeft -= pageHeight;
                }

                doc.save("mis-cortes.pdf");

                $(".botones").show();
            });
        }
                
    