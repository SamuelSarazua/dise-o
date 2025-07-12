// archivo: juego.js
import { preguntas } from "./preguntas.js";

export function juego() {
  const container = document.createElement("div");
  container.className = "juego-container";

  let temporizadorInterval;
  let tiempoRestante = 90; // 1.5 minutos
  let puntaje = 0;

  function mostrarInicio() {
    document.body.className = "inicio";
    container.innerHTML = "";

    const tituloInicio = document.createElement("h1");
    tituloInicio.textContent = "🎮 Bienvenido a Trivial Trouble";
    tituloInicio.className = "titulo-inicio";
    container.appendChild(tituloInicio);

    const imagenInicio = document.createElement("img");
    imagenInicio.src = "https://wallpapers.com/images/hd/cuphead-and-beppi-the-clown-m5h8hdbjktxsva50.jpg";
    imagenInicio.alt = "Cuphead Inicio";
    imagenInicio.className = "imagen-inicio";
    container.appendChild(imagenInicio);

    const botonInicio = document.createElement("button");
    botonInicio.textContent = "Iniciar Juego";
    botonInicio.className = "btn-inicio";
    botonInicio.onclick = () => mostrarSeleccionNivel();
    container.appendChild(botonInicio);
  }

  function mostrarSeleccionNivel() {
    document.body.className = "seleccion-nivel";
    container.innerHTML = "";

    const titulo = document.createElement("h1");
    titulo.textContent = "Selecciona un Nivel";
    titulo.className = "titulo-seleccion";
    container.appendChild(titulo);

    const nivelesContainer = document.createElement("div");
    nivelesContainer.className = "niveles-container";

    for (let nivel = 1; nivel <= 5; nivel++) {
      const btnNivel = document.createElement("button");
      btnNivel.textContent = `Nivel ${nivel}`;
      btnNivel.className = "btn-nivel";
      btnNivel.onclick = () => iniciarJuego(nivel);
      nivelesContainer.appendChild(btnNivel);
    }

    container.appendChild(nivelesContainer);
  }

  function iniciarJuego(nivel) {
    document.body.className = "juego";

    container.innerHTML = ""; // Limpiar el contenedor para mostrar el juego

    const preguntasFiltradas = preguntas.filter(p => p.nivel === nivel);
    let indice = 0;
    let puntaje = 0;
    let tiempoRestante = 90;

    // Crear el contador de tiempo
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

    container.appendChild(infoPanel);

    // Temporizador
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
      container.innerHTML = ""; // Limpiar el contenedor para mostrar la pregunta
      container.appendChild(infoPanel); // Volver a agregar el panel de información

      const titulo = document.createElement("h2");
      titulo.className = "pregunta";
      titulo.textContent = `Pregunta ${indice + 1}: ${actual.texto}`;
      container.appendChild(titulo);

      const opcionesContainer = document.createElement("div");
      opcionesContainer.className = "opciones";
      container.appendChild(opcionesContainer);

      actual.opciones.forEach((opcion, i) => {
        const btn = document.createElement("button");
        btn.className = "btn-opcion";
        btn.textContent = opcion;
        btn.onclick = () => {
          const correcta = i === actual.correcta;
          btn.classList.add(correcta ? "correcta" : "incorrecta");

          if (correcta) {
            puntaje += 100; // Cada respuesta correcta vale 100 puntos
            puntajeDisplay.textContent = `Puntaje: ${puntaje}`;
          }

          const botones = opcionesContainer.querySelectorAll("button");
          botones.forEach(b => b.disabled = true);

          setTimeout(() => {
            indice++;
            mostrarPregunta();
          }, 1500);
        };
        opcionesContainer.appendChild(btn);
      });
    }

    mostrarPregunta();
  }

  function mostrarFinal(puntaje, totalPreguntas) {
    container.innerHTML = ""; // Limpiar el contenedor para mostrar el final

    const titulo = document.createElement("h2");
    titulo.className = "pregunta";
    titulo.textContent = "🎉 ¡Nivel terminado!";
    container.appendChild(titulo);

    const mensaje = document.createElement("div");
    mensaje.className = "mensaje-final";
    mensaje.textContent = `Respondiste correctamente ${puntaje / 100} de ${totalPreguntas} preguntas.`;
    container.appendChild(mensaje);

    const puntajeFinal = document.createElement("div");
    puntajeFinal.className = "puntaje-final";
    puntajeFinal.textContent = `Puntaje final: ${puntaje}`;
    container.appendChild(puntajeFinal);

    const graficaDiv = document.createElement("div");
    graficaDiv.className = "grafica";
    const canvas = document.createElement("canvas");
    canvas.id = "graficoResultados";
    graficaDiv.appendChild(canvas);
    container.appendChild(graficaDiv);

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

    const reiniciarBtn = document.createElement("button");
    reiniciarBtn.textContent = "Volver a jugar";
    reiniciarBtn.className = "btn-opcion volver-jugar";
    reiniciarBtn.onclick = () => mostrarSeleccionNivel();
    container.appendChild(reiniciarBtn);
  }

  mostrarInicio();
  return container;
}
