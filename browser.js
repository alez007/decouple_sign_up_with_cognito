var AmazonCognitoIdentity = require('amazon-cognito-identity-js');
var poolData = {
    UserPoolId : 'eu-west-1_o6rTi0jr2', // Your user pool id here
    ClientId : '54j5i8o3j3j51lgdr6icppmqo5' // Your client id here
};
var userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);

var cognitoUser = userPool.getCurrentUser();
if (cognitoUser != null) {
    cognitoUser.getSession((err, result) => {
        console.log(err);
        console.log(result);

        cognitoUser.getUserAttributes(function(err, attributes) {
            if (err) {
                // Handle error
            } else {
                // Do something with attributes
                console.log(attributes);
            }
        });
    });
}

document.getElementById("registerForm").onsubmit = (evt) => {
    var email = evt.target.childNodes[1].value;
    var password = evt.target.childNodes[3].value;

    var responseSpan = document.getElementById('registerResponse');
    responseSpan.textContent = '';

    userPool.signUp(email, password, [], null, (err, result) => {
        if (err) {
            responseSpan.textContent = err.message || JSON.stringify(err);

            return;
        }
        cognitoUser = result.user;
        responseSpan.textContent = 'User has been created';
    });

    return false;
};

document.getElementById("registerConfirmForm").onsubmit = (evt) => {
    var email = evt.target.childNodes[1].value;
    var validateCode = evt.target.childNodes[3].value;

    var responseSpan = document.getElementById('registerConfirmResponse');
    responseSpan.textContent = '';

    var cognitoUser = new AmazonCognitoIdentity.CognitoUser({
        Username: email,
        Pool: userPool
    });

    cognitoUser.confirmRegistration(validateCode, true, function(err, result) {
        if (err) {
            responseSpan.textContent = err.message || JSON.stringify(err);
            return;
        }
        responseSpan.textContent = result;
    });

    return false;
};

document.getElementById("loginForm").onsubmit = (evt) => {
    var email = evt.target.childNodes[1].value;
    var password = evt.target.childNodes[3].value;

    var responseSpan = document.getElementById('loginResponse');
    responseSpan.textContent = '';

    var cognitoUser = new AmazonCognitoIdentity.CognitoUser({
        Username: email,
        Pool: userPool
    });

    cognitoUser.authenticateUser(new AmazonCognitoIdentity.AuthenticationDetails({
        Username: email,
        Password: password
    }), {
        onSuccess: (result) => {
            var accessToken = result.getAccessToken().getJwtToken();

            cognitoUser.getUserAttributes(function(err, attributes) {
                if (err) {
                    // Handle error
                } else {
                    // Do something with attributes
                    console.log(attributes);
                }
            });

        },
        onFailure: (err) => {
            responseSpan.textContent = err.message || JSON.stringify(err);
        }
    });
    return false;
};