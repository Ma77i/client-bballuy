import { existsSync, mkdirSync, readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const require = createRequire(import.meta.url);
const specStates = new Set(['draft', 'ready', 'in_progress', 'verified', 'blocked']);
const taskStates = new Set(['todo', 'in_progress', 'done', 'blocked']);

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function repoPath(relative) {
  assert(typeof relative === 'string' && relative.length > 0, 'Ruta local vacía o inválida.');
  assert(!path.isAbsolute(relative), `Usar ruta relativa al repositorio: ${relative}`);
  const absolute = path.resolve(root, relative);
  const resolved = path.relative(root, absolute);
  assert(resolved !== '..' && !resolved.startsWith(`..${path.sep}`) && !path.isAbsolute(resolved), `Ruta fuera del repositorio: ${relative}`);
  return absolute;
}

function read(relative) {
  return readFileSync(repoPath(relative), 'utf8');
}

function requireFile(relative) {
  const absolute = repoPath(relative);
  assert(existsSync(absolute) && statSync(absolute).isFile(), `Falta archivo: ${relative}`);
  assert(readFileSync(absolute, 'utf8').trim().length > 0, `Archivo vacío: ${relative}`);
}

function uniqueStrings(values, label) {
  assert(Array.isArray(values) && values.every(value => typeof value === 'string' && value.trim()), `${label}: se esperaba una lista de textos.`);
  assert(new Set(values).size === values.length, `${label}: valores duplicados.`);
}

function loadSpecs() {
  const registry = JSON.parse(read('specs/registry.json'));
  assert(registry.version === 1, 'Versión del registro no soportada.');
  assert(Array.isArray(registry.specs) && registry.specs.length > 0, 'No hay especificaciones registradas.');
  uniqueStrings(registry.specs.map(spec => spec.id), 'IDs de especificación');
  uniqueStrings(registry.specs.map(spec => spec.path), 'Carpetas de especificación');

  return registry.specs.map(spec => {
    assert(/^SPEC-\d{3,}$/.test(spec.id), `ID de especificación inválido: ${spec.id}`);
    assert(typeof spec.title === 'string' && spec.title.trim(), `${spec.id}: falta título.`);
    assert(specStates.has(spec.status), `${spec.id}: estado inválido.`);
    assert(/^specs\/\d{3,}-[a-z0-9-]+$/.test(spec.path), `${spec.id}: carpeta inválida.`);
    if (spec.status === 'blocked') assert(spec.blockedReason?.trim(), `${spec.id}: falta blockedReason.`);
    uniqueStrings(spec.requirements, `${spec.id}: requisitos`);
    assert(spec.requirements.length > 0 && spec.requirements.every(id => /^R\d{2,}$/.test(id)), `${spec.id}: requisitos inválidos.`);
    for (const file of ['spec.md', 'plan.md', 'tasks.json', 'verification.md']) requireFile(`${spec.path}/${file}`);

    const headings = [...read(`${spec.path}/spec.md`).matchAll(/^### (R\d{2,})\b/gm)].map(match => match[1]);
    uniqueStrings(headings, `${spec.id}: encabezados de requisitos`);
    assert(headings.length === spec.requirements.length && spec.requirements.every(id => headings.includes(id)), `${spec.id}: requisitos del registro y spec.md no coinciden.`);

    const taskFile = JSON.parse(read(`${spec.path}/tasks.json`));
    assert(taskFile.specId === spec.id, `${spec.id}: tasks.json pertenece a otra especificación.`);
    assert(Array.isArray(taskFile.tasks) && taskFile.tasks.length > 0, `${spec.id}: faltan tareas.`);
    const tasks = taskFile.tasks;
    uniqueStrings(tasks.map(task => task.id), `${spec.id}: IDs de tareas`);
    const byId = new Map(tasks.map(task => [task.id, task]));

    for (const task of tasks) {
      const label = `${spec.id}/${task.id}`;
      assert(/^T\d{2,}$/.test(task.id), `${label}: ID inválido.`);
      assert(typeof task.title === 'string' && task.title.trim(), `${label}: falta título.`);
      assert(typeof task.acceptance === 'string' && task.acceptance.trim(), `${label}: falta condición de salida.`);
      assert(taskStates.has(task.status), `${label}: estado inválido.`);
      uniqueStrings(task.requirements, `${label}: requisitos`);
      assert(task.requirements.length > 0 && task.requirements.every(id => spec.requirements.includes(id)), `${label}: requisitos desconocidos o vacíos.`);
      uniqueStrings(task.dependsOn, `${label}: dependencias`);
      assert(task.dependsOn.every(id => id !== task.id && byId.has(id)), `${label}: dependencia inexistente o propia.`);
      uniqueStrings(task.evidence, `${label}: evidencia`);
      for (const evidence of task.evidence) {
        assert(!evidence.replaceAll('\\', '/').split('/').includes('.harness'), `${label}: evidencia temporal no admitida.`);
        requireFile(evidence);
      }
      if (task.status === 'blocked') assert(task.blockedReason?.trim(), `${label}: falta blockedReason.`);
      if (task.status === 'done' || task.status === 'in_progress') {
        assert(task.dependsOn.every(id => byId.get(id).status === 'done'), `${label}: dependencias pendientes.`);
      }
      if (task.status === 'done') assert(task.evidence.length > 0, `${label}: una tarea terminada requiere evidencia.`);
    }

    const visiting = new Set();
    const visited = new Set();
    function visit(id) {
      assert(!visiting.has(id), `${spec.id}: ciclo de dependencias en ${id}.`);
      if (visited.has(id)) return;
      visiting.add(id);
      byId.get(id).dependsOn.forEach(visit);
      visiting.delete(id);
      visited.add(id);
    }
    tasks.forEach(task => visit(task.id));
    for (const id of spec.requirements) assert(tasks.some(task => task.requirements.includes(id)), `${spec.id}/${id}: requisito sin tarea.`);
    if (spec.status === 'verified') assert(tasks.every(task => task.status === 'done'), `${spec.id}: verificada con tareas pendientes.`);
    return { ...spec, tasks };
  });
}

function markdownFiles(directory) {
  return readdirSync(repoPath(directory), { withFileTypes: true }).flatMap(entry => {
    const relative = `${directory}/${entry.name}`;
    if (entry.isDirectory()) return markdownFiles(relative);
    return entry.isFile() && entry.name.endsWith('.md') ? [relative] : [];
  });
}

function verifyDocs() {
  for (const file of ['README.md', 'AGENTS.md', '.env.example', 'docs/README.md', 'docs/product.md', 'docs/status.md', 'docs/architecture.md', 'docs/development.md', 'docs/db-context.md', 'docs/workflow.md', 'docs/harness.md', 'specs/README.md', 'specs/template.md']) requireFile(file);
  const specs = loadSpecs();
  const registered = new Set(specs.map(spec => spec.path));
  for (const entry of readdirSync(repoPath('specs'), { withFileTypes: true })) {
    if (entry.isDirectory()) assert(registered.has(`specs/${entry.name}`), `Carpeta no registrada: specs/${entry.name}`);
  }
  const roots = readdirSync(root).filter(name => /^(README.*|AGENTS)\.md$/.test(name));
  const files = [...roots, ...markdownFiles('docs'), ...markdownFiles('specs')];
  for (const file of files) {
    const content = read(file).replace(/```[\s\S]*?```/g, '');
    for (const match of content.matchAll(/\[[^\]]+\]\(([^\s)]+)\)/g)) {
      const link = match[1];
      if (/^(?:[a-z][a-z0-9+.-]*:|#)/i.test(link)) continue;
      const target = decodeURIComponent(link.split('#')[0]);
      if (!target) continue;
      const relative = path.join(path.dirname(file), target);
      assert(existsSync(repoPath(relative)), `${file}: enlace local roto: ${link}`);
    }
  }
  console.log(`Documentación válida: ${files.length} archivos Markdown, ${specs.length} especificación(es).`);
  console.log('Se validan rutas de enlaces, no anclas ni contenido de páginas externas.');
}

function runProcess(command, args) {
  const result = spawnSync(command, args, { cwd: root, stdio: 'inherit', shell: false });
  if (result.error) throw new Error(`No se pudo ejecutar ${command}: ${result.error.message}`);
  if (result.signal) throw new Error(`${command} terminó por señal ${result.signal}.`);
  return { exitCode: result.status ?? 1, command: [command, ...args] };
}

function runNodePackage(packageName, relativeExecutable, args) {
  const packageRoot = path.dirname(require.resolve(`${packageName}/package.json`));
  return runProcess(process.execPath, [path.join(packageRoot, relativeExecutable), ...args]);
}

const checks = {
  docs: () => { verifyDocs(); return { exitCode: 0 }; },
  typecheck: () => runNodePackage('typescript', 'bin/tsc', ['--noEmit', '-p', 'tsconfig.app.json']),
  lint: () => runNodePackage('eslint', 'bin/eslint.js', ['app', 'components', 'constants', 'contexts', 'hooks', 'lib']),
  edge: () => {
    const files = readdirSync(repoPath('supabase/functions'), { withFileTypes: true })
      .filter(entry => entry.isDirectory())
      .map(entry => `supabase/functions/${entry.name}/index.ts`)
      .filter(file => existsSync(repoPath(file))).sort();
    assert(files.length > 0, 'No se encontraron Edge Functions.');
    return runProcess('deno', ['check', ...files]);
  },
};

function status() {
  for (const spec of loadSpecs()) {
    console.log(`${spec.id} [${spec.status}] ${spec.title}`);
    if (spec.status === 'draft') console.log('Alcance detallado propuesto; confirmar decisiones antes de tareas que dependan de ellas.');
    for (const task of spec.tasks) {
      const waiting = task.dependsOn.filter(id => spec.tasks.find(candidate => candidate.id === id).status !== 'done');
      const detail = task.status === 'blocked' ? task.blockedReason : waiting.length ? `espera ${waiting.join(', ')}` : task.status === 'todo' ? 'disponible por dependencias' : task.status;
      console.log(`  ${task.id} [${task.status}] ${task.title} — ${detail}`);
    }
  }
  console.log('Este comando no ejecuta comprobaciones ni inicia tareas.');
}

function run(mode) {
  const names = mode === 'verify' ? ['docs', 'typecheck', 'lint'] : [mode];
  const report = { version: 1, mode, startedAt: new Date().toISOString(), node: process.version, platform: process.platform, scope: mode === 'verify' ? 'documentation-and-client-static' : mode, checks: [] };
  for (const name of names) {
    console.log(`\n[${name}]`);
    const started = Date.now();
    let result;
    try { result = checks[name](); }
    catch (error) { result = { exitCode: 1, error: error.message }; console.error(error.message); }
    report.checks.push({ name, ...result, status: result.exitCode === 0 ? 'passed' : 'failed', durationMs: Date.now() - started });
  }
  report.passed = report.checks.every(check => check.status === 'passed');
  report.finishedAt = new Date().toISOString();
  mkdirSync(repoPath('.harness'), { recursive: true });
  writeFileSync(repoPath(`.harness/${mode}.json`), `${JSON.stringify(report, null, 2)}\n`);
  console.log(`\n${report.passed ? 'PASS' : 'FAIL'}: ${report.checks.map(check => `${check.name}=${check.status}`).join(', ')}`);
  console.log(`Resultado local: .harness/${mode}.json. No certifica aceptación funcional.`);
  return report.passed ? 0 : 1;
}

const mode = process.argv[2];
try {
  assert(process.argv.length === 3 && ['status', 'verify', 'docs', 'edge'].includes(mode), 'Uso: node scripts/harness.mjs <status|verify|docs|edge>');
  if (mode === 'status') status();
  else process.exitCode = run(mode);
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
}
