const { backupDatabaseToFirebase } = require('../middleware/firebaseConfig');

const backupDatabase = async (req, res) => {
  try {
    const backupUrl = await backupDatabaseToFirebase(); 
    res.status(200).json({ message: 'Backup successfully!', url: backupUrl });
  } catch (error) {
    console.error('Error while backing up:', error);
    res.status(500).json({ message: 'Backup failed!', error: error.message });
  }
};

module.exports = {
  backupDatabase,
};
