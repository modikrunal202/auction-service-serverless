import { DynamoDB } from 'aws-sdk';
import {
    TABLE_NAME
} from '@libs/constant'
const dynamoDb = new DynamoDB.DocumentClient();

export async function getEndedAuctions() {
    const now = new Date();
    const params: DynamoDB.DocumentClient.QueryInput = {
        TableName: TABLE_NAME,
        IndexName: 'statusAndEndDate',
        KeyConditionExpression: '#status = :status AND endingAt <= :now',
        ExpressionAttributeValues: {
            ':status': 'OPEN',
            ':now': now.toISOString()
        },
        ExpressionAttributeNames: {
            '#status': 'status'
        }
    }
    const result = await dynamoDb.query(params).promise()
    return result.Items;
}