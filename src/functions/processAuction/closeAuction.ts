import { DynamoDB } from 'aws-sdk';
import {
    TABLE_NAME
} from '@libs/constant'
const dynamoDb = new DynamoDB.DocumentClient();


export async function closeAuction(auction) {
    const params: DynamoDB.DocumentClient.UpdateItemInput = {
        TableName: TABLE_NAME,
        Key: { id: auction.id },
        UpdateExpression: 'set #status = :status',
        ExpressionAttributeValues: {
            ':status': 'CLOSED'
        },
        ExpressionAttributeNames: {
            '#status': 'status'
        }
    }
    return await dynamoDb.update(params).promise();
}