const calendario = document.querySelector(".calendar"),
  data = document.querySelector(".date"),
  diasContainer = document.querySelector(".days"),
  ant = document.querySelector(".prev"),
  prox = document.querySelector(".next"),
  btnHoje = document.querySelector(".today-btn"),
  btnIrPara = document.querySelector(".goto-btn"),
  entradaData = document.querySelector(".date-input"),
  diaEvento = document.querySelector(".event-day"),
  dataEvento = document.querySelector(".event-date"),
  containerEventos = document.querySelector(".events"),
  btnAddEvento = document.querySelector(".add-event"),
  wrapperAddEvento = document.querySelector(".add-event-wrapper "),
  btnFecharAddEvento = document.querySelector(".close "),
  tituloEvento = document.querySelector(".event-name "),
  horaInicioEvento = document.querySelector(".event-time-from "),
  horaFimEvento = document.querySelector(".event-time-to "),
  btnEnviarEvento = document.querySelector(".add-event-btn ");

let hoje = new Date();
let diaAtivo;
let mes = hoje.getMonth();
let ano = hoje.getFullYear();

const meses = [
  "Janeiro",
  "Fevereiro",
  "Março",
  "Abril",
  "Maio",
  "Junho",
  "Julho",
  "Agosto",
  "Setembro",
  "Outubro",
  "Novembro",
  "Dezembro",
];

const eventosArr = [];
getEventos();
console.log(eventosArr);

function initCalendario() {
  const primeiroDia = new Date(ano, mes, 1);
  const ultimoDia = new Date(ano, mes + 1, 0);
  const ultimoDiaMesAnterior = new Date(ano, mes, 0);
  const diasAnteriores = ultimoDiaMesAnterior.getDate();
  const ultimoDiaMes = ultimoDia.getDate();
  const diaSemana = primeiroDia.getDay();
  const proxDias = 7 - ultimoDia.getDay() - 1;

  data.innerHTML = meses[mes] + " " + ano;

  let dias = "";

  for (let x = diaSemana; x > 0; x--) {
    dias += `<div class="day prev-date">${diasAnteriores - x + 1}</div>`;
  }

  for (let i = 1; i <= ultimoDiaMes; i++) {
    let eventoPresente = false;
    eventosArr.forEach((objEvento) => {
      if (
        objEvento.dia === i &&
        objEvento.mes === mes + 1 &&
        objEvento.ano === ano
      ) {
        eventoPresente = true;
      }
    });
    if (
      i === new Date().getDate() &&
      ano === new Date().getFullYear() &&
      mes === new Date().getMonth()
    ) {
      diaAtivo = i;
      getDiaAtivo(i);
      updateEventos(i);
      if (eventoPresente) {
        dias += `<div class="day today active event">${i}</div>`;
      } else {
        dias += `<div class="day today active">${i}</div>`;
      }
    } else {
      if (eventoPresente) {
        dias += `<div class="day event">${i}</div>`;
      } else {
        dias += `<div class="day ">${i}</div>`;
      }
    }
  }

  for (let j = 1; j <= proxDias; j++) {
    dias += `<div class="day next-date">${j}</div>`;
  }
  diasContainer.innerHTML = dias;
  adicionarOuvinte();
}

function mesAnterior() {
  mes--;
  if (mes < 0) {
    mes = 11;
    ano--;
  }
  initCalendario();
}

function proximoMes() {
  mes++;
  if (mes > 11) {
    mes = 0;
    ano++;
  }
  initCalendario();
}

ant.addEventListener("click", mesAnterior);
prox.addEventListener("click", proximoMes);

initCalendario();

function adicionarOuvinte() {
  const dias = document.querySelectorAll(".day");
  dias.forEach((dia) => {
    dia.addEventListener("click", (e) => {
      getDiaAtivo(e.target.innerHTML);
      updateEventos(Number(e.target.innerHTML));
      diaAtivo = Number(e.target.innerHTML);
      dias.forEach((dia) => {
        dia.classList.remove("active");
      });
      if (e.target.classList.contains("prev-date")) {
        mesAnterior();
        setTimeout(() => {
          const dias = document.querySelectorAll(".day");
          dias.forEach((dia) => {
            if (
              !dia.classList.contains("prev-date") &&
              dia.innerHTML === e.target.innerHTML
            ) {
              dia.classList.add("active");
            }
          });
        }, 100);
      } else if (e.target.classList.contains("next-date")) {
        proximoMes();
        setTimeout(() => {
          const dias = document.querySelectorAll(".day");
          dias.forEach((dia) => {
            if (
              !dia.classList.contains("next-date") &&
              dia.innerHTML === e.target.innerHTML
            ) {
              dia.classList.add("active");
            }
          });
        }, 100);
      } else {
        e.target.classList.add("active");
      }
    });
  });
}

