import React, { useMemo, useState } from 'react';

import lightLogo from './assets/light-logo.png';

/*
  APP JSX — Simulador de Proteção de Subestação
  Melhorias:
  1) Banco maior de perguntas.
  2) Não repete pergunta até terminar o ciclo.
  3) Alternativas embaralhadas.
  4) Cada cenário tem explicação técnica.
  5) Filtro por trilha.
*/

const colors = {
  top: '#009E95',
  sidebar: '#075F5A',
  sidebarDark: '#064D49',
  accent: '#B6D433',
  bg: '#F7F9FA',
  card: '#FFFFFF',
  border: '#E5E7EB',
  text: '#1F2933',
  muted: '#6B7280',
  success: '#16A34A',
  danger: '#DC2626',
  warning: '#F59E0B',
};

const cenarios = [
  {
    id: 1,
    area: 'Proteções Diferenciais',
    titulo: 'Atuação do 87T no transformador T1',
    nivel: 'Crítico',
    rele: '87T / 86T',
    equipamento: 'Transformador T1 - 138/13,8 kV',
    alarme: 'Diferencial do transformador atuado',
    descricao:
      'O relé 87T atuou indicando possível defeito interno no transformador, seguido de bloqueio pelo 86T.',
    pergunta: 'Qual deve ser a primeira conduta operacional segura?',
    correta:
      'Manter o transformador isolado, registrar a atuação e comunicar o despacho',
    opcoes: [
      'Manter o transformador isolado, registrar a atuação e comunicar o despacho',
      'Resetar o 86T e fechar novamente o disjuntor de alta',
      'Transferir carga e religar o transformador sem inspeção',
      'Aumentar o tape para compensar a tensão',
    ],
    explicacao:
      'Atuação diferencial é grave. O transformador não deve ser religado sem análise técnica, inspeção e autorização.',
    checklist: [
      'Registrar relés atuados',
      'Confirmar abertura dos disjuntores',
      'Verificar bloqueio 86T',
      'Inspecionar visualmente o transformador',
      'Comunicar o despacho',
    ],
  },
  {
    id: 2,
    area: 'Sobrecorrente',
    titulo: 'Atuação de F.51H no transformador',
    nivel: 'Alto',
    rele: 'F.51H / F.86-2',
    equipamento: 'Transformador 138/13,8 kV',
    alarme: 'Sobrecorrente de fase no transformador',
    descricao:
      'O relé F.51H atuou por sobrecorrente de fase, indicando sobrecarga severa ou curto-circuito entre fases.',
    pergunta:
      'O que o mantenedor deve verificar antes de qualquer tentativa de normalização?',
    correta:
      'Verificar relés atuados, condição dos disjuntores gerais e possível defeito no transformador ou na barra',
    opcoes: [
      'Verificar relés atuados, condição dos disjuntores gerais e possível defeito no transformador ou na barra',
      'Fechar imediatamente o disjuntor geral para testar o circuito',
      'Desbloquear o 86-2 sem verificar a causa',
      'Transferir toda carga para o mesmo transformador atuado',
    ],
    explicacao:
      'A proteção de sobrecorrente do transformador atua como segunda linha. Pode indicar falha em alimentador, barra ou no próprio transformador.',
    checklist: [
      'Conferir F.51H',
      'Conferir F.86-2',
      'Verificar abertura dos gerais',
      'Avaliar transferência de carga',
      'Comunicar despacho',
    ],
  },
  {
    id: 3,
    area: 'Sobrecorrente',
    titulo: 'Defeito fase-terra no lado de baixa do transformador',
    nivel: 'Alto',
    rele: 'F.51G / F.51ZN / F.86-2',
    equipamento: 'Transformador 138/13,8 kV',
    alarme: 'Sobrecorrente de terra',
    descricao:
      'A proteção indicou defeito fase-terra no lado de baixa tensão do transformador.',
    pergunta: 'Qual interpretação técnica é mais adequada?',
    correta:
      'Pode haver falha de primeira linha; a proteção do transformador atuou como retaguarda',
    opcoes: [
      'Pode haver falha de primeira linha; a proteção do transformador atuou como retaguarda',
      'É sempre defeito no lado de 138 kV',
      'É ocorrência normal e não precisa de registro',
      'Deve-se religar todos os alimentadores imediatamente',
    ],
    explicacao:
      'F.51G ou F.51ZN pode atuar para defeito fase-terra na baixa quando a proteção principal não elimina a falta.',
    checklist: [
      'Identificar se atuou F.51G ou F.51ZN',
      'Verificar disjuntores gerais',
      'Verificar alimentadores envolvidos',
      'Não religar sem causa definida',
      'Comunicar despacho',
    ],
  },
  {
    id: 4,
    area: 'Alimentadores',
    titulo: 'Sobrecorrente instantânea em LDA 13,8 kV',
    nivel: 'Alto',
    rele: '50 / 50N',
    equipamento: 'Alimentador LDA',
    alarme: 'Atuação instantânea',
    descricao:
      'Um alimentador de 13,8 kV desarmou por atuação instantânea de fase/neutro.',
    pergunta: 'Qual ação evita agravamento da ocorrência?',
    correta:
      'Bloquear novas tentativas indevidas, verificar atuação e aguardar orientação operacional',
    opcoes: [
      'Bloquear novas tentativas indevidas, verificar atuação e aguardar orientação operacional',
      'Forçar três religamentos manuais seguidos',
      'Aumentar o ajuste do relé para evitar novo trip',
      'Ignorar porque toda falta em LDA é transitória',
    ],
    explicacao:
      'A unidade 50/50N atua rápido para curtos de maior intensidade. Religamento sem critério pode danificar equipamentos.',
    checklist: [
      'Anotar fase/neutro atuado',
      'Confirmar posição do DJ',
      'Verificar se houve religamento automático',
      'Bloquear manobras indevidas',
      'Comunicar despacho',
    ],
  },
  {
    id: 5,
    area: 'Alimentadores',
    titulo: 'Atuação temporizada em alimentador',
    nivel: 'Médio',
    rele: '51 / 51N',
    equipamento: 'Alimentador 13,8 kV',
    alarme: 'Sobrecorrente temporizada',
    descricao:
      'O alimentador atuou por função temporizada, indicando corrente elevada por tempo superior ao ajuste.',
    pergunta: 'Qual informação deve ser priorizada no registro da ocorrência?',
    correta:
      'Relé atuado, fase envolvida, horário, carga e condição do religamento',
    opcoes: [
      'Relé atuado, fase envolvida, horário, carga e condição do religamento',
      'Somente o nome da subestação',
      'Apenas informar que o DJ abriu',
      'Registrar somente depois de normalizar tudo',
    ],
    explicacao:
      'O registro completo ajuda o despacho e a manutenção a entenderem seletividade, carga e possível origem do defeito.',
    checklist: [
      'Registrar horário',
      'Registrar função atuada',
      'Verificar corrente',
      'Verificar condição do 79',
      'Comunicar despacho',
    ],
  },
  {
    id: 6,
    area: 'Falha de Disjuntor',
    titulo: 'Falha de disjuntor em alimentador',
    nivel: 'Crítico',
    rele: '50/62BF / 86-3',
    equipamento: 'DJ de alimentador',
    alarme: 'Falha de disjuntor',
    descricao:
      'A proteção do alimentador atuou, mas o disjuntor não abriu corretamente. O esquema de falha de disjuntor foi iniciado.',
    pergunta: 'O que a atuação do 50/62BF pode provocar?',
    correta:
      'Atuação do 86-3 e desenergização da seção de barra referente ao disjuntor',
    opcoes: [
      'Atuação do 86-3 e desenergização da seção de barra referente ao disjuntor',
      'Somente acendimento de lâmpada no painel',
      'Fechamento automático do disjuntor',
      'Bloqueio apenas do religador 79',
    ],
    explicacao:
      'Na falha de disjuntor, a proteção retira a seção de barra para eliminar o defeito que o DJ não eliminou.',
    checklist: [
      'Confirmar falha de abertura',
      'Confirmar 50/62BF',
      'Confirmar atuação do 86-3',
      'Verificar seção desenergizada',
      'Comunicar despacho',
    ],
  },
  {
    id: 7,
    area: 'Falha de Disjuntor',
    titulo: 'DJ 33 operou 50N + 50/62BF',
    nivel: 'Crítico',
    rele: '50N / 50-62BF / 86-3',
    equipamento: 'DJ 33 - Blindada 13,8 kV',
    alarme: 'Neutro + falha de disjuntor',
    descricao:
      'O DJ 33 teve atuação de 50N e, por não eliminar a falta adequadamente, houve atuação do esquema 50/62BF.',
    pergunta: 'Qual sequência representa melhor a lógica da ocorrência?',
    correta:
      'Defeito à terra no alimentador, falha na abertura do DJ e desligamento da seção pelo 86-3',
    opcoes: [
      'Defeito à terra no alimentador, falha na abertura do DJ e desligamento da seção pelo 86-3',
      'Defeito interno no transformador com atuação do 87T',
      'Subfrequência sistêmica com corte automático de carga',
      'Falha apenas de lâmpada de sinalização do DJ',
    ],
    explicacao:
      '50N indica falta à terra/neutro. Se o DJ não abre, o 62BF temporiza e comanda o bloqueio/abertura pela seção de barra.',
    checklist: [
      'Confirmar 50N no DJ 33',
      'Confirmar 50/62BF',
      'Verificar 86-3',
      'Identificar seção atingida',
      'Não normalizar sem autorização',
    ],
  },
  {
    id: 8,
    area: 'Religamento Automático',
    titulo: 'Religamento automático em LDA 13,8 kV',
    nivel: 'Médio',
    rele: 'F.79',
    equipamento: 'LDA 13,8 kV',
    alarme: 'Religamento automático executado',
    descricao:
      'A LDA sofreu defeito transitório e o relé F.79 iniciou ciclo de religamento.',
    pergunta: 'Qual característica é esperada para LDA de 13,8 kV?',
    correta:
      'Dois religamentos temporizados, normalmente com tempos diferentes',
    opcoes: [
      'Dois religamentos temporizados, normalmente com tempos diferentes',
      'Religamento infinito até a carga voltar',
      'Nenhum religamento pode existir em LDA',
      'Religamento somente manual no campo',
    ],
    explicacao:
      'Em alimentadores aéreos, muitos defeitos são transitórios, como galhos, pipas ou animais. O F.79 ajuda a recompor com critério.',
    checklist: [
      'Verificar ciclo do 79',
      'Registrar tentativa com sucesso ou bloqueio',
      'Verificar se houve novo trip',
      'Não forçar religamento',
      'Comunicar despacho',
    ],
  },
  {
    id: 9,
    area: 'Religamento Automático',
    titulo: 'Chave F.43R fora da posição automática',
    nivel: 'Alto',
    rele: 'F.43R / 79',
    equipamento: 'Disjuntor 138 kV',
    alarme: 'Religamento não executado',
    descricao:
      'O esquema recebeu condição para religamento, mas o disjuntor não religou automaticamente.',
    pergunta: 'Qual verificação deve ser feita antes de suspeitar do relé 79?',
    correta: 'Verificar posição da F.43R e permissivos do comando automático',
    opcoes: [
      'Verificar posição da F.43R e permissivos do comando automático',
      'Trocar imediatamente o relé 79',
      'Fechar manualmente sem consultar o despacho',
      'Desligar a corrente contínua da subestação',
    ],
    explicacao:
      'A F.43R define condição/seleção do religamento. Se estiver fora da posição correta, o 79 pode não executar.',
    checklist: [
      'Conferir F.43R',
      'Conferir 43AB/43T quando existir',
      'Verificar permissivos',
      'Verificar bobina de fechamento',
      'Comunicar despacho',
    ],
  },
  {
    id: 10,
    area: 'Barra 13,8 kV',
    titulo: 'Proteção de barra tipo terra isolada',
    nivel: 'Crítico',
    rele: 'F.64 / F.67G / F.2 / F.86-3',
    equipamento: 'Blindada 13,8 kV',
    alarme: 'Possível defeito no barramento',
    descricao:
      'A blindada possui proteção de barra por terra isolada com F.64, F.67G, temporizador F.2 e auxiliar F.86-3.',
    pergunta: 'Qual conjunto compõe o esquema seletivo dessa proteção?',
    correta: 'F.64, F.67G, F.2 e F.86-3',
    opcoes: [
      'F.64, F.67G, F.2 e F.86-3',
      '87T, 86T e 81U',
      'Somente F.79 e F.43R',
      'Apenas lâmpadas vermelha e verde do painel',
    ],
    explicacao:
      'O esquema usa F.64 e F.67G para detectar/selecionar defeito, F.2 para temporização e F.86-3 para bloqueio/abertura da seção.',
    checklist: [
      'Verificar F.64',
      'Verificar F.67G',
      'Verificar temporizador F.2',
      'Verificar 86-3',
      'Identificar seção da barra',
    ],
  },
  {
    id: 11,
    area: 'Barra 13,8 kV',
    titulo: 'Deficiência do F.64 com TSL na blindada',
    nivel: 'Alto',
    rele: 'F.64 / F.67G',
    equipamento: 'TSL dentro da blindada',
    alarme: 'Risco de atuação indevida do F.64',
    descricao:
      'Em algumas configurações, defeito monofásico em circuito de baixa do TSL pode sensibilizar o F.64.',
    pergunta: 'Por que o F.67G foi usado como solução nesse esquema?',
    correta:
      'Para melhorar a seletividade e evitar desenergização indevida da seção de barra',
    opcoes: [
      'Para melhorar a seletividade e evitar desenergização indevida da seção de barra',
      'Para substituir o disjuntor geral fisicamente',
      'Para eliminar a necessidade de TC',
      'Para permitir religamento automático da barra',
    ],
    explicacao:
      'O F.67G ajuda a diferenciar defeito real de barra de defeitos externos/BT do TSL, evitando atuação indevida.',
    checklist: [
      'Verificar se TSL está na blindada',
      'Avaliar atuação do F.64',
      'Avaliar F.67G',
      'Confirmar seletividade',
      'Comunicar despacho',
    ],
  },
  {
    id: 12,
    area: 'Barra 13,8 kV',
    titulo: 'Defeito real no barramento 13,8 kV',
    nivel: 'Crítico',
    rele: 'F.64 / F.67G / F.86-3',
    equipamento: 'Barramento blindado',
    alarme: 'Proteção de barra atuada',
    descricao:
      'A proteção indica defeito interno na seção da barra de 13,8 kV.',
    pergunta: 'Qual procedimento é mais seguro?',
    correta:
      'Manter a seção isolada, inspecionar a blindada e só energizar após liberação',
    opcoes: [
      'Manter a seção isolada, inspecionar a blindada e só energizar após liberação',
      'Rearmar o 86-3 e energizar imediatamente',
      'Transferir carga para a mesma seção defeituosa',
      'Ignorar o alarme se a tensão voltou ao normal',
    ],
    explicacao:
      'Defeito de barra é crítico. A normalização só deve ocorrer após inspeção, identificação da causa e autorização.',
    checklist: [
      'Confirmar seção isolada',
      'Inspecionar cubículos',
      'Verificar odor, ruído ou marcas de arco',
      'Registrar relés',
      'Comunicar despacho',
    ],
  },
  {
    id: 13,
    area: 'Diferencial de Barras',
    titulo: 'Diferencial de barras não deve atuar para defeito externo',
    nivel: 'Alto',
    rele: '87B / 87BN',
    equipamento: 'Barra 13,8 kV',
    alarme: 'Defeito fora da zona protegida',
    descricao:
      'O defeito ocorreu fora da zona de proteção diferencial da barra.',
    pergunta:
      'Como a proteção diferencial deve se comportar para defeito externo?',
    correta: 'Não deve operar, pois o defeito está fora da zona protegida',
    opcoes: [
      'Não deve operar, pois o defeito está fora da zona protegida',
      'Deve desligar todas as barras da subestação',
      'Deve bloquear o transformador por 87T',
      'Deve acionar o religamento automático 79',
    ],
    explicacao:
      'A proteção diferencial compara correntes dentro da zona protegida. Para falta externa, ela deve permanecer estável.',
    checklist: [
      'Confirmar zona protegida',
      'Verificar TCs exclusivos da proteção',
      'Identificar ponto do defeito',
      'Confirmar se houve atuação indevida',
      'Registrar ocorrência',
    ],
  },
  {
    id: 14,
    area: 'Diferencial de Barras',
    titulo: 'TCs exclusivos da proteção diferencial de barras',
    nivel: 'Médio',
    rele: '87B',
    equipamento: 'Blindada 13,8 kV',
    alarme: 'Análise de circuito de corrente',
    descricao:
      'A proteção diferencial de barras utiliza TCs específicos para delimitar sua zona de atuação.',
    pergunta: 'Qual afirmação está correta?',
    correta:
      'Os TCs da proteção diferencial de barras são exclusivos dessa proteção',
    opcoes: [
      'Os TCs da proteção diferencial de barras são exclusivos dessa proteção',
      'São sempre os mesmos TCs dos alimentadores',
      'Não existe TC em proteção diferencial',
      'A proteção usa somente tensão de serviço auxiliar',
    ],
    explicacao:
      'TCs exclusivos ajudam a garantir seletividade e delimitar corretamente a zona protegida da barra.',
    checklist: [
      'Identificar TCs da proteção',
      'Conferir circuito de corrente',
      'Verificar zona protegida',
      'Verificar atuação diferencial',
      'Registrar anormalidades',
    ],
  },
  {
    id: 15,
    area: 'Comando e Sinalização',
    titulo: 'Lâmpada vermelha permanece acesa com DJ aberto',
    nivel: 'Médio',
    rele: '52a / 52b / sinalização',
    equipamento: 'Disjuntor de alimentador',
    alarme: 'Indicação incoerente de posição',
    descricao:
      'Após desarme, a lâmpada vermelha de fechado não apagou, mesmo com o disjuntor aberto.',
    pergunta: 'Qual causa deve ser investigada primeiro?',
    correta:
      'Circuito de sinalização/contatos auxiliares 52a e 52b do disjuntor',
    opcoes: [
      'Circuito de sinalização/contatos auxiliares 52a e 52b do disjuntor',
      'Atuação obrigatória do 87T',
      'Defeito no resistor de aterramento da barra',
      'Subfrequência no sistema',
    ],
    explicacao:
      'Indicação incoerente geralmente está relacionada a contato auxiliar, circuito de lâmpada ou supervisão de posição.',
    checklist: [
      'Confirmar posição mecânica',
      'Verificar indicação elétrica',
      'Checar 52a/52b',
      'Registrar anomalia',
      'Comunicar manutenção',
    ],
  },
  {
    id: 16,
    area: 'Sistema',
    titulo: 'Subfrequência no sistema',
    nivel: 'Crítico',
    rele: '81U',
    equipamento: 'Sistema elétrico',
    alarme: 'Frequência abaixo do limite',
    descricao:
      'A frequência do sistema caiu abaixo do valor operacional aceitável.',
    pergunta: 'Qual atitude operacional é mais segura?',
    correta:
      'Monitorar a frequência, não religar cargas sem autorização e aguardar despacho',
    opcoes: [
      'Monitorar a frequência, não religar cargas sem autorização e aguardar despacho',
      'Religar todas as cargas para elevar a frequência',
      'Isolar todos os transformadores imediatamente',
      'Desativar a proteção de subfrequência',
    ],
    explicacao:
      'Em subfrequência, religar carga sem autorização pode piorar a instabilidade do sistema.',
    checklist: [
      'Monitorar frequência',
      'Registrar alarmes',
      'Evitar religamento de carga',
      'Aguardar estabilização',
      'Comunicar despacho',
    ],
  },
];

