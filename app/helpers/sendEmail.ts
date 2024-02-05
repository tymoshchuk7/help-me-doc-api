/* eslint-disable */
const sgMail = require('@sendgrid/mail');
import { config } from '../config';
//TODO fix typing
sgMail.setApiKey(config.sendgridApiKey);

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
  `${config.appUrl}/invitation/${invitationId}?userExists=${isUserExists}`
);

export default async function sendEmail({ to, invitationId, from, isUserExists }: Params) {
  return sgMail.send({
    to,
    from: config.sendgridEmail,
    subject: `${from} invites you to tenant`,
    html: emailContent(from, getInvitationUrl(invitationId, isUserExists)),
  });
}