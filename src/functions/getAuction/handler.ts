import { formatJSONResponse } from "@libs/api-gateway";
import AWS from 'aws-sdk';
import {
    TABLE_NAME
} from '@libs/constant'

const dynamoDb = new AWS.DynamoDB.DocumentClient();

export const getAuctionById = async (id) => {
    let auction;
    try {
        const result = await dynamoDb.get({
            TableName: TABLE_NAME,
            Key: { id }
        }).promise();
        auction = result.Item;
        return auction;
    } catch (error) {
        console.error('error in Get Auction', error)
        throw new Error('Internal server exception')
    }
}

export const getAuction = async (event) => {
    const { id } = event.pathParameters;
    let auction = await getAuctionById(id);

    if (!auction) {
        return formatJSONResponse(404, {
            message: 'Auction Item not found.'
        })
    }

    return formatJSONResponse(200, {
        message: 'Success',
        auction,
    });
}