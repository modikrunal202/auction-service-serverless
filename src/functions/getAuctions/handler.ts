import { formatJSONResponse } from "@libs/api-gateway";
import { DynamoDB } from 'aws-sdk';
import {
    TABLE_NAME
} from '@libs/constant';


const dynamoDb = new DynamoDB.DocumentClient();


export const getAuctions = async (event) => {
    let auctions = [];
    const { status = 'OPEN' } = event.queryStringParameters;
    try {
        const params: DynamoDB.DocumentClient.QueryInput = {
            TableName: TABLE_NAME,
            IndexName: 'statusAndEndDate',
            KeyConditionExpression: '#status = :status',
            ExpressionAttributeValues: {
                ':status': status
            },
            ExpressionAttributeNames: {
                '#status': 'status'
            }
        }
        const result = await dynamoDb.query(params).promise();
        auctions = result.Items;
        return formatJSONResponse(200, {
            message: 'Success',
            auctions,
        });
    } catch (error) {
        console.error('error in Get Auctions', error)
        return formatJSONResponse(503, {
            message: 'Failed',
        });
    }

}