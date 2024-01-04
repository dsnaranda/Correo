function login() {
    var username = document.getElementById("username").value;
    var password = document.getElementById("password").value;

    // Comprobar si el usuario existe en el localStorage
    var storedUser = localStorage.getItem(username);

    if (storedUser) {
        var storedPassword = JSON.parse(storedUser).password;

        if (password === storedPassword) {
            alert("Contraseña correcta");
            localStorage.setItem('usuario_actual', JSON.stringify({ username: username }));
            window.location.href = 'bandeja.html';
        } else {
            alert("Contraseña incorrecta");
        }
    } else {
        alert("Usuario no encontrado");
    }
}


// Obtener el nombre del usuario almacenado en localStorage
var usuarioActual = localStorage.getItem('usuario_actual');
if (usuarioActual) {
    usuarioActual = JSON.parse(usuarioActual).username;
    // Actualizar el contenido del label con el nombre del usuario
    document.getElementById('usuarioLabel').textContent += usuarioActual;
}

function logout() {
    localStorage.removeItem('usuario_actual');
    window.location.href = 'index.html';
}



localStorage.setItem("derik", JSON.stringify({ password: "123" }));
localStorage.setItem("angels", JSON.stringify({ password: "321" }));



function mostrarFormulario() {
    document.getElementById('bandejaEntrada').style.display = 'none';
    document.getElementById('formulario').style.display = 'block';
}

function mostrarBandeja() {
    // Oculta el formulario
    document.getElementById('formulario').style.display = 'none';

    // Muestra el contenido de la bandeja de entrada
    document.getElementById('bandejaEntrada').style.display = 'block';

    // Lógica para cargar y mostrar los mensajes recibidos
    cargarMensajesRecibidos();
}

function cargarMensajesRecibidos() {
    var usuarioActual = JSON.parse(localStorage.getItem('usuario_actual'));
    var bandejaEntradaDiv = document.getElementById('bandejaEntrada');
    bandejaEntradaDiv.innerHTML = '';  // Limpia el contenido existente

    // Recupera todos los mensajes almacenados en localStorage
    for (var clave in localStorage) {
        if (clave.startsWith('mensaje_')) {
            var mensaje = JSON.parse(localStorage.getItem(clave));
            agregarMensajeAlDiv(mensaje, bandejaEntradaDiv, clave);
        }
    }

    // Agrega el botón de "Borrar Seleccionados" si hay mensajes en la bandeja de entrada
    if (localStorage.length > 1) {
        var botonBorrar = document.createElement('button');
        botonBorrar.textContent = 'Borrar Seleccionados';
        botonBorrar.onclick = function () {
            borrarSeleccionados();
        };
        bandejaEntradaDiv.appendChild(botonBorrar);
    }
}


function agregarMensajeAlDiv(mensaje, div, clave) {
    // Agrega el mensaje al div solo si el destinatario es el usuario actual
    if (mensaje.destinatario === JSON.parse(localStorage.getItem('usuario_actual')).username) {
        var mensajeDiv = document.createElement('div');
        mensajeDiv.innerHTML = `
            <input type="checkbox" id="${clave}">
            <label>Remitente: ${mensaje.remitente}</label>
            <label>Asunto: ${mensaje.asunto}</label>
            <label>Contenido: ${mensaje.contenido}</label>
            <hr>
        `;
        div.appendChild(mensajeDiv);
    }
}

function enviarMensaje() {
    var destinatario = document.getElementById('destinatario').value;
    var asunto = document.getElementById('asunto').value;
    var contenido = document.getElementById('contenido').value;

    // Obtén el usuario actual del localStorage
    var remitente = JSON.parse(localStorage.getItem('usuario_actual')).username;

    // Almacena el mensaje en localStorage usando una clave única
    var mensajeKey = 'mensaje_' + new Date().getTime(); // Clave única basada en el tiempo
    var mensaje = {
        remitente: remitente,
        destinatario: destinatario,
        asunto: asunto,
        contenido: contenido
    };

    localStorage.setItem(mensajeKey, JSON.stringify(mensaje));

    // Limpia el formulario después de enviar el mensaje
    document.getElementById('formulario').reset();
    // Oculta el formulario después de enviar el mensaje
    document.getElementById('formulario').style.display = 'none';

    // Muestra la bandeja de entrada después de enviar el mensaje
    mostrarBandeja();

    // Prevención del envío del formulario para evitar la recarga de la página
    return false;
}

function borrarSeleccionados() {
    // Recorre todas las casillas de verificación y borra los mensajes seleccionados
    var bandejaEntradaDiv = document.getElementById('bandejaEntrada');
    var checkboxes = bandejaEntradaDiv.querySelectorAll('input[type="checkbox"]');
    
    checkboxes.forEach(function (checkbox) {
        if (checkbox.checked) {
            var claveMensaje = checkbox.id;
            localStorage.removeItem(claveMensaje);
        }
    });

    // Actualiza la bandeja de entrada después de borrar los mensajes seleccionados
    cargarMensajesRecibidos();
}