btnHoje.addEventListener("click", () => {
  hoje = new Date();
  mes = hoje.getMonth();
  ano = hoje.getFullYear();
  initCalendario();
});

entradaData.addEventListener("input", (e) => {
  entradaData.value = entradaData.value.replace(/[^0-9/]/g, "");
  if (entradaData.value.length === 2) {
    entradaData.value += "/";
  }
  if (entradaData.value.length > 7) {
    entradaData.value = entradaData.value.slice(0, 7);
  }
  if (e.inputType === "deleteContentBackward") {
    if (entradaData.value.length === 3) {
      entradaData.value = entradaData.value.slice(0, 2);
    }
  }
});

btnIrPara.addEventListener("click", irParaData);

function irParaData() {
  console.log("aqui");
  const dataArr = entradaData.value.split("/");
  if (dataArr.length === 2) {
    if (dataArr[0] > 0 && dataArr[0] < 13 && dataArr[1].length === 4) {
      mes = dataArr[0] - 1;
      ano = dataArr[1];
      initCalendario();
      return;
    }
  }
  alert("Data inválida");
}

function getDiaAtivo(dia) {
  const dataAtiva = new Date(ano, mes, dia);
  const nomeDia = dataAtiva.toString().split(" ")[0];
  diaEvento.innerHTML = nomeDia;
  dataEvento.innerHTML = dia + " " + meses[mes] + " " + ano;
}

function updateEventos(dia) {
  let eventos = "";
  eventosArr.forEach((evento) => {
    if (
      dia === evento.dia &&
      mes + 1 === evento.mes &&
      ano === evento.ano
    ) {
      evento.eventos.forEach((evento) => {
        eventos += `<div class="event">
            <div class="title">
              <i class="fas fa-circle"></i>
              <h3 class="event-title">${evento.title}</h3>
            </div>
            <div class="event-time">
              <span class="event-time">${evento.time}</span>
            </div>
        </div>`;
      });
    }
  });
  if (eventos === "") {
    eventos = `<div class="no-event">
            <h3>Sem eventos</h3>
        </div>`;
  }
  containerEventos.innerHTML = eventos;
  salvarEventos();
}

btnAddEvento.addEventListener("click", () => {
  wrapperAddEvento.classList.toggle("active");
});

btnFecharAddEvento.addEventListener("click", () => {
  wrapperAddEvento.classList.remove("active");
});

document.addEventListener("click", (e) => {
  if (e.target !== btnAddEvento && !wrapperAddEvento.contains(e.target)) {
    wrapperAddEvento.classList.remove("active");
  }
});

tituloEvento.addEventListener("input", (e) => {
  tituloEvento.value = tituloEvento.value.slice(0, 60);
});

function definirPropriedade() {
  var osccred = document.createElement("div");
  osccred.innerHTML =
   ""; 
  osccred.style.position = "absolute";
  osccred.style.bottom = "0";
  osccred.style.right = "0";
  osccred.style.fontSize = "10px";
  osccred.style.color = "#ccc";
  osccred.style.fontFamily = "sans-serif";
  osccred.style.padding = "5px";
  osccred.style.background = "#fff";
  osccred.style.borderTopLeftRadius = "5px";
  osccred.style.borderBottomRightRadius = "5px";
  osccred.style.boxShadow = "0 0 5px #ccc";
  document.body.appendChild(osccred);
}

definirPropriedade();

horaInicioEvento.addEventListener("input", (e) => {
  horaInicioEvento.value = horaInicioEvento.value.replace(/[^0-9:]/g, "");
  if (horaInicioEvento.value.length === 2) {
    horaInicioEvento.value += ":";
  }
  if (horaInicioEvento.value.length > 5) {
    horaInicioEvento.value = horaInicioEvento.value.slice(0, 5);
  }
});

