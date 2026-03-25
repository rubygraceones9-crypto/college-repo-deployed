const fs = require('fs');
fetch('https://sonarcloud.io/api/issues/search?componentKeys=rubygraceones9-crypto_college-evaluation-system&resolved=false')
  .then(res => res.json())
  .then(data => {
    const issues = data.issues.map(i => ({
      severity: i.severity,
      type: i.type,
      component: i.component,
      message: i.message,
      rule: i.rule
    }));
    fs.writeFileSync('sonar-issues.json', JSON.stringify(issues, null, 2));
    console.log(`Saved ${issues.length} issues.`);
  });
