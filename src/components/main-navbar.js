import { useRef, useState } from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import { AppBar, Box, Button, Container, IconButton, Link, Toolbar, Typography, Avatar, ButtonBase } from '@mui/material';
import NextLink from 'next/link';
import MenuIcon from '@mui/icons-material/Menu';
import { Logo } from './logo';
import { UserCircle as UserCircleIcon } from '../icons/user-circle';
import { Users as UsersIcon } from '../icons/users';
import { AccountPopover } from './account-popover';
import { useAuth } from 'src/hooks/use-auth';

const DashboardNavbarRoot = styled(AppBar)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  boxShadow: theme.shadows[3]
}));

export const MainNavbar = (props) => {
  const anchorRef = useRef(null);
  const [openAccountPopover, setOpenAccountPopover] = useState(false);
  const { user } = useAuth();
  const [openPopover, setOpenPopover] = useState(false);

  function handleOpenPopover() {
    setOpenPopover(true);
  }
  
  function handleClosePopover() {
    setOpenPopover(false);
  }

  return (
    <AppBar
      elevation={0}
      sx={{
        backgroundColor: 'background.paper',
        borderBottomColor: 'divider',
        borderBottomStyle: 'solid',
        borderBottomWidth: 1,
        color: 'text.secondary'
      }}
    >
      <Container maxWidth="lg">
        <Toolbar
          disableGutters
          sx={{ minHeight: 64 }}
        >
          <NextLink
            href="/"
            passHref
          >
            <a>
            <Box
            sx={{
              width: 10
            }}
            >
                <Logo  />
            </Box>
            </a>
          </NextLink>
          <Box sx={{ flexGrow: 1 }} />
          <IconButton
            color="inherit"
            sx={{
              display: {
                md: 'none'
              }
            }}
          >
            <MenuIcon fontSize="small" />
          </IconButton>
          <Box
            sx={{
              alignItems: 'center',
              display: {
                md: 'flex',
                xs: 'none'
              }
            }}
          >
            <NextLink
              href="/about"
              passHref
            >
              <Link underline="none">
                <Box sx={{ borderRadius: 1, py: '0.25em', px: '0.5em', '&:hover': { backgroundColor: 'rgba(155,155,155,0.1)' } }}>
                  <Typography color="textSecondary" variant="subtitle2">About Us</Typography>
                </Box>
              </Link>
            </NextLink>
            <NextLink
              href="/tutorial"
              passHref
            >
              <Link underline="none">
                <Box sx={{ borderRadius: 1, py: '0.25em', px: '0.5em', '&:hover': { backgroundColor: 'rgba(155,155,155,0.1)' } }}>
                  <Typography color="textSecondary" variant="subtitle2">Tutorial</Typography>
                </Box>
              </Link>
            </NextLink>
            <Box
              component={ButtonBase}
              onClick={handleOpenPopover}
              ref={anchorRef}
              sx={{
                alignItems: 'center',
                display: 'flex',
                ml: 2
              }}
            >
              { user && 
                <div>
                  <Avatar
                    sx={{
                      height: 50,
                      width: 50,
                    }}
                    src={user.avatarUrl}
                  >
                    <UserCircleIcon fontSize="small" />
                  </Avatar>
                  <AccountPopover
                    anchorEl={anchorRef.current}
                    onClose={handleClosePopover}
                    open={openPopover}
                  />
                </div>
              }
              
            </Box>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

MainNavbar.propTypes = {
  onSidebarOpen: PropTypes.func
};
