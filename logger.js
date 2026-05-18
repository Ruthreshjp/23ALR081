function Log(stack, level, packageName, message) {

    console.log({
        stack,
        level,
        package: packageName,
        message
    });
}

module.exports = Log;