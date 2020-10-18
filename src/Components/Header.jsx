import React from 'react';

import { Link } from 'react-router-dom';

function Header() {
  return (
    <header className="w-full">
      <nav className="w-full flex justify-end">
        <ul className="flex flex-row">
          <li>
            <Link className="text-indigo-500 px-2" to="/login">Login</Link>
          </li>
          <li>
            <Link className="text-indigo-500 px-2" to="/register">Register</Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}

export default Header;
