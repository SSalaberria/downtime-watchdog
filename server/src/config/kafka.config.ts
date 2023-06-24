export const kafkaConfig = {
  name: 'KAFKA_SERVICE',
  transport: 6,
  options: {
    client: {
      clientId: 'nestjs-kafka-task-queue',
      brokers: ['localhost:9092'],
    },
    consumer: {
      groupId: 'nestjs-kafka-task-queue-group',
    },
  },
};
