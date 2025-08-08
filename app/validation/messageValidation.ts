import { Schema } from 'express-validator';

const createSchema: Schema = {
  'data.participantRecipientId': {
    errorMessage: 'Recipient is required',
    notEmpty: true,
    isLength: {
      options: { max: 36 },
    },
  },
  'data.content': {
    errorMessage: 'Recipient is required',
    notEmpty: true,
  },
};

export default { createSchema };
