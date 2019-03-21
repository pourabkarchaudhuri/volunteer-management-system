module.exports = {
    
    configuration:{
        microsoftAppRegistrationPortal:{
            clientId: 'e4e804bc-f591-4134-8882-c0ad7f6c4b58',
            clientSecret: 'jLKSM610]~mkwirpCVG65|@',
            redirectUri: 'https://dry-savannah-42918.herokuapp.com/authorize',
        },
        oauthScope:['openid', 'profile', 'offline_access', 'https://outlook.office.com/calendars.readwrite'],
        token:{
            site: 'https://login.microsoftonline.com/common',
            authorizationPath: '/oauth2/v2.0/authorize',
            tokenPath: '/oauth2/v2.0/token'
        }
    }
    
    
}