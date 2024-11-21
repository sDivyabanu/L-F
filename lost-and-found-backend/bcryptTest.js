const bcrypt = require('bcrypt');

async function testPassword() {
  // Set a sample password for the test
  const password = 'a';

  // Hash the password with bcrypt
  const hash = await bcrypt.hash(password, 10);

  // Attempt to compare the original password with the hash
  const isMatch = await bcrypt.compare(password, hash);

  // Output the comparison result
  console.log('Is Match:', isMatch); // This should log "true" if bcrypt works correctly
}

// Run the test function
testPassword();
