export const messages = {
  en: {
    title: 'RepoRelief — Less upkeep. More shipping.', description: 'Turn repository maintenance into an evidence-based action plan. Try an interactive example before opening a local folder.',
    skip: 'Skip to the workbench', navigation: 'Main navigation', language: 'Language', source: 'Source ↗', support: 'Support',
    eyebrow: 'THE MAINTENANCE WORKBENCH / v1.0', headline1: 'Less upkeep.', headline2: 'More shipping.', intro: 'Turn “I’ll document it later” into a concrete plan. Find the gaps, inspect the evidence and pick your next move.',
    runDemo: 'Run sample audit ↗', openFolder: 'Open local folder', privacy: 'Try the example first. Local files stay in your browser. No account, API key or AI service.',
    workbenchLabel: 'Maintenance workbench', workbench: 'WORKBENCH', sampleMode: 'INTERACTIVE SAMPLE', localMode: 'LOCAL FOLDER', localEngine: '● LOCAL ENGINE',
    demoEyebrow: 'TRY IT BEFORE OPENING A FOLDER', demoTitle: 'A small repo. Real audit rules.', demoIntro: 'Explore this fictional repository, inspect its findings, then change the example and watch the maintenance queue update.',
    restart: 'Restart demo ↺', guide1: 'Inspect a finding and its file evidence.', guide2: 'Apply a sample change to the in-memory files.', guide3: 'Compare the remaining findings or export the plan.',
    exampleFiles: 'Inspect the example files', selectFile: 'Choose an example file', fileContents: 'Sample file contents', sampleNote: 'Fictional source files are shown in their original English. They stay in memory and are never executed.',
    tryChanges: 'Try a change', ready: 'Ready to inspect your own repository? Select a local folder whenever you want.',
    queue: 'Maintenance queue', priority: 'Priority', all: 'All findings', high: 'High', medium: 'Medium', low: 'Low', rerun: 'Run audit again', export: 'Export plan ↓',
    limitsTitle: 'What this audit can tell you', limitsBody: 'Static rules detect missing relative Markdown targets with source lines, README sections, workflow and license files, large modules, maintenance markers and matching test filenames. This is not measured test coverage or semantic dependency analysis. Generated plans need maintainer review.',
    terminal: 'BUILT FOR YOUR TERMINAL TOO', terminal1: 'One command.', terminal2: 'A smaller backlog.', cliComment: '# JSON output or a review checklist', credits: 'Open source. MIT licensed. Built by', motto: 'Evidence over guesswork.',
    files: 'Files', sourceFiles: 'Source files', testFiles: 'Test files', findings: 'Findings', status: '{count} of {total} findings shown. Heuristics only; review evidence before acting.',
    apply: 'Apply example change', applied: 'Applied', inspect: 'Inspect example evidence', progress: '{done}/{steps} changes applied · {before} initial findings → {after} remaining.',
    completed: 'No findings match the current rules in this example. This does not prove correctness or test coverage.', noFiltered: 'No findings at this priority. Choose another filter.', noFindings: 'No findings matched the supplied files. Review the audit limits before drawing conclusions.',
    'fix.docs.title': 'Restore the guide and document testing', 'fix.docs.detail': 'Add docs/setup.md and README instructions. Recheck the broken link and missing section.',
    'fix.tests.title': 'Add a matching billing test file', 'fix.tests.detail': 'Demonstrate filename matching. Tests are not executed and coverage is not measured.',
    'fix.ci.title': 'Add a checks workflow', 'fix.ci.detail': 'Add an example GitHub Actions file. The audit checks its presence, not whether CI passes.',
    'fix.license.title': 'Add an example MIT license', 'fix.license.detail': 'Demonstrate the root license check. Choosing a real project’s license still needs maintainer review.',
    'fix.markers.title': 'Track the maintenance marker', 'fix.markers.detail': 'Replace the marker with an example issue reference. This changes the signal; it does not implement payment handling.',
    reading: 'Reading local files…', tooMany: 'Choose a smaller folder (10,000 files maximum).', tooLarge: 'Choose a smaller folder (20 MB maximum).', readError: 'Could not read the folder. Try selecting it again.', noText: 'No supported text files were found in that folder.',
    auditAgain: 'Audit updated. {count} findings remain.', changeApplied: 'Example change applied. {before} → {after} findings.',
    planTitle: '# RepoRelief maintenance plan', planSummary: '{files} files · {sourceFiles} source files · {testFiles} test files · {findings} findings', changeReview: 'Change review', relatedTests: 'Related tests (filename and directory heuristic):', noRelatedTests: 'No related tests identified.', limits: 'Limits', downloadName: 'reporelief-plan.md'
  },
  'pt-BR': {
    title: 'RepoRelief — Menos manutenção pendente. Mais entregas.', description: 'Transforme a manutenção do repositório em um plano com evidências. Experimente uma demonstração interativa antes de abrir uma pasta local.',
    skip: 'Ir para a bancada', navigation: 'Navegação principal', language: 'Idioma', source: 'Código-fonte ↗', support: 'Apoiar',
    eyebrow: 'BANCADA DE MANUTENÇÃO / v1.0', headline1: 'Menos pendências.', headline2: 'Mais entregas.', intro: 'Transforme “depois eu documento” em um plano concreto. Encontre lacunas, inspecione as evidências e escolha a próxima ação.',
    runDemo: 'Executar auditoria de exemplo ↗', openFolder: 'Abrir pasta local', privacy: 'Experimente o exemplo primeiro. Os arquivos locais ficam no navegador. Sem cadastro, chave de API ou serviço de IA.',
    workbenchLabel: 'Bancada de manutenção', workbench: 'BANCADA', sampleMode: 'EXEMPLO INTERATIVO', localMode: 'PASTA LOCAL', localEngine: '● ANÁLISE LOCAL',
    demoEyebrow: 'EXPERIMENTE ANTES DE ABRIR UMA PASTA', demoTitle: 'Um pequeno repositório. Regras reais de análise.', demoIntro: 'Explore este repositório fictício, inspecione os achados, altere o exemplo e acompanhe a atualização da fila de manutenção.',
    restart: 'Reiniciar demonstração ↺', guide1: 'Inspecione um achado e as evidências nos arquivos.', guide2: 'Aplique uma alteração nos arquivos do exemplo em memória.', guide3: 'Compare os achados restantes ou exporte o plano.',
    exampleFiles: 'Inspecione os arquivos do exemplo', selectFile: 'Escolher um arquivo do exemplo', fileContents: 'Conteúdo do arquivo de exemplo', sampleNote: 'Os arquivos fictícios são exibidos no inglês original. Ficam apenas em memória e nunca são executados.',
    tryChanges: 'Experimente uma alteração', ready: 'Pronto para analisar seu repositório? Selecione uma pasta local quando quiser.',
    queue: 'Fila de manutenção', priority: 'Prioridade', all: 'Todos os achados', high: 'Alta', medium: 'Média', low: 'Baixa', rerun: 'Executar auditoria novamente', export: 'Exportar plano ↓',
    limitsTitle: 'O que esta auditoria pode identificar', limitsBody: 'Regras estáticas identificam destinos Markdown locais ausentes com linhas de origem, seções do README, arquivos de workflow e licença, módulos grandes, marcadores de manutenção e nomes de arquivos de teste correspondentes. A análise não mede cobertura de testes nem dependências semânticas. Os planos gerados precisam de revisão do mantenedor.',
    terminal: 'TAMBÉM FUNCIONA NO TERMINAL', terminal1: 'Um comando.', terminal2: 'Menos pendências.', cliComment: '# Saída JSON ou checklist de revisão', credits: 'Código aberto. Licença MIT. Criado por', motto: 'Evidências em vez de suposições.',
    files: 'Arquivos', sourceFiles: 'Arquivos de código', testFiles: 'Arquivos de teste', findings: 'Achados', status: '{count} de {total} achados exibidos. Análise heurística: revise as evidências antes de agir.',
    apply: 'Aplicar alteração no exemplo', applied: 'Aplicada', inspect: 'Inspecionar evidência do exemplo', progress: '{done}/{steps} alterações aplicadas · {before} achados iniciais → {after} restantes.',
    completed: 'Nenhum achado corresponde às regras atuais neste exemplo. Isso não comprova correção nem cobertura de testes.', noFiltered: 'Nenhum achado nesta prioridade. Escolha outro filtro.', noFindings: 'Nenhum achado corresponde aos arquivos fornecidos. Consulte os limites da análise antes de tirar conclusões.',
    'fix.docs.title': 'Restaurar o guia e documentar os testes', 'fix.docs.detail': 'Adiciona docs/setup.md e instruções ao README. Verifica novamente o link quebrado e a seção ausente.',
    'fix.tests.title': 'Adicionar um teste com nome correspondente', 'fix.tests.detail': 'Demonstra a correspondência de nomes. Os testes não são executados e a cobertura não é medida.',
    'fix.ci.title': 'Adicionar um workflow de verificação', 'fix.ci.detail': 'Adiciona um exemplo de GitHub Actions. A auditoria verifica a presença do arquivo, não se o CI passa.',
    'fix.license.title': 'Adicionar uma licença MIT de exemplo', 'fix.license.detail': 'Demonstra a verificação de licença na raiz. A licença de um projeto real ainda precisa ser escolhida pelo mantenedor.',
    'fix.markers.title': 'Registrar o marcador de manutenção', 'fix.markers.detail': 'Substitui o marcador por uma referência fictícia de issue. Isso altera o sinal, sem implementar o tratamento de pagamentos.',
    reading: 'Lendo arquivos locais…', tooMany: 'Escolha uma pasta menor (máximo de 10.000 arquivos).', tooLarge: 'Escolha uma pasta menor (máximo de 20 MB).', readError: 'Não foi possível ler a pasta. Tente selecioná-la novamente.', noText: 'Nenhum arquivo de texto compatível foi encontrado nesta pasta.',
    auditAgain: 'Auditoria atualizada. {count} achados restantes.', changeApplied: 'Alteração aplicada ao exemplo. {before} → {after} achados.',
    planTitle: '# Plano de manutenção RepoRelief', planSummary: '{files} arquivos · {sourceFiles} arquivos de código · {testFiles} arquivos de teste · {findings} achados', changeReview: 'Revisão de alterações', relatedTests: 'Testes relacionados (heurística de nomes e diretórios):', noRelatedTests: 'Nenhum teste relacionado identificado.', limits: 'Limites', downloadName: 'reporelief-plano.md'
  }
};
export function t(locale, key, variables = {}) {
  const value = (messages[locale] ?? messages.en)[key] ?? messages.en[key] ?? key;
  return value.replace(/\{(\w+)\}/g, (match, name) => String(variables[name] ?? match));
}
const reportText = {
  'Repair a missing local Markdown target': 'Corrigir um destino Markdown local ausente',
  'Restore the target or update the link relative to the source file directory. Only local path existence is checked.': 'Restaure o destino ou atualize o link em relação ao diretório do arquivo de origem. Apenas a existência do caminho local é verificada.',
  'Add a project entry point': 'Adicionar uma apresentação do projeto',
  'No root README found': 'Nenhum README encontrado na raiz',
  'Document purpose, setup, one runnable example and the test command.': 'Documente a finalidade, a instalação, um exemplo executável e o comando de testes.',
  'Document setup': 'Documentar a instalação', 'Document testing': 'Documentar os testes', 'Document usage': 'Documentar o uso',
  'Add a setup section with commands verified by a maintainer.': 'Adicione uma seção de instalação com comandos verificados pelo mantenedor.',
  'Add a testing section with commands verified by a maintainer.': 'Adicione uma seção de testes com comandos verificados pelo mantenedor.',
  'Add a usage section with commands verified by a maintainer.': 'Adicione uma seção de uso com comandos verificados pelo mantenedor.',
  'Make checks repeatable': 'Tornar as verificações reproduzíveis',
  'No GitHub Actions workflow found': 'Nenhum workflow do GitHub Actions encontrado',
  'Add CI that runs the actual project checks on pushes and pull requests.': 'Adicione CI para executar as verificações reais do projeto em pushes e pull requests.',
  'Clarify reuse permissions': 'Definir as permissões de reutilização', 'No root license file found': 'Nenhum arquivo de licença encontrado na raiz',
  'Choose and add a license appropriate to the project.': 'Escolha e adicione uma licença adequada ao projeto.',
  'Review modules without matching test names': 'Revisar módulos sem nomes de testes correspondentes',
  'Check existing integration coverage first; add behavior tests for uncovered boundaries and failure paths. Filename and directory matching is a heuristic, not coverage.': 'Verifique primeiro a cobertura de integração existente; adicione testes de comportamento para limites e falhas não cobertos. A correspondência de nomes e diretórios é uma heurística, não uma medição de cobertura.',
  'Review a large module before changing it': 'Revisar um módulo grande antes de alterá-lo',
  'Identify public behavior and add characterization tests before extracting responsibilities.': 'Identifique o comportamento público e adicione testes de caracterização antes de separar responsabilidades.',
  'Triage maintenance markers': 'Avaliar marcadores de manutenção',
  'Validate each marker and convert actionable work into a scoped issue.': 'Valide cada marcador e transforme o trabalho necessário em uma issue com escopo definido.',
  'Explain the user-visible behavior change.': 'Explique a mudança de comportamento visível ao usuário.',
  'Verify failure paths and backward compatibility.': 'Verifique os caminhos de falha e a compatibilidade com versões anteriores.',
  'Run relevant tests, then the project check suite.': 'Execute os testes relevantes e depois as verificações do projeto.',
  'Update documentation and record rollback steps.': 'Atualize a documentação e registre os passos de reversão.',
  'Static heuristics only; no code execution, semantic call graph or measured test coverage.': 'Somente heurísticas estáticas; sem execução de código, grafo semântico de chamadas ou medição de cobertura de testes.',
  'Only supplied text files are analyzed. Review recommendations before applying changes.': 'Somente os arquivos de texto fornecidos são analisados. Revise as recomendações antes de aplicar alterações.',
  'Test matching uses filenames and conventional directory layouts. Shared integration tests, custom layouts and multiple source files with the same module key may require manual review.': 'A correspondência de testes usa nomes de arquivos e diretórios convencionais. Testes de integração compartilhados, estruturas personalizadas e arquivos de código com a mesma chave de módulo podem exigir revisão manual.',
  'Markdown links: bounded inline/reference syntax only; no external URL, anchor, HTML link or instruction validation. Missing targets may be excluded from the supplied inventory.': 'Links Markdown: somente sintaxe limitada de links diretos e por referência; sem validação de URLs externas, âncoras, links HTML ou instruções. Destinos ausentes podem ter sido excluídos do inventário fornecido.'
};
export function translateReportText(value, locale) {
  if (locale !== 'pt-BR') return value;
  return reportText[value] ?? value.replace(/: (\d+) lines$/, ': $1 linhas');
}
export function localizeReport(report, locale) {
  const translate = value => translateReportText(value, locale);
  return { ...report, findings: report.findings.map(f => ({ ...f, title: translate(f.title), action: translate(f.action), evidence: f.evidence.map(translate) })), changePlan: { ...report.changePlan, checklist: report.changePlan.checklist.map(translate) }, limitations: report.limitations.map(translate) };
}
export function exportMarkdown(report, locale) {
  const translated = localizeReport(report, locale);
  const oneLine = value => String(value).replace(/[\r\n]/g, ' ');
  return [t(locale, 'planTitle'), '', t(locale, 'planSummary', report.summary), '',
    ...translated.findings.flatMap(f => [`## [${t(locale, f.priority)}] ${f.title}`, '', ...f.evidence.map(e => `- ${oneLine(e)}`), '', f.action, '']),
    `## ${t(locale, 'changeReview')}`, '', ...translated.changePlan.checklist.map(e => `- [ ] ${oneLine(e)}`), '', t(locale, 'relatedTests'), '',
    ...(translated.changePlan.relatedTests.length ? translated.changePlan.relatedTests.map(e => `- ${oneLine(e)}`) : [`- ${t(locale, 'noRelatedTests')}`]), '',
    `## ${t(locale, 'limits')}`, '', ...translated.limitations.map(e => `- ${oneLine(e)}`), ''
  ].join('\n');
}
