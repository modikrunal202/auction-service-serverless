import { handlerPath } from "@libs/handler-resolver";

export default {
    handler: `${handlerPath(__dirname)}/handler.placeBid`,
    events: [
        {
            http: {
                method: 'patch',
                path: 'auction/{id}/bid',
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
            Action: [
                'dynamodb:UpdateItem',
                'dynamodb:GetItem'
            ],
            Resource: "${self:custom.AuctionsTable.arn}"
        }
    ]
};
