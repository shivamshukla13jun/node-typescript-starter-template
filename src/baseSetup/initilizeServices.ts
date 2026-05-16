import { initializeBullMQ } from "libs/bullmq";
import { initializeConsumers } from "libs/rabbitmq/consumers";
import { rabbitMQService } from "libs/rabbitmq/rabbitmq.service";
import { connectRedis } from "libs/redis";

const initializeServices=async()=>{
    try {
    // Initialize RabbitMQ
    await rabbitMQService.initialize();
        // Connect Redis
    await connectRedis();
    // console.log('✅ Redis connected');
    await  initializeConsumers()
    // // Initialize BullMQ before migrations
    await initializeBullMQ();
    console.log('✅ BullMQ initialized');
    } catch (error) {
        console.log(error,"Failed to initialize services")
    }
}
export default initializeServices