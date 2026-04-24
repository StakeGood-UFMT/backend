const { execSync } = require('child_process');
const fs = require('fs');

const repos = [
    { name: 'smartcontract', file: 'SMARTCONTRACT_ISSUES_PRS.md' }
];

repos.forEach(repoInfo => {
    const repo = `StakeGood-UFMT/${repoInfo.name}`;
    console.log(`Processing ${repo}...`);

    try {
        console.log('Fetching issues...');
        const issues = JSON.parse(execSync(`gh issue list --repo ${repo} --state all --limit 100 --json number,title,body,state,createdAt,author,labels`, { encoding: 'utf8', maxBuffer: 10 * 1024 * 1024 }));

        console.log('Fetching PRs...');
        const prs = JSON.parse(execSync(`gh pr list --repo ${repo} --state all --limit 100 --json number,title,body,state,createdAt,author,mergedAt,url`, { encoding: 'utf8', maxBuffer: 10 * 1024 * 1024 }));

        let md = `# StakeGood ${repoInfo.name.toUpperCase()} - Issues & PRs Report\n\n`;

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

        fs.writeFileSync(repoInfo.file, md);
        console.log(`Report generated: ${repoInfo.file}`);
    } catch (err) {
        console.error(`Error processing ${repo}:`, err.message);
    }
});
