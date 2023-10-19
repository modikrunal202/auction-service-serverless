import { formatJSONResponse } from "@libs/api-gateway";
import { v4 as uuid } from 'uuid';
import AWS from 'aws-sdk';
import {
    TABLE_NAME
} from '@libs/constant'

const dynamoDb = new AWS.DynamoDB.DocumentClient();


export const createAuction = async (event) => {
    const { title } = JSON.parse(event.body);
    const { email } = event.requestContext.authorizer.claims;
    const now = new Date();
    const endAt = new Date();
    endAt.setHours(now.getHours() + 1);
    const auction = {
        id: uuid(),
        title,
        status: 'OPEN',
        createdAt: now.toISOString(),
        highestBid: {
            amount: 0,
        },
        endingAt: endAt.toISOString(),
        seller: email
    };
    await dynamoDb.put({
        TableName: TABLE_NAME,
        Item: { ...auction }
    }).promise();

    return formatJSONResponse(201, {
        message: 'Success',
        auction,
    });
}