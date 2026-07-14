import React, { useEffect, useMemo, useState } from 'react';

import './App.css';
import './components/training/HomeDashboard.css';
import { CertificadoView } from './components/training/CertificadoView';
import { GestorView } from './components/training/GestorView';
import { HomeView } from './components/training/HomeView';
import { LoginView } from './components/training/LoginView';
import { ProtecaoDiferencialBarrasView } from './components/training/ProtecaoDiferencialBarrasView';
import { SimuladorView } from './components/training/SimuladorView';
import { SiteFooter } from './components/training/SiteFooter';
import { TrainingHeader } from './components/training/TrainingHeader';
import { TransformadoresInstrumentosView } from './components/training/TransformadoresInstrumentosView';
import { cenarios } from './data/cenariosProtecao';

const PROTECAO_DIFERENCIAL_BARRAS_ROUTE = '/treinamento/protecao/diferencial-barras-13-8kv';
const TRANSFORMADORES_INSTRUMENTOS_ROUTE = '/treinamento/transformadores/transformadores-instrumentos';
const TRANSFORMADORES_TC_ROUTE = '/treinamento/transformadores/tc';

function telaInicialPelaRota() {
  if (window.location.pathname === PROTECAO_DIFERENCIAL_BARRAS_ROUTE) {
    return 'protecao-diferencial-barras';
  }

  if ([TRANSFORMADORES_INSTRUMENTOS_ROUTE, TRANSFORMADORES_TC_ROUTE].includes(window.location.pathname)) {
    return 'transformadores-instrumentos';
  }

  return 'home';
}

function embaralhar(lista) {
  return [...lista].sort(() => Math.random() - 0.5);
}

function obterAlternativas(cenario) {
  return cenario?.alternativas || [];
}

function normalizarTexto(valor = '') {
  return valor
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
}

function obterRespostaCorreta(cenario) {
  return obterAlternativas(cenario).find(
    (alternativa) => alternativa.id === cenario.respostaCorretaId
  );
}

function sortearSemRepetir(lista, usados, filtroArea, atualId) {
  const base = filtroArea === 'Todas'
    ? lista
    : lista.filter((cenario) => cenario.area === filtroArea);

  let disponiveis = base.filter(
    (cenario) => !usados.includes(cenario.id) && cenario.id !== atualId
  );

  if (disponiveis.length === 0) {
    disponiveis = base.filter((cenario) => cenario.id !== atualId);
  }

  if (disponiveis.length === 0) disponiveis = base;

  return disponiveis[Math.floor(Math.random() * disponiveis.length)];
}

