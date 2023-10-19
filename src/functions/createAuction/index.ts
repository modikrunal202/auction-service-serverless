import { handlerPath } from "@libs/handler-resolver";
// import {
//     ACCOUNT_ID,
//     REGION
// } from '../../libs/constant'

export default {
    handler: `${handlerPath(__dirname)}/handler.createAuction`,
    events: [
        {
            http: {
                method: 'post',
                path: 'auction',
                cors: true,
                authorizer: {
                    type: 'COGNITO_USER_POOLS',
                    authorizerId: {
                        "Ref": "ApiGatewayAuthorizer",
                    }
                },
            },
        },
    ],
    iamRoleStatements: [
        {
            Effect: "Allow",
            Action: 'dynamodb:PutItem',
            // Resource: `arn:aws:dynamodb:${REGION}:${ACCOUNT_ID}:table/AuctionsTable`
            Resource: "${self:custom.AuctionsTable.arn}"
            // Resource: 'arn:aws:dynamodb:ap-south-1:464490416531:table/AuctionsTable'
        }
    ]
};
