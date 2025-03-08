module.exports.main = async (event) => {
  return {
    statusCode: 200,
    body: JSON.stringify({ message: 'Hello from the marketing service!' }),
  };
};
