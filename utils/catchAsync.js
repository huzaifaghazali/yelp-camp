// This whole function is like a tool that takes another func as input and returns a new function.
//  if anything goes wrong, it catches the problem and passes it to the "next" middleware to handle.
module.exports = (func) => {
  return (req, res, next) => {
    func(req, res, next).catch(next); // catch(next) Pass this error to the next middleware function
  };
};
