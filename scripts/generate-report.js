#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

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

function generateTestSummary() {
  log(`${colors.bright}📊 Generando resumen de pruebas...${colors.reset}`);
  
  const testFiles = [
    'tests/registration.spec.js',
    'tests/contact.spec.js', 
    'tests/checkout.spec.js',
    'tests/navigation.spec.js',
    'tests/error-handling.spec.js'
  ];
  
  let totalTests = 0;
  const testSummary = {
    files: [],
    totalTests: 0,
    categories: {
      'Formulario de Registro': 0,
      'Formulario de Contacto': 0,
      'Proceso de Compra': 0,
      'Navegación y UI': 0,
      'Manejo de Errores': 0
    }
  };
  
  testFiles.forEach(file => {
    if (fs.existsSync(file)) {
      const content = fs.readFileSync(file, 'utf8');
      const testMatches = content.match(/test\(/g);
      const testCount = testMatches ? testMatches.length : 0;
      
      const fileName = path.basename(file, '.spec.js');
      const category = getCategoryFromFileName(fileName);
      
      testSummary.files.push({
        name: fileName,
        path: file,
        testCount: testCount
      });
      
      testSummary.totalTests += testCount;
      testSummary.categories[category] += testCount;
    }
  });
  
  return testSummary;
}

function getCategoryFromFileName(fileName) {
  const categories = {
    'registration': 'Formulario de Registro',
    'contact': 'Formulario de Contacto',
    'checkout': 'Proceso de Compra',
    'navigation': 'Navegación y UI',
    'error-handling': 'Manejo de Errores'
  };
  
  return categories[fileName] || 'Otros';
}

function generateHTMLReport(summary) {
  const html = `
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Reporte de Pruebas - Demo Playwright</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            margin: 0;
            padding: 20px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
        }
        .container {
            max-width: 1200px;
            margin: 0 auto;
            background: white;
            border-radius: 15px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.2);
            overflow: hidden;
        }
        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 30px;
            text-align: center;
        }
        .header h1 {
            margin: 0;
            font-size: 2.5rem;
        }
        .header p {
            margin: 10px 0 0 0;
            opacity: 0.9;
        }
        .content {
            padding: 30px;
        }
        .summary-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 20px;
            margin-bottom: 30px;
        }
        .summary-card {
            background: #f8f9fa;
            padding: 20px;
            border-radius: 10px;
            border-left: 4px solid #667eea;
        }
        .summary-card h3 {
            margin: 0 0 10px 0;
            color: #333;
        }
        .summary-card .number {
            font-size: 2rem;
            font-weight: bold;
            color: #667eea;
        }
        .test-files {
            margin-top: 30px;
        }
        .test-file {
            background: #f8f9fa;
            margin: 10px 0;
            padding: 15px;
            border-radius: 8px;
            border-left: 4px solid #28a745;
        }
        .test-file h4 {
            margin: 0 0 5px 0;
            color: #333;
        }
        .test-file p {
            margin: 0;
            color: #666;
        }
        .commands {
            background: #e9ecef;
            padding: 20px;
            border-radius: 10px;
            margin-top: 30px;
        }
        .commands h3 {
            margin-top: 0;
            color: #333;
        }
        .command {
            background: #343a40;
            color: #fff;
            padding: 10px 15px;
            border-radius: 5px;
            font-family: 'Courier New', monospace;
            margin: 10px 0;
            display: inline-block;
        }
        .footer {
            background: #f8f9fa;
            padding: 20px;
            text-align: center;
            color: #666;
            border-top: 1px solid #dee2e6;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🎭 Demo de Playwright</h1>
            <p>Reporte de Pruebas Automatizadas</p>
        </div>
        
        <div class="content">
            <div class="summary-grid">
                <div class="summary-card">
                    <h3>Total de Pruebas</h3>
                    <div class="number">${summary.totalTests}</div>
                </div>
                <div class="summary-card">
                    <h3>Archivos de Prueba</h3>
                    <div class="number">${summary.files.length}</div>
                </div>
                <div class="summary-card">
                    <h3>Categorías</h3>
                    <div class="number">${Object.keys(summary.categories).length}</div>
                </div>
            </div>
            
            <h2>📋 Resumen por Categoría</h2>
            <div class="summary-grid">
                ${Object.entries(summary.categories).map(([category, count]) => `
                    <div class="summary-card">
                        <h3>${category}</h3>
                        <div class="number">${count}</div>
                    </div>
                `).join('')}
            </div>
            
            <div class="test-files">
                <h2>📁 Archivos de Prueba</h2>
                ${summary.files.map(file => `
                    <div class="test-file">
                        <h4>${file.name.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}</h4>
                        <p><strong>Ruta:</strong> ${file.path}</p>
                        <p><strong>Pruebas:</strong> ${file.testCount}</p>
                    </div>
                `).join('')}
            </div>
            
            <div class="commands">
                <h3>🚀 Comandos Útiles</h3>
                <p><strong>Ejecutar todas las pruebas:</strong></p>
                <div class="command">npm test</div>
                
                <p><strong>Ejecutar con interfaz gráfica:</strong></p>
                <div class="command">npm run test:headed</div>
                
                <p><strong>Ejecutar con UI de Playwright:</strong></p>
                <div class="command">npm run test:ui</div>
                
                <p><strong>Ver reporte HTML:</strong></p>
                <div class="command">npm run test:report</div>
                
                <p><strong>Ejecutar en navegador específico:</strong></p>
                <div class="command">npx playwright test --project firefox</div>
                
                <p><strong>Ejecutar pruebas específicas:</strong></p>
                <div class="command">npx playwright test --grep "registro"</div>
            </div>
        </div>
        
        <div class="footer">
            <p>Generado el ${new Date().toLocaleString('es-ES')}</p>
            <p>Demo de Playwright - Pruebas Automatizadas</p>
        </div>
    </div>
</body>
</html>`;
  
  const reportPath = path.join(process.cwd(), 'test-summary.html');
  fs.writeFileSync(reportPath, html);
  
  log(`${colors.green}✅ Reporte HTML generado: test-summary.html${colors.reset}`);
  return reportPath;
}

function generateJSONReport(summary) {
  const jsonReport = {
    generated: new Date().toISOString(),
    summary: summary,
    metadata: {
      project: 'Demo Playwright',
      description: 'Pruebas automatizadas para formularios y validaciones',
      version: '1.0.0'
    }
  };
  
  const reportPath = path.join(process.cwd(), 'test-summary.json');
  fs.writeFileSync(reportPath, JSON.stringify(jsonReport, null, 2));
  
  log(`${colors.green}✅ Reporte JSON generado: test-summary.json${colors.reset}`);
  return reportPath;
}

function openReport(reportPath) {
  try {
    const command = process.platform === 'win32' ? 'start' : 
                   process.platform === 'darwin' ? 'open' : 'xdg-open';
    execSync(`${command} ${reportPath}`, { stdio: 'ignore' });
    log(`${colors.blue}🌐 Abriendo reporte en el navegador...${colors.reset}`);
  } catch (error) {
    log(`${colors.yellow}⚠️ No se pudo abrir el reporte automáticamente${colors.reset}`);
    log(`${colors.blue}💡 Abre manualmente: ${reportPath}${colors.reset}`);
  }
}

function main() {
  log(`${colors.bright}📊 Generador de Reportes - Demo Playwright${colors.reset}`);
  log(`${colors.blue}============================================${colors.reset}\n`);
  
  try {
    // Generar resumen
    const summary = generateTestSummary();
    
    log(`${colors.cyan}📈 Resumen de Pruebas:${colors.reset}`);
    log(`  • Total de pruebas: ${colors.green}${summary.totalTests}${colors.reset}`);
    log(`  • Archivos de prueba: ${colors.green}${summary.files.length}${colors.reset}`);
    log(`  • Categorías: ${colors.green}${Object.keys(summary.categories).length}${colors.reset}\n`);
    
    // Generar reportes
    const htmlPath = generateHTMLReport(summary);
    const jsonPath = generateJSONReport(summary);
    
    log(`\n${colors.bright}🎉 Reportes generados exitosamente!${colors.reset}`);
    log(`${colors.green}📄 HTML: ${htmlPath}${colors.reset}`);
    log(`${colors.green}📄 JSON: ${jsonPath}${colors.reset}`);
    
    // Preguntar si abrir el reporte
    const args = process.argv.slice(2);
    if (args.includes('--open')) {
      openReport(htmlPath);
    } else {
      log(`\n${colors.blue}💡 Para abrir el reporte: node scripts/generate-report.js --open${colors.reset}`);
    }
    
  } catch (error) {
    log(`${colors.red}❌ Error generando reportes: ${error.message}${colors.reset}`);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = {
  generateTestSummary,
  generateHTMLReport,
  generateJSONReport
};
