const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');

var items = {};

// Public API - Fix these CRUD functions ///////////////////////////////////////

exports.create = (text, callback) => {

  counter.getNextUniqueId((x, y) => {
    //use this next unique ID and create a path from dataDir with the ID
    let id = y;
    let pathname = exports.dataDir + '/' + y + '.txt';
    // console.log(pathname);
    // console.log(text);
    fs.writeFile(pathname, text, function (err) {
      if (err) {
        throw err;
      }
      // console.log('saved!');
      callback(null, { id: id, text: text });
    });
  });
};

exports.readAll = (callback) => {
  let data = [];
  fs.readdir(exports.dataDir, (err, filenames) => {
    if (err) {
      console.log(err);
    }
    // let data = _.map(filenames, (filename) => {
    //   fs.readFile(exports.dataDir + '/' + filename, 'utf-8', (err, content) => {
    //     if (err) {
    //       console.log(err);
    //     }
    //     console.log(content);
    //     console.log(typeof (content));
    //     return { id: filename, text: content };
    //   });
    // });

    data = _.map(filenames, (filename) => {
      return { id: filename.substring(0, 5), text: filename.substring(0, 5) };
    });

    //console.log(data);

    callback(null, data);
  });

  // var data = _.map(items, (text, id) => {
  //   return { id, text };
  // });
};

exports.readOne = (id, callback) => {

  fs.readFile(exports.dataDir + '/' + id + '.txt', 'utf-8', (err, content) => {
    if (err) {
      callback(new Error(`No item with id: ${id}`));
    } else {
      callback(null, { id: id, text: content });
    }
  });
};

exports.update = (id, text, callback) => {

  fs.exists(exports.dataDir + '/' + id + '.txt', (exists) => {
    if (!exists) {
      callback(new Error(`No item with id: ${id}`));
    } else {
      fs.writeFile(exports.dataDir + '/' + id + '.txt', text, (err, content) => {
        if (err) {
          callback(new Error(`No item with id: ${id}`));
        } else {
          callback(null, { id: id, text: content });
        }
      });
    }
  });
};

exports.delete = (id, callback) => {
  fs.unlink(exports.dataDir + '/' + id + '.txt', (err, content) => {
    if (err) {
      callback(new Error(`No item with id: ${id}`));
    } else {
      callback();
    }
  });
};

// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////

exports.dataDir = path.join(__dirname, 'data');

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};
