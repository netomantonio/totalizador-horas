const express = require('express');
const convertPeriodoEmMinutos = require('../tools/DateTimeTools');
const router = express.Router();


router.post('/', (req, res) => {

	const { horarioInicial, horarioFinal } = req.body;
	let totalHorasDiurnas = { horas: 00, minutos: 00 };
	let totalHorasNoturnas = { horas: 00, minutos: 00 };

	if(!horarioInicial || !horarioFinal) return res.send({ error: 'Dados inconsistentes'});

	let horaInicioPeriodo = new Date(horarioInicial);

	let horaFimPeriodo = new Date(horarioFinal);

	const periodoEmMinutos = convertPeriodoEmMinutos(horaInicioPeriodo, horaFimPeriodo);

	if(periodoEmMinutos >= 1440) return res.send({error: 'Período maior que permitido'});


	if(horaInicioPeriodo.getHours() * 60 + horaInicioPeriodo.getMinutes() > 300 && horaInicioPeriodo.getHours() * 60 + horaInicioPeriodo.getMinutes() <= 1320){
		console.log(horaInicioPeriodo.getHours());
		if (horaFimPeriodo.getHours() * 60 + horaFimPeriodo.getMinutes() > 300 && horaFimPeriodo.getHours() * 60 + horaFimPeriodo.getMinutes() <= 1320) {

			let mins = (horaFimPeriodo - horaInicioPeriodo) / umMinuto;

			let h = mins / 60 | 0;
			let m = mins % 60 | 0;

			totalHorasDiurnas["horas"] = h;
			totalHorasDiurnas["minutos"] = m;

			return res.send({totalHorasDiurnas, totalHorasNoturnas});
		} else {
			let horaFimDiurna = new Date(horaInicioPeriodo);
			let horaInicioNoturna = new Date(horaInicioPeriodo);
			horaFimDiurna.setHours(22,00);
			horaInicioNoturna.setHours(22,01);
			console.log(horaFimDiurna.getHours())
			let mins = (horaFimDiurna - horaInicioPeriodo) / umMinuto;
			let h = mins / 60 | 0;
			let m = mins % 60 | 0;
			totalHorasDiurnas["horas"] = h;
			totalHorasDiurnas["minutos"] = m;

			let mins2 = (horaFimPeriodo - horaInicioNoturna) / umMinuto;
			let h2 = mins2 / 60 | 0;
			let m2 = mins2 % 60 | 0;
			totalHorasNoturnas["horas"] = h2;
			totalHorasNoturnas["minutos"] = m2;


			return res.send({totalHorasDiurnas, totalHorasNoturnas});
		}
	}
})

module.exports = router;