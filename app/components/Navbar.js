'use client';
import React from 'react';
import { AppBar, Toolbar, Box } from '@mui/material';
import { useRouter, usePathname } from 'next/navigation';
import styled from '@emotion/styled';

const NavLink = styled.a`
  color: white;
  text-decoration: none;
  padding: 8px 16px;
  position: relative;
  transition: color 0.3s ease;
  cursor: pointer;

  &:after {
    content: '';
    position: absolute;
    width: 0;
    height: 2px;
    bottom: 0;
    left: 50%;
    background-color: white;
    transition: all 0.3s ease;
    transform: translateX(-50%);
  }

  &:hover:after {
    width: calc(100% - 32px);
  }

  &.active:after {
    width: calc(100% - 32px);
  }
`;

const Navbar = () => {
    const router = useRouter();
    const pathname = usePathname();

    const pages = [
        { label: 'CREATE', path: '/' },
        { label: 'VIDEOS', path: '/getVideo' },
    ];

    return (
        <AppBar position="static" sx={{
            backgroundColor: '#1c1c1c',
            boxShadow: 'none', // Removes default shadow
            borderBottom: '1px solid rgba(255,255,255,0.1)' // Adds subtle border
        }}>
            <Toolbar sx={{ justifyContent: 'center' }}>
                <Box sx={{ display: 'flex', gap: 4 }}>
                    {pages.map((page) => (
                        <NavLink
                            key={page.label}
                            onClick={() => router.push(page.path)}
                            className={pathname === page.path ? 'active' : ''}
                        >
                            {page.label}
                        </NavLink>
                    ))}
                </Box>
            </Toolbar>
        </AppBar>
    );
};

export default Navbar;
