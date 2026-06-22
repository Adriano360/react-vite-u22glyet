import React, { useEffect, useMemo, useState } from 'react';

import './App.css';
import { CertificadoView } from './components/training/CertificadoView';
import { GestorView } from './components/training/GestorView';
import { HomeView } from './components/training/HomeView';
import { LoginView } from './components/training/LoginView';
import { SimuladorView } from './components/training/SimuladorView';
import { TrainingHeader } from './components/training/TrainingHeader';
import { cenarios } from './data/cenariosProtecao';

/*
  APP JSX — Simulador de Proteção de Subestação
  Melhorias:
  1) Banco maior de perguntas.
  2) Não repete pergunta até terminar o ciclo.
  3) Alternativas embaralhadas.
  4) Cada cenário tem explicação técnica.
  5) Filtro por trilha.
*/

function embaralhar(lista) {
  return [...lista].sort(() => Math.random() - 0.5);
}

function obterAlternativas(cenario) {
  return cenario?.alternativas || [];
}

function obterRespostaCorreta(cenario) {
  return obterAlternativas(cenario).find(
    (alternativa) => alternativa.id === cenario.respostaCorretaId
  );
}

function sortearSemRepetir(lista, usados, filtroArea, atualId) {
  const base =
    filtroArea === 'Todas' ? lista : lista.filter((c) => c.area === filtroArea);

  let disponiveis = base.filter(
    (c) => !usados.includes(c.id) && c.id !== atualId
  );

  if (disponiveis.length === 0) {
    disponiveis = base.filter((c) => c.id !== atualId);
  }

  if (disponiveis.length === 0) {
    disponiveis = base;
  }

  return disponiveis[Math.floor(Math.random() * disponiveis.length)];
}

