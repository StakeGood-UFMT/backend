const { execSync } = require('child_process');
const fs = require('fs');

const repo = 'StakeGood-UFMT/backend';

function getJson(cmd) {
    return JSON.parse(execSync(cmd, { encoding: 'utf8', maxBuffer: 10 * 1024 * 1024 }));
}

console.log('Fetching issues...');
const issues = getJson(`gh issue list --repo ${repo} --state all --limit 100 --json number,title,body,state,createdAt,author,labels`);

console.log('Fetching PRs...');
const prs = getJson(`gh pr list --repo ${repo} --state all --limit 100 --json number,title,body,state,createdAt,author,mergedAt,url`);

let md = '# StakeGood Backend - Issues & PRs Report\n\n';

md += '## Issues\n\n';
issues.sort((a, b) => b.number - a.number).forEach(issue => {
    md += `### #${issue.number} - ${issue.title}\n`;
    md += `- **State:** ${issue.state}\n`;
    md += `- **Created at:** ${issue.createdAt}\n`;
    md += `- **Author:** ${issue.author.login}\n`;
    if (issue.labels && issue.labels.length > 0) {
        md += `- **Labels:** ${issue.labels.map(l => l.name).join(', ')}\n`;
    }
    md += '\n#### Description\n';
    md += (issue.body || '*No description provided.*').trim() + '\n\n';
    md += '---\n\n';
});

md += '## Pull Requests\n\n';
prs.sort((a, b) => b.number - a.number).forEach(pr => {
    md += `### PR #${pr.number} - ${pr.title}\n`;
    md += `- **State:** ${pr.state}\n`;
    md += `- **Created at:** ${pr.createdAt}\n`;
    if (pr.mergedAt) md += `- **Merged at:** ${pr.mergedAt}\n`;
    md += `- **Author:** ${pr.author.login}\n`;
    md += `- **URL:** ${pr.url}\n`;
    md += '\n#### Description\n';
    md += (pr.body || '*No description provided.*').trim() + '\n\n';
    md += '---\n\n';
});

fs.writeFileSync('BACKEND_ISSUES_PRS.md', md);
console.log('Report generated: BACKEND_ISSUES_PRS.md');
