import { handlerPath } from "@libs/handler-resolver";

export default {
    handler: `${handlerPath(__dirname)}/handler.getAuctions`,
    events: [
        {
            http: {
                method: 'get',
                path: 'auctions',
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
            Action: 'dynamodb:Query',
            Resource: [
                '${self:custom.AuctionsTable.arn}',
                {
                    "Fn::Join": ["/", ['${self:custom.AuctionsTable.arn}', 'index', 'statusAndEndDate']]
                }
            ]
        }
    ]
};
