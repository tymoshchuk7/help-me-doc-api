/* eslint-disable */
const sgMail = require('@sendgrid/mail');
import { config } from '../config';
//TODO fix typing
sgMail.setApiKey(config.sendgridApiKey);

interface Params {
  to: string,
  from: string,
  invitationId: string,
}

const emailContent = (from: string, urlLink: string) => (
  `<div>
    <div>${from} invites into his tenant</div>
    <div>Click the <a href="${urlLink}">link</a></div>  
  </div>`
);

const getInvitationUrl = (invitationId: string) => `${config.appUrl}/invitation/${invitationId}`;

export default async function sendEmail({ to, invitationId, from }: Params) {
  return sgMail.send({
    to,
    from: config.sendgridEmail,
    subject: `${from} invites you to tenant`,
    html: emailContent(from, getInvitationUrl(invitationId)),
  });
}