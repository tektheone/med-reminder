const { format } = require('date-fns');
const CallLog = require('../models/CallLog');

const logCall = (sid, status, metadata = {}) => {
  const entry = {
    timestamp: format(new Date(), 'yyyy-MM-dd HH:mm:ss'),
    sid,
    status,
    ...metadata
  };

  console.log('CALL LOG:', entry);
  return entry;
};

const saveCallLog = async (logEntry) => {
  try {
    await new CallLog(logEntry).save();
  } catch (error) {
    console.error('DB Save Error:', error);
  }
};

module.exports = { logCall, saveCallLog };