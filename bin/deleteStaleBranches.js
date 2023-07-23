const { Octokit } = require('@octokit/rest');
const cron = require('cron');

const accessToken = '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';

const owner = 'arya011tp';
const repo = 'sampleLMS';
const octokit = new Octokit({ auth: accessToken });

async function deleteOldBranches() {
    try {
        const branches = await octokit.repos.listBranches({ owner, repo });

        const currentDate = new Date();
        const sixMonthsAgo = new Date();

        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

        for (const branch of branches.data) {
            const branchData = await octokit.repos.getBranch({ owner, repo, branch: branch.name });
            const branchCreationDate = new Date(branchData.data.commit.commit.author.date);

            if (branchCreationDate < sixMonthsAgo) {
                if (branch.name !== 'main' && branch.name !== 'master') {
                    console.log(`Deleting branch: ${branch.name}`);
                    await octokit.git.deleteRef({ owner, repo, ref: `heads/${branch.name}` });
                }
            }
        }
    } catch (error) {
        console.error('Error:', error.message);
    }
}

deleteOldBranches()

// Schedule the function to run every 1st day of the month at 00:00 AM.
// cron.schedule('0 0 1 * *', () => {
//     deleteOldBranches();
// });
