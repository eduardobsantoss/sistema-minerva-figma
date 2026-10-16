import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve('src');
const skipDirs = ['disseccoes', 'node_modules'];

function walk(dir, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (skipDirs.includes(entry.name)) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, out);
    else if (entry.name.endsWith('.vue')) out.push(full);
  }
  return out;
}

function addImport(content, name, from) {
  if (content.includes(`import ${name} from`)) return content;
  const open = content.match(/<script setup[^>]*>/);
  if (!open) return null;
  const start = content.indexOf(open[0]) + open[0].length;
  const end = content.indexOf('</script>', start);
  if (end < 0) return null;
  const body = content.slice(start, end);
  const lines = body.split('\n');
  let offset = 0;
  let insertAt = 0;
  let found = false;
  for (const line of lines) {
    if (/^\s*import\s/.test(line)) {
      found = true;
      insertAt = offset + line.length + 1;
    }
    offset += line.length + 1;
  }
  const line = `import ${name} from '${from}';\n`;
  if (!found) return content.slice(0, start) + '\n' + line + content.slice(start);
  return content.slice(0, start + insertAt) + line + content.slice(start + insertAt);
}

function parseAttrs(raw) {
  const attrs = [];
  const re = /([:@#]?[\w.-]+|v-[\w.-]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'=<>`]+)))?/g;
  let match;
  while ((match = re.exec(raw))) {
    attrs.push({
      name: match[1],
      value: match[2] ?? match[3] ?? match[4] ?? true,
    });
  }
  return attrs;
}

function attrValue(attrs, name) {
  return attrs.find((attr) => attr.name === name)?.value;
}

function tag(name, attrs) {
  const body = attrs.filter((attr) => attr.value !== undefined && attr.value !== false).map((attr) => {
    if (attr.value === true) return attr.name;
    return `${attr.name}="${attr.value}"`;
  }).join(' ');
  return body ? `<${name} ${body} />` : `<${name} />`;
}

const KEEP_DATE = new Set(['v-model', ':value', ':min', ':max', 'min', 'max', ':disabled', 'disabled', 'aria-label', 'id', 'name']);
const DROP_DATE = new Set(['type', 'class', ':class', 'style', ':style', 'placeholder', 'autocomplete', 'inputmode']);

function convertDate(content, file) {
  const skipped = [];
  const next = content.replace(/<input\b([^>]*?)\/?>/g, (full, raw) => {
    const attrs = parseAttrs(raw);
    if (attrValue(attrs, 'type') !== 'date') return full;
    const unknown = attrs.filter((attr) => !KEEP_DATE.has(attr.name) && !DROP_DATE.has(attr.name) && !attr.name.startsWith('@'));
    if (unknown.length) {
      skipped.push(`${unknown.map((attr) => attr.name).join(', ')} :: ${full.slice(0, 80)}`);
      return full;
    }
    const out = [];
    const model = attrValue(attrs, 'v-model');
    const value = attrValue(attrs, ':value');
    if (typeof model === 'string') out.push({ name: 'v-model', value: model });
    else if (typeof value === 'string') out.push({ name: ':model-value', value });
    for (const name of [':min', ':max', 'min', 'max', ':disabled', 'disabled', 'aria-label', 'id', 'name']) {
      const found = attrValue(attrs, name);
      if (found !== undefined) out.push({ name, value: found });
    }
    for (const attr of attrs.filter((item) => item.name.startsWith('@'))) {
      let handler = String(attr.value);
      handler = handler.replace(/\(\$event\.target as HTMLInputElement\)\.value/g, '$event');
      handler = handler.replace(/\$event\.target\.value/g, '$event');
      const event = attr.name === '@input' || attr.name === '@change' ? '@update:model-value' : attr.name;
      out.push({ name: event, value: handler });
    }
    return tag('AdminDateField', out);
  });
  return { content: next === content ? content : addImport(next, 'AdminDateField', '@/components/ui/AdminDateField.vue'), skipped };
}

function optionLabel(text) {
  const trimmed = text.trim();
  const mustache = trimmed.match(/^\{\{\s*([\s\S]+?)\s*\}\}$/);
  if (mustache) return { kind: 'expr', value: mustache[1].trim() };
  if (trimmed && !trimmed.includes('{{')) return { kind: 'text', value: trimmed };
  return null;
}

function parseVFor(expr) {
  const pair = expr.match(/^\(\s*([\w$]+)\s*,\s*([\w$]+)\s*\)\s+in\s+([\s\S]+)$/);
  if (pair) return { item: pair[1], key: pair[2], source: pair[3].trim() };
  const single = expr.match(/^([\w$]+)\s+in\s+([\s\S]+)$/);
  if (single) return { item: single[1], key: null, source: single[2].trim() };
  return null;
}

function convertSelect(content) {
  const skipped = [];
  const next = content.replace(/<select\b([^>]*)>([\s\S]*?)<\/select>/g, (full, raw, inner) => {
    const attrs = parseAttrs(raw);
    if (attrValue(attrs, 'multiple') !== undefined) {
      skipped.push('multiple');
      return full;
    }
    const model = attrValue(attrs, 'v-model');
    if (typeof model !== 'string' || model.includes('.')) {
      // dotted v-model is fine; skip only missing or modifiers
    }
    if (typeof model !== 'string') {
      skipped.push('no-model');
      return full;
    }
    if (attrs.some((attr) => attr.name.startsWith('v-model.'))) {
      skipped.push('modifier');
      return full;
    }
    const optionRe = /<option\b([^>]*)>([\s\S]*?)<\/option>/g;
    const options = [];
    let cursor = 0;
    let match;
    while ((match = optionRe.exec(inner))) {
      if (inner.slice(cursor, match.index).trim()) {
        skipped.push('stray-inner');
        return full;
      }
      cursor = match.index + match[0].length;
      options.push({ attrs: parseAttrs(match[1]), text: match[2] });
    }
    if (inner.slice(cursor).trim()) {
      skipped.push('stray-tail');
      return full;
    }
    if (!options.length) {
      skipped.push('empty');
      return full;
    }

    const pieces = [];
    let placeholder = null;
    for (const option of options) {
      const names = option.attrs.map((attr) => attr.name);
      const extra = names.filter((name) => !['value', ':value', 'v-for', ':key', 'disabled', 'selected'].includes(name));
      if (extra.length) {
        skipped.push(`option-attr ${extra.join(',')}`);
        return full;
      }
      const label = optionLabel(option.text);
      if (!label) {
        skipped.push('label');
        return full;
      }
      const vfor = attrValue(option.attrs, 'v-for');
      const disabled = attrValue(option.attrs, 'disabled') !== undefined;
      const literal = attrValue(option.attrs, 'value');
      const bound = attrValue(option.attrs, ':value');
      if (disabled && (literal === '' || literal === true) && !vfor) {
        if (label.kind !== 'text') {
          skipped.push('placeholder-expr');
          return full;
        }
        placeholder = label.value;
        continue;
      }
      if (typeof vfor === 'string') {
        const parsed = parseVFor(vfor);
        if (!parsed) {
          skipped.push(`v-for ${vfor}`);
          return full;
        }
        const valueExpr = typeof bound === 'string' ? bound : (typeof literal === 'string' ? `'${literal}'` : parsed.item);
        const labelExpr = label.kind === 'expr' ? label.value : `'${label.value.replace(/'/g, "\\'")}'`;
        const usesKey = parsed.key && (valueExpr === parsed.key || labelExpr === parsed.key);
        if (parsed.key && usesKey) {
          pieces.push(`...Object.entries(${parsed.source}).map(([${parsed.key}, ${parsed.item}]) => ({ value: ${valueExpr}, label: ${labelExpr} }))`);
        } else {
          const params = parsed.key && (valueExpr.includes(parsed.key) || labelExpr.includes(parsed.key))
            ? `(${parsed.item}, ${parsed.key})`
            : parsed.item;
          pieces.push(`...${parsed.source}.map((${params}) => ({ value: ${valueExpr}, label: ${labelExpr} }))`);
        }
        continue;
      }
      const labelExpr = label.kind === 'expr' ? label.value : `'${label.value.replace(/'/g, "\\'")}'`;
      if (typeof bound === 'string') {
        pieces.push(`{ value: ${bound}, label: ${labelExpr} }`);
      } else {
        const value = typeof literal === 'string' ? literal : '';
        pieces.push(`{ value: '${String(value).replace(/'/g, "\\'")}', label: ${labelExpr} }`);
      }
    }

    if (!pieces.length && !placeholder) {
      skipped.push('no-options');
      return full;
    }
    const out = [{ name: 'v-model', value: model }];
    if (placeholder) out.push({ name: 'placeholder', value: placeholder });
    const spread = pieces.some((piece) => piece.startsWith('...'));
    const optionsExpr = !pieces.length
      ? '[]'
      : spread || pieces.length > 1
        ? `[${pieces.join(', ')}]`
        : pieces[0].startsWith('...') ? pieces[0].slice(3) : `[${pieces[0]}]`;
    out.push({ name: ':options', value: optionsExpr });
    for (const name of ['aria-label', 'id', ':disabled', 'disabled', 'style', ':style']) {
      const found = attrValue(attrs, name);
      if (found !== undefined) out.push({ name, value: found });
    }
    for (const attr of attrs.filter((item) => item.name.startsWith('@'))) {
      if (String(attr.value).includes('$event')) {
        skipped.push('change-event');
        return full;
      }
      const event = attr.name === '@change' || attr.name === '@input' ? '@update:model-value' : attr.name;
      out.push({ name: event, value: attr.value });
    }
    return tag('AdminSelect', out);
  });
  return { content: next, skipped };
}

const report = [];
let dateFiles = 0;
let selectFiles = 0;
for (const file of walk(root)) {
  if (file.includes(`${path.sep}components${path.sep}ui${path.sep}`)) continue;
  if (file.endsWith(`${path.sep}TablePagination.vue`)) continue;
  let content = fs.readFileSync(file, 'utf8');
  const original = content;
  if (content.includes('type="date"') || content.includes("type='date'")) {
    const date = convertDate(content, file);
    if (date.content === null) {
      report.push(`NO SCRIPT DATE ${file}`);
    } else {
      content = date.content;
      if (date.skipped.length) report.push(`DATE SKIP ${path.relative(root, file)}: ${date.skipped.join(' | ')}`);
    }
  }
  if (content.includes('<select')) {
    const select = convertSelect(content);
    content = select.content;
    if (select.skipped.length) report.push(`SELECT SKIP ${path.relative(root, file)}: ${[...new Set(select.skipped)].join(', ')}`);
  }
  if (content !== original) {
    if (content.includes('<AdminSelect') && !original.includes('AdminSelect')) {
      const withImport = addImport(content, 'AdminSelect', '@/components/ui/AdminSelect.vue');
      if (!withImport) report.push(`NO SCRIPT SELECT ${file}`);
      else content = withImport;
    }
    fs.writeFileSync(file, content);
    if (content.includes('AdminDateField') && !original.includes('AdminDateField')) dateFiles += 1;
    if (content.includes('AdminSelect') && !original.includes('AdminSelect')) selectFiles += 1;
  }
}
console.log(`date files ${dateFiles}, select files ${selectFiles}`);
console.log(report.join('\n'));
