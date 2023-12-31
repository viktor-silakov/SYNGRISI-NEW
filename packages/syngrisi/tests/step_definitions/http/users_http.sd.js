/* eslint-disable prefer-arrow-callback,no-console */
const { When } = require('cucumber');
const { got } = require('got-cjs');
const { requestWithLastSessionSid } = require('../../src/utills/common');

When(/^I create via http test user$/, async function () {
    const uri = `http://${browser.config.serverDomain}:${browser.config.serverPort}/v1/tasks/loadTestUser`;
    // console.log({ uri });
    const res = await got.get(uri);
    console.log({ response: res.body });
    expect(JSON.parse(res.body).username)
        .toBe('Test');
});

When(/^I login via http with user:"([^"]*)" password "([^"]*)"$/, async function (login, password) {
    const uri = `http://${browser.config.serverDomain}:${browser.config.serverPort}`;
    console.log({ uri });

    const res = (await got.post(
        `${uri}/v1/auth/login`,
        {
            headers: {
                'upgrade-insecure-requests': '1',
            },
            json: { username: login, password },
        }
    ));
    // console.log({ Body: res.body });
    const sessionSid = res.headers['set-cookie'][0].split(';')
        .filter((x) => x.includes('connect.sid'))[0].split('=')[1];
    // console.log({ sessionSid });

    this.saveItem('users', {
        [login]: { sessionSid },
    });

    this.saveItem('lastSessionId', sessionSid);
});

When(/^I create via http user as:"([^"]*)" with params:$/, async function (user, json) {
    const params = JSON.parse(json);

    const uri = `http://${browser.config.serverDomain}:${browser.config.serverPort}/`
        + 'v1/users';
    console.log('💥👉', { uri });

    const { sessionSid } = this.getSavedItem('users')[user];
    // console.log({ sessionSid });

    const res = await (await requestWithLastSessionSid(
        uri,
        this,
        {
            method: 'POST',
            json: {
                username: params.username,
                firstName: params.firstName,
                lastName: params.lastName,
                role: params.role,
                password: params.password,
            },
        }
    )).json;

    console.log({ respBody: res });
});

When(/^I generate via http API key for the User$/, async function () {
    const uri = `http://${browser.config.serverDomain}:${browser.config.serverPort}/v1/auth/apikey`;
    console.log({ uri });
    const res = await requestWithLastSessionSid(uri, this);
    // console.log({ respBodyJSON: res.json });
    const apiKey = res.json.apikey;
    // console.log({ apiKey });
    this.saveItem('apiKey', { value: apiKey });
});
