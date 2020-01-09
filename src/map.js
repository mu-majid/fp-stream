const { Transform } = require('stream');


class Map extends Transform {

  constructor(opts) {

    super(
      {
        readableObjectMode: true,
        writableObjectMode: true,
        ...opts
      }
    );
    this.index = 0;
    this.map = opts.mapFn || (elem => elem);    
  }

  _transform(chunk, encoding, cb) {
    let mapped;

    try {
      mapped = this.map(chunk, this.index++);  
    }
    catch (e) {
      cb(e);
      return;
    }

    cb(null, mapped);
  }
}

module.exports = (mapFn) => new Map({ mapFn });