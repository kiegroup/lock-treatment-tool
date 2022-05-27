const { v4: uuidv4 } = require('uuid');
const npmLock = require('../../lib/treat-locks/npm.lock');
const yarnLock = require('../../lib/treat-locks/yarn.lock');
const NpmOptions = require('../../lib/treat-locks/npm.options');
const { performance } = require('perf_hooks');
let log = console.log
console.log = () => {}
console.warn = () => {}
console.info = () => {}

const perfNPMv7 = async () => {
    // Arrange
    const uuid = uuidv4();
    const npmOptions = new NpmOptions('http://redhat.com', true);

    // Act
    let startTime = performance.now();
    await npmLock('./test/resources/npmv7', `./test/resources/npmv7/execution-${uuid}`, npmOptions);
    let endTime = performance.now();
    let duration = endTime - startTime;
    log(`npmv7 ran in: ${duration}`)
};

const perfNPM = async () => {
    // Arrange
    const uuid = uuidv4();
    const npmOptions = new NpmOptions('http://redhat.com', true);

    // Act
    let startTime = performance.now();
    await npmLock('./test/resources', `./test/resources/execution-${uuid}`, npmOptions);
    let endTime = performance.now();
    let duration = endTime - startTime;
    log(`npm ran in: ${duration}`)
};

const perfNPMShrinkWrap = async () => {
    // Arrange
    const uuid = uuidv4();
    const npmOptions = new NpmOptions('http://redhat.com', true);

    // Act
    let startTime = performance.now();
    await npmLock('./test/resources/shrinkwrap', `./test/resources/shrinkwrap/execution-${uuid}`, npmOptions);
    let endTime = performance.now();
    let duration = endTime - startTime;
    log(`npm-shrinkwrap ran in: ${duration}`)
};


const perfYarn = async () => {
    // Arrange
    const uuid = uuidv4();
    const npmOptions = new NpmOptions('http://redhat.com', false);

    // Act
    let startTime = performance.now();
    await yarnLock('./test/resources', `./test/resources/execution-${uuid}`, npmOptions);
    let endTime = performance.now();
    let duration = endTime - startTime;
    log(`yarn ran in: ${duration}`)
};


perfNPMv7();
perfNPM();
perfYarn();
perfNPMShrinkWrap();