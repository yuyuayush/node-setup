import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses';
import { config } from '../config/index.js';

const sesClient = new SESClient({
  region: config.aws.region,
  credentials: {
    accessKeyId: config.aws.accessKeyId,
    secretAccessKey: config.aws.secretAccessKey,
  },
});

export const sendMail = async (to, subject, htmlBody) => {
  const command = new SendEmailCommand({
    Destination: { ToAddresses: [to] },
    Message: {
      Body: { Html: { Charset: 'UTF-8', Data: htmlBody } },
      Subject: { Charset: 'UTF-8', Data: subject },
    },
    Source: config.aws.sesSender,
  });

  await sesClient.send(command);
}
