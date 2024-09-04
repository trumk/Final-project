import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './style.css'; 

const Dashboard = () => {
  return (
    <div className="container-fluid p-4">
      <h1 className="mb-4">Admin Dashboard</h1>
      <div className="row">
        {/* Card 1 */}
        <div className="col-md-4">
          <div className="card text-white bg-primary mb-3">
            <div className="card-header">Projects</div>
            <div className="card-body">
              <h5 className="card-title">10 Projects</h5>
              <p className="card-text">Manage all submitted projects.</p>
              <button className="btn btn-light">View Projects</button>
            </div>
          </div>
        </div>

        {/* Card 2 */}
        <div className="col-md-4">
          <div className="card text-white bg-success mb-3">
            <div className="card-header">Users</div>
            <div className="card-body">
              <h5 className="card-title">50 Users</h5>
              <p className="card-text">Manage registered users.</p>
              <button className="btn btn-light">View Users</button>
            </div>
          </div>
        </div>

        {/* Card 3 */}
        <div className="col-md-4">
          <div className="card text-white bg-warning mb-3">
            <div className="card-header">Comments</div>
            <div className="card-body">
              <h5 className="card-title">120 Comments</h5>
              <p className="card-text">Review and manage comments.</p>
              <button className="btn btn-light">View Comments</button>
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        {/* Card 4 */}
        <div className="col-md-6">
          <div className="card bg-light mb-3">
            <div className="card-header">Recent Activities</div>
            <div className="card-body">
              <h5 className="card-title">Latest Updates</h5>
              <ul className="list-group">
                <li className="list-group-item">Project "Portfolio" updated</li>
                <li className="list-group-item">New user "John Doe" registered</li>
                <li className="list-group-item">Comment added on "E-commerce Platform"</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Card 5 */}
        <div className="col-md-6">
          <div className="card bg-light mb-3">
            <div className="card-header">Admin Actions</div>
            <div className="card-body">
              <h5 className="card-title">Quick Actions</h5>
              <button className="btn btn-primary mb-2 me-2" ><a href='/admin/project/create' style={{color: 'black', textDecoration: 'none'}}>Add new project</a></button>
              <button className="btn btn-secondary mb-2 me-2">Manage Users</button>
              <button className="btn btn-danger mb-2">Settings</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
