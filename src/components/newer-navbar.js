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
import { alpha, useTheme } from '@mui/material/styles';


const DashboardNavbarRoot = styled(AppBar)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  boxShadow: theme.shadows[3]
}));

export const NewerNavbar = (props) => {
    const { onOpenSidebar } = props;
    const theme = useTheme();
  
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
              <Logo
                sx={{
                  pt: 1,
                  display: {
                    md: 'inline',
                    xs: 'none'
                  }
                }}
              />
            </NextLink>
            <Box sx={{ flexGrow: 1 }} />
            <IconButton
              color="inherit"
              onClick={onOpenSidebar}
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
                href="/explorer"
                passHref
                legacyBehavior
              >
                <Button sx={{ borderRadius: 1, py: '0.25em', '&:hover': { backgroundColor: 'rgba(155,155,155,0.1)' } }}>
                  <Typography color="textSecondary" variant="subtitle2">NFT Explorer</Typography>
                </Button>
              </NextLink>
              <NextLink
                href="/inventory"
                passHref
                legacyBehavior
              >
                <Button sx={{ borderRadius: 1, py: '0.25em', '&:hover': { backgroundColor: 'rgba(155,155,155,0.1)' } }}>
                  <Typography color="textSecondary" variant="subtitle2">My NFTs</Typography>
                </Button>
              </NextLink>
              <NextLink
                href="/"
                passHref
                legacyBehavior
              >
                <Button sx={{ borderRadius: 1, py: '0.25em', '&:hover': { backgroundColor: 'rgba(155,155,155,0.1)' } }}>
                  <Typography color="textSecondary" variant="subtitle2">Marketplace</Typography>
                </Button>
              </NextLink>
              <NextLink
                href="/"
                passHref
                legacyBehavior
              >
                <Button sx={{ borderRadius: 1, py: '0.25em', '&:hover': { backgroundColor: 'rgba(155,155,155,0.1)' } }}>
                  <Typography color="textSecondary" variant="subtitle2">Store</Typography>
                </Button>
              </NextLink>
              <NextLink
                href="https://docs.assetlayer.com"
                passHref
                legacyBehavior
              >
                <Button sx={{ borderRadius: 1, py: '0.25em', '&:hover': { backgroundColor: 'rgba(155,155,155,0.1)' } }}>
                  <Typography color="textSecondary" variant="subtitle2">Docs</Typography>
                </Button>
              </NextLink>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
    );
};

NewerNavbar.propTypes = {
  onSidebarOpen: PropTypes.func
};
