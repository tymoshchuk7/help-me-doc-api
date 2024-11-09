import { Response, Request } from 'express';
import { asyncRoute, sendEmail } from '../../helpers';
import { InvitationController } from '../../controllers';
import { TRole } from '../../types';

interface Body {
  data: {
    email: string,
    role: TRole,
  },
}

export default asyncRoute(async (req: Request<object, object, Body>, res: Response) => {
  const { user } = req;
  const { data: { email, role } } = req.body;

  const invitation = await InvitationController.create({ email, role, tenant: user.default_tenant });

  try {
    await sendEmail({
      from: user.email,
      to: email,
      invitationId: invitation.id,
    });
  } catch (e) {
    console.error(e);
  }

  return res.json({
    invitations: [invitation],
  });
});