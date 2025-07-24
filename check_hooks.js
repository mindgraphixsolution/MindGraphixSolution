// Script temporaire pour détecter les violations de hooks React
const fs = require('fs');
const path = require('path');

function checkHooksViolations(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n');
  
  let hasEarlyReturn = false;
  let earlyReturnLine = -1;
  let hasHooksAfterReturn = false;
  let hooksAfterReturnLines = [];
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    // Détecter les early returns
    if (line.includes('return null') && !hasEarlyReturn) {
      hasEarlyReturn = true;
      earlyReturnLine = i + 1;
    }
    
    // Détecter les hooks après un early return
    if (hasEarlyReturn && (line.includes('useEffect') || line.includes('useState') || line.includes('useRef'))) {
      hasHooksAfterReturn = true;
      hooksAfterReturnLines.push(i + 1);
    }
  }
  
  if (hasHooksAfterReturn) {
    console.log(`❌ ${filePath}`);
    console.log(`   Early return at line ${earlyReturnLine}`);
    console.log(`   Hooks after return at lines: ${hooksAfterReturnLines.join(', ')}`);
    return false;
  } else if (hasEarlyReturn) {
    console.log(`✅ ${filePath} (has early return but no hooks after)`);
  }
  
  return true;
}

// Vérifier tous les fichiers TSX dans components/
const componentsDir = './client/components';
const files = fs.readdirSync(componentsDir);

let hasViolations = false;

files.forEach(file => {
  if (file.endsWith('.tsx')) {
    const result = checkHooksViolations(path.join(componentsDir, file));
    if (!result) {
      hasViolations = true;
    }
  }
});

if (!hasViolations) {
  console.log('\n🎉 Aucune violation de hooks détectée !');
} else {
  console.log('\n⚠️  Violations détectées - corrigez-les pour éviter les erreurs React');
}
