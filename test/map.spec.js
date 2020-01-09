const { describe, it, before, beforeEach, after } = require('mocha');
const { expect } = require('chai');
const { Transform, Readable } = require('stream');
const { map } = require('../index');


const getStream = () => new Readable({
  objectMode: true,
  read() { }
});

describe('map', () => {

  it('Should return instance of transform stream.', () => {
    const fp_map_stream = map();
    expect(fp_map_stream).is.instanceOf(Transform);
  });
  
  it('Should map stream chunks one by one.', (done) => {
    const readstream = getStream();
    readstream.push(5);
    readstream.push(null);

    const writable = readstream.pipe(map(chunk => chunk * 3));
    const mapped_chunks = [];
    writable.on('data', c => mapped_chunks.push(c));
    writable.on('end', () => {      
      expect(mapped_chunks.length).to.equal(1);
      expect(mapped_chunks[0]).to.equal(15);
      done();
    });

    writable.on('error', done);
  });

  it('Should map stream chunks one by one.', (done) => {
    const readstream = getStream();
    readstream.push(5);
    readstream.push(10);
    readstream.push(null);

    const writable = readstream.pipe(map(chunk => chunk * 3));
    const mapped_chunks = [];
    writable.on('data', c => mapped_chunks.push(c));
    writable.on('end', () => {      
      expect(mapped_chunks.length).to.equal(2);
      expect(mapped_chunks[0]).to.equal(15);
      expect(mapped_chunks[1]).to.equal(30);
      done();
    });

    writable.on('error', done);
  });

  it('Should use default mapper if none was provided.', (done) => {
    const readstream = getStream();
    readstream.push(5);
    readstream.push(10);
    readstream.push(null);

    const writable = readstream.pipe(map());
    const mapped_chunks = [];
    writable.on('data', c => mapped_chunks.push(c));
    writable.on('end', () => {      
      expect(mapped_chunks.length).to.equal(2);
      expect(mapped_chunks[0]).to.equal(5);
      expect(mapped_chunks[1]).to.equal(10);
      done();
    });

    writable.on('error', done);
  });

  it('Should throw error if map fails', (done) => {
    const readstream = getStream();
    readstream.push(5);
    readstream.push(10);
    readstream.push(null);

    const writable = readstream.pipe(map(() => { throw new Error('An Error Occured During Map') }));
    writable.on('error', (e) => {
      expect(e).instanceOf(Error);
      expect(e.message).to.include('An Error Occured During Map');
      done();
    });
  });

  it('a map function can emit only sometimes', (done) => {
    const stream = getStream();
    stream.push(10);
    stream.push(5);
    stream.push(null);
    const mappedStream = stream.pipe(map(n => (n > 6 ? n : undefined)));

    const mapped_chunks = [];
    mappedStream.on('data', c => mapped_chunks.push(c));
    mappedStream.on('end', () => {
      expect(mapped_chunks).to.deep.equal([10]);
      done();
    });
  });

  // test index as second paramter
});
