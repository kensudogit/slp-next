import { NextResponse } from 'next/server';
import { HealthStatus } from '@/types';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { S3Client } from '@aws-sdk/client-s3';

export async function GET() {
  try {
    const healthStatus: HealthStatus = {
      dynamodb: false,
      s3: false,
      lambda: true,
      initialization: true,
      timestamp: Date.now()
    };

    // Check DynamoDB connection
    try {
      const dynamoDb = new DynamoDBClient({});
      await dynamoDb.send(new DynamoDBClient({}).config.requestHandler);
      healthStatus.dynamodb = true;
    } catch (error) {
      console.error('DynamoDB health check failed:', error);
    }

    // Check S3 connection
    try {
      const s3 = new S3Client({});
      await s3.send(new S3Client({}).config.requestHandler);
      healthStatus.s3 = true;
    } catch (error) {
      console.error('S3 health check failed:', error);
    }

    // Add memory information if available
    if (process.env.AWS_LAMBDA_FUNCTION_MEMORY_SIZE) {
      healthStatus.memory = {
        limit: parseInt(process.env.AWS_LAMBDA_FUNCTION_MEMORY_SIZE)
      };
    }

    const overallHealth = healthStatus.dynamodb && healthStatus.s3;

    return NextResponse.json({
      status: overallHealth ? 'healthy' : 'unhealthy',
      details: healthStatus,
      message: overallHealth ? 'System operational' : 'System degraded'
    }, {
      status: overallHealth ? 200 : 500
    });
  } catch (error) {
    console.error('Health check failed:', error);
    return NextResponse.json({
      status: 'unhealthy',
      details: {
        dynamodb: false,
        s3: false,
        lambda: true,
        initialization: true,
        timestamp: Date.now()
      },
      message: 'System health check failed'
    }, {
      status: 500
    });
  }
} 