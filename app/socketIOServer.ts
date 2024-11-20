import { Application, Request } from 'express';
import jwks from 'jwks-rsa';
import jwt, { VerifyOptions, Jwt, JwtPayload } from 'jsonwebtoken';
import { Server } from 'socket.io';
import { createServer } from 'http';
import { config } from './config';
import { UserController, ChatMessageController, ChatMemberController } from './controllers';

interface Handshake {
  token: string,
  participantId: string,
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

socketIO.on('connection', async (socket) => {
  const { token, participantId } = socket.handshake.auth as Handshake;
  const options = {
    secret: jwks.expressJwtSecret({
      cache: true,
      rateLimit: true,
      jwksRequestsPerMinute: 5,
      jwksUri: config.auth0JwksUri,
    }) as jwks.GetVerificationKey,
    issuer: config.auth0Issuer,
    algorithms: ['RS256'],
  };

  let decodedToken: Jwt | null = null;

  try {
    decodedToken = jwt.decode(token, { complete: true }) as Jwt;
  } catch (err) {
    return socket.disconnect();
  }

  const key = await options.secret({
    headers: {
      authorization: `Bearer ${token}`,
    },
  } as unknown as Request, decodedToken);

  if (!key) {
    return socket.disconnect();
  }

  try {
    jwt.verify(token, key, options as VerifyOptions);
  } catch (err) {
    socket.disconnect();
  }

  const email = (decodedToken?.payload as JwtPayload)?.email as string;
  const user = await UserController.findOne({ email });

  if (!user) {
    return socket.disconnect();
  }

  const chatRoom = `participant-room-${participantId}`;
  await socket.join(chatRoom);

  socket.on('ENTER_CHAT_ROOM', (chatId: string) => socket.join(getChatRoomName(chatId)));
  socket.on('LEAVE_CHAT_ROOM', (chatId: string) => socket.leave(getChatRoomName(chatId)));

  socket.on('CHAT_MESSAGE', async (data) => {
    const { chatId, participantId: senderParticipantId, content }: ChatMessagePayload = JSON.parse(data as string);
    const chatMemember = await ChatMemberController.findOne(user.default_tenant, {
      chat_id: chatId,
      participant_id: senderParticipantId,
    });
    if (!chatMemember) {
      return socket.disconnect();
    }
    const message = await ChatMessageController.create(user.default_tenant, {
      chat_id: chatId,
      chat_member_id: chatMemember.id,
      participant_id: participantId,
      content,
      sent_timestamp: new Date().toISOString(),
    });
    socketIO.to(getChatRoomName(chatId)).emit('RECEIVE_MESSAGE', JSON.stringify(message));
  });
});
