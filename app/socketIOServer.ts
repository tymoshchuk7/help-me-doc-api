import { Application } from 'express';
import jwks from 'jwks-rsa';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { Server, Socket, ExtendedError } from 'socket.io';
import { createServer } from 'http';
import { config } from './config';
import { UserController, TenantController } from './controllers';

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

      const participantMainRoom = `participant-room-${participantId}`;
      await socket.join(participantMainRoom);

      socket.on('ENTER_CHAT_ROOM', (chatId: string) => socket.join(getChatRoomName(chatId)));
      socket.on('LEAVE_CHAT_ROOM', (chatId: string) => socket.leave(getChatRoomName(chatId)));

      socket.on('CHAT_MESSAGE', async (data) => {
        const { chatId, participantId: senderParticipantId, content }: ChatMessagePayload = JSON.parse(data as string);
        const { ChatMessageController, ChatMemberController } = tenant;
        const chatMemember = await ChatMemberController.findOne({
          chat_id: chatId,
          participant_id: senderParticipantId,
        });
        if (!chatMemember) {
          return socket.disconnect();
        }
        const message = await ChatMessageController.create({
          chat_id: chatId,
          chat_member_id: chatMemember.id,
          content,
          sent_timestamp: new Date().toISOString(),
        });
        socketIO.to(getChatRoomName(chatId)).emit('RECEIVE_MESSAGE', JSON.stringify(message));
      });
    } catch {}
  });
