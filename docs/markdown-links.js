const normalize = path => {
  const parts = [];
  for (const part of path.replaceAll('\\', '/').split('/')) {
    if (!part || part === '.') continue;
    if (part === '..' && parts.length && parts.at(-1) !== '..') parts.pop();
    else parts.push(part);
  }
  return parts.join('/');
};
const labelKey = label => label.trim().replace(/\s+/g, ' ').toLowerCase();

function visibleMarkdown(text) {
  let fence;
  return text.split('\n').map(line => {
    const marker = line.match(/^ {0,3}(`{3,}|~{3,})/);
    if (marker) {
      if (!fence) fence = marker[1];
      else if (marker[1][0] === fence[0] && marker[1].length >= fence.length) fence = undefined;
      return '';
    }
    return fence ? '' : line.replace(/(`+).*?\1/g, '');
  });
}

export function missingMarkdownLinks(entries, availablePaths) {
  const known = new Set(availablePaths.map(normalize));
  const exists = path => known.has(path) || [...known].some(p => p.startsWith(`${path}/`));
  const missing = [];
  for (const [source, text] of entries.filter(([p]) => /\.(md|markdown)$/i.test(p))) {
    const lines = visibleMarkdown(text);
    const definitions = new Map();
    for (const line of lines) {
      const match = line.match(/^ {0,3}\[([^\]]+)\]:\s*(?:<([^>]+)>|(\S+))/);
      if (match && !definitions.has(labelKey(match[1]))) definitions.set(labelKey(match[1]), match[2] ?? match[3]);
    }
    const check = (destination, line) => {
      if (/^(?:[a-z][a-z\d+.-]*:|\/|#|\?)/i.test(destination)) return;
      const local = destination.split(/[?#]/)[0];
      if (!local) return;
      let decoded;
      try { decoded = decodeURIComponent(local).replace(/\\([\\()[\] ])/g, '$1'); } catch { return; }
      const directory = source.split('/').slice(0, -1).join('/');
      const target = normalize(`${directory}/${decoded}`);
      if (!exists(target)) missing.push({ source, line, destination, target });
    };
    lines.forEach((line, index) => {
      if (/^ {0,3}\[[^\]]+\]:/.test(line)) return;
      // Deliberately bounded Markdown subset: inline links/images (balanced one-level
      // parentheses), reference links/images, and shortcut references with definitions.
      const pattern = /!?\[([^\]]*)\](?:\(\s*(?:<([^>\n]+)>|((?:\\.|[^\s()\\]|\((?:\\.|[^()])*\))+))(?:\s+["'][^\n]*?["'])?\s*\)|\[([^\]]*)\])?/g;
      for (const match of line.matchAll(pattern)) {
        if (match.index > 0 && line[match.index - 1] === '\\') continue;
        const destination = match[2] ?? match[3] ?? definitions.get(labelKey(match[4] || match[1]));
        if (destination !== undefined) check(destination, index + 1);
      }
    });
  }
  return missing;
}
