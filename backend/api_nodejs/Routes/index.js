const express = require("express");
dtt = require("../tools/DateTimeTools");
calcHoras = require("../tools/CalcHours");
const router = express.Router();

router.post("/", (req, res) => {
  const { horarioInicial, horarioFinal } = req.body;

  //transforma os dados recebidos no tipo Date para facilitar manipulação dos dados.
  let horaInicioPeriodo = new Date(horarioInicial);
  let horaFimPeriodo = new Date(horarioFinal);

  //converte os dados do período e horario em minutos para facilitar o controle
  const periodoEmMinutos = dtt.convertPeriodoEmMinutos(
    horaInicioPeriodo,
    horaFimPeriodo
  );

  //verifica se requisição vem com os dados necessários
  if (!horarioInicial || !horarioFinal)
    return res.send({ error: "Dados inconsistentes" });

  // verifica se o período informado é maior ou igual a 24hs
  if (periodoEmMinutos >= 1440)
    return res.send({ error: "Período maior que permitido" });

  const { totalHorasDiurnas, totalHorasNoturnas } = calcHoras.calcularHoras(
    horarioInicial,
    horarioFinal
  );

  return res.send({ totalHorasDiurnas, totalHorasNoturnas });
});

module.exports = router;
