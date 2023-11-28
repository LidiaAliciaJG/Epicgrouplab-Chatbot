var messageForm = document.getElementById("message-form");
var messageInput = document.getElementById("message-input");
var messages = document.getElementById("messages"); //espacio en blanco, aqui apareceran nuevos cuadros de texto

function addMessage(content, user) {
	var messageElement = document.createElement("div"); //crear nuevo elemento llamado div
	//crear una clase desde el codigo JS, tal como se hhace en el html pero como aún no existe, aqui se debe realizar
	//la clase no es fija, va a ir cambiando cuando ya se ingresen los mensajes de OpenAI, el mensaje de nosotros es user, el de open ai será otro class
	messageElement.classList.add(user);
	messageElement.innerText = content; //texto ingresado, se mostrará como un globo en la parte del chat

	//aun no se agrega el globo en el espacio en blanco
	messages.appendChild(messageElement); //le dice a la caja blanca que se agrega lo que se acaba de crear para el mensaje ingresado
	messages.scrollTo(0, messages.scrollHeigth); //que nos envíe hasta abajo de todo, comoo whatsapp
}

async function sendMessage(message) {
	//se agrega async y await para esperar a que el internet del usuario procese y evitar errores por si recibe el mensaje antes de que el internet cargue
	//esta funcion puede tener errores, si los hay, vamos a pedir que nos notifique
	try {
		//intentar:
		const context = "Eres un bot de respuestas. Tengo una página web de venta donde vas responder cualquier pregunta relacionada a estos temas: Telefono de la empresa: 23234334, procedimiento de pedido: delivery, tipos de productos: frutas, verduras, tubérculos. Procedimiento de reclamo: rápido y fácil."; //conocimiento previo que llega al bot para entrenarlo y que apartir de eso nos responda. Ejemplo: en epic se puede subir toda la información de Epic como horarios, costos, etc,
		const response = await fetch("/api/chatbot", {
			method: "POST", // -> enviar
			headers: {
				"Content-Type": "application/json" //conexión con el envío es como nuestro header en html, nuuestra configuración, se va a enviar contenido del tipo de app json
			},
			body: JSON.stringify({ message, context }) //transforma al formato JSON que es lo que entiende el chatgpt, envía el mensaje y el contexto; esta info la requiere para respondernos coorrectamente
		}); //fetch es para unirte a servicios externos comoo el de open ai. su enlace en la doocumentacion es el colocado
		if (!response.ok) {
			var errorText = await response.text()
			throw new Error("Error en la respuesta "+ response.status + errorText)
		}
		var data = await response.json()
		addMessage(data.reply, 'bot')
	} catch (error) {
		//si el iintento falla, atrapa el error de lo que salió mal en el intento
		console.error("Error al enviar mensaje", error);
	}
}

//messageForm.addEventListener("submit", (event) => {//escuchar el evento de enviar el mensaje a openain. o sea todo click a enviar
//})

messageForm.addEventListener("submit", mt);

function mt(event) {
	event.preventDefault();
	var message = messageInput.value.trim(); //eliminar espacios en blanco, para evitar que se cobren los caracteres o solo provoque error
	if (!message) return; //si el mensaje esta vacío, no hagas nada; aqui finaliza el código, si no, ejecuta lo siguiente:
	addMessage(message, "user");
	messageInput.value = ""; //limpiar la caja de texto cada que se envía
	sendMessage(message);
}