export default function App() {
  const [logado, setLogado] = useState(
    () => localStorage.getItem('treinamentoProtecaoLogado') === 'true'
  );
  const [nome, setNome] = useState(
    () => localStorage.getItem('treinamentoProtecaoNome') || ''
  );
  const [tela, setTela] = useState('home');
  const [filtroArea, setFiltroArea] = useState('Todas');
  const [cenario, setCenario] = useState(() => embaralhar(cenarios)[0]);
  const [opcoes, setOpcoes] = useState([]);
  const [selecionada, setSelecionada] = useState(null);
  const [erroLogin, setErroLogin] = useState('');
  const [pontos, setPontos] = useState(
    () => Number(localStorage.getItem('treinamentoProtecaoPontos')) || 0
  );
  const [historico, setHistorico] = useState(() => {
    try {
      return (
        JSON.parse(localStorage.getItem('treinamentoProtecaoHistorico')) || []
      );
    } catch {
      return [];
    }
  });
  const [usados, setUsados] = useState([]);

  const areas = useMemo(
    () => ['Todas', ...new Set(cenarios.map((c) => c.area))],
    []
  );

  const acertos = historico.filter((h) => h.acertou).length;
  const taxa = historico.length
    ? Math.round((acertos / historico.length) * 100)
    : 0;
  const aprovado = taxa >= 70 && historico.length >= 8;
  const erros = historico.filter((h) => !h.acertou);
  const totalDaTrilha =
    filtroArea === 'Todas'
      ? cenarios.length
      : cenarios.filter((c) => c.area === filtroArea).length;
  const progressoRodada = totalDaTrilha
    ? Math.min(100, Math.round((usados.length / totalDaTrilha) * 100))
    : 0;
  const desempenhoPorTrilha = useMemo(() => {
    return areas
      .filter((area) => area !== 'Todas')
      .map((area) => {
        const tentativasArea = historico.filter((item) => item.area === area);
        const acertosArea = tentativasArea.filter((item) => item.acertou).length;
        const errosArea = tentativasArea.length - acertosArea;
        const taxaArea = tentativasArea.length
          ? Math.round((acertosArea / tentativasArea.length) * 100)
          : 0;

        return {
          area,
          tentativas: tentativasArea.length,
          acertos: acertosArea,
          erros: errosArea,
          taxa: taxaArea,
        };
      });
  }, [areas, historico]);
  const recomendacao = useMemo(() => {
    return (
      desempenhoPorTrilha
        .filter((item) => item.tentativas > 0)
        .sort((a, b) => b.erros - a.erros || a.taxa - b.taxa)[0] || null
    );
  }, [desempenhoPorTrilha]);

  useEffect(() => {
    localStorage.setItem('treinamentoProtecaoLogado', String(logado));
  }, [logado]);

  useEffect(() => {
    localStorage.setItem('treinamentoProtecaoNome', nome);
  }, [nome]);

  useEffect(() => {
    localStorage.setItem('treinamentoProtecaoPontos', String(pontos));
  }, [pontos]);

  useEffect(() => {
    localStorage.setItem(
      'treinamentoProtecaoHistorico',
      JSON.stringify(historico)
    );
  }, [historico]);

  useEffect(() => {
    setOpcoes(embaralhar(obterAlternativas(cenario)));
    setSelecionada(null);
  }, [cenario]);

  function entrar() {
    if (!nome.trim()) {
      setErroLogin('Informe o nome do operador para iniciar.');
      return;
    }

    setErroLogin('');
    setNome(nome.trim());
    setLogado(true);
    novoCenario();
  }

  function novoCenario(areaEscolhida = filtroArea) {
    const escolhido = sortearSemRepetir(
      cenarios,
      usados,
      areaEscolhida,
      cenario?.id
    );

    setCenario(escolhido);
    setOpcoes(embaralhar(obterAlternativas(escolhido)));
    setSelecionada(null);

    setUsados((anteriores) => {
      const baseArea =
        areaEscolhida === 'Todas'
          ? cenarios
          : cenarios.filter((c) => c.area === areaEscolhida);
      const todosUsados = baseArea.every((c) => anteriores.includes(c.id));

      if (todosUsados) return [escolhido.id];
      if (anteriores.includes(escolhido.id)) return anteriores;
      return [...anteriores, escolhido.id];
    });
  }

  function trocarArea(area) {
    setFiltroArea(area);
    setUsados([]);
    setSelecionada(null);

    const base =
      area === 'Todas' ? cenarios : cenarios.filter((c) => c.area === area);
    const escolhido = embaralhar(base)[0];

    setCenario(escolhido);
    setOpcoes(embaralhar(obterAlternativas(escolhido)));
    setUsados([escolhido.id]);
  }

  function selecionarTrilha(area) {
    trocarArea(area);
    setTela('simulador');
  }

  function responder(alternativa) {
    if (selecionada) return;

    const respostaCorreta = obterRespostaCorreta(cenario);
    const acertou = alternativa.id === cenario.respostaCorretaId;
    setSelecionada(alternativa.id);

    if (acertou) setPontos((p) => p + 25);

    setHistorico((h) => [
      ...h,
      {
        id: cenario.id,
        area: cenario.area,
        titulo: cenario.titulo,
        nivel: cenario.nivel,
        resposta: alternativa.texto,
        respostaCorreta: respostaCorreta?.texto || '',
        acertou,
        data: new Date().toLocaleString('pt-BR'),
      },
    ]);
  }

  function reiniciar() {
    setHistorico([]);
    setPontos(0);
    setSelecionada(null);
    setUsados([]);
    setTela('home');
    novoCenario();
  }

  function refazerErros() {
    if (!erros.length) return;

    const primeiroErro = cenarios.find((c) => c.id === erros[0].id);
    if (!primeiroErro) return;

    setFiltroArea('Todas');
    setCenario(primeiroErro);
    setOpcoes(embaralhar(obterAlternativas(primeiroErro)));
    setSelecionada(null);
    setUsados([primeiroErro.id]);
    setTela('simulador');
  }

  if (!logado) {
    return (
      <LoginView
        nome={nome}
        setNome={setNome}
        erroLogin={erroLogin}
        onEntrar={entrar}
      />
    );
  }

  return (
    <main className="training-app">
      <TrainingHeader
        nome={nome}
        tela={tela}
        setTela={setTela}
        onSair={() => setLogado(false)}
      />

      {tela === 'home' && (
        <HomeView
          totalCenarios={cenarios.length}
          pontos={pontos}
          tentativas={historico.length}
          acertos={acertos}
          taxa={taxa}
          areas={areas}
          onIniciar={() => setTela('simulador')}
          onSelecionarTrilha={selecionarTrilha}
        />
      )}

      {tela === 'simulador' && (
        <SimuladorView
          areas={areas}
          filtroArea={filtroArea}
          cenario={cenario}
          opcoes={opcoes}
          selecionada={selecionada}
          usados={usados}
          totalDaTrilha={totalDaTrilha}
          progressoRodada={progressoRodada}
          onTrocarArea={trocarArea}
          onResponder={responder}
          onNovoCenario={() => novoCenario()}
        />
      )}

      {tela === 'gestor' && (
        <GestorView
          nome={nome}
          pontos={pontos}
          taxa={taxa}
          aprovado={aprovado}
          historico={historico}
          desempenhoPorTrilha={desempenhoPorTrilha}
          recomendacao={recomendacao}
          erros={erros}
          onRefazerErros={refazerErros}
          onReiniciar={reiniciar}
        />
      )}

      {tela === 'certificado' && (
        <CertificadoView
          nome={nome}
          pontos={pontos}
          taxa={taxa}
          aprovado={aprovado}
          onContinuar={() => setTela('simulador')}
        />
      )}
    </main>
  );
}