function embaralhar(lista) {
  return [...lista].sort(() => Math.random() - 0.5);
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
  const [logado, setLogado] = useState(false);
  const [nome, setNome] = useState('');
  const [tela, setTela] = useState('home');
  const [filtroArea, setFiltroArea] = useState('Todas');
  const [cenario, setCenario] = useState(() => embaralhar(cenarios)[0]);
  const [opcoes, setOpcoes] = useState(() => embaralhar(cenarios[0].opcoes));
  const [selecionada, setSelecionada] = useState(null);
  const [pontos, setPontos] = useState(0);
  const [historico, setHistorico] = useState([]);
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

  function entrar() {
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
    setOpcoes(embaralhar(escolhido.opcoes));
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
    setOpcoes(embaralhar(escolhido.opcoes));
    setUsados([escolhido.id]);
  }

  function responder(opcao) {
    if (selecionada) return;

    const acertou = opcao === cenario.correta;
    setSelecionada(opcao);

    if (acertou) setPontos((p) => p + 25);

    setHistorico((h) => [
      ...h,
      {
        id: cenario.id,
        area: cenario.area,
        titulo: cenario.titulo,
        nivel: cenario.nivel,
        resposta: opcao,
        correta: cenario.correta,
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

  if (!logado) {
    return (
      <main style={s.page}>
        <section style={s.login}>
          <img style={s.logo} src={lightLogo} alt="Light" />
          <h1 style={s.title}>Treinamento de Proteção</h1>
          <p style={s.sub}>
            Simulador operacional para mantenedores e operadores de subestação.
          </p>

          <input
            style={s.input}
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            placeholder="Nome do operador"
          />

          <button style={s.primary} onClick={entrar}>
            Entrar na Plataforma
          </button>
        </section>
      </main>
    );
  }

  return (
    <main style={s.page}>
      <header style={s.header}>
        <div>
          <strong style={s.brand}>Light+ — Treinamento de Proteção</strong>
          <p style={s.small}>Operador: {nome}</p>
        </div>
        <button style={s.exit} onClick={() => setLogado(false)}>
          Sair
        </button>
      </header>

      <nav style={s.nav}>
        <button
          style={tela === 'home' ? s.navOn : s.navBtn}
          onClick={() => setTela('home')}
        >
          Início
        </button>
        <button
          style={tela === 'simulador' ? s.navOn : s.navBtn}
          onClick={() => setTela('simulador')}
        >
          Simulador
        </button>
        <button
          style={tela === 'gestor' ? s.navOn : s.navBtn}
          onClick={() => setTela('gestor')}
        >
          Gestor
        </button>
        <button
          style={tela === 'certificado' ? s.navOn : s.navBtn}
          onClick={() => setTela('certificado')}
        >
          Certificado
        </button>
      </nav>

      {tela === 'home' && (
        <>
          <section style={s.hero}>
            <h1>Centro de Treinamento Operacional</h1>
            <p>
              Banco com {cenarios.length} perguntas diferentes sobre proteção de
              transformador, alimentadores, barra 13,8 kV, falha de disjuntor,
              religamento e sistema.
            </p>
          </section>

          <section style={s.cards}>
            <Card label="Pontuação" value={pontos} />
            <Card label="Tentativas" value={historico.length} />
            <Card label="Acertos" value={acertos} />
            <Card label="Taxa" value={`${taxa}%`} />
          </section>

          <section style={s.panel}>
            <h2>Trilhas disponíveis</h2>
            {areas
              .filter((a) => a !== 'Todas')
              .map((item) => (
                <div key={item} style={s.trilha}>
                  📘 {item}
                </div>
              ))}
            <button style={s.primary} onClick={() => setTela('simulador')}>
              Iniciar treinamento
            </button>
          </section>
        </>
      )}

      {tela === 'simulador' && (
        <section style={s.simGrid}>
          <aside style={s.scada}>
            <h2>🖥️ Painel SCADA</h2>

            <label style={s.label}>Trilha</label>
            <select
              style={s.select}
              value={filtroArea}
              onChange={(e) => trocarArea(e.target.value)}
            >
              {areas.map((area) => (
                <option key={area} value={area}>
                  {area}
                </option>
              ))}
            </select>

            <Info label="Área" value={cenario.area} />
            <Info label="Nível" value={cenario.nivel} />
            <Info label="Relé" value={cenario.rele} />
            <Info label="Equipamento" value={cenario.equipamento} />

            <div style={s.alarm}>
              🚨 <strong>{cenario.alarme}</strong>
              <p>{cenario.descricao}</p>
            </div>
          </aside>

          <section style={s.question}>
            <div style={s.badge}>Pergunta #{cenario.id}</div>
            <h2>{cenario.titulo}</h2>
            <p>{cenario.descricao}</p>
            <h3>{cenario.pergunta}</h3>

            {opcoes.map((op, i) => {
              const correto = op === cenario.correta;
              const escolhido = op === selecionada;

              let estilo = s.option;
              if (selecionada && correto)
                estilo = { ...s.option, ...s.correct };
              if (selecionada && escolhido && !correto)
                estilo = { ...s.option, ...s.wrong };

              return (
                <button
                  key={`${cenario.id}-${op}`}
                  style={estilo}
                  onClick={() => responder(op)}
                >
                  <strong>{String.fromCharCode(65 + i)}.</strong> {op}
                </button>
              );
            })}

            {selecionada && (
              <div style={selecionada === cenario.correta ? s.ok : s.bad}>
                {selecionada === cenario.correta
                  ? '✅ Decisão segura'
                  : '❌ Decisão insegura'}
                <br />
                Correto: <strong>{cenario.correta}</strong>
                <p style={{ marginBottom: 0 }}>{cenario.explicacao}</p>
              </div>
            )}

            {selecionada && (
              <button style={s.primary} onClick={() => novoCenario()}>
                Próximo cenário sem repetir
              </button>
            )}
          </section>

          <aside style={s.scada}>
            <h2>✅ Checklist Operacional</h2>
            {cenario.checklist.map((item) => (
              <div key={item} style={s.check}>
                ✔ {item}
              </div>
            ))}

            <div style={s.counter}>
              Perguntas usadas nesta rodada: {usados.length}
            </div>
          </aside>
        </section>
      )}

      {tela === 'gestor' && (
        <section style={s.panel}>
          <h2>Painel do Gestor</h2>

          <section style={s.cards}>
            <Card label="Operador" value={nome} />
            <Card label="Pontuação" value={pontos} />
            <Card label="Taxa" value={`${taxa}%`} />
            <Card label="Status" value={aprovado ? 'Aprovado' : 'Em treino'} />
          </section>

          <h3>Histórico de decisões</h3>
          {historico.length === 0 && <p>Nenhuma tentativa registrada.</p>}

          {historico.map((h, i) => (
            <div key={`${h.id}-${i}`} style={h.acertou ? s.histOk : s.histBad}>
              <strong>{h.acertou ? '✅ Correto' : '❌ Incorreto'}</strong>
              <p>{h.titulo}</p>
              <small>
                {h.area} • {h.nivel} • {h.data}
              </small>
            </div>
          ))}

          <button style={s.restart} onClick={reiniciar}>
            Reiniciar treinamento
          </button>
        </section>
      )}

      {tela === 'certificado' && (
        <section style={s.cert}>
          <h1>Certificado de Treinamento</h1>
          <p>Certificamos que</p>
          <h2>{nome}</h2>
          <p>
            participou do treinamento operacional de proteção de subestação.
          </p>

          <div style={s.cards}>
            <Card label="Pontuação" value={pontos} />
            <Card label="Aproveitamento" value={`${taxa}%`} />
            <Card
              label="Status"
              value={aprovado ? 'Aprovado' : 'Não aprovado'}
            />
          </div>

          <p style={s.small}>
            Critério de aprovação: mínimo de 70% de acerto e 8 tentativas.
          </p>
        </section>
      )}
    </main>
  );
}

function Card({ label, value }) {
  return (
    <div style={s.card}>
      <small>{label}</small>
      <strong>{value}</strong>
    </div>
  );
}

function Info({ label, value }) {
  return (
    <div style={s.info}>
      <small>{label}</small>
      <strong>{value}</strong>
    </div>
  );
}

const s = {
  page: {
    minHeight: '100vh',
    background: colors.bg,
    color: colors.text,
    padding: 16,
    fontFamily: 'Arial, sans-serif',
  },
  login: {
    maxWidth: 488,
    margin: '94px auto',
    background: colors.card,
    border: `1px solid ${colors.border}`,
    borderRadius: 24,
    padding: '52px 28px 28px',
    textAlign: 'center',
  },
  logo: {
    width: 84,
    maxWidth: '40%',
    height: 'auto',
    margin: '0 auto 28px',
    display: 'block',
  },
  title: {
    color: colors.top,
    fontSize: 36,
    lineHeight: 1.12,
    margin: 0,
  },
  sub: {
    color: colors.muted,
    maxWidth: 420,
    margin: '16px auto 32px',
  },
  input: {
    width: '100%',
    boxSizing: 'border-box',
    padding: '13px 14px',
    borderRadius: 14,
    border: '2px solid #111111',
    background: '#F3F6F6',
    color: '#000000',
    marginTop: 0,
    fontSize: 16,
  },
  primary: {
    width: '100%',
    marginTop: 16,
    background: '#ff981f',
    color: 'white',
    border: 'none',
    borderRadius: 16,
    padding: 15,
    fontWeight: 'bold',
    fontSize: 16,
    cursor: 'pointer',
  },
  header: {
    background: colors.top,
    border: `1px solid ${colors.top}`,
    borderRadius: 0,
    padding: 15,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
  },
  brand: { color: colors.top, fontSize: 18 },
  small: { color: '#64748b', fontSize: 13 },
  exit: {
    background: colors.sidebar,
    color: 'white',
    border: 'none',
    borderRadius: 12,
    padding: '10px 14px',
    cursor: 'pointer',
  },
  nav: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4,1fr)',
    gap: 8,
    margin: '14px 0',
  },
  navBtn: {
    background: '#FFFFFF',
    color: colors.text,
    border: `1px solid ${colors.border}`,
    borderRadius: 12,
    padding: 10,
    cursor: 'pointer',
  },
  navOn: {
    background: colors.top,
    color: 'white',
    border: 'none',
    borderRadius: 12,
    padding: 10,
    fontWeight: 'bold',
    cursor: 'pointer',
  },
  hero: {
    background: colors.card,
    border: `1px solid ${colors.border}`,
    borderRadius: 24,
    padding: 24,
    marginBottom: 14,
  },
  cards: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit,minmax(120px,1fr))',
    gap: 10,
    margin: '14px 0',
  },
  card: {
    background: colors.card,
    border: `1px solid ${colors.border}`,
    borderRadius: 18,
    padding: 15,
    textAlign: 'center',
    display: 'grid',
    gap: 8,
  },
  panel: {
    background: colors.card,
    border: `1px solid ${colors.border}`,
    borderRadius: 24,
    padding: 20,
  },
  trilha: {
    background: '#F3F6F6',
    border: `1px solid ${colors.border}`,
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
  },
  simGrid: {
    display: 'grid',
    gridTemplateColumns:
      'minmax(260px,0.9fr) minmax(320px,1.4fr) minmax(260px,0.9fr)',
    gap: 14,
  },
  scada: {
    background: colors.card,
    border: `1px solid ${colors.border}`,
    borderRadius: 22,
    padding: 18,
  },
  question: {
    background: colors.card,
    border: `1px solid ${colors.border}`,
    borderRadius: 22,
    padding: 18,
  },
  info: {
    background: '#F3F6F6',
    border: `1px solid ${colors.border}`,
    borderRadius: 14,
    padding: 12,
    marginBottom: 10,
    display: 'grid',
    gap: 5,
  },
  alarm: {
    background: '#FFF7ED',
    border: `1px solid ${colors.warning}`,
    borderRadius: 16,
    padding: 14,
    marginTop: 14,
  },
  option: {
    width: '100%',
    background: '#FFFFFF',
    color: colors.text,
    border: `1px solid ${colors.border}`,
    borderRadius: 16,
    padding: 15,
    marginTop: 10,
    textAlign: 'left',
    fontSize: 15,
    cursor: 'pointer',
  },
  correct: { background: '#ECFDF5', border: `1px solid ${colors.success}` },
  wrong: { background: '#FEF2F2', border: `1px solid ${colors.danger}` },
  ok: {
    background: '#ECFDF5',
    border: `1px solid ${colors.success}`,
    borderRadius: 16,
    padding: 14,
    marginTop: 14,
  },
  bad: {
    background: '#FEF2F2',
    border: `1px solid ${colors.danger}`,
    borderRadius: 16,
    padding: 14,
    marginTop: 14,
  },
  check: {
    background: '#F3F6F6',
    border: `1px solid ${colors.border}`,
    borderRadius: 12,
    padding: 10,
    marginBottom: 8,
  },
  histOk: {
    background: '#ECFDF5',
    border: `1px solid ${colors.success}`,
    borderRadius: 14,
    padding: 12,
    marginBottom: 10,
  },
  histBad: {
    background: '#FFF7ED',
    border: `1px solid ${colors.warning}`,
    borderRadius: 14,
    padding: 12,
    marginBottom: 10,
  },
  restart: {
    width: '100%',
    background: colors.sidebar,
    color: 'white',
    border: 'none',
    borderRadius: 16,
    padding: 15,
    fontWeight: 'bold',
    marginTop: 12,
    cursor: 'pointer',
  },
  cert: {
    background: colors.card,
    color: colors.text,
    borderRadius: 24,
    padding: 28,
    textAlign: 'center',
  },
  label: {
    display: 'block',
    color: colors.top,
    marginBottom: 6,
    fontWeight: 'bold',
  },
  select: {
    width: '100%',
    boxSizing: 'border-box',
    padding: 12,
    borderRadius: 12,
    border: `1px solid ${colors.border}`,
    background: '#F3F6F6',
    color: 'white',
    marginBottom: 14,
  },
  badge: {
    display: 'inline-block',
    background: '#E6FFFB',
    border: `1px solid ${colors.top}`,
    color: colors.sidebar,
    borderRadius: 999,
    padding: '6px 10px',
    fontSize: 12,
    fontWeight: 'bold',
  },
  counter: {
    marginTop: 14,
    background: colors.card,
    border: `1px solid ${colors.border}`,
    borderRadius: 14,
    padding: 12,
    color: colors.top,
    fontWeight: 'bold',
  },
};