export default function App() {
  const [logado, setLogado] = useState(
    () => localStorage.getItem('treinamentoProtecaoLogado') === 'true'
  );
  const [nome, setNome] = useState(
    () => localStorage.getItem('treinamentoProtecaoNome') || ''
  );
  const [tela, setTela] = useState(telaInicialPelaRota);
  const [menuAberto, setMenuAberto] = useState(false);
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
      return JSON.parse(localStorage.getItem('treinamentoProtecaoHistorico')) || [];
    } catch {
      return [];
    }
  });
  const [usados, setUsados] = useState([]);

  const areas = useMemo(
    () => ['Todas', ...new Set(cenarios.map((cenario) => cenario.area))],
    []
  );

  const acertos = historico.filter((item) => item.acertou).length;
  const taxa = historico.length
    ? Math.round((acertos / historico.length) * 100)
    : 0;
  const aprovado = taxa >= 70 && historico.length >= 8;
  const erros = historico.filter((item) => !item.acertou);
  const totalDaTrilha = filtroArea === 'Todas'
    ? cenarios.length
    : cenarios.filter((cenarioItem) => cenarioItem.area === filtroArea).length;
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
    return desempenhoPorTrilha
      .filter((item) => item.tentativas > 0)
      .sort((a, b) => b.erros - a.erros || a.taxa - b.taxa)[0] || null;
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

  useEffect(() => {
    function sincronizarTelaComRota() {
      setTela(telaInicialPelaRota());
    }

    window.addEventListener('popstate', sincronizarTelaComRota);
    return () => window.removeEventListener('popstate', sincronizarTelaComRota);
  }, []);

  function navegarParaTela(proximaTela) {
    const rotasPorTela = {
      'protecao-diferencial-barras': PROTECAO_DIFERENCIAL_BARRAS_ROUTE,
      'transformadores-instrumentos': TRANSFORMADORES_INSTRUMENTOS_ROUTE,
    };
    const rota = rotasPorTela[proximaTela] || '/';

    if (window.location.pathname !== rota) {
      window.history.pushState({}, '', rota);
    }

    setTela(proximaTela);
  }

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
      const baseArea = areaEscolhida === 'Todas'
        ? cenarios
        : cenarios.filter((cenarioItem) => cenarioItem.area === areaEscolhida);
      const todosUsados = baseArea.every((cenarioItem) =>
        anteriores.includes(cenarioItem.id)
      );

      if (todosUsados) return [escolhido.id];
      if (anteriores.includes(escolhido.id)) return anteriores;
      return [...anteriores, escolhido.id];
    });
  }

  function trocarArea(area) {
    setFiltroArea(area);
    setUsados([]);
    setSelecionada(null);

    const base = area === 'Todas'
      ? cenarios
      : cenarios.filter((cenarioItem) => cenarioItem.area === area);
    const escolhido = embaralhar(base)[0];

    setCenario(escolhido);
    setOpcoes(embaralhar(obterAlternativas(escolhido)));
    setUsados([escolhido.id]);
  }

  function selecionarTrilha(area) {
    const areaNormalizada = normalizarTexto(area);

    if (['diferencial de barras', 'protecoes diferenciais'].includes(areaNormalizada)) {
      navegarParaTela('protecao-diferencial-barras');
      return;
    }

    if (areaNormalizada === 'transformadores') {
      navegarParaTela('transformadores-instrumentos');
      return;
    }

    trocarArea(area);
    navegarParaTela('simulador');
  }

  function responder(alternativa) {
    if (selecionada) return;

    const respostaCorreta = obterRespostaCorreta(cenario);
    const acertou = alternativa.id === cenario.respostaCorretaId;
    setSelecionada(alternativa.id);

    if (acertou) setPontos((valorAtual) => valorAtual + 25);

    setHistorico((itens) => [
      ...itens,
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
    navegarParaTela('home');
    novoCenario();
  }

  function refazerErros() {
    if (!erros.length) return;

    const primeiroErro = cenarios.find((cenarioItem) => cenarioItem.id === erros[0].id);
    if (!primeiroErro) return;

    setFiltroArea('Todas');
    setCenario(primeiroErro);
    setOpcoes(embaralhar(obterAlternativas(primeiroErro)));
    setSelecionada(null);
    setUsados([primeiroErro.id]);
    navegarParaTela('simulador');
  }

  function sair() {
    setMenuAberto(false);
    setLogado(false);
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

  if (tela === 'home') {
    return (
      <HomeView
        nome={nome}
        tela={tela}
        filtroArea={filtroArea}
        totalCenarios={cenarios.length}
        pontos={pontos}
        tentativas={historico.length}
        acertos={acertos}
        taxa={taxa}
        areas={areas}
        onSair={sair}
        onNavigate={navegarParaTela}
        onSelecionarTrilha={selecionarTrilha}
      />
    );
  }

  return (
    <main className={menuAberto ? 'training-app sidebar-open' : 'training-app'}>
      <TrainingHeader
        nome={nome}
        tela={tela}
        filtroArea={filtroArea}
        areas={areas}
        setTela={navegarParaTela}
        onSelecionarTrilha={selecionarTrilha}
        menuAberto={menuAberto}
        onToggleMenu={() => setMenuAberto((aberto) => !aberto)}
        onCloseMenu={() => setMenuAberto(false)}
        onSair={sair}
      />

      <div className="training-content">
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
            onContinuar={() => navegarParaTela('simulador')}
          />
        )}

        {tela === 'transformadores-instrumentos' && (
          <TransformadoresInstrumentosView
            onBackHome={() => navegarParaTela('home')}
            onNextLesson={() => {
              if (window.location.pathname !== TRANSFORMADORES_TC_ROUTE) {
                window.history.pushState({}, '', TRANSFORMADORES_TC_ROUTE);
              }
              setTela('transformadores-instrumentos');
            }}
          />
        )}

        {tela === 'protecao-diferencial-barras' && (
          <ProtecaoDiferencialBarrasView onBackHome={() => navegarParaTela('home')} />
        )}
      </div>

      <SiteFooter />
    </main>
  );
}
