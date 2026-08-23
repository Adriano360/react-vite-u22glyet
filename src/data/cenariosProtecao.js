import diagramaUrg861Tr1 from '../assets/diagrama-urg-86-1-tr1.png';

export const cenarios = [
  {
    id: 1,
    modulo: 'Proteção de transformadores',
    ordem: 1,
    area: 'Proteções diferenciais',
    titulo: 'Atuação do 87T no transformador TR1',
    nivel: 'Crítico',
    rele: '87T / 86T',
    equipamento: 'Transformador TR1 - 138/13,8 kV',
    competencia: 'Reconhecer atuação diferencial e manter o transformador isolado até liberação técnica.',
    tempoEstimado: '3 min',
    pontosCriticos: [
      'Atuação diferencial é indício grave.',
      'Não religar o transformador sem análise técnica.',
      'Registrar relés atuados e comunicar o despacho.',
    ],
    alarme: 'Diferencial do transformador atuado',
    descricao:
      'O relé 87T atuou indicando possível defeito interno no transformador, seguido de bloqueio pelo 86T.',
    pergunta:
      'A atuação do 87T, seguida do bloqueio pelo 86T, indica que a corrente medida nos TCs de alta e de baixa tensão do TR1 não fechou dentro da margem de restrição percentual do relé diferencial. Diante disso, qual é a interpretação tecnicamente correta e a conduta operacional adequada?',
    respostaCorretaId: 'a',
    alternativas: [
      {
        id: 'a',
        texto:
          'A diferença acima da margem de restrição aponta falta dentro da zona diferencial, entre os TCs de AT e BT; o transformador deve permanecer isolado e bloqueado, com os relés registrados, até inspeção e liberação técnica.',
        feedback:
          'Correto. O 87T é proteção unitária: sua zona vai de TC a TC, e uma diferença fora da margem de restrição indica falta interna, exigindo isolamento até diagnóstico.',
      },
      {
        id: 'b',
        texto:
          'Como o inrush de energização também gera diferença de corrente entre os enrolamentos, a atuação pode ser normalizada assim que a corrente diferencial retornar a zero, sem necessidade de inspeção.',
        feedback:
          'Incorreto. O relé 87T usa restrição harmônica justamente para não atuar por inrush; se atuou e bloqueou por 86T, a causa mais provável é falta real, não energização.',
      },
      {
        id: 'c',
        texto:
          'A atuação decorre necessariamente de erro de relação nos TCs de neutro do aterramento, sendo suficiente corrigir a relação de transformação antes de recompor o TR1.',
        feedback:
          'Incorreto. Erro de TC pode gerar diferencial espúria, mas não se confirma isso sem investigação; presumir a causa sem inspeção é inseguro.',
      },
      {
        id: 'd',
        texto:
          'Por se tratar de proteção de retaguarda, a atuação do 87T dispensa inspeção interna, bastando confirmar a leitura do relé de sobrecorrente 51 antes de religar.',
        feedback:
          'Incorreto. O 87T é proteção principal (unitária) do transformador, não retaguarda; a inspeção interna é obrigatória antes de qualquer recomposição.',
      },
    ],
    explicacao:
      'O 87T compara as correntes de entrada e saída do transformador dentro de sua zona diferencial. Uma diferença acima da margem de restrição, com bloqueio confirmado pelo 86T, indica falta interna real — não deve ser confundida com inrush (contido por restrição harmônica) nem tratada como erro presumido de instrumentação.',
    checklist: [
      'Registrar relés atuados.',
      'Confirmar abertura dos disjuntores.',
      'Verificar bloqueio 86T.',
      'Inspecionar visualmente o transformador.',
      'Comunicar o despacho.',
    ],
  },
  {
    id: 2,
    modulo: 'Proteção de transformadores',
    ordem: 2,
    area: 'Sobrecorrente',
    titulo: 'Atuação de F.51H no transformador',
    nivel: 'Alto',
    rele: 'F.51H / F.86-2',
    equipamento: 'Transformador 138/13,8 kV',
    competencia: 'Interpretar sobrecorrente de fase em transformador e priorizar verificações de segurança.',
    tempoEstimado: '3 min',
    pontosCriticos: [
      'Verificar relés atuados.',
      'Confirmar condição dos disjuntores gerais.',
      'Avaliar possível defeito no transformador ou na barra.',
    ],
    alarme: 'Sobrecorrente de fase no transformador',
    descricao:
      'O relé F.51H atuou por sobrecorrente de fase, indicando sobrecarga severa ou curto-circuito entre fases.',
    pergunta:
      'O F.51H atuou por sobrecorrente de fase no transformador, com temporização coordenada em relação às proteções dos alimentadores da barra secundária. Qual conclusão técnica está correta sobre essa atuação?',
    respostaCorretaId: 'a',
    alternativas: [
      {
        id: 'a',
        texto:
          'Por ser proteção de retaguarda temporizada, o F.51H também pode atuar por uma falta não eliminada por um alimentador (falha de disjuntor ou de proteção primária), não apenas por defeito interno no transformador; por isso a causa deve ser investigada nos disjuntores gerais e nos alimentadores antes de normalizar.',
        feedback:
          'Correto. A coordenação temporizada existe para que o F.51H sirva de retaguarda a faltas nos alimentadores, além de proteger o próprio transformador.',
      },
      {
        id: 'b',
        texto:
          'Como o relé está instalado no transformador, a atuação só pode ser causada por defeito interno, sendo desnecessário verificar os alimentadores da barra secundária.',
        feedback:
          'Incorreto. A localização física do TC não limita a zona de retaguarda; o F.51H protege também contra faltas não eliminadas nos alimentadores.',
      },
      {
        id: 'c',
        texto:
          'A temporização do F.51H serve apenas para evitar disparo por partida de motores, sem qualquer relação com seletividade em relação às proteções dos alimentadores.',
        feedback:
          'Incorreto. A temporização também garante seletividade: o F.51H deve atuar depois das proteções dos alimentadores, dando tempo para que elas eliminem a falta primeiro.',
      },
      {
        id: 'd',
        texto:
          'Uma atuação temporizada de sobrecorrente de fase indica curto-circuito trifásico franco próximo aos terminais do transformador, descartando faltas fase-fase distantes na rede secundária.',
        feedback:
          'Incorreto. A função de sobrecorrente de fase não distingue localização ou tipo específico de falta; qualquer sobrecorrente de fase acima do ajuste, por tempo suficiente, provoca a atuação.',
      },
    ],
    explicacao:
      'O F.51H funciona como retaguarda temporizada: protege o transformador e também cobre faltas nos alimentadores que a proteção primária não eliminou dentro do tempo esperado. A coordenação de tempo garante seletividade entre os níveis de proteção.',
    checklist: [
      'Conferir F.51H.',
      'Conferir F.86-2.',
      'Verificar abertura dos disjuntores gerais.',
      'Avaliar transferência de carga.',
      'Comunicar o despacho.',
    ],
  },
  {
    id: 3,
    modulo: 'Proteção de transformadores',
    ordem: 3,
    area: 'Sobrecorrente',
    titulo: 'Defeito fase-terra no lado de baixa do transformador',
    nivel: 'Alto',
    rele: 'F.51G / F.51ZN / F.86-2',
    equipamento: 'Transformador 138/13,8 kV',
    competencia: 'Identificar atuação de retaguarda para faltas fase-terra no lado de baixa tensão.',
    tempoEstimado: '3 min',
    pontosCriticos: [
      'Diferenciar proteção principal e retaguarda.',
      'Não religar sem causa definida.',
      'Verificar alimentadores envolvidos.',
    ],
    alarme: 'Sobrecorrente de terra',
    descricao:
      'A proteção indicou defeito fase-terra no lado de baixa tensão do transformador.',
    pergunta:
      'A proteção indicou defeito fase-terra no lado de baixa tensão do transformador, com possível atuação tanto do F.51G quanto do F.51ZN. Qual é a diferença técnica entre essas duas funções e o que isso implica para a análise da ocorrência?',
    respostaCorretaId: 'a',
    alternativas: [
      {
        id: 'a',
        texto:
          'O F.51G normalmente mede a corrente residual formada pelos TCs de fase, enquanto o F.51ZN mede diretamente a corrente no neutro aterrado do transformador; identificar qual das duas atuou ajuda a confirmar se a falta está mais próxima do secundário do transformador ou distribuída na rede de baixa.',
        feedback:
          'Correto. Diferenciar a origem do sinal (residual de fase versus neutro do transformador) orienta a investigação sobre a provável localização da falta.',
      },
      {
        id: 'b',
        texto:
          'F.51G e F.51ZN são exatamente a mesma função com nomes diferentes, portanto não importa qual delas atuou para a análise da ocorrência.',
        feedback:
          'Incorreto. São grandezas medidas de formas distintas (residual de fase versus neutro do transformador); a distinção é relevante para localizar a falta.',
      },
      {
        id: 'c',
        texto:
          'A atuação de qualquer uma dessas funções indica obrigatoriamente falta no enrolamento de alta tensão do transformador, já que ambas dependem do aterramento do neutro de 138 kV.',
        feedback:
          'Incorreto. O cenário descreve o lado de baixa tensão; essas funções de terra estão associadas à malha de baixa, não ao neutro de 138 kV.',
      },
      {
        id: 'd',
        texto:
          'Como se trata de retaguarda, a atuação dessas funções pode ser desconsiderada sempre que a proteção principal dos alimentadores não tiver sinalizado nenhuma atuação.',
        feedback:
          'Inseguro. A ausência de sinalização na proteção principal não descarta falta real; pode indicar falha da proteção primária, justamente o cenário em que a retaguarda deve atuar.',
      },
    ],
    explicacao:
      'F.51G (residual de fase) e F.51ZN (neutro do transformador) são medições distintas que, associadas ao esquema de aterramento e à topologia da rede de baixa tensão, ajudam a estimar a localização provável de uma falta fase-terra não eliminada pela proteção primária.',
    checklist: [
      'Identificar se atuou F.51G ou F.51ZN.',
      'Verificar disjuntores gerais.',
      'Verificar alimentadores envolvidos.',
      'Não religar sem causa definida.',
      'Comunicar o despacho.',
    ],
  },
  {
    id: 4,
    modulo: 'Proteção de alimentadores',
    ordem: 4,
    area: 'Alimentadores',
    titulo: 'Sobrecorrente instantânea em LDA 13,8 kV',
    nivel: 'Alto',
    rele: '50 / 50N',
    equipamento: 'Alimentador LDA 13,8 kV',
    competencia: 'Reconhecer atuação instantânea e evitar tentativas indevidas de religamento.',
    tempoEstimado: '3 min',
    pontosCriticos: [
      'Confirmar fase ou neutro atuado.',
      'Verificar posição do disjuntor.',
      'Aguardar orientação operacional.',
    ],
    alarme: 'Atuação instantânea',
    descricao:
      'Um alimentador de 13,8 kV desarmou por atuação instantânea de fase/neutro.',
    pergunta:
      'O alimentador desarmou pela unidade instantânea (50/50N), sem que nenhum religamento automático fosse tentado. Do ponto de vista de coordenação de proteção, o que essa ausência de religamento sugere sobre a lógica do esquema?',
    respostaCorretaId: 'a',
    alternativas: [
      {
        id: 'a',
        texto:
          'É provável que a lógica de religamento (F.79) tenha sido programada para não atuar após disparo pela unidade instantânea de maior magnitude, evitando religar sobre uma falta de intensidade elevada; por isso deve-se aguardar orientação antes de qualquer manobra.',
        feedback:
          'Correto. É comum bloquear o religamento automático quando o disparo vem de unidades instantâneas de alta magnitude, justamente para não repetir o fechamento sobre um defeito severo.',
      },
      {
        id: 'b',
        texto:
          'A ausência de religamento indica falha do relé 79, que deve ser substituído imediatamente antes de qualquer outra verificação.',
        feedback:
          'Incorreto. Presumir falha do relé sem verificar a lógica e os permissivos programados é prematuro e pode levar a uma troca desnecessária.',
      },
      {
        id: 'c',
        texto:
          'Toda atuação da unidade instantânea 50/50N é, por definição, seguida de religamento automático obrigatório, já que se trata de proteção primária do alimentador.',
        feedback:
          'Incorreto. Não existe essa obrigatoriedade; o religamento é uma função configurável e pode ser bloqueado justamente para disparos de alta magnitude.',
      },
      {
        id: 'd',
        texto:
          'A ausência de religamento significa que a proteção 50/50N está desabilitada e que o desarme ocorreu por outra função não identificada.',
        feedback:
          'Incorreto. O enunciado já identifica a função atuada (50/50N); a ausência de religamento é uma característica da lógica de religamento, não evidência de proteção desabilitada.',
      },
    ],
    explicacao:
      'Esquemas de religamento automático costumam ser configurados para não religar após disparos por unidades instantâneas de alta magnitude, reduzindo o risco de fechar o disjuntor sobre uma falta permanente severa. A ausência de religamento, nesse contexto, é esperada e não indica falha do relé.',
    checklist: [
      'Anotar fase/neutro atuado.',
      'Confirmar posição do disjuntor.',
      'Verificar se houve religamento automático.',
      'Bloquear manobras indevidas.',
      'Comunicar o despacho.',
    ],
  },
  {
    id: 5,
    modulo: 'Proteção de alimentadores',
    ordem: 5,
    area: 'Alimentadores',
    titulo: 'Atuação temporizada em alimentador',
    nivel: 'Médio',
    rele: '51 / 51N',
    equipamento: 'Alimentador 13,8 kV',
    competencia: 'Registrar corretamente atuações temporizadas em alimentadores.',
    tempoEstimado: '2 min',
    pontosCriticos: [
      'Registrar horário e função atuada.',
      'Verificar corrente e fase envolvida.',
      'Registrar condição do religamento.',
    ],
    alarme: 'Sobrecorrente temporizada',
    descricao:
      'O alimentador atuou por função temporizada, indicando corrente elevada por tempo superior ao ajuste.',
    pergunta:
      'Ao registrar a atuação temporizada do 51/51N, qual conjunto de dados é indispensável para que a equipe de proteção avalie corretamente a seletividade entre esse alimentador e os demais níveis de proteção da subestação?',
    respostaCorretaId: 'a',
    alternativas: [
      {
        id: 'a',
        texto:
          'Corrente de atuação, tempo decorrido até o desarme, fase(s) envolvida(s) e comparação com a curva tempo x corrente ajustada, além da atuação (ou não) de proteções a montante e a jusante no mesmo intervalo.',
        feedback:
          'Correto. Só é possível avaliar seletividade comparando a curva ajustada do relé com os dados reais da ocorrência e a resposta das demais proteções envolvidas.',
      },
      {
        id: 'b',
        texto:
          'Basta o horário da ocorrência, pois a curva tempo x corrente do relé pode ser obtida posteriormente sem relação com o evento registrado.',
        feedback:
          'Incompleto. Sem os dados de corrente e tempo do evento específico, não é possível verificar se a atuação seguiu a curva ajustada.',
      },
      {
        id: 'c',
        texto:
          'A seletividade é avaliada exclusivamente pelo ajuste de pickup do relé, sendo dispensável verificar o tempo decorrido até o desarme.',
        feedback:
          'Incompleto. Coordenação tempo x corrente depende tanto do pickup quanto do tempo de atuação; ignorar o tempo inviabiliza a análise de seletividade.',
      },
      {
        id: 'd',
        texto:
          'Como o alimentador é o nível mais baixo da hierarquia de proteção, não há necessidade de verificar a atuação das proteções a montante durante o registro.',
        feedback:
          'Incorreto. Verificar se as proteções a montante permaneceram estáveis é parte essencial da confirmação de seletividade.',
      },
    ],
    explicacao:
      'A avaliação de seletividade em sobrecorrente temporizada depende da curva tempo x corrente ajustada, dos dados reais de corrente/tempo do evento e da confirmação de que as proteções a montante permaneceram estáveis enquanto a proteção correta atuou.',
    checklist: [
      'Registrar horário.',
      'Registrar função atuada.',
      'Verificar corrente.',
      'Verificar condição do 79.',
      'Comunicar o despacho.',
    ],
  },
  {
    id: 6,
    modulo: 'Falha de disjuntor',
    ordem: 6,
    area: 'Falha de disjuntor',
    titulo: 'Falha de disjuntor em alimentador',
    nivel: 'Crítico',
    rele: '50/62BF / 86-3',
    equipamento: 'Disjuntor de alimentador',
    competencia: 'Entender a atuação do esquema de falha de disjuntor e seus impactos na barra.',
    tempoEstimado: '3 min',
    pontosCriticos: [
      'Confirmar falha de abertura.',
      'Confirmar atuação do 50/62BF.',
      'Identificar seção desenergizada pelo 86-3.',
    ],
    alarme: 'Falha de disjuntor',
    descricao:
      'A proteção do alimentador atuou, mas o disjuntor não abriu corretamente. O esquema de falha de disjuntor foi iniciado.',
    pergunta:
      'O esquema de falha de disjuntor foi iniciado porque a proteção do alimentador atuou, mas a corrente de falta não foi extinta dentro do tempo esperado. Sobre a lógica de atuação do 50/62BF, qual afirmação está tecnicamente correta?',
    respostaCorretaId: 'a',
    alternativas: [
      {
        id: 'a',
        texto:
          'O elemento de sobrecorrente (50BF) permanece sensibilizado enquanto a corrente de falta persistir; se, ao final da temporização do 62BF, a corrente ainda estiver presente, isso confirma que o disjuntor não interrompeu a falta, disparando o 86-3 para desenergizar a seção de barra.',
        feedback:
          'Correto. A lógica combina detecção de corrente persistente (50BF) com temporização (62BF) para confirmar a falha real de abertura antes de atuar sobre a seção de barra.',
      },
      {
        id: 'b',
        texto:
          'O 62BF temporiza de forma independente da corrente de falta, disparando o 86-3 sempre que a proteção do alimentador atua, mesmo que o disjuntor tenha aberto corretamente.',
        feedback:
          'Incorreto. O esquema depende da persistência da corrente detectada pelo 50BF; se o disjuntor abre corretamente, a corrente cessa e o 62BF não completa a temporização.',
      },
      {
        id: 'c',
        texto:
          'A atuação do 86-3 ocorre imediatamente após o comando de abertura do disjuntor do alimentador, sem qualquer temporização adicional do 62BF.',
        feedback:
          'Incorreto. Existe uma temporização deliberada (62BF) para dar tempo ao disjuntor de abrir normalmente antes de acionar a retaguarda de barra.',
      },
      {
        id: 'd',
        texto:
          'O esquema de falha de disjuntor é acionado por uma segunda atuação manual do operador, não fazendo parte da lógica automática de proteção.',
        feedback:
          'Incorreto. O esquema é inteiramente automático, disparado pela combinação de sobrecorrente persistente e temporização, sem depender de ação manual.',
      },
    ],
    explicacao:
      'A lógica de falha de disjuntor combina um elemento de sobrecorrente (50BF) que confirma a persistência da corrente de falta com uma temporização (62BF) que dá tempo ao disjuntor de operar normalmente. Só se a corrente persistir além desse tempo é que o 86-3 desenergiza a seção de barra como retaguarda.',
    checklist: [
      'Confirmar falha de abertura.',
      'Confirmar 50/62BF.',
      'Confirmar atuação do 86-3.',
      'Verificar seção desenergizada.',
      'Comunicar o despacho.',
    ],
  },
  {
    id: 7,
    modulo: 'Falha de disjuntor',
    ordem: 7,
    area: 'Falha de disjuntor',
    titulo: 'Disjuntor operou 50N + 50/62BF',
    nivel: 'Crítico',
    rele: '50N / 50/62BF / 86-3',
    equipamento: 'Disjuntor 33 - Blindada 13,8 kV',
    competencia: 'Relacionar falta à terra, falha de abertura e desligamento de seção de barra.',
    tempoEstimado: '3 min',
    pontosCriticos: [
      '50N indica falta à terra/neutro.',
      '50/62BF indica falha de eliminação pelo disjuntor.',
      '86-3 pode desligar a seção da barra.',
    ],
    alarme: 'Neutro + falha de disjuntor',
    descricao:
      'O disjuntor 33 teve atuação de 50N e, por não eliminar a falta adequadamente, houve atuação do esquema 50/62BF.',
    pergunta:
      'O disjuntor 33 apresentou atuação de 50N (instantânea de neutro) seguida de 50/62BF. Comparando com uma hipotética atuação de 51N (temporizada de neutro) no mesmo ponto, qual é a implicação técnica de a proteção ter atuado pela unidade instantânea?',
    respostaCorretaId: 'a',
    alternativas: [
      {
        id: 'a',
        texto:
          'A atuação pela unidade instantânea de neutro sugere uma corrente de falta à terra de magnitude elevada, tipicamente associada a defeito próximo ao disjuntor; combinada à falha de abertura, reforça a necessidade de tratar a ocorrência como severa antes de qualquer tentativa de normalização.',
        feedback:
          'Correto. Unidades instantâneas costumam estar ajustadas para faltas de maior corrente/proximidade; junto com a falha de disjuntor, isso indica uma ocorrência de maior severidade.',
      },
      {
        id: 'b',
        texto:
          'Não há diferença técnica relevante entre 50N e 51N atuarem, pois ambas indicam exatamente a mesma magnitude e localização de falta.',
        feedback:
          'Incorreto. A unidade instantânea (50N) e a temporizada (51N) costumam ter ajustes e propósitos de coordenação diferentes, e a magnitude típica associada a cada uma não é a mesma.',
      },
      {
        id: 'c',
        texto:
          'A atuação pela unidade instantânea descarta qualquer possibilidade de falha do disjuntor, já que 50N e 62BF não podem operar em sequência.',
        feedback:
          'Incorreto. É justamente a sequência 50N seguido de 62BF que caracteriza a falha de abertura descrita no cenário.',
      },
      {
        id: 'd',
        texto:
          'Como o 50N é uma função de retaguarda de barra, sua atuação já implica diretamente na abertura do 86-3, independentemente do funcionamento do disjuntor 33.',
        feedback:
          'Incorreto. O 50N é a proteção primária do próprio disjuntor 33; o 86-3 só atua depois da confirmação de falha de abertura pelo esquema 62BF.',
      },
    ],
    explicacao:
      '50N (instantâneo) costuma estar ajustado para faltas de maior corrente, geralmente mais próximas ou de maior severidade, ao contrário do 51N (temporizado), usado para seletividade com esquemas a jusante. A sequência 50N + 62BF confirma que o disjuntor 33 não eliminou uma falta severa, levando à atuação de retaguarda pelo 86-3.',
    checklist: [
      'Confirmar 50N no disjuntor.',
      'Confirmar 50/62BF.',
      'Verificar 86-3.',
      'Identificar seção atingida.',
      'Não normalizar sem autorização.',
    ],
  },
  {
    id: 8,
    modulo: 'Religamento automático',
    ordem: 8,
    area: 'Religamento automático',
    titulo: 'Religamento automático em LDA 13,8 kV',
    nivel: 'Médio',
    rele: 'F.79',
    equipamento: 'LDA 13,8 kV',
    competencia: 'Reconhecer ciclos de religamento automático em alimentadores aéreos.',
    tempoEstimado: '2 min',
    pontosCriticos: [
      'Verificar ciclo do 79.',
      'Registrar sucesso ou bloqueio do religamento.',
      'Não forçar religamento manual.',
    ],
    alarme: 'Religamento automático executado',
    descricao:
      'A LDA sofreu defeito transitório e o relé F.79 iniciou ciclo de religamento.',
    pergunta:
      'O F.79 executou um ciclo de religamento após defeito transitório na LDA. Por que, tipicamente, o primeiro tempo morto (dead time) de um religamento é mais curto que o segundo, em esquemas de múltiplos religamentos?',
    respostaCorretaId: 'a',
    alternativas: [
      {
        id: 'a',
        texto:
          'Defeitos transitórios de curta duração costumam se autoextinguir rapidamente, então a primeira tentativa usa tempo morto curto; caso a falta persista, tempos mortos maiores nas tentativas seguintes dão mais chance de dissipação do arco, evitando religamentos sucessivos sobre uma falta ainda presente.',
        feedback:
          'Correto. O escalonamento dos tempos mortos busca equilibrar rapidez na recomposição de faltas transitórias curtas com segurança contra faltas mais persistentes.',
      },
      {
        id: 'b',
        texto:
          'O tempo morto é sempre igual entre as tentativas, pois o F.79 não permite variação de tempos dentro do mesmo ciclo de religamento.',
        feedback:
          'Incorreto. Esquemas de múltiplos religamentos tipicamente têm tempos mortos configuráveis e diferentes entre as tentativas.',
      },
      {
        id: 'c',
        texto:
          'Tempos mortos mais curtos nas primeiras tentativas existem apenas para reduzir o desgaste mecânico do disjuntor, sem qualquer relação com a natureza do defeito.',
        feedback:
          'Incompleto. O principal critério para o escalonamento dos tempos mortos é dar tempo suficiente para a extinção do arco e desionização do ar, adequado à persistência provável da falta.',
      },
      {
        id: 'd',
        texto:
          'O tempo morto da segunda tentativa é menor porque o sistema já identificou que a primeira falha foi transitória, reduzindo a margem de segurança necessária.',
        feedback:
          'Incorreto. É o contrário: tempos mortos aumentam a cada tentativa subsequente, justamente porque a persistência da falta após a primeira tentativa sugere um defeito potencialmente mais duradouro.',
      },
    ],
    explicacao:
      'O escalonamento dos tempos mortos em esquemas de múltiplos religamentos (F.79) equilibra velocidade de recomposição para defeitos transitórios curtos com segurança adicional (maior tempo para desionização do arco) caso a falta persista nas tentativas seguintes.',
    checklist: [
      'Verificar ciclo do 79.',
      'Registrar tentativa com sucesso ou bloqueio.',
      'Verificar se houve novo trip.',
      'Não forçar religamento.',
      'Comunicar o despacho.',
    ],
  },
  {
    id: 9,
    modulo: 'Religamento automático',
    ordem: 9,
    area: 'Religamento automático',
    titulo: 'Chave F.43R fora da posição automática',
    nivel: 'Alto',
    rele: 'F.43R / F.79',
    equipamento: 'Disjuntor 138 kV',
    competencia: 'Verificar permissivos e seleção de religamento antes de suspeitar do relé.',
    tempoEstimado: '3 min',
    pontosCriticos: [
      'Conferir posição da F.43R.',
      'Verificar permissivos do comando automático.',
      'Evitar fechamento manual sem autorização.',
    ],
    alarme: 'Religamento não executado',
    descricao:
      'O esquema recebeu condição para religamento, mas o disjuntor não religou automaticamente.',
    pergunta:
      'O disjuntor não religou automaticamente mesmo com o esquema de religamento habilitado. Antes de suspeitar de falha no relé 79, por que a verificação da chave seletora F.43R deve ter prioridade na investigação?',
    respostaCorretaId: 'a',
    alternativas: [
      {
        id: 'a',
        texto:
          'A F.43R define o modo de operação selecionado (automático, manual ou desligado) e funciona como permissivo de entrada para o comando de fechamento do 79; se estiver fora da posição automática, o relé pode estar funcionando corretamente, mas sem receber a permissão necessária para fechar.',
        feedback:
          'Correto. A chave seletora é um permissivo lógico anterior ao comando do 79; verificar sua posição evita diagnósticos equivocados de falha do relé.',
      },
      {
        id: 'b',
        texto:
          'A F.43R apenas sinaliza visualmente a posição do disjuntor no painel, sem qualquer influência lógica sobre o comando de religamento automático.',
        feedback:
          'Incorreto. A F.43R é um permissivo funcional que habilita ou bloqueia o comando automático, não apenas uma sinalização visual.',
      },
      {
        id: 'c',
        texto:
          'Verificar a F.43R só é relevante depois de confirmado defeito interno no relé 79, já que ambos operam de forma totalmente independente.',
        feedback:
          'Incorreto. Justamente por não serem independentes — a F.43R condiciona o comando do 79 — a verificação deve ocorrer antes de suspeitar do relé.',
      },
      {
        id: 'd',
        texto:
          'A posição da F.43R influencia apenas o tempo morto do religamento, não a permissão para o comando de fechamento.',
        feedback:
          'Incorreto. A função da F.43R está relacionada à seleção/habilitação do modo de religamento, não à temporização do tempo morto.',
      },
    ],
    explicacao:
      'A chave seletora F.43R atua como permissivo lógico: define se o comando automático do 79 está habilitado a fechar o disjuntor. Uma posição incorreta bloqueia o religamento mesmo com o relé 79 funcionando normalmente, por isso deve ser verificada antes de suspeitar de falha do relé.',
    checklist: [
      'Conferir F.43R.',
      'Conferir 43AB/43T quando existir.',
      'Verificar permissivos.',
      'Verificar bobina de fechamento.',
      'Comunicar o despacho.',
    ],
  },
  {
    id: 10,
    modulo: 'Proteção de barra',
    ordem: 10,
    area: 'Barra 13,8 kV',
    titulo: 'Proteção de barra tipo terra isolada',
    nivel: 'Crítico',
    rele: 'F.64 / F.67G / F.2 / F.86-3',
    equipamento: 'Blindada 13,8 kV',
    competencia: 'Identificar os elementos do esquema seletivo de proteção de barra.',
    tempoEstimado: '3 min',
    pontosCriticos: [
      'F.64 e F.67G detectam/selecionam a falta.',
      'F.2 temporiza a lógica.',
      'F.86-3 bloqueia/abre a seção.',
    ],
    alarme: 'Possível defeito no barramento',
    descricao:
      'A blindada possui proteção de barra por terra isolada com F.64, F.67G, temporizador F.2 e auxiliar F.86-3.',
    pergunta:
      'No esquema seletivo de proteção de barra por terra isolada (F.64, F.67G, F.2 e F.86-3), qual é o papel específico do temporizador F.2 dentro da lógica de atuação?',
    respostaCorretaId: 'a',
    alternativas: [
      {
        id: 'a',
        texto:
          'O F.2 introduz um retardo deliberado entre a detecção da falta pelos elementos de terra (F.64/F.67G) e o comando de bloqueio/abertura pelo F.86-3, dando tempo às proteções de nível inferior (como as dos alimentadores) para eliminar faltas externas antes que a barra seja desenergizada.',
        feedback:
          'Correto. A temporização do F.2 é o que garante seletividade: só se a falta persistir além desse tempo é que a barra é considerada realmente afetada.',
      },
      {
        id: 'b',
        texto:
          'O F.2 mede diretamente a corrente diferencial da barra e substitui a função dos relés F.64 e F.67G na detecção da falta.',
        feedback:
          'Incorreto. O F.2 é um elemento de temporização, não de medição de corrente; a detecção é feita pelos relés F.64 e F.67G.',
      },
      {
        id: 'c',
        texto:
          'O F.2 existe apenas para registrar o horário da atuação, sem qualquer influência sobre o tempo até o comando de abertura da seção de barra.',
        feedback:
          'Incorreto. O F.2 introduz um retardo funcional na lógica de atuação, não apenas um registro de horário.',
      },
      {
        id: 'd',
        texto:
          'A função do F.2 é acelerar a atuação do F.86-3 sempre que os relés F.64 ou F.67G forem sensibilizados, eliminando qualquer necessidade de seletividade com os alimentadores.',
        feedback:
          'Incorreto. O objetivo do F.2 é justamente o oposto: retardar a atuação para preservar a seletividade com as proteções de nível inferior.',
      },
    ],
    explicacao:
      'No esquema seletivo de barra por terra isolada, o F.2 temporiza a lógica entre a detecção (F.64/F.67G) e o comando de bloqueio/abertura (F.86-3), garantindo que as proteções dos alimentadores tenham prioridade para eliminar faltas externas antes que a seção de barra seja considerada realmente defeituosa.',
    checklist: [
      'Verificar F.64.',
      'Verificar F.67G.',
      'Verificar temporizador F.2.',
      'Verificar 86-3.',
      'Identificar seção da barra.',
    ],
  },
  {
    id: 11,
    modulo: 'Proteção de barra',
    ordem: 11,
    area: 'Barra 13,8 kV',
    titulo: 'Deficiência do F.64 com TSL na blindada',
    nivel: 'Alto',
    rele: 'F.64 / F.67G',
    equipamento: 'TSL dentro da blindada',
    competencia: 'Entender o uso do F.67G para melhorar seletividade em arranjos com TSL.',
    tempoEstimado: '3 min',
    pontosCriticos: [
      'Defeitos na baixa do TSL podem sensibilizar o F.64.',
      'F.67G melhora a seletividade.',
      'Evitar desenergização indevida da seção de barra.',
    ],
    alarme: 'Risco de atuação indevida do F.64',
    descricao:
      'Em algumas configurações, defeito monofásico em circuito de baixa do TSL pode sensibilizar o F.64.',
    pergunta:
      'Em arranjos com TSL (transformador de serviço local) dentro da blindada, um defeito monofásico no circuito de baixa tensão do TSL pode sensibilizar indevidamente o F.64. Por que a adição do F.67G, um relé de sobrecorrente direcional de terra, resolve esse problema de seletividade?',
    respostaCorretaId: 'a',
    alternativas: [
      {
        id: 'a',
        texto:
          'O F.67G verifica não apenas a magnitude da corrente de terra, mas também o sentido do fluxo de potência; isso permite diferenciar uma falta real dentro da zona da barra de uma corrente de terra originada no circuito de baixa do TSL, que flui em sentido oposto ao de uma falta interna.',
        feedback:
          'Correto. A informação direcional é o que possibilita distinguir a origem da corrente de terra, algo que um elemento não direcional como o F.64 sozinho não consegue fazer.',
      },
      {
        id: 'b',
        texto:
          'O F.67G substitui completamente o F.64, eliminando a necessidade de qualquer elemento de sobrecorrente de terra não direcional no esquema.',
        feedback:
          'Incorreto. O F.67G complementa o F.64 adicionando a informação direcional; não o substitui na lógica seletiva.',
      },
      {
        id: 'c',
        texto:
          'A direcionalidade do F.67G serve para aumentar a sensibilidade de detecção de correntes de terra, mas não tem relação com a origem ou o sentido da corrente.',
        feedback:
          'Incorreto. A principal contribuição do F.67G é justamente identificar o sentido do fluxo de corrente, não apenas aumentar sensibilidade.',
      },
      {
        id: 'd',
        texto:
          'O F.67G foi adicionado para eliminar completamente a corrente de terra gerada pelo TSL, impedindo fisicamente sua circulação pelo circuito de baixa.',
        feedback:
          'Incorreto. O relé não atua sobre a origem física da corrente; ele apenas discrimina, pela direção do fluxo, se a falta está dentro ou fora da zona protegida.',
      },
    ],
    explicacao:
      'Elementos de sobrecorrente de terra não direcionais (como o F.64) não conseguem distinguir a origem de uma corrente de terra. O F.67G, ao considerar o sentido do fluxo de potência, permite diferenciar uma falta real na barra de uma corrente originada no circuito de baixa tensão do TSL, evitando desenergização indevida da seção.',
    checklist: [
      'Verificar se o TSL está na blindada.',
      'Avaliar atuação do F.64.',
      'Avaliar F.67G.',
      'Confirmar seletividade.',
      'Comunicar o despacho.',
    ],
  },
  {
    id: 12,
    modulo: 'Proteção de barra',
    ordem: 12,
    area: 'Barra 13,8 kV',
    titulo: 'Defeito real no barramento 13,8 kV',
    nivel: 'Crítico',
    rele: 'F.64 / F.67G / F.86-3',
    equipamento: 'Barramento blindado 13,8 kV',
    competencia: 'Aplicar procedimento seguro diante de defeito interno em barramento.',
    tempoEstimado: '3 min',
    pontosCriticos: [
      'Manter a seção isolada.',
      'Inspecionar a blindada.',
      'Energizar somente após liberação.',
    ],
    alarme: 'Proteção de barra atuada',
    descricao:
      'A proteção indica defeito interno na seção da barra de 13,8 kV.',
    pergunta:
      'Após a atuação da proteção de barra, a tensão nos alimentadores adjacentes aparenta estar normal. Do ponto de vista de segurança operacional, por que essa observação isolada não é suficiente para descartar defeito real na seção protegida?',
    respostaCorretaId: 'a',
    alternativas: [
      {
        id: 'a',
        texto:
          'Tensão aparentemente normal em circuitos adjacentes não garante ausência de defeito na seção isolada, pois a proteção já desenergizou a seção afetada; a normalidade em outros pontos reflete apenas que o defeito foi confinado pela proteção, não que ele deixou de existir fisicamente no barramento.',
        feedback:
          'Correto. A proteção isolou a seção justamente para conter o defeito; a tensão normal alhures é consequência do isolamento, não prova de que não houve falha física.',
      },
      {
        id: 'b',
        texto:
          'Se a tensão está normal, a atuação da proteção foi necessariamente indevida, e a seção pode ser reenergizada assim que o bloqueio 86-3 for rearmado.',
        feedback:
          'Inseguro. Presumir atuação indevida sem inspeção física da blindada é uma conclusão precipitada e perigosa.',
      },
      {
        id: 'c',
        texto:
          'A tensão normal comprova que o defeito ocorreu exclusivamente nos TCs de medição, dispensando qualquer inspeção do compartimento da blindada.',
        feedback:
          'Incorreto. Não há evidência suficiente para atribuir a causa exclusivamente aos TCs sem inspeção física.',
      },
      {
        id: 'd',
        texto:
          'A observação da tensão substitui a necessidade de verificar odor, ruído ou marcas de arco elétrico durante a inspeção da blindada.',
        feedback:
          'Incorreto. A inspeção física (odor, ruído, marcas de arco) continua sendo indispensável, independentemente da leitura de tensão em pontos adjacentes.',
      },
    ],
    explicacao:
      'A atuação da proteção de barra isola a seção defeituosa, o que pode fazer a tensão nos demais pontos parecer normal — isso é consequência da própria atuação, não prova de ausência de defeito. A liberação só deve ocorrer após inspeção física completa da blindada e identificação da causa.',
    checklist: [
      'Confirmar seção isolada.',
      'Inspecionar cubículos.',
      'Verificar odor, ruído ou marcas de arco.',
      'Registrar relés.',
      'Comunicar o despacho.',
    ],
  },
  {
    id: 13,
    modulo: 'Proteção diferencial de barras',
    ordem: 13,
    area: 'Diferencial de barras',
    titulo: 'Diferencial de barras não deve atuar para defeito externo',
    nivel: 'Alto',
    rele: '87B / 87BN',
    equipamento: 'Barra 13,8 kV',
    competencia: 'Distinguir faltas internas e externas à zona diferencial da barra.',
    tempoEstimado: '3 min',
    pontosCriticos: [
      'Confirmar a zona protegida.',
      'Verificar TCs exclusivos da proteção.',
      'Registrar atuação indevida, se houver.',
    ],
    alarme: 'Defeito fora da zona protegida',
    descricao:
      'O defeito ocorreu fora da zona de proteção diferencial da barra.',
    pergunta:
      'Para um defeito externo à zona diferencial, o esquema 87B/87BN deve, em condições normais, permanecer estável. No entanto, defeitos externos de alta magnitude podem gerar saturação assimétrica dos TCs de um dos terminais, criando uma corrente diferencial espúria. Como o esquema de proteção diferencial de barras trata esse risco?',
    respostaCorretaId: 'a',
    alternativas: [
      {
        id: 'a',
        texto:
          'Esquemas modernos de 87B/87BN utilizam restrição percentual (comparando a corrente diferencial com a corrente de restrição/através) e, em muitos casos, elementos adicionais de bloqueio por saturação, tornando o relé mais tolerante a erros de TC em faltas externas de alta corrente, sem perder sensibilidade a faltas internas reais.',
        feedback:
          'Correto. A restrição percentual (e/ou bloqueio por saturação) é o mecanismo que permite ao 87B/87BN permanecer estável mesmo diante de erro de TC causado por defeito externo severo.',
      },
      {
        id: 'b',
        texto:
          'A proteção diferencial de barras não possui nenhum mecanismo para lidar com saturação de TC; qualquer erro de medição em falta externa provoca atuação indevida inevitável.',
        feedback:
          'Incorreto. Esquemas modernos incorporam restrição percentual ou lógicas de bloqueio por saturação exatamente para mitigar esse risco.',
      },
      {
        id: 'c',
        texto:
          'A saturação de TC em falta externa é irrelevante para a proteção diferencial de barras, pois essa proteção não depende da qualidade da medição de corrente dos TCs.',
        feedback:
          'Incorreto. A proteção diferencial depende diretamente da precisão da medição de corrente dos TCs; a saturação é uma preocupação real de projeto e ajuste.',
      },
      {
        id: 'd',
        texto:
          'O problema de saturação de TC é resolvido exclusivamente pela troca do relé por um de tecnologia eletromecânica, que não sofre esse tipo de erro de medição.',
        feedback:
          'Incorreto. Relés eletromecânicos não são imunes à saturação de TC; a mitigação vem da lógica de restrição/bloqueio do esquema de proteção, não da tecnologia do relé em si.',
      },
    ],
    explicacao:
      'Faltas externas de alta magnitude podem saturar assimetricamente os TCs de um terminal, gerando uma corrente diferencial aparente mesmo sem falta real na zona protegida. Esquemas de 87B/87BN mitigam esse risco com restrição percentual e, em muitos casos, elementos adicionais de bloqueio por saturação, preservando estabilidade sem perder sensibilidade a faltas internas.',
    checklist: [
      'Confirmar zona protegida.',
      'Verificar TCs exclusivos da proteção.',
      'Identificar ponto do defeito.',
      'Confirmar se houve atuação indevida.',
      'Registrar ocorrência.',
    ],
  },
  {
    id: 14,
    modulo: 'Proteção diferencial de barras',
    ordem: 14,
    area: 'Diferencial de barras',
    titulo: 'TCs exclusivos da proteção diferencial de barras',
    nivel: 'Médio',
    rele: '87B',
    equipamento: 'Blindada 13,8 kV',
    competencia: 'Reconhecer a função dos TCs exclusivos na delimitação da zona diferencial.',
    tempoEstimado: '2 min',
    pontosCriticos: [
      'TCs delimitam a zona protegida.',
      'Exclusividade ajuda na seletividade.',
      'Circuito de corrente deve ser conferido.',
    ],
    alarme: 'Análise de circuito de corrente',
    descricao:
      'A proteção diferencial de barras utiliza TCs específicos para delimitar sua zona de atuação.',
    pergunta:
      'Por que a proteção diferencial de barras (87B) normalmente utiliza núcleos de TC exclusivos, em vez de compartilhar os mesmos núcleos usados pelas proteções de sobrecorrente dos alimentadores?',
    respostaCorretaId: 'a',
    alternativas: [
      {
        id: 'a',
        texto:
          'Núcleos exclusivos evitam que o burden adicional de outras proteções e medições influencie a precisão e a resposta transitória dos TCs usados no esquema diferencial, além de manter a zona de proteção claramente delimitada pelos pontos exatos onde os TCs estão instalados.',
        feedback:
          'Correto. A exclusividade preserva a precisão de medição necessária para a comparação diferencial e define com clareza os limites físicos da zona protegida.',
      },
      {
        id: 'b',
        texto:
          'O compartilhamento de núcleos entre proteções é fisicamente impossível, já que cada TC só pode alimentar um único relé de qualquer tipo.',
        feedback:
          'Incorreto. Um TC pode ter múltiplos enrolamentos secundários; o motivo da exclusividade é de precisão e delimitação de zona, não impossibilidade física.',
      },
      {
        id: 'c',
        texto:
          'Núcleos exclusivos são usados apenas por tradição de projeto, sem qualquer diferença técnica de desempenho em relação ao compartilhamento com outras proteções.',
        feedback:
          'Incorreto. Há razões técnicas concretas (burden, precisão, delimitação de zona) para a exclusividade, não apenas convenção.',
      },
      {
        id: 'd',
        texto:
          'A exclusividade dos TCs existe para permitir que a proteção diferencial de barras opere sem qualquer necessidade de calibração de relação de transformação entre os terminais.',
        feedback:
          'Incorreto. A calibração e compatibilidade de relação de transformação entre os TCs dos diferentes terminais continua sendo necessária, exclusivos ou não.',
      },
    ],
    explicacao:
      'TCs exclusivos para o esquema diferencial de barras reduzem o burden compartilhado com outras proteções, preservam a precisão de medição necessária para a comparação diferencial e delimitam claramente os pontos que definem a zona protegida — fatores essenciais para a estabilidade e sensibilidade do 87B.',
    checklist: [
      'Identificar TCs da proteção.',
      'Conferir circuito de corrente.',
      'Verificar zona protegida.',
      'Verificar atuação diferencial.',
      'Registrar anormalidades.',
    ],
  },
  {
    id: 15,
    modulo: 'Comando e sinalização',
    ordem: 15,
    area: 'Comando e sinalização',
    titulo: 'Lâmpada vermelha permanece acesa com disjuntor aberto',
    nivel: 'Médio',
    rele: '52a / 52b / sinalização',
    equipamento: 'Disjuntor de alimentador',
    competencia: 'Investigar indicação incoerente de posição em circuito de comando e sinalização.',
    tempoEstimado: '2 min',
    pontosCriticos: [
      'Confirmar posição mecânica.',
      'Verificar contatos auxiliares 52a/52b.',
      'Registrar anomalia de sinalização.',
    ],
    alarme: 'Indicação incoerente de posição',
    descricao:
      'Após desarme, a lâmpada vermelha de fechado não apagou, mesmo com o disjuntor aberto.',
    pergunta:
      'A lâmpada vermelha (indicação de fechado) permanece acesa mesmo após o disjuntor abrir corretamente. Considerando que essa lâmpada normalmente é alimentada através do contato 52a (que replica a posição do disjuntor), qual hipótese técnica melhor explica essa indicação incoerente?',
    respostaCorretaId: 'a',
    alternativas: [
      {
        id: 'a',
        texto:
          'O contato 52a pode estar mecanicamente preso na posição fechada (não acompanhando a abertura real do disjuntor) ou pode haver um desvio no circuito de sinalização que mantém a lâmpada energizada; ambas as hipóteses exigem verificação do contato auxiliar e do circuito de sinalização antes de confiar na indicação.',
        feedback:
          'Correto. Como a lâmpada vermelha depende do 52a, tanto uma falha mecânica do contato quanto um defeito elétrico no circuito de sinalização podem gerar essa indicação incoerente.',
      },
      {
        id: 'b',
        texto:
          'A indicação incoerente só pode ser causada por defeito no contato 52b, já que esse contato é o único responsável pela lâmpada vermelha de posição fechada.',
        feedback:
          'Incorreto. A lâmpada vermelha (fechado) tipicamente depende do 52a, não do 52b (associado à lâmpada verde, de aberto); atribuir a causa ao 52b inverte a lógica dos contatos auxiliares.',
      },
      {
        id: 'c',
        texto:
          'Lâmpadas de sinalização de posição não dependem de contatos auxiliares do disjuntor, sendo alimentadas diretamente por um sensor de tensão da linha.',
        feedback:
          'Incorreto. A sinalização convencional de posição (vermelha/verde) depende dos contatos auxiliares 52a/52b, refletindo mecanicamente a posição do disjuntor.',
      },
      {
        id: 'd',
        texto:
          'Essa indicação incoerente é esperada sempre que houver religamento automático habilitado, não representando uma anomalia a ser investigada.',
        feedback:
          'Incorreto. A indicação incoerente é uma anomalia real que precisa ser investigada, independentemente da configuração do religamento automático.',
      },
    ],
    explicacao:
      'A lâmpada vermelha de posição fechada normalmente é alimentada através do contato auxiliar 52a, que replica mecanicamente o estado do disjuntor. Uma indicação incoerente após abertura real do disjuntor aponta para falha mecânica do 52a ou defeito no circuito de sinalização, não para o 52b (associado à lâmpada verde) nem para causas elétricas de proteção como o 87T.',
    checklist: [
      'Confirmar posição mecânica.',
      'Verificar indicação elétrica.',
      'Checar 52a/52b.',
      'Registrar anomalia.',
      'Comunicar manutenção.',
    ],
  },
  {
    id: 16,
    modulo: 'Sistema elétrico',
    ordem: 16,
    area: 'Sistema elétrico',
    titulo: 'Subfrequência no sistema',
    nivel: 'Crítico',
    rele: '81U',
    equipamento: 'Sistema elétrico',
    competencia: 'Adotar conduta segura durante evento de subfrequência sistêmica.',
    tempoEstimado: '3 min',
    pontosCriticos: [
      'Monitorar a frequência.',
      'Não religar cargas sem autorização.',
      'Aguardar estabilização e orientação do despacho.',
    ],
    alarme: 'Frequência abaixo do limite',
    descricao:
      'A frequência do sistema caiu abaixo do valor operacional aceitável.',
    pergunta:
      'Durante um evento de subfrequência, esquemas de corte automático de carga (81U) atuam em estágios escalonados por faixas de frequência. Por que essa atuação em estágios, em vez de um corte único e total, é tecnicamente preferível para a recuperação do sistema?',
    respostaCorretaId: 'a',
    alternativas: [
      {
        id: 'a',
        texto:
          'O corte escalonado retira apenas a quantidade de carga necessária em cada faixa de frequência para conter a queda e permitir a recuperação, evitando tanto a continuidade do colapso (corte insuficiente) quanto uma sobre-elevação de frequência por corte excessivo, também prejudicial ao sistema.',
        feedback:
          'Correto. O escalonamento busca o equilíbrio entre conter a subfrequência e não gerar sobrecorreção, que criaria um novo desequilíbrio (sobrefrequência) no sistema.',
      },
      {
        id: 'b',
        texto:
          'O corte escalonado existe apenas para simplificar a operação da subestação, sem qualquer relação com o comportamento da frequência do sistema após a atuação.',
        feedback:
          'Incorreto. O critério de escalonamento está diretamente relacionado ao comportamento da frequência e à necessidade de equilíbrio entre geração e carga.',
      },
      {
        id: 'c',
        texto:
          'Um corte único e total de toda a carga seria sempre a solução mais segura, pois eliminaria completamente qualquer risco de nova subfrequência no sistema.',
        feedback:
          'Incorreto. Um corte total e desnecessário pode gerar sobrefrequência e outros problemas de estabilidade, sem ser proporcional à real necessidade de alívio.',
      },
      {
        id: 'd',
        texto:
          'A atuação em estágios serve exclusivamente para proteger fisicamente os relés 81U contra sobrecarga de contatos, sem relação com a estabilidade do sistema elétrico.',
        feedback:
          'Incorreto. O objetivo do escalonamento é o equilíbrio entre carga e geração, não a proteção física dos contatos do relé.',
      },
    ],
    explicacao:
      'O corte de carga por subfrequência é escalonado em estágios de frequência justamente para retirar apenas a carga necessária em cada faixa, equilibrando a contenção da queda de frequência com o risco de sobrecorreção. Por isso, após a atuação, não se deve religar cargas sem autorização: isso pode neutralizar o efeito do corte e agravar a instabilidade.',
    checklist: [
      'Monitorar frequência.',
      'Registrar alarmes.',
      'Evitar religamento de carga.',
      'Aguardar estabilização.',
      'Comunicar o despacho.',
    ],
  },
  {
    id: 17,
    modulo: 'Proteção de transformadores',
    ordem: 17,
    area: 'Transformadores',
    titulo: 'Atuação do 86-1 do TR1 na blindada de 13 kV',
    nivel: 'Alto',
    rele: '86-1',
    equipamento: 'Transformador TR1',
    competencia: 'Interpretar bloqueio do TR1, disparo cruzado e recomposição automática das seções saudáveis.',
    tempoEstimado: '5 min',
    pontosCriticos: [
      'TR1 permanece isolado e bloqueado.',
      'Disparo cruzado abre o disjuntor correspondente do TR2.',
      'Junções automáticas redistribuem carga entre TR2 e TR3.',
    ],
    alarme: 'Atuação do relé de bloqueio 86-1 do TR1 na blindada de 13 kV',
    descricao:
      'O relé de bloqueio 86-1 do TR1 atuou na blindada de 13 kV, em um esquema em linha com disparo cruzado.',
    pergunta:
      'O relé de bloqueio 86-1 do TR1 atuou na blindada de 13 kV, em um esquema em linha com disparo cruzado. Além de isolar o TR1, por que esse esquema também comanda a abertura do disjuntor geral correspondente do TR2, mesmo o defeito sendo exclusivo do TR1, e como o automatismo restabelece as seções saudáveis?',
    imagem: {
      src: diagramaUrg861Tr1,
      alt: 'Diagrama da URG após atuação do relé 86-1 do TR1',
      legenda: 'Diagrama da URG após atuação do relé 86-1 do TR1',
    },
    respostaCorretaId: 'a',
    alternativas: [
      {
        id: 'a',
        texto:
          'Em arranjo em linha, a seção de barra entre os disjuntores gerais de TR1 e TR2 pode continuar recebendo contribuição de falta do TR2; o disparo cruzado abre o disjuntor correspondente do TR2 para eliminar essa contribuição remanescente. Em seguida, com os disjuntores de junção em automático, o sistema fecha as junções necessárias, redistribuindo a carga entre TR2 e TR3, enquanto o TR1 permanece isolado e bloqueado.',
        feedback:
          'Correto. O disparo cruzado existe para eliminar a contribuição de outra fonte (TR2) para a mesma seção de barra afetada, e o automatismo de junções recompõe as seções saudáveis sem religar o TR1.',
      },
      {
        id: 'b',
        texto:
          'Todos os disjuntores da subestação permanecem abertos e nenhuma transferência automática de carga acontece, pois o disparo cruzado tem como único efeito duplicar o registro do evento na URG.',
        feedback:
          'Incorreto. O disparo cruzado tem função elétrica real (eliminar contribuição de falta), e o automatismo de junções recompõe as seções saudáveis.',
      },
      {
        id: 'c',
        texto:
          'O TR1 é religado automaticamente pelo relé 86-1 assim que o disjuntor correspondente do TR2 abre, dispensando inspeção ou liberação operacional.',
        feedback:
          'Inseguro. O 86-1 bloqueia e isola o TR1; não há religamento automático do transformador afetado, independentemente da atuação no TR2.',
      },
      {
        id: 'd',
        texto:
          'O disparo cruzado abre o disjuntor do TR2 apenas como medida preventiva de manutenção programada, sem qualquer relação com a eliminação da falta que afetou o TR1.',
        feedback:
          'Incorreto. O disparo cruzado é uma ação de proteção em tempo real relacionada à eliminação da contribuição de falta, não uma medida de manutenção.',
      },
    ],
    explicacao:
      'O disparo cruzado existe porque, em arranjo em linha, a seção de barra pode continuar recebendo contribuição de falta do TR2 mesmo após o TR1 ser isolado; abrir o disjuntor correspondente do TR2 elimina essa contribuição remanescente. O TR1 permanece bloqueado e isolado — não há religamento automático —, enquanto os disjuntores de junção em automático recompõem as seções saudáveis, redistribuindo a carga entre TR2 e TR3.',
    explicacaoDetalhada: [
      {
        titulo: 'Condição encontrada na URG:',
        itens: [
          'TR1 isolado após a atuação da proteção.',
          'Disjuntor correspondente do TR2 também aberto, por disparo cruzado.',
          'A carga é transferida automaticamente para os transformadores disponíveis.',
        ],
      },
      {
        titulo: 'Resultado da atuação:',
        texto:
          'O relé 86-1 bloqueia e isola o TR1. O disparo cruzado abre o disjuntor correspondente do TR2 para eliminar a contribuição remanescente de corrente de falta pela mesma seção de barra. O transformador afetado (TR1) não é religado automaticamente. Com os disjuntores de junção em automático, o sistema identifica a abertura dos disjuntores gerais e fecha as junções necessárias para restabelecer as seções saudáveis e redistribuir a carga entre o TR2 e o TR3.',
      },
    ],
    checklist: [
      'Confirmar a atuação do 86-1.',
      'Verificar os disjuntores gerais abertos.',
      'Confirmar a abertura da seccionadora motorizada do TR1.',
      'Verificar o disparo cruzado.',
      'Confirmar o fechamento automático das junções.',
      'Verificar a transferência de carga para o TR2 e o TR3.',
      'Manter o TR1 bloqueado e isolado.',
      'Comunicar o despacho e aguardar orientação operacional.',
    ],
  },
];
