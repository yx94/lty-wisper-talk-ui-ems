const fs = require('fs-extra');

fs.copy('dist', 'backup', err => {
  if (err) return console.error(err);
  console.log('dist目录内容已成功复制到backup目录');
});
