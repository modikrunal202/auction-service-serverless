import { CognitoIdentityServiceProvider } from 'aws-sdk';
import { USER_POOL_CLIENT, USER_POOL_ID } from '@libs/constant'
import { formatJSONResponse } from '@libs/api-gateway';

const cognito = new CognitoIdentityServiceProvider();

export const loginUser = async (event) => {
    const { email, password } = JSON.parse(event.body);
    console.log('COGNITO_ARN...', process.env.COGNITO_ARN);
    const params: CognitoIdentityServiceProvider.AdminInitiateAuthRequest = {
        UserPoolId: USER_POOL_ID,
        AuthFlow: "ADMIN_NO_SRP_AUTH",
        AuthParameters: {
            USERNAME: email,
            PASSWORD: password
        },
        ClientId: USER_POOL_CLIENT,
    }
    const result = await cognito.adminInitiateAuth(params).promise();
    return formatJSONResponse(200, {
        message: 'User Login Successfully.',
        data: result.AuthenticationResult
    });
}