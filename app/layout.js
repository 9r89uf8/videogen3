// app/layout.jsx
import React from 'react';
import Navbar from "@/app/components/Navbar";
import './styles/globals.css';


const Layout = ({ children }) => {
  return (
      <html lang="en">
      <body>
      <Navbar/>
      <main>{children}</main>
      </body>
      </html>
  );
};


export default Layout;
