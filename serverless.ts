import { config } from 'dotenv';
config();
import type { AWS } from '@serverless/typescript';

import { createAuction, getAuctions, getAuction, placeBid, processAuction, registerUser, loginUser } from './src/functions';


const serverlessConfiguration: AWS = {
  service: 'udemy-typescript-learning',
  frameworkVersion: '3',
  useDotenv: true,
  plugins: ['serverless-esbuild', 'serverless-iam-roles-per-function', 'serverless-offline'],
  provider: {
    name: 'aws',
    runtime: 'nodejs14.x',
    stage: "${opt:stage, 'dev'}",
    region: 'ap-south-1',
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      NODE_OPTIONS: '--enable-source-maps --stack-trace-limit=1000',
      REGION: '${env:REGION}',
      ACCOUNT_ID: '${env:ACCOUNT_ID}',
      ACCOUNT_TEMP: '${env:ACCOUNT_TEMP}',
      AUCTIONS_TABLE_NAME: '${self:custom.AuctionsTable.name}',
      USER_POOL_ID: {
        'Ref': 'UserPool',
      },
      USER_POOL_CLIENT: {
        'Ref': 'UserClient'
      },
      COGNITO_ARN: '${self:custom.AuctionCognitoPool.arn}'
    },
  },
  resources: {
    "Resources": {
      "UserPool": {
        Type: "AWS::Cognito::UserPool",
        Properties: {
          UserPoolName: "AuctionsTable-pool-${self:provider.stage}",
          Schema: [
            {
              Name: 'email',
              Required: true,
              Mutable: true
            }
          ],
          Policies: {
            PasswordPolicy: {
              MinimumLength: 6
            }
          },
          AutoVerifiedAttributes: ['email']
        }
      },
      "UserClient": {
        Type: "AWS::Cognito::UserPoolClient",
        Properties: {
          ClientName: "AuctionsTable-client-${self:provider.stage}",
          GenerateSecret: false,
          UserPoolId: {
            "Ref": "UserPool"
          },
          AccessTokenValidity: 5,
          IdTokenValidity: 5,
          ExplicitAuthFlows: [
            "ADMIN_NO_SRP_AUTH"
          ]
        }
      },
      "AuctionsTable": {
        "Type": "AWS::DynamoDB::Table",
        "Properties": {
          "TableName": "AuctionsTable-${self:provider.stage}",
          "BillingMode": "PAY_PER_REQUEST",
          "AttributeDefinitions": [
            {
              "AttributeName": "id",
              "AttributeType": "S"
            },
            {
              "AttributeName": "status",
              "AttributeType": "S"
            },
            {
              "AttributeName": "endingAt",
              "AttributeType": "S"
            }
          ],
          "KeySchema": [
            {
              "AttributeName": "id",
              "KeyType": "HASH"
            }
          ],
          "GlobalSecondaryIndexes": [
            {
              IndexName: "statusAndEndDate",
              KeySchema: [
                {
                  "AttributeName": "status",
                  "KeyType": "HASH"
                },
                {
                  "AttributeName": "endingAt",
                  "KeyType": "RANGE"
                },
              ],
              Projection: {
                ProjectionType: "ALL"
              }
            }
          ]
        }
      },
      "ApiGatewayAuthorizer": {
        "Type": "AWS::ApiGateway::Authorizer",
        'DependsOn': [
          'ApiGatewayRestApi'
        ],
        Properties: {
          Name: 'cognito-authorizer',
          IdentitySource: "method.request.header.Authorization",
          RestApiId: {
            'Ref': 'ApiGatewayRestApi'
          },
          Type: 'COGNITO_USER_POOLS',
          ProviderARNs: [
            {
              "Fn::GetAtt": ["UserPool", "Arn"]
            }
          ]

        }
      }
    }
  },
  // import the function via paths
  functions: { createAuction, getAuctions, getAuction, placeBid, processAuction, registerUser, loginUser },
  package: { individually: true },
  custom: {
    AuctionsTable: {
      name: {
        "Ref": "AuctionsTable"
      },
      arn: {
        "Fn::GetAtt": ["AuctionsTable", "Arn"]
      },
      temp: 'hello',
    },
    AuctionCognitoPool: {
      arn: {
        "Fn::GetAtt": ["UserPool", "Arn"]
      }
    },
    esbuild: {
      bundle: true,
      minify: false,
      sourcemap: true,
      exclude: ['aws-sdk'],
      target: 'node14',
      define: { 'require.resolve': undefined },
      platform: 'node',
      concurrency: 10,
    },
  },
};

module.exports = serverlessConfiguration;
