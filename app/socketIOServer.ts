/* eslint-disable max-lines */
import { Application } from 'express';
import jwks from 'jwks-rsa';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { Server, Socket, ExtendedError } from 'socket.io';
import { createServer } from 'http';
import { config } from './config';
import { UserController, TenantController } from './controllers';
import { TenantChatMember, User } from './types';

interface Handshake {
  token: string,
  participantId: string,
  tenantId: string,
}

interface ChatMessagePayload {
  chatId: string,
  participantId: string,
  content: string,
}

interface INotification {
  roomName: string,
  event: string,
  payload: any,
}

interface INewMessageNotification {
  recipientParticipantId: string,
  userSender: User,
  messageId: string,
  chatId: string,
}

const socketIO = new Server();

export function initializeSocketIO(app: Application) {
  const server = createServer(app);
  socketIO.attach(server, {
    pingInterval: 10000,
    pingTimeout: 5000,
    cookie: false,
  });
  return server;
}

const getChatRoomName = (chatId: string) => `chat-room-${chatId}`;
const getMainRoomName = (participantId: string) => `participant-room-${participantId}`;

function getKey(header: jwt.JwtHeader, callback: jwt.SigningKeyCallback) {
  const client = jwks({
    jwksUri: config.auth0JwksUri,
  });
  client.getSigningKey(header.kid || '', (err, key) => {
    if (err) {
      return callback(err);
    }
    const signingKey = key?.getPublicKey();
    callback(null, signingKey);
  });
}

const authenticateSocket = (socket: Socket, next: (err?: ExtendedError) => void) => {
  const token = socket.handshake.auth?.token as string;

  if (!token) {
    return next(new Error('Authentication token missing'));
  }

  jwt.verify(token, getKey, {
    algorithms: ['RS256'],
  }, (err, decoded) => {
    if (err) {
      return next(new Error('Invalid or expired token'));
    }
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    socket.data.user = decoded as JwtPayload;
    return next();
  });
};

const broadcastNotification = ({ roomName, event, payload }: INotification) =>
  socketIO.to(roomName).emit(event, JSON.stringify(payload));

const broadcastChatMessage = (chatId: string, message: object) => broadcastNotification({
  roomName: getChatRoomName(chatId),
  event: 'RECEIVE_MESSAGE',
  payload: message,
});
// socketIO.to(participantMainRoom).emit('READY')
const broadcastSocketReady = (roomName: string) => broadcastNotification({
  roomName,
  event: 'READY',
  payload: {},
});

export const sendNewMessageNotification = ({
  recipientParticipantId, messageId, userSender, chatId,
}: INewMessageNotification) => broadcastNotification({
  roomName: getMainRoomName(recipientParticipantId),
  event: 'NOTIFICATION',
  payload: {
    type: 'MESSAGE_NOTIFICATION',
    title: `${userSender.first_name} ${userSender.last_name} sent you a message`,
    description: '',
    attributes: { messageId, chatId },
  },
});

/*
* WARNING: It will not work for multiple instances,
* as users can be connected to different app instances.
*/

socketIO
  .use(authenticateSocket)
  .on('connection', async (socket) => {
    try {
      const { participantId, tenantId } = socket.handshake.auth as Handshake;
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      const email = (socket.data?.user as JwtPayload)?.email as string;
      const user = await UserController.findOne({ email });
      const tenant = await TenantController.findOneById(tenantId);

      if (!user || !tenant) {
        return socket.disconnect();
      }

      const participantMainRoom = getMainRoomName(participantId);
      await socket.join(participantMainRoom);

      socket.on('ENTER_CHAT_ROOM', (chatId: string) => socket.join(getChatRoomName(chatId)));
      socket.on('LEAVE_CHAT_ROOM', (chatId: string) => socket.leave(getChatRoomName(chatId)));

      socket.on('CHAT_MESSAGE', async (data) => {
        const { chatId, participantId: senderParticipantId, content }: ChatMessagePayload = JSON.parse(data as string);
        const { ChatMessageController, ChatMemberController } = tenant;
        const chatMember = await ChatMemberController.findOne({
          chat_id: chatId,
          participant_id: senderParticipantId,
        });
        if (!chatMember) {
          return socket.disconnect();
        }
        const message = await ChatMessageController.create({
          chat_id: chatId,
          chat_member_id: chatMember.id,
          content,
        });
        broadcastChatMessage(chatId, message);

        const queryObject = ChatMemberController.query();
        const chatMemberRecipient: TenantChatMember = await queryObject
          .where({ chat_id: chatId })
          .whereNot('participant_id', senderParticipantId)
          .first();

        if (chatMemberRecipient) {
          sendNewMessageNotification({
            recipientParticipantId: chatMemberRecipient.participant_id,
            userSender: user,
            messageId: message.id,
            chatId: chatId,
          });
        }
      });

      broadcastSocketReady(participantMainRoom);
    } catch {}
  });
