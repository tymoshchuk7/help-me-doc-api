const sgMail = require('@sendgrid/mail');
//TODO fix typing
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

interface Params {
  to: string,
  from: string,
  invitationId: string,
  isUserExists: boolean,
}

const emailContent = (from: string, urlLink: string) => (
  `<div>
    <div>${from} invites into his tenant</div>
    <div>Click the <a href="${urlLink}">link</a></div>  
  </div>`
);

const getInvitationUrl = (invitationId: string, isUserExists: boolean) => (
  `${process.env.APP_URL}/invitation/${invitationId}?userExists=${isUserExists}`
);

export default async function sendEmail({ to, invitationId, from, isUserExists }: Params) {
  return sgMail.send({
    to,
    from: process.env.SENDGRID_EMAIL,
    subject: `${from} invites you to tenant`,
    html: emailContent(from, getInvitationUrl(invitationId, isUserExists)),
  });
}