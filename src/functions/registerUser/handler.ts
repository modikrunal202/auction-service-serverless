import { CognitoIdentityServiceProvider } from 'aws-sdk';
import { USER_POOL_ID } from '@libs/constant'
import { formatJSONResponse } from '@libs/api-gateway';

const cognito = new CognitoIdentityServiceProvider();

export const registerUser = async (event) => {
    const { email, password } = JSON.parse(event.body);
    console.log('register user...', email, password);
    const params: CognitoIdentityServiceProvider.AdminCreateUserRequest = {
        UserPoolId: USER_POOL_ID,
        Username: email,
        UserAttributes: [
            {
                Name: 'email',
                Value: email,
            },
            {
                Name: 'email_verified',
                Value: 'true'

            }
        ],
        MessageAction: 'SUPPRESS',
    }
    const result = await cognito.adminCreateUser(params).promise();
    if (result.User) {
        const paramsToSetPassword: CognitoIdentityServiceProvider.AdminSetUserPasswordRequest = {
            Password: password,
            UserPoolId: USER_POOL_ID,
            Username: email,
            Permanent: true
        }
        await cognito.adminSetUserPassword(paramsToSetPassword).promise()
    }
    return formatJSONResponse(200, {
        message: 'User Registered Successfully.',
        result
    });
}