horaFimEvento.addEventListener("input", (e) => {
  horaFimEvento.value = horaFimEvento.value.replace(/[^0-9:]/g, "");
  if (horaFimEvento.value.length === 2) {
    horaFimEvento.value += ":";
  }
  if (horaFimEvento.value.length > 5) {
    horaFimEvento.value = horaFimEvento.value.slice(0, 5);
  }
});

btnEnviarEvento.addEventListener("click", () => {
  const tituloEventoValor = tituloEvento.value;
  const horaInicioEventoValor = horaInicioEvento.value;
  const horaFimEventoValor = horaFimEvento.value;

  if (
    tituloEventoValor === "" ||
    horaInicioEventoValor === "" ||
    horaFimEventoValor === ""
  ) {
    alert("Preencha o evento");
    return;
  }

  const tempoInicioArr = horaInicioEventoValor.split(":");
  const tempoFimArr = horaFimEventoValor.split(":");
  if (
    tempoInicioArr.length !== 2 ||
    tempoFimArr.length !== 2 ||
    tempoInicioArr[0] > 23 ||
    tempoInicioArr[1] > 59 ||
    tempoFimArr[0] > 23 ||
    tempoFimArr[1] > 59
  ) {
    alert("Formato inválido");
    return;
  }

  const tempoInicio = converterTempo(horaInicioEventoValor);
  const tempoFim = converterTempo(horaFimEventoValor);

  let eventoExiste = false;
  eventosArr.forEach((evento) => {
    if (
      evento.dia === diaAtivo &&
      evento.mes === mes + 1 &&
      evento.ano === ano
    ) {
      evento.eventos.forEach((evento) => {
        if (evento.title === tituloEventoValor) {
          eventoExiste = true;
        }
      });
    }
  });
  if (eventoExiste) {
    alert("Você já adicionou um evento");
    return;
  }
  const novoEvento = {
    title: tituloEventoValor,
    time: tempoInicio + " - " + tempoFim,
  };
  console.log(novoEvento);
  console.log(diaAtivo);
  let eventoAdicionado = false;
  if (eventosArr.length > 0) {
    eventosArr.forEach((item) => {
      if (
        item.dia === diaAtivo &&
        item.mes === mes + 1 &&
        item.ano === ano
      ) {
        item.eventos.push(novoEvento);
        eventoAdicionado = true;
      }
    });
  }

  if (!eventoAdicionado) {
    eventosArr.push({
      dia: diaAtivo,
      mes: mes + 1,
      ano: ano,
      eventos: [novoEvento],
    });
  }

  console.log(eventosArr);
  wrapperAddEvento.classList.remove("active");
  tituloEvento.value = "";
  horaInicioEvento.value = "";
  horaFimEvento.value = "";
  updateEventos(diaAtivo);
  const diaAtivoEl = document.querySelector(".day.active");
  if (!diaAtivoEl.classList.contains("event")) {
    diaAtivoEl.classList.add("event");
  }
});

containerEventos.addEventListener("click", (e) => {
  if (e.target.classList.contains("event")) {
    if (confirm("Tem certeza que deseja excluir?")) {
      const tituloEvento = e.target.children[0].children[1].innerHTML;
      eventosArr.forEach((evento) => {
        if (
          evento.dia === diaAtivo &&
          evento.mes === mes + 1 &&
          evento.ano === ano
        ) {
          evento.eventos.forEach((item, index) => {
            if (item.title === tituloEvento) {
              evento.eventos.splice(index, 1);
            }
          });
          if (evento.eventos.length === 0) {
            eventosArr.splice(eventosArr.indexOf(evento), 1);
            const diaAtivoEl = document.querySelector(".day.active");
            if (diaAtivoEl.classList.contains("event")) {
              diaAtivoEl.classList.remove("event");
            }
          }
        }
      });
      updateEventos(diaAtivo);
    }
  }
});

function salvarEventos() {
  localStorage.setItem("eventos", JSON.stringify(eventosArr));
}

function getEventos() {
  if (localStorage.getItem("eventos") === null) {
    return;
  }
  eventosArr.push(...JSON.parse(localStorage.getItem("eventos")));
}

function converterTempo(tempo) {
  let tempoArr = tempo.split(":");
  let horaTempo = tempoArr[0];
  let minutoTempo = tempoArr[1];
  let formatoTempo = horaTempo >= 12 ? "PM" : "AM";
  horaTempo = horaTempo % 12 || 12;
  tempo = horaTempo + ":" + minutoTempo + " " + formatoTempo;
  return tempo;
}
