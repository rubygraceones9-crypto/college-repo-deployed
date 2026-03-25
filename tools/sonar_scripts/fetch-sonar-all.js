const fs = require('fs');

async function getAllIssues() {
  let all = [];
  let p = 1;
  while (true) {
    const res = await fetch(`https://sonarcloud.io/api/issues/search?componentKeys=rubygraceones9-crypto_college-evaluation-system&resolved=false&p=${p}&ps=500`);
    const data = await res.json();
    if (!data.issues || data.issues.length === 0) break;
    all.push(...data.issues);
    if (all.length >= data.total) break;
    p++;
  }
  
  const bad = all.filter(i => i.type === 'BUG' || i.type === 'VULNERABILITY' || i.type === 'SECURITY_HOTSPOT' || i.severity === 'CRITICAL' || i.severity === 'BLOCKER');
  
  const lines = bad.map(i => `${i.type} [${i.severity}]: ${i.component.replace('rubygraceones9-crypto_college-evaluation-system:', '')} -> ${i.message}`);
  
  fs.writeFileSync('sonar-all-bad.txt', lines.join('\n'));
  console.log('Saved totally', all.length, 'issues. Target issues to fix:', bad.length);
}

getAllIssues().catch(console.error);
