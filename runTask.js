const fs = require('fs');

const createFile = (dir, fileName, content) => {
  try {
   fs.writeFileSync(dir + '/' + fileName, content);
  } catch (err) {
   console.error(err);
  }
};

const runTask = () => {
  const zlibDir = './node_modules/zlib/lib';

  createFile(zlibDir, 'zlib_bindings.js', '//module.exports = require(\'./zlib_bindings\');');
  createFile(zlibDir, 'zlib.js', '//module.exports = require(\'./zlib_bindings\');');
}

runTask();