/**
 * Give templates access to node env variables.
 * @returns {string} current development environment (developnent || build)
 */

module.exports = function () {
  return {
    environment: process.env.NODE_ENV || "development"
  };
};