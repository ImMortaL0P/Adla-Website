const maxConcurrentStreams = 5;
let currentStreams = 0;
const waitingQueue = [];

const enqueueStream = () => {
  return new Promise((resolve) => {
    if (currentStreams < maxConcurrentStreams) {
      currentStreams++;
      resolve();
    } else {
      waitingQueue.push(resolve);
    }
  });
};

const dequeueStream = () => {
  if (waitingQueue.length > 0) {
    const nextResolve = waitingQueue.shift();
    // Don't modify currentStreams because the exiting stream transfers its slot to the next
    nextResolve();
  } else {
    currentStreams--;
  }
};

module.exports = {
  enqueueStream,
  dequeueStream
};
