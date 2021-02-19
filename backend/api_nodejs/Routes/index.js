const express = require('express');
dtt = require('../tools/DateTimeTools');
calcHoras = require('../tools/CalcHours');
const router = express.Router();


router.post('/', (req, res) => {

	const { horarioInicial, horarioFinal } = req.body;

	//atribuindo valor default as variáveis pois em determinadas situações
	//uma delas não terá necessidade de serem manipuladas
	let totalHorasDiurnas = { horas: 00, minutos: 00 };
	let totalHorasNoturnas = { horas: 00, minutos: 00 };

	//verifica se requisição vem com os dados necessários
	if(!horarioInicial || !horarioFinal) return res.send({ error: 'Dados inconsistentes'});

	//transforma os dados recebidos no tipo Date para facilitar manipulação dos dados.
	let horaInicioPeriodo = new Date(horarioInicial);
	let horaFimPeriodo = new Date(horarioFinal);

	//converte os dados do período e horario em minutos para facilitar o controle
	const periodoEmMinutos = dtt.convertPeriodoEmMinutos(horaInicioPeriodo, horaFimPeriodo);
	const horaInicialEmMinutos = dtt.convertHorasEmMinutos(horaInicioPeriodo);
	const horaFinalEmMinutos = dtt.convertHorasEmMinutos(horaFimPeriodo);

	// verifica se o período informado é maior ou igual a 24hs
	if(periodoEmMinutos >= 1440) return res.send({error: 'Período maior que permitido'});

	//Começa a validação para estabelecer a regra e contabilizar as horas trabalhadas

	//verifica se o período de trabalho está todo concentrado em horas diurnas
	//começa verificando se o horario inicial está dentro do range entre 5hs e 22hs
	if( horaInicialEmMinutos > 300 && horaInicialEmMinutos <= 1320) {
		//verifica se o horario final está dentro do range de 5hs e 22hs
		if (horaFinalEmMinutos > 300 && horaFinalEmMinutos <= 1320 && horaInicialEmMinutos < horaFinalEmMinutos) {
			//Extrai a quantidade de horas e minutos trabalhadas no período
			let {horas, minutos} = calcHoras.calcularHorasDiurnas(horaInicialEmMinutos, horaFinalEmMinutos);

			//atualiza somente total de horas diurnas pois a regra não contém horas noturnas
			totalHorasDiurnas["horas"] = horas;
			totalHorasDiurnas["minutos"] = minutos;

			return res.send({totalHorasDiurnas, totalHorasNoturnas});
		} else {
			// instancia duas variáveis auxiliares pois nesta regra considera
			// que o período de trabalho contém horas diurnas e noturnas.
			// considerando a regra onde HoraInicial = inicio das horas diurnas
			let horaFimDiurna = new Date(horaInicioPeriodo);
			let horaInicioNoturna = new Date(horaInicioPeriodo);

			//atualiza as duas variáveis para contemplar a regra de negócio
			horaFimDiurna.setHours(22,00);
			horaInicioNoturna.setHours(22,01);

			//converte os valores do tipo Date em minutos para facilitar o calculo
			let horaFimDiurnaEmMinutos = dtt.convertHorasEmMinutos(horaFimDiurna);
			// let horaInicioNoturnaEmMinutos = dtt.convertHorasEmMinutos(horaInicioNoturna);

			// submete os períodos diurno e noturno para extrair quantidade de horas e minutos
			let diurna = calcHoras.calcularHorasDiurnas(horaInicialEmMinutos, horaFimDiurnaEmMinutos);
			let noturna = calcHoras.calcularHorasNoturnas(horaInicioNoturna, horaFimPeriodo);

			//atualização das variáveis de retorno do resultado.
			totalHorasDiurnas["horas"] = diurna.horas;
			totalHorasDiurnas["minutos"] = diurna.minutos;
			totalHorasNoturnas["horas"] = noturna.horas;
			totalHorasNoturnas["minutos"] = noturna.minutos;

			return res.send({totalHorasDiurnas, totalHorasNoturnas});
		}
	} else {
		
	}
})

module.exports = router;