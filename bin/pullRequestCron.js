const { Octokit } = require("octokit");
const nodemailer = require("nodemailer");
const cron = require("node-cron");

const octokit = new Octokit({
  auth: "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",
});

const transporter = nodemailer.createTransport({
  service: "Gmail", // e.g., Gmail, Outlook, etc.
  auth: {
    user: "arya.aniket@tyreplex.com",
    pass: "Arya@886287",
  },
});

async function checkOpenPRs() {
  try {
    const owner = "arya011tp";
    const repo = "lead-distributor";

    const { data: pullRequests } = await octokit.rest.pulls.list({
      owner,
      repo,
      state: "open",
    });
    console.log(pullRequests)
    const currentDate = new Date();

    for (const pr of pullRequests) {
      const prCreatedAt = new Date(pr.created_at);
      const timeDifferenceInMs = currentDate - prCreatedAt;
      const timeDifferenceInDays = timeDifferenceInMs / (1000 * 60 * 60 * 24);

      if (timeDifferenceInDays >= 7) {
        const creator = pr.user.login;
        const prUrl = pr.html_url;

        const mailOptions = {
          from: "arya.aniket@tyreplex.com",
          to: creator,
          subject: "Reminder: Your Pull Request is still open",
          text: `Your Pull Request (${prUrl}) is still open after 7 days. Please consider reviewing and closing it if necessary.`,
        };

        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            console.error("Error sending email:", error);
          } else {
            console.log("Email sent:", info.response);
          }
        });
      }
    }
  } catch (error) {
    console.error("Error checking open PRs:", error);
  }
}

checkOpenPRs()
// Run the cron job function every day at a specific time (e.g., 12:00 PM)
// cron.schedule("0 12 * * *", checkOpenPRs); // Adjust the cron schedule according to your preference