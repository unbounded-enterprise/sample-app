import { Fragment, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import { AppBar, Box, Button, Container, IconButton, Link, Toolbar, Typography, Avatar, ButtonBase } from '@mui/material';
import NextLink from 'next/link';
import MenuIcon from '@mui/icons-material/Menu';
import { Logo } from './asset-layer-logo';
import { UserCircle as UserCircleIcon } from '../icons/user-circle';
import { Users as UsersIcon } from '../icons/users';
import { AccountPopover } from './account-popover';
import { useAuth } from 'src/hooks/use-auth';

const DashboardNavbarRoot = styled(AppBar)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  boxShadow: theme.shadows[3]
}));

export const NewNavbar = (props) => {
  const anchorRef = useRef(null);
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
        color: 'text.secondary',
        padding: 1
      }}
    >
      <Container maxWidth={false}>
        <AccountPopover
          anchorEl={anchorRef.current}
          onClose={handleClosePopover}
          open={openPopover}
        />
        <Toolbar
          disableGutters
          sx={{ minHeight: 64, width: '100%'}}
        >
          
          <Box
            sx={{
                flex: 1,
              alignItems: 'center',
              display: {
                md: 'flex',
                xs: 'none'
              }
            }}
          ><Box sx={{paddingRight: 3}}>
            <NextLink
            href="/"
            passHref>
                <Logo  />
          </NextLink></Box>
            <NextLink
              href="/explorer"
              passHref
              legacyBehavior
            >
              <Link underline="none" sx={{paddingRight: 2}} >
                <Box sx={{ borderRadius: 1, py: '0.25em', px: '0.5em', '&:hover': { backgroundColor: 'rgba(155,155,155,0.1)' } }}>
                  <Typography color="textSecondary" variant="subtitle2">NFT Explorer</Typography>
                </Box>
              </Link>
            </NextLink>
            <NextLink
              href="/inventory"
              passHref
              legacyBehavior
            >
              <Link underline="none" sx={{paddingRight: 2}}>
                <Box sx={{ borderRadius: 1, py: '0.25em', px: '0.5em', '&:hover': { backgroundColor: 'rgba(155,155,155,0.1)' } }}>
                  <Typography color="textSecondary" variant="subtitle2">My NFTs</Typography>
                </Box>
              </Link>
            </NextLink>
            <NextLink
              href="/"
              passHref
              legacyBehavior
            >
              <Link underline="none" sx={{paddingRight: 2}}>
                <Box sx={{ borderRadius: 1, py: '0.25em', px: '0.5em', '&:hover': { backgroundColor: 'rgba(155,155,155,0.1)' } }}>
                  <Typography color="textSecondary" variant="subtitle2">Marketplace</Typography>
                </Box>
              </Link>
            </NextLink>
            <NextLink
              href="/"
              passHref
              legacyBehavior
            >
              <Link underline="none" sx={{paddingRight: 2}}>
                <Box sx={{ borderRadius: 1, py: '0.25em', px: '0.5em', '&:hover': { backgroundColor: 'rgba(155,155,155,0.1)' } }}>
                  <Typography color="textSecondary" variant="subtitle2">Storefront</Typography>
                </Box>
              </Link>
            </NextLink>
            <NextLink
              href="https://docs.assetlayer.com"
              passHref
              legacyBehavior
            >
              <Link underline="none" sx={{paddingRight: 2}}>
                <Box sx={{ borderRadius: 1, py: '0.25em', px: '0.5em', '&:hover': { backgroundColor: 'rgba(155,155,155,0.1)' } }}>
                  <Typography color="textSecondary" variant="subtitle2">Docs</Typography>
                </Box>
              </Link>
            </NextLink>
          </Box>
          <Box
              component={ButtonBase}
              onClick={handleOpenPopover}
              ref={anchorRef}
              sx={{
                right: 0,
                display: 'flex',
                ml: 2
              }}
            >
              { user && <Avatar
                sx={{
                  height: 50,
                  width: 50,
                }}
                src={user.avatarUrl}
              >
                <UserCircleIcon fontSize="small" />
              </Avatar> }
            </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

NewNavbar.propTypes = {
  onSidebarOpen: PropTypes.func
};
