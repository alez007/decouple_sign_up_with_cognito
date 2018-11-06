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







/*var AWS = require('aws-sdk');


var CognitoUserPool = AmazonCognitoIdentity.CognitoUserPool;

var poolData = {
    UserPoolId : 'eu-west-1_DwyictZ3k', // Your user pool id here
    ClientId : '1aj1to248jl27p97hsnf6nhnk6' // Your client id here
};
var userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);

/!*userPool.signUp('alex@zuve.co.uk', 'Cucu12345%6', [], null, function(err, result){
    if (err) {
        alert(err.message || JSON.stringify(err));
        return;
    }
    var cognitoUser = result.user;
    console.log('user name is ' + cognitoUser.getUsername());
});*!/


var authenticationData = {
    Username : 'alex@zuve.co.uk',
    Password : 'Cucu12345%6',
};
var authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails(authenticationData);
var poolData = {
    UserPoolId : 'eu-west-1_DwyictZ3k', // Your user pool id here
    ClientId : '1aj1to248jl27p97hsnf6nhnk6' // Your client id here
};
var userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);
var userData = {
    Username : 'alex@zuve.co.uk',
    Pool : userPool
};
var cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);
cognitoUser.getSession((err, result) => {
    console.log(err);
    console.log(result);
});*/
/*cognitoUser.authenticateUser(authenticationDetails, {
    onSuccess: function (result) {
        var accessToken = result.getAccessToken().getJwtToken();
        console.log(accessToken);

        //POTENTIAL: Region needs to be set if not already set previously elsewhere.
        AWS.config.region = 'eu-west-1';

        AWS.config.credentials = new AWS.CognitoIdentityCredentials({
            IdentityPoolId : 'eu-west-1:f84a5320-8095-4896-8507-71b6b6f4fbf9', // your identity pool id here
            Logins : {
                // Change the key below according to the specific region your user pool is in.
                'cognito-idp.eu-west-1.amazonaws.com/eu-west-1_DwyictZ3k' : result.getIdToken().getJwtToken()
            }
        });

        //refreshes credentials using AWS.CognitoIdentity.getCredentialsForIdentity()
        AWS.config.credentials.refresh((error) => {
            if (error) {
                console.error(error);
            } else {
                // Instantiate aws sdk service objects now that the credentials have been updated.
                // example: var s3 = new AWS.S3();
                console.log('Successfully logged!');
            }
        });
    },

    onFailure: function(err) {
        alert(err.message || JSON.stringify(err));
    },

});*/



// console.log(cognitoIdentity);
