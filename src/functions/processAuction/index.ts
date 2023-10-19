import { handlerPath } from "@libs/handler-resolver";

export default {
    handler: `${handlerPath(__dirname)}/handler.processAuction`,
    // events: [
    //     {
    //         schedule: "rate(1 minute)"
    //     },
    // ],
    iamRoleStatements: [
        {
            Effect: "Allow",
            Action: [
                'dynamodb:Query',
                'dynamodb:UpdateItem',
            ],
            Resource: [
                '${self:custom.AuctionsTable.arn}',
                {
                    "Fn::Join": ["/", ['${self:custom.AuctionsTable.arn}', 'index', 'statusAndEndDate']]
                }
            ]
        }
    ]
};
