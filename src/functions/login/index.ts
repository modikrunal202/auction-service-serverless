import { handlerPath } from "@libs/handler-resolver";

export default {
    handler: `${handlerPath(__dirname)}/handler.loginUser`,
    events: [
        {
            http: {
                method: 'post',
                path: 'login',
            },
        },
    ],
    iamRoleStatements: [
        {
            Effect: "Allow",
            Action: [
                'cognito-idp:AdminInitiateAuth',
            ],
            Resource: '${self:custom.AuctionCognitoPool.arn}'
        }
    ]
};
