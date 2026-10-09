import assert from 'node:assert/strict';
import { copyFileSync, mkdirSync, mkdtempSync, readFileSync, realpathSync, rmSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import test from 'node:test';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const fixtureParent = path.join(root, '.harness', 'test-fixtures');
mkdirSync(fixtureParent, { recursive: true });

function fixture(t) {
  const directory = mkdtempSync(path.join(fixtureParent, 'case-'));
  t.after(() => {
    const resolved = realpathSync(directory);
    assert.equal(path.dirname(resolved), realpathSync(fixtureParent));
    assert.ok(path.basename(resolved).startsWith('case-'));
    rmSync(resolved, { recursive: true });
  });
  const put = (file, content) => {
    const target = path.join(directory, file);
    mkdirSync(path.dirname(target), { recursive: true });
    writeFileSync(target, typeof content === 'string' ? content : JSON.stringify(content));
  };
  const get = file => JSON.parse(readFileSync(path.join(directory, file), 'utf8'));
  for (const file of ['README.md', 'AGENTS.md', '.env.example', 'docs/README.md', 'docs/product.md', 'docs/status.md', 'docs/architecture.md', 'docs/development.md', 'docs/db-context.md', 'docs/workflow.md', 'docs/harness.md', 'specs/README.md', 'specs/template.md', 'specs/001-example/plan.md', 'specs/001-example/verification.md']) put(file, '# Fixture\n');
  put('specs/001-example/spec.md', '# SPEC-001\n### R01 — Resultado\n');
  put('specs/registry.json', { version: 1, specs: [{ id: 'SPEC-001', title: 'Example', path: 'specs/001-example', status: 'draft', requirements: ['R01'] }] });
  const task = id => ({ id, title: 'Example task', status: 'todo', requirements: ['R01'], dependsOn: [], acceptance: 'Observable result', evidence: [] });
  put('specs/001-example/tasks.json', { specId: 'SPEC-001', tasks: [task('T01'), task('T02')] });
  mkdirSync(path.join(directory, 'scripts'));
  copyFileSync(path.join(root, 'scripts', 'harness.mjs'), path.join(directory, 'scripts', 'harness.mjs'));
  const run = (mode = 'docs') => {
    const result = spawnSync(process.execPath, [path.join(directory, 'scripts', 'harness.mjs'), mode], { encoding: 'utf8', cwd: directory });
    assert.ifError(result.error);
    return { ...result, output: result.stdout + result.stderr };
  };
  const changeTasks = change => {
    const data = get('specs/001-example/tasks.json');
    change(data.tasks);
    put('specs/001-example/tasks.json', data);
  };
  return { put, get, run, changeTasks };
}

test('acepta documentación trazable y emite resultado estructurado', t => {
  const f = fixture(t);
  assert.equal(f.run().status, 0);
  assert.equal(f.get('.harness/docs.json').passed, true);
});

test('rechaza un enlace local roto', t => {
  const f = fixture(t);
  f.put('README.md', '[Archivo](docs/missing.md)');
  const result = f.run();
  assert.equal(result.status, 1);
  assert.match(result.output, /enlace local roto/);
});

test('rechaza requisitos sin tareas', t => {
  const f = fixture(t);
  const registry = f.get('specs/registry.json');
  registry.specs[0].requirements.push('R02');
  f.put('specs/registry.json', registry);
  f.put('specs/001-example/spec.md', '# SPEC-001\n### R01 — Uno\n### R02 — Dos\n');
  assert.match(f.run().output, /requisito sin tarea/);
});

test('detecta ciclos entre tareas pendientes', t => {
  const f = fixture(t);
  f.changeTasks(tasks => { tasks[0].dependsOn = ['T02']; tasks[1].dependsOn = ['T01']; });
  const result = f.run();
  assert.equal(result.status, 1);
  assert.match(result.output, /ciclo de dependencias/);
});

test('no acepta completar una tarea sin evidencia', t => {
  const f = fixture(t);
  f.changeTasks(tasks => { tasks[0].status = 'done'; });
  assert.match(f.run().output, /terminada requiere evidencia/);
});

test('no acepta completar una tarea con dependencias pendientes', t => {
  const f = fixture(t);
  f.changeTasks(tasks => { tasks[1].status = 'done'; tasks[1].dependsOn = ['T01']; tasks[1].evidence = ['README.md']; });
  assert.match(f.run().output, /dependencias pendientes/);
});

test('rechaza evidencia que escape del repositorio', t => {
  const f = fixture(t);
  f.changeTasks(tasks => { tasks[0].evidence = ['../outside.md']; });
  assert.match(f.run().output, /fuera del repositorio/);
});

test('rechaza evidencia temporal del harness', t => {
  const f = fixture(t);
  f.put('.harness/old.json', '{}');
  f.changeTasks(tasks => { tasks[0].evidence = ['./.harness/old.json']; });
  assert.match(f.run().output, /evidencia temporal no admitida/);
});

test('no acepta especificación verificada con tareas pendientes', t => {
  const f = fixture(t);
  const registry = f.get('specs/registry.json');
  registry.specs[0].status = 'verified';
  f.put('specs/registry.json', registry);
  assert.match(f.run().output, /verificada con tareas pendientes/);
});

test('continúa controles después de un fallo y conserva salida no cero', t => {
  const f = fixture(t);
  f.put('node_modules/typescript/package.json', { name: 'typescript' });
  f.put('node_modules/typescript/bin/tsc', 'process.exit(7);');
  f.put('node_modules/eslint/package.json', { name: 'eslint' });
  f.put('node_modules/eslint/bin/eslint.js', 'console.log("lint fixture executed");');
  const result = f.run('verify');
  assert.equal(result.status, 1);
  assert.match(result.output, /lint fixture executed/);
  const report = f.get('.harness/verify.json');
  assert.equal(report.passed, false);
  assert.deepEqual(report.checks.map(check => check.exitCode), [0, 7, 0]);
});

test('status no inicia ni completa tareas', t => {
  const f = fixture(t);
  const before = f.get('specs/001-example/tasks.json');
  assert.equal(f.run('status').status, 0);
  assert.deepEqual(f.get('specs/001-example/tasks.json'), before);
});
