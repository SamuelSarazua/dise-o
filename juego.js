import { preguntas } from "./preguntas.js";

export function juego() {
  const container = document.createElement("div");
  container.className = "juego-container";

  function mostrarInicio() {
    // Cambiar el fondo al de la pantalla de inicio
    document.body.className = "inicio";

    container.innerHTML = ""; // Limpiar el contenedor

    const tituloInicio = document.createElement("h1");
    tituloInicio.textContent = "🎮 Bienvenido a Trivial Trouble";
    tituloInicio.className = "titulo-inicio";
    container.appendChild(tituloInicio);

    const imagenInicio = document.createElement("img");
    imagenInicio.src = "https://wallpapers.com/images/hd/cuphead-and-beppi-the-clown-m5h8hdbjktxsva50.jpg"; // Imagen para la pantalla de inicio
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
    // Cambiar el fondo al de la selección de nivel
    document.body.className = "seleccion-nivel";

    container.innerHTML = ""; // Limpiar el contenedor

    const tituloSeleccion = document.createElement("h1");
    tituloSeleccion.textContent = "Selecciona un Nivel";
    tituloSeleccion.className = "titulo-seleccion";
    container.appendChild(tituloSeleccion);

    const nivelesContainer = document.createElement("div");
    nivelesContainer.className = "niveles-container";

    for (let nivel = 1; nivel <= 5; nivel++) {
      const botonNivel = document.createElement("button");
      botonNivel.textContent = `Nivel ${nivel}`;
      botonNivel.className = "btn-nivel";
      botonNivel.onclick = () => iniciarJuego(nivel);
      nivelesContainer.appendChild(botonNivel);
    }

    container.appendChild(nivelesContainer);
  }

  function iniciarJuego(nivel) {
    // Cambiar el fondo al del juego
    document.body.className = "juego";

    container.innerHTML = ""; // Limpiar el contenedor para mostrar el juego

    const preguntasFiltradas = preguntas.filter(p => p.nivel === nivel); // Filtrar preguntas por nivel
    let indice = 0;
    let puntaje = 0;

    function mostrarPregunta() {
      if (indice >= preguntasFiltradas.length) {
        mostrarFinal(puntaje, preguntasFiltradas.length);
        return;
      }

      const actual = preguntasFiltradas[indice];
      container.innerHTML = ""; // Limpiar el contenedor para mostrar la pregunta

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

          if (correcta) puntaje++;

          // Desactivar botones
          const botones = opcionesContainer.querySelectorAll("button");
          botones.forEach(b => b.disabled = true);

          // Pasar a la siguiente pregunta luego de 1.5s
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

  function mostrarFinal(correctas, total) {
    container.innerHTML = ""; // Limpiar el contenedor para mostrar el final

    const titulo = document.createElement("h2");
    titulo.className = "pregunta";
    titulo.textContent = "🎉 ¡Nivel terminado!";
    container.appendChild(titulo);

    const mensaje = document.createElement("div");
    mensaje.className = "mensaje-final";
    mensaje.textContent = `Obtuviste ${correctas} de ${total} preguntas correctas.`;
    container.appendChild(mensaje);

    // Crear contenedor para la gráfica
    const graficaDiv = document.createElement("div");
    graficaDiv.className = "grafica";
    const canvas = document.createElement("canvas");
    canvas.id = "graficoResultados";
    graficaDiv.appendChild(canvas);
    container.appendChild(graficaDiv);

    // Mostrar la gráfica
    const incorrectas = total - correctas;
    new Chart(canvas, {
      type: "bar",
      data: {
        labels: ["Correctas", "Incorrectas"],
        datasets: [{
          label: "Respuestas",
          data: [correctas, incorrectas],
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

    // Botón para volver a jugar
    const reiniciarBtn = document.createElement("button");
    reiniciarBtn.textContent = "Volver a jugar";
    reiniciarBtn.className = "btn-opcion";
    reiniciarBtn.onclick = () => mostrarSeleccionNivel();
    container.appendChild(reiniciarBtn);
  }

  mostrarInicio(); // Mostrar la pantalla de inicio al cargar
  return container;
}
