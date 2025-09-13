const bcrypt = require('bcryptjs');

const hashPassword = async (password) => {
  try {
    const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS) || 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    console.log('🔒 Password hashed successfully');
    return hashedPassword;
  } catch (error) {
    console.error('❌ Password hashing error:', error);
    throw new Error('Password hashing failed');
  }
};

const comparePassword = async (password, hashedPassword) => {
  try {
    const isMatch = await bcrypt.compare(password, hashedPassword);
    console.log('🔍 Password comparison result:', isMatch ? 'MATCH' : 'NO MATCH');
    return isMatch;
  } catch (error) {
    console.error('❌ Password comparison error:', error);
    throw new Error('Password comparison failed');
  }
};

module.exports = {
  hashPassword,
  comparePassword
};