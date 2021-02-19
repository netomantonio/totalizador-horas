const umMinuto = 1000 * 60;

exports.convertPeriodoEmMinutos = function (horaInicioPeriodo, horaFimPeriodo) {
  return (horaFimPeriodo - horaInicioPeriodo) / umMinuto;
};

exports.convertHorasEmMinutos = function (hora) {
  hora = new Date(hora);
  return hora.getHours() * 60 + hora.getMinutes();
};
