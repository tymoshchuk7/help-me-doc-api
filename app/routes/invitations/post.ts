import { Response, Request } from 'express';
import { asyncRoute, sendEmail, prepareAPIResponse } from '../../helpers';
import { InvitationController, UserController } from '../../controllers';

interface Body {
  email: string,
  role: string,
}

export default asyncRoute(async (req: Request<object, object, Body>, res: Response) => {
  const { user } = req;
  const { email, role } = req.body;

  const invitation = await InvitationController.create({ email, role, tenant: user.defaultTenant });

  if (!invitation) {
    throw new Error('Invitation has not been created');
  }

  const invitedUser = await UserController.findOne({ email });

  await sendEmail({
    from: user.email,
    to: email,
    invitationId: invitation.id,
    isUserExists: !!invitedUser,
  });

  return res.json({
    invitations: prepareAPIResponse(invitation),
  });
});