#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Colores para la consola
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function runCommand(command, description) {
  log(`\n${colors.cyan}▶ ${description}${colors.reset}`);
  log(`${colors.yellow}Ejecutando: ${command}${colors.reset}\n`);
  
  try {
    execSync(command, { stdio: 'inherit' });
    log(`${colors.green}✅ ${description} completado exitosamente${colors.reset}`);
    return true;
  } catch (error) {
    log(`${colors.red}❌ Error en ${description}${colors.reset}`);
    log(`${colors.red}${error.message}${colors.reset}`);
    return false;
  }
}

function checkPrerequisites() {
  log(`${colors.bright}🔍 Verificando prerrequisitos...${colors.reset}`);
  
  // Verificar Node.js
  try {
    const nodeVersion = execSync('node --version', { encoding: 'utf8' }).trim();
    log(`${colors.green}✅ Node.js: ${nodeVersion}${colors.reset}`);
  } catch (error) {
    log(`${colors.red}❌ Node.js no está instalado${colors.reset}`);
    return false;
  }
  
  // Verificar npm
  try {
    const npmVersion = execSync('npm --version', { encoding: 'utf8' }).trim();
    log(`${colors.green}✅ npm: ${npmVersion}${colors.reset}`);
  } catch (error) {
    log(`${colors.red}❌ npm no está instalado${colors.reset}`);
    return false;
  }
  
  return true;
}

function installDependencies() {
  log(`${colors.bright}📦 Instalando dependencias...${colors.reset}`);
  
  if (!runCommand('npm install', 'Instalación de dependencias de Node.js')) {
    return false;
  }
  
  if (!runCommand('npx playwright install', 'Instalación de navegadores de Playwright')) {
    return false;
  }
  
  return true;
}

function runTests(options = {}) {
  const { 
    headed = false, 
    ui = false, 
    project = 'chromium',
    grep = null,
    reporter = 'html'
  } = options;
  
  let command = 'npx playwright test';
  
  if (headed) {
    command += ' --headed';
  }
  
  if (ui) {
    command += ' --ui';
  }
  
  if (project && project !== 'all') {
    command += ` --project ${project}`;
  }
  
  if (grep) {
    command += ` --grep "${grep}"`;
  }
  
  if (reporter) {
    command += ` --reporter ${reporter}`;
  }
  
  return runCommand(command, 'Ejecución de pruebas automatizadas');
}

function generateReport() {
  log(`${colors.bright}📊 Generando reporte de pruebas...${colors.reset}`);
  
  // Verificar si existe el reporte HTML
  const reportPath = path.join(process.cwd(), 'playwright-report', 'index.html');
  
  if (fs.existsSync(reportPath)) {
    log(`${colors.green}✅ Reporte HTML generado: playwright-report/index.html${colors.reset}`);
    log(`${colors.blue}💡 Para ver el reporte, ejecuta: npx playwright show-report${colors.reset}`);
  } else {
    log(`${colors.yellow}⚠️ No se encontró reporte HTML. Ejecuta las pruebas primero.${colors.reset}`);
  }
  
  // Verificar si existe el reporte JSON
  const jsonReportPath = path.join(process.cwd(), 'test-results.json');
  if (fs.existsSync(jsonReportPath)) {
    log(`${colors.green}✅ Reporte JSON generado: test-results.json${colors.reset}`);
  }
}

function showHelp() {
  log(`${colors.bright}🚀 Demo de Playwright - Script de Ejecución${colors.reset}\n`);
  log(`${colors.cyan}Uso:${colors.reset}`);
  log(`  node scripts/run-tests.js [opciones]\n`);
  log(`${colors.cyan}Opciones:${colors.reset}`);
  log(`  --help, -h          Mostrar esta ayuda`);
  log(`  --install           Instalar dependencias y navegadores`);
  log(`  --headed            Ejecutar pruebas con interfaz gráfica`);
  log(`  --ui                Ejecutar pruebas con UI de Playwright`);
  log(`  --project <nombre>  Ejecutar pruebas en navegador específico (chromium, firefox, webkit)`);
  log(`  --grep <patrón>     Ejecutar solo pruebas que coincidan con el patrón`);
  log(`  --report            Solo generar reporte (sin ejecutar pruebas)`);
  log(`  --all               Ejecutar todas las opciones (instalar + pruebas + reporte)\n`);
  log(`${colors.cyan}Ejemplos:${colors.reset}`);
  log(`  node scripts/run-tests.js --install`);
  log(`  node scripts/run-tests.js --headed`);
  log(`  node scripts/run-tests.js --project firefox`);
  log(`  node scripts/run-tests.js --grep "registro"`);
  log(`  node scripts/run-tests.js --all`);
}

function main() {
  const args = process.argv.slice(2);
  
  if (args.includes('--help') || args.includes('-h')) {
    showHelp();
    return;
  }
  
  log(`${colors.bright}🎭 Demo de Playwright - Pruebas Automatizadas${colors.reset}`);
  log(`${colors.blue}================================================${colors.reset}\n`);
  
  // Verificar prerrequisitos
  if (!checkPrerequisites()) {
    process.exit(1);
  }
  
  // Instalar dependencias si se solicita
  if (args.includes('--install') || args.includes('--all')) {
    if (!installDependencies()) {
      process.exit(1);
    }
  }
  
  // Solo generar reporte
  if (args.includes('--report')) {
    generateReport();
    return;
  }
  
  // Ejecutar pruebas
  if (!args.includes('--install') || args.includes('--all')) {
    const options = {
      headed: args.includes('--headed'),
      ui: args.includes('--ui'),
      project: getArgValue(args, '--project') || 'chromium',
      grep: getArgValue(args, '--grep'),
      reporter: 'html'
    };
    
    if (runTests(options)) {
      generateReport();
      
      log(`\n${colors.bright}🎉 ¡Pruebas completadas exitosamente!${colors.reset}`);
      log(`${colors.green}📈 Revisa los resultados en el reporte HTML${colors.reset}`);
      log(`${colors.blue}🔗 Para ver el reporte: npx playwright show-report${colors.reset}`);
    } else {
      log(`\n${colors.red}💥 Las pruebas fallaron. Revisa los errores arriba.${colors.reset}`);
      process.exit(1);
    }
  }
}

function getArgValue(args, argName) {
  const index = args.indexOf(argName);
  if (index !== -1 && index + 1 < args.length) {
    return args[index + 1];
  }
  return null;
}

// Ejecutar script
if (require.main === module) {
  main();
}

module.exports = {
  runTests,
  generateReport,
  installDependencies,
  checkPrerequisites
};
