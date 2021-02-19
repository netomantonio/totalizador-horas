dtt = require('../tools/DateTimeTools');

exports.calcularHorasDiurnas = function (horaInicialEmMinutos, horaFinalEmMinutos){

	horas = (horaFinalEmMinutos - horaInicialEmMinutos) / 60 | 0;
	minutos = (horaFinalEmMinutos - horaInicialEmMinutos) % 60 | 0;

	return {horas,minutos};
}
exports.calcularHorasNoturnas = function (horaInicial, horaFinal){
	if(horaInicial.getHours() > horaFinal.getHours()){
		if (horaFinal.getHours() * 60 + horaFinal.getMinutes() > 300) {
			horaFinal.setHours(5,0);
			periodoEmMin = dtt.convertPeriodoEmMinutos(horaInicial,horaFinal);
			horas = ((periodoEmMin)) / 60 | 0;
			minutos = ((periodoEmMin)) % 60 | 0;
		} else {
			periodoEmMin = dtt.convertPeriodoEmMinutos(horaInicial,horaFinal);
			horas = ((periodoEmMin)) / 60 | 0;
			minutos = ((periodoEmMin)) % 60 | 0;
		}
	} else {
		console.log("não entrou em nenhum if");
	}



	return {horas,minutos};
}