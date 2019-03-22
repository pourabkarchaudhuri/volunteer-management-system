module.exports = {
    
    configuration:{
        microsoftAppRegistrationPortal:{
            clientId: 'e4e804bc-f591-4134-8882-c0ad7f6c4b58',
            clientSecret: 'jLKSM610]~mkwirpCVG65|@',
            redirectUri: 'http://localhost:5000/authorize',
        },
        oauthScope:['openid', 'profile', 'offline_access', 'https://outlook.office.com/calendars.readwrite'],
        token:{
            site: 'https://login.microsoftonline.com/common',
            authorizationPath: '/oauth2/v2.0/authorize',
            tokenPath: '/oauth2/v2.0/token'
        },
        chatserver: 'https://oou69odffl.execute-api.ap-south-1.amazonaws.com/v1/webhook'
    }
    
    
}