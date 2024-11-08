import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { initiateBackup } from '../../../redux/apiRequest';
import './style.css';

const BackupPage = () => {
  const dispatch = useDispatch();
  const { backupUrl, isBackingUp, error, msg } = useSelector((state) => state.backup);

  const handleBackup = () => {
    dispatch(initiateBackup());
  };

  return (
    <div className="backup-page container">
      <h2>Database Backup</h2>
      <p>Click the button below to create a backup of the database.</p>
      <button className="btn btn-primary" onClick={handleBackup} disabled={isBackingUp}>
        {isBackingUp ? 'Backing up...' : 'Backup Database'}
      </button>
      {msg && (
        <div className={`alert ${error ? 'alert-danger' : 'alert-success'} mt-3`}>
          {msg} {backupUrl && <a href={backupUrl} target="_blank" rel="noopener noreferrer">Download Backup</a>}
        </div>
      )}
    </div>
  );
};

export default BackupPage;