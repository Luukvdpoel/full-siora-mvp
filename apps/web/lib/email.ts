import { getResend } from "@/lib/resend";

export async function sendEmail(to: string, subject: string, html: string) {
  const resend = getResend();
  if (!resend) return;
  await resend.emails.send({
    from: "Siora <hello@usesiora.com>",
    to,
    subject,
    html,
  });
}

export async function sendWelcomeEmail(to: string, brandName: string) {
  const name = brandName || "there";
  const html = `
    <h2>Hi ${name}, welcome to Siora!</h2>
    <p>We built Siora to help brands like yours find value-aligned creators in minutes.</p>
    <p>Here’s how to get started today:</p>
    <ol>
      <li>Create your first campaign brief (just 2 lines).</li>
      <li>Click <b>Analyze + Generate</b> to see instant matches.</li>
      <li>Add the best to your shortlist → draft your first outreach.</li>
    </ol>
    <p><a href="https://usesiora.com/campaigns/new" style="background:#4f46e5;color:white;padding:12px 20px;border-radius:8px;text-decoration:none;">Create campaign now</a></p>
    <p style="margin-top:24px;font-size:12px;color:#999">PS. You start with 20 free credits — enough to test matches right away.</p>
  `;
  await sendEmail(to, "Welcome to Siora 🎉 Your first matches await", html);
}
