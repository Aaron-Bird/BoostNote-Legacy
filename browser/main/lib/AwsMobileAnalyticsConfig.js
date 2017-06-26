const AWS = require('aws-sdk')
const AMA = require('aws-sdk-mobile-analytics')
const ConfigManager = require('browser/main/lib/ConfigManager')

AWS.config.region = 'us-east-1'
if (process.env.NODE_ENV === 'production') {
  AWS.config.credentials = new AWS.CognitoIdentityCredentials({
    IdentityPoolId: 'us-east-1:xxxxxxxxxxxxxxxxxxxxxxxxx'
  })
  const mobileAnalyticsClient = new AMA.Manager({
    appId: 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
    appTitle: 'xxxxxxxxxx'
  })
}

function initAwsMobileAnalytics () {
  if (process.env.NODE_ENV !== 'production') return
  AWS.config.credentials.get((err) => {
    if (!err) {
      console.log('Cognito Identity ID: ' + AWS.config.credentials.identityId)
    }
  })
  recordStaticCustomEvent()
}

function recordDynamitCustomEvent (type) {
  if (process.env.NODE_ENV !== 'production') return
  mobileAnalyticsClient.recordEvent(type)
}

function recordStaticCustomEvent () {
  if (process.env.NODE_ENV !== 'production') return
  mobileAnalyticsClient.recordEvent('UI_COLOR_THEME', {
    uiColorTheme: ConfigManager.default.get().ui.theme
  })
}

module.exports = {
  initAwsMobileAnalytics,
  recordDynamitCustomEvent
}
