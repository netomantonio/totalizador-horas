dtt = require("../tools/DateTimeTools");

calcularHorasDiurnas = function (horaInicialEmMinutos, horaFinalEmMinutos) {
  horas = ((horaFinalEmMinutos - horaInicialEmMinutos) / 60) | 0;
  minutos = (horaFinalEmMinutos - horaInicialEmMinutos) % 60 | 0;

  return { horas, minutos };
};
calcularHorasNoturnas = function (horaInicial, horaFinal) {
  periodoEmMin = dtt.convertPeriodoEmMinutos(horaInicial, horaFinal);
  horas = (periodoEmMin / 60) | 0;
  minutos = periodoEmMin % 60 | 0;

  let noturna = { horas, minutos };
  return { noturna };
};

calcularHorasPorTurno = function (horaInicioPeriodo, horaFimPeriodo) {
  // instancia duas variáveis auxiliares pois nesta regra considera
  // que o período de trabalho contém horas diurnas e noturnas.

  // considerando a regra onde HoraInicial = inicio das horas diurnas
  let horaFimDiurna = new Date(horaInicioPeriodo);
  let horaInicioNoturna = new Date(horaInicioPeriodo);

  //transforma os dados recebidos pela função no tipo Date
  horaInicioPeriodo = new Date(horaInicioPeriodo);
  horaFimPeriodo = new Date(horaFimPeriodo);

  //atualiza as duas variáveis para contemplar a regra de negócio
  horaFimDiurna.setHours(22, 00);
  horaInicioNoturna.setHours(22, 01);

  //converte os valores do tipo Date em minutos para facilitar o calculo
  let horaFimDiurnaEmMinutos = dtt.convertHorasEmMinutos(horaFimDiurna);
  let horaInicialEmMinutos = dtt.convertHorasEmMinutos(horaInicioPeriodo);

  //calcula as horas diurnas iniciais
  let diurna = calcularHorasDiurnas(
    horaInicialEmMinutos,
    horaFimDiurnaEmMinutos
  );

  if (horaInicioPeriodo.getHours() > horaFimPeriodo.getHours()) {
    // Verifica se após o final das horas noturnas existem mais horas diurnas
    if (horaFimPeriodo.getHours() * 60 + horaFimPeriodo.getMinutes() > 300) {
      //delimita o período de horas noturnas
      horaFinalNoturna = new Date(horaFimPeriodo);
      horaFinalNoturna.setHours(5, 0);
      let { noturna } = calcularHorasNoturnas(
        horaInicioNoturna,
        horaFinalNoturna
      );

      //estabelece um novo período de horas diurnas
      horaInicioDiurna = new Date(horaFinalNoturna);
      horaInicioDiurna.setHours(5, 1);
      let horaInicioDiurnaExtraEmMinutos = dtt.convertHorasEmMinutos(
        horaInicioDiurna
      );
      let horaFimDiurnaExtraEmMinutos = dtt.convertHorasEmMinutos(
        horaFimPeriodo
      );
      let { horas, minutos } = calcularHorasDiurnas(
        horaInicioDiurnaExtraEmMinutos,
        horaFimDiurnaExtraEmMinutos
      );
      //incrementa as horas diurnas extras as horas diurnas já calculadas
      diurna.horas += horas;
      if ((diurna.minutos += minutos) >= 60) {
		  diurna.horas += 1;
		  diurna.minutos += minutos - 60;
	  } else {
		diurna.minutos += minutos;
	  }
      return { diurna, noturna };
    }
  }
};
exports.calcularHoras = function (horaInicioPeriodo, horaFimPeriodo) {
  //atribuindo valor default as variáveis pois em determinadas situações
  //uma delas não terá necessidade de serem manipuladas
  let totalHorasDiurnas = { horas: 00, minutos: 00 };
  let totalHorasNoturnas = { horas: 00, minutos: 00 };

  let horaInicialEmMinutos = dtt.convertHorasEmMinutos(horaInicioPeriodo);
  let horaFinalEmMinutos = dtt.convertHorasEmMinutos(horaFimPeriodo);

  //Começa a validação para estabelecer a regra e contabilizar as horas trabalhadas

  //verifica se o período de trabalho está todo concentrado em horas diurnas
  //começa verificando se o horario inicial está dentro do range entre 5hs e 22hs
  if (horaInicialEmMinutos > 300 && horaInicialEmMinutos <= 1320) {
    //verifica se o horario final está dentro do range de 5hs e 22hs
    if (
      horaFinalEmMinutos > 300 &&
      horaFinalEmMinutos <= 1320 &&
      horaInicialEmMinutos < horaFinalEmMinutos
    ) {
      //Extrai a quantidade de horas e minutos trabalhadas no período
      let { horas, minutos } = calcularHorasDiurnas(
        horaInicialEmMinutos,
        horaFinalEmMinutos
      );

      //atualiza somente total de horas diurnas pois a regra não contém horas noturnas
      totalHorasDiurnas["horas"] = horas;
      totalHorasDiurnas["minutos"] = minutos;

      return { totalHorasDiurnas, totalHorasNoturnas };
    } else {
      // let horaInicioNoturnaEmMinutos = dtt.convertHorasEmMinutos(horaInicioNoturna);

      // submete os períodos diurno e noturno para extrair quantidade de horas e minutos
      let { diurna, noturna } = calcularHorasPorTurno(
        horaInicioPeriodo,
        horaFimPeriodo
      );

      //atualização das variáveis de retorno do resultado.
      totalHorasDiurnas["horas"] = diurna.horas;
      totalHorasDiurnas["minutos"] = diurna.minutos;
      totalHorasNoturnas["horas"] = noturna.horas;
      totalHorasNoturnas["minutos"] = noturna.minutos;

      return { totalHorasDiurnas, totalHorasNoturnas };
    }
  } else {
	//verifica se o período corresponde apenas a horas noturnas
    if (horaInicialEmMinutos > 1320 && horaFinalEmMinutos <= 300) {
      horaInicioPeriodo = new Date(horaInicioPeriodo);
      horaFimPeriodo = new Date(horaFimPeriodo);
      let { noturna } = calcularHorasNoturnas(
        horaInicioPeriodo,
        horaFimPeriodo
      );
      //atualização das variáveis de retorno do resultado.
      totalHorasNoturnas["horas"] = noturna.horas;
      totalHorasNoturnas["minutos"] = noturna.minutos;

      return { totalHorasDiurnas, totalHorasNoturnas };
    } else {
	  // nesse trecho compreende que existe horas diurnas e noturnas
      // submete os períodos diurno e noturno para extrair quantidade de horas e minutos
      let { diurna, noturna } = calcularHorasPorTurno(
        horaInicioPeriodo,
        horaFimPeriodo
      );

      //atualização das variáveis de retorno do resultado.
      totalHorasDiurnas["horas"] = diurna.horas;
      totalHorasDiurnas["minutos"] = diurna.minutos;
      totalHorasNoturnas["horas"] = noturna.horas;
      totalHorasNoturnas["minutos"] = noturna.minutos;

      return { totalHorasDiurnas, totalHorasNoturnas };
    }
  }
};
