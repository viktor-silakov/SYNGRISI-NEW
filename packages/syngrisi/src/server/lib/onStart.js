/* eslint-disable no-underscore-dangle */
// this code should run only once at server start
const fs = require('fs');
// eslint-disable-next-line no-unused-vars
const testUsers = require('./testUsers.json');
const { User } = require('../models');

const $this = this;
$this.logMeta = {
    scope: 'on_start',
    msgType: 'SETUP',
};

exports.createTempDir = function createTempDir() {
    const dir = '.tmp';
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
    }
};

exports.createInitialSettings = async function createInitialSettings() {
    if ((await global.AppSettings.count()) < 1) {
        await global.AppSettings.loadInitialFromFile();
    }
};

exports.createBasicUsers = async function createBasicUsers() {
    const defAdmin = await User.findOne({ username: 'Administrator' });
    const defGuest = await User.findOne({ username: 'Guest' });
    if (!defAdmin) {
        log.info('create the default Administrator', $this);
        const adminData = JSON.parse(fs.readFileSync(`${__dirname}/admin.json`));

        const admin = await User.create(adminData);
        log.info(`administrator with id: '${admin._id}' was created`, $this);
    }
    if (!defGuest) {
        log.info('create the default Guest', $this);
        const guestData = JSON.parse(fs.readFileSync(`${__dirname}/guest.json`));
        const guest = await User.create(guestData);
        log.info(`guest with id: '${guest._id}' was created`, $this);
    }
};

exports.createTestsUsers = async function createTestsUsers() {
    const users = require('./testUsers.json');
    log.debug('creating tests users', $this);
    try {
        await User.insertMany(users);
    } catch (e) {
        console.warn(e);
    }
};
