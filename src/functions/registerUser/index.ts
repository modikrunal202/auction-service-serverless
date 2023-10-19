import { handlerPath } from "@libs/handler-resolver";

export default {
    handler: `${handlerPath(__dirname)}/handler.registerUser`,
    events: [
        {
            http: {
                method: 'post',
                path: 'register',
            },
        },
    ],
    iamRoleStatements: [
        {
            Effect: "Allow",
            Action: [
                'cognito-idp:AdminCreateUser',
                'cognito-idp:AdminSetUserPassword'
            ],
            Resource: '${self:custom.AuctionCognitoPool.arn}'
        }
    ]
};
