import React from 'react';
import { Link } from 'react-router-dom';

export default function Navbar(props) {
  return (
    <nav className={`navbar navbar-expand-lg navbar-light bg-light`}>
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">{props.title}</Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent">
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link className="nav-link" to="/">Home</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/about">About</Link>
            </li>
          </ul>

          <div className="d-flex">
            <button className="btn btn-light mx-1" onClick={() => props.toggleMode('light')}>Light</button>
            <button className="btn btn-dark mx-1" onClick={() => props.toggleMode('dark')}>Dark</button>
            <button className="btn btn-danger mx-1" onClick={() => props.toggleMode('danger')}>Red</button>
            <button className="btn btn-primary mx-1" onClick={() => props.toggleMode('primary')}>Blue</button>
            <button className="btn btn-success mx-1" onClick={() => props.toggleMode('success')}>Green</button>
            <button className="btn btn-warning mx-1" onClick={() => props.toggleMode('warning')}>Yellow</button>
            <button className="btn btn-info mx-1" onClick={() => props.toggleMode('info')}>Cyan</button>
            <button className="btn btn-secondary mx-1" onClick={() => props.toggleMode('secondary')}>Gray</button>
            <button className="btn btn-pink mx-1" onClick={() => props.toggleMode('pink')}>Pink</button>
            <button className="btn btn-orange mx-1" onClick={() => props.toggleMode('orange')}>Orange</button>
          </div>
        </div>
      </div>
    </nav>
  );
}
