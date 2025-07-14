// archivo: juego.js
import { preguntas } from "./preguntas.js";

export function juego() {
  const container = document.createElement("div");
  container.className = "juego-memoria";
  document.body.appendChild(container);

  function mostrarInicio() {
    container.className = "juego-memoria inicio";
    container.innerHTML = "";

    const juegoContainer = document.createElement("div");
    juegoContainer.className = "juego-container";
    container.appendChild(juegoContainer);

    const tituloInicio = document.createElement("h1");
    tituloInicio.textContent = "🎮 Bienvenido a Trivial Trouble";
    tituloInicio.className = "titulo-inicio";
    juegoContainer.appendChild(tituloInicio);

    const imagenInicio = document.createElement("img");
    imagenInicio.src = "https://wallpapers.com/images/hd/cuphead-and-beppi-the-clown-m5h8hdbjktxsva50.jpg";
    imagenInicio.alt = "Cuphead Inicio";
    imagenInicio.className = "imagen-inicio";
    juegoContainer.appendChild(imagenInicio);

    const botonInicio = document.createElement("button");
    botonInicio.textContent = "Iniciar Juego";
    botonInicio.className = "btn-inicio";
    botonInicio.onclick = () => mostrarSeleccionNivel();
    juegoContainer.appendChild(botonInicio);
  }

  function mostrarSeleccionNivel() {
    container.className = "juego-memoria seleccion-nivel";
    container.innerHTML = "";

    const juegoContainer = document.createElement("div");
    juegoContainer.className = "juego-container";
    container.appendChild(juegoContainer);

    const titulo = document.createElement("h1");
    titulo.textContent = "Selecciona un Nivel";
    titulo.className = "titulo-seleccion";
    juegoContainer.appendChild(titulo);

    const nivelesContainer = document.createElement("div");
    nivelesContainer.className = "niveles-container";

    for (let nivel = 1; nivel <= 5; nivel++) {
      const btnNivel = document.createElement("button");
      btnNivel.textContent = `Nivel ${nivel}`;
      btnNivel.className = "btn-nivel";
      btnNivel.onclick = () => iniciarJuego(nivel);
      nivelesContainer.appendChild(btnNivel);
    }

    juegoContainer.appendChild(nivelesContainer);
  }

  function iniciarJuego(nivel) {
    container.className = "juego-memoria juego";
    container.innerHTML = "";

    const juegoContainer = document.createElement("div");
    juegoContainer.className = "juego-container";
    container.appendChild(juegoContainer);

    const preguntasFiltradas = preguntas.filter(p => p.nivel === nivel);
    let indice = 0;
    let puntaje = 0;
    let tiempoRestante = 90;

    const infoPanel = document.createElement("div");
    infoPanel.className = "info-panel";

    const reloj = document.createElement("div");
    reloj.className = "tiempo";
    reloj.textContent = `⏱️ Tiempo: ${tiempoRestante}s`;
    infoPanel.appendChild(reloj);

    const puntajeDisplay = document.createElement("div");
    puntajeDisplay.className = "puntaje";
    puntajeDisplay.textContent = `Puntaje: ${puntaje}`;
    infoPanel.appendChild(puntajeDisplay);

    juegoContainer.appendChild(infoPanel);

    const temporizadorInterval = setInterval(() => {
      tiempoRestante--;
      reloj.textContent = `⏱️ Tiempo: ${tiempoRestante}s`;
      if (tiempoRestante <= 0) {
        clearInterval(temporizadorInterval);
        mostrarFinal(puntaje, preguntasFiltradas.length);
      }
    }, 1000);

    function mostrarPregunta() {
      if (indice >= preguntasFiltradas.length) {
        clearInterval(temporizadorInterval);
        mostrarFinal(puntaje, preguntasFiltradas.length);
        return;
      }

      const actual = preguntasFiltradas[indice];
      juegoContainer.innerHTML = "";
      juegoContainer.appendChild(infoPanel);

      const titulo = document.createElement("h2");
      titulo.className = "pregunta";
      titulo.textContent = `Pregunta ${indice + 1}: ${actual.texto}`;
      juegoContainer.appendChild(titulo);

      const opcionesContainer = document.createElement("ul");
      opcionesContainer.className = "opciones";
      juegoContainer.appendChild(opcionesContainer);

      actual.opciones.forEach((opcion, i) => {
        const li = document.createElement("li"); // Crear un elemento de lista
        const btn = document.createElement("button");
        btn.className = "btn-opcion"; // Clase para el estilo de los botones
        btn.textContent = opcion;
        btn.onclick = () => {
          const correcta = i === actual.correcta;
          btn.classList.add(correcta ? "correcta" : "incorrecta"); // Agregar clase según la respuesta

          if (correcta) {
            puntaje += 100;
            puntajeDisplay.textContent = `Puntaje: ${puntaje}`;
          }

          const botones = opcionesContainer.querySelectorAll("button");
          botones.forEach(b => b.disabled = true); // Deshabilitar todos los botones después de responder

          setTimeout(() => {
            indice++;
            mostrarPregunta();
          }, 1500);
        };
        li.appendChild(btn); // Agregar el botón dentro del elemento de lista
        opcionesContainer.appendChild(li); // Agregar el elemento de lista al contenedor
      });
    }

    mostrarPregunta();
  }

  function mostrarFinal(puntaje, totalPreguntas) {
    container.className = "juego-memoria final"; // Cambiar la clase para la pantalla de resultados
    container.innerHTML = ""; // Limpiar el contenedor para mostrar el final

    const juegoContainer = document.createElement("div");
    juegoContainer.className = "juego-container";
    container.appendChild(juegoContainer);

    const titulo = document.createElement("h2");
    titulo.className = "pregunta";
    titulo.textContent = "🎉 ¡Nivel terminado!";
    juegoContainer.appendChild(titulo);

    const mensaje = document.createElement("div");
    mensaje.className = "mensaje-final";
    mensaje.textContent = `Respondiste correctamente ${puntaje / 100} de ${totalPreguntas} preguntas.`;
    juegoContainer.appendChild(mensaje);

    const puntajeFinal = document.createElement("div");
    puntajeFinal.className = "puntaje-final";
    puntajeFinal.textContent = `Puntaje final: ${puntaje}`;
    juegoContainer.appendChild(puntajeFinal);

    const graficaDiv = document.createElement("div");
    graficaDiv.className = "grafica";
    const canvas = document.createElement("canvas");
    canvas.id = "graficoResultados";
    graficaDiv.appendChild(canvas);
    juegoContainer.appendChild(graficaDiv);

    const incorrectas = totalPreguntas - puntaje / 100;
    new Chart(canvas, {
      type: "bar",
      data: {
        labels: ["Correctas", "Incorrectas"],
        datasets: [{
          label: "Respuestas",
          data: [puntaje / 100, incorrectas],
          backgroundColor: ["#2ecc71", "#e74c3c"]
        }]
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              stepSize: 1
            }
          }
        }
      }
    });

    const descargarBtn = document.createElement("button");
    descargarBtn.textContent = "Descargar resultados";
    descargarBtn.className = "btn-opcion descargar";
    descargarBtn.onclick = () => {
      const link = document.createElement("a");
      link.download = "resultados.png";
      link.href = canvas.toDataURL("image/png");
      link.click();
    };
    juegoContainer.appendChild(descargarBtn);

    const reiniciarBtn = document.createElement("button");
    reiniciarBtn.textContent = "Volver a jugar";
    reiniciarBtn.className = "btn-opcion volver-jugar";
    reiniciarBtn.onclick = () => mostrarSeleccionNivel();
    juegoContainer.appendChild(reiniciarBtn);
  }

  mostrarInicio();
  return container;
}
