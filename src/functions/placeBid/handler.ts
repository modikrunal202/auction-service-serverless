import { formatJSONResponse } from "@libs/api-gateway";
import AWS from 'aws-sdk';
import {
    TABLE_NAME
} from '@libs/constant'
import { getAuctionById } from "@functions/getAuction/handler";

const dynamoDb = new AWS.DynamoDB.DocumentClient();


export const placeBid = async (event) => {
    const { id } = event.pathParameters;
    const { amount } = JSON.parse(event.body);
    const { email } = event.requestContext.authorizer.claims;
    let auction = await getAuctionById(id);
    if (!auction) {
        return formatJSONResponse(404, {
            message: 'Auction Item not found.'
        })
    }
    if (auction.status !== 'OPEN') {
        return formatJSONResponse(401, {
            message: `Your can not bid on this ${auction.title}`
        })
    }
    if (amount <= auction.highestBid.amount) {
        return formatJSONResponse(401, {
            message: `Your bid must be higher than current bid amount ${auction.highestBid.amount}`
        })
    }
    console.log('bodyyy', event.body);
    console.log('amount', amount);

    let updatedAuction;
    try {
        const params: AWS.DynamoDB.DocumentClient.UpdateItemInput = {
            TableName: TABLE_NAME,
            Key: { id },
            UpdateExpression: 'set highestBid.amount = :amount, highestBid.bidder = :bidder',
            ExpressionAttributeValues: {
                ':amount': amount,
                ':bidder': email,
            },
            ReturnValues: 'ALL_NEW'
        }

        const result = await dynamoDb.update(params).promise();
        updatedAuction = result.Attributes;

    } catch (error) {
        console.error('error in Place Bid', error)
    }

    return formatJSONResponse(200, {
        message: 'Success',
        updatedAuction,
    });
}