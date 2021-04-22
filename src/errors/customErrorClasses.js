class ResultsError extends Error {
    constructor(message) {
      super();
      this.statusCode = message;
    }
  }
  
  module.exports = {
    ResultsError
  }
  