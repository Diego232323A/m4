const AWS = require('aws-sdk');
const sqs = new AWS.SQS({ region: 'us-east-2' });

const processMessages = async () => {
    const params = {
        QueueUrl: 'https://sqs.us-east-2.amazonaws.com/339712766050/BookingConfirmedQueue',
        MaxNumberOfMessages: 10,
        WaitTimeSeconds: 20
    };

    try {
        const messages = await sqs.receiveMessage(params).promise();
        if (messages.Messages) {
            for (const message of messages.Messages) {
                console.log('Raw message:', message.Body);

                // Analizar el cuerpo del mensaje
                try {
                    const body = JSON.parse(message.Body);  // Asegúrate de analizar solo el Body
                    console.log('Parsed body:', body);

                    if (body.Message) {
                        const eventMessage = body.Message;

                        try {
                            const event = JSON.parse(eventMessage);  // Analizar el contenido del mensaje SNS
                            console.log('Parsed event:', event);

                            const { bookingId, userId } = event;

                            // Procesar el evento
                            sendNotification(userId, bookingId);

                            // Eliminar el mensaje de la cola
                            await sqs.deleteMessage({
                                QueueUrl: params.QueueUrl,
                                ReceiptHandle: message.ReceiptHandle
                            }).promise();
                        } catch (innerError) {
                            console.error('Error parsing event message:', innerError);

                            // Eliminar el mensaje inválido de la cola
                            await sqs.deleteMessage({
                                QueueUrl: params.QueueUrl,
                                ReceiptHandle: message.ReceiptHandle
                            }).promise();
                        }
                    } else {
                        console.error('No Message found in body:', body);

                        // Eliminar el mensaje inválido de la cola
                        await sqs.deleteMessage({
                            QueueUrl: params.QueueUrl,
                            ReceiptHandle: message.ReceiptHandle
                        }).promise();
                    }
                } catch (error) {
                    console.error('Error parsing message body:', error);

                    // Eliminar el mensaje inválido de la cola
                    await sqs.deleteMessage({
                        QueueUrl: params.QueueUrl,
                        ReceiptHandle: message.ReceiptHandle
                    }).promise();
                }
            }
        }
    } catch (error) {
        console.error('Error processing messages:', error);
    }
};

const sendNotification = (userId, bookingId) => {
    // Lógica para enviar la notificación
    console.log(`Notificación enviada a usuario ${userId} para la reserva ${bookingId}`);
};

// Llamar a esta función periódicamente para procesar mensajes
setInterval(processMessages, 20000);
