import NextLink from "next/link";
import { useRef, useState } from "react";
import {
  AppBar,
  Avatar,
  Box,
  Button,
  ButtonBase,
  Container,
  IconButton,
  Toolbar,
  Typography,
  Popover,
  MenuItem,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { Logo } from "../icons/asset-layer-logo";
import { UserCircle as UserCircleIcon } from "../icons/user-circle";
import { AccountPopover } from "./account-popover";
import { useAuth } from "src/hooks/use-auth";
import { useAssetLayer } from "src/contexts/assetlayer-context.js";
import "@fontsource/chango";

const menuItems = [
  { label: "Play", value: "playMenuItem", href: "/play" },
  { label: "Shop", value: "shopMenuItem", href: "/shop" },
  { label: "My Assets", value: "assetsMenuItem", href: "/inventory" }
];

export const MenuPopover = (props) => {
  const { anchorEl, close, open, items, ...other } = props;

  return (
    <Popover
      anchorEl={anchorEl}
      anchorOrigin={{
        horizontal: "left",
        vertical: "bottom",
      }}
      keepMounted
      onClick={close}
      onClose={close}
      open={!!open}
      PaperProps={{ sx: { width: 180 } }}
      transitionDuration={0}
      sx={{ display: !!open ? "inherit" : "none" }}
      {...other}
    >
      {items.map((item) =>
        item.href ? (
          <NextLink key={item.value} href={item.href} passHref legacyBehavior>
            <MenuItem>{item.label}</MenuItem>
          </NextLink>
        ) : (
          <MenuItem key={item.value}>{item.label}</MenuItem>
        )
      )}
    </Popover>
  );
};

export const MainNavbar = (props) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [accountPopoverOpen, setAccountPopoverOpen] = useState(false);
  const menuRef = useRef(null);
  const accountRef = useRef(null);
  const { user } = useAuth();
  const { loggedIn, setLoggedIn, unityOn, assetlayerClient } = useAssetLayer();

  const handleOpenMenu = () => {
    setMenuOpen(true);
  };
  const handleCloseMenu = () => {
    setMenuOpen(false);
  };
  const handleOpenAccountPopover = () => {
    setAccountPopoverOpen(true);
  };
  const handleCloseAccountPopover = () => {
    setAccountPopoverOpen(false);
  };

  if (unityOn) {
    return null;
  } else {
  return (
    <AppBar
      elevation={0}
      sx={{
        backgroundColor: "background.paper",
        borderBottomColor: "divider",
        borderBottomStyle: "solid",
        borderBottomWidth: 1,
        color: "text.secondary",
      }}
    >
      <MenuPopover
        anchorEl={menuRef.current}
        close={handleCloseMenu}
        open={menuOpen}
        items={menuItems}
      />
      <AccountPopover
        anchorEl={accountRef.current}
        onClose={handleCloseAccountPopover}
        open={accountPopoverOpen}
      />
      <Container maxWidth="lg">
        <Toolbar disableGutters sx={{ minHeight: 64 }}>
          <NextLink href="/" passHref>
            <img src="static/Rolltopia Logo Just Text.png" alt="logo" style={{ height: "50px" }} sx={{ pt:1, display: {md: "inline", sx:"none"}}}/>
          </NextLink>
          <Box
            onClick={handleOpenMenu}
            ref={menuRef}
            disabled={{ md: true }}
            sx={{
              display: { xs: "flex", md: "none" },
              justifyContent: "center",
              alignItems: "center",
              cursor: "pointer",
              p: "1rem",
            }}
          >
            <IconButton color="inherit">
              <MenuIcon fontSize="small" />
            </IconButton>
          </Box>
          <Box sx={{ flexGrow: 1 }} />
          <Box
            sx={{ alignItems: "center", display: { xs: "none", md: "flex" } }}
          >
            <NextLink href="/play" passHref legacyBehavior>
              <Button
                sx={{
                  borderRadius: 1,
                  py: "0.25em",
                  "&:hover": { backgroundColor: "rgba(155,155,155,0.1)" },
                }}
              >
                <Typography variant="subtitle1" color="#FF4D0D"
            fontFamily="Chango"
            sx={{
              textShadow: `
        2px 2px 0 white, 
        -2px -2px 0 white, 
        2px -2px 0 white, 
        -2px 2px 0 white,
        3px 3px 8px rgba(0, 0, 0, 0.5)
      `,
            }}>
                  Play
                </Typography>
              </Button>
            </NextLink>
            <NextLink href="/shop" passHref legacyBehavior>
              <Button
                sx={{
                  borderRadius: 1,
                  py: "0.25em",
                  "&:hover": { backgroundColor: "rgba(155,155,155,0.1)" },
                }}
              >
                <Typography variant="subtitle1" color="#FF4D0D"
            fontFamily="Chango"
            sx={{
              textShadow: `
        2px 2px 0 white, 
        -2px -2px 0 white, 
        2px -2px 0 white, 
        -2px 2px 0 white,
        3px 3px 8px rgba(0, 0, 0, 0.5)
      `,
            }}>
                  Shop
                </Typography>
              </Button>
            </NextLink>
            <NextLink href="/inventory" passHref legacyBehavior>
              <Button
                sx={{
                  borderRadius: 1,
                  py: "0.25em",
                  "&:hover": { backgroundColor: "rgba(155,155,155,0.1)" },
                }}
              >
                <Typography variant="subtitle1" color="#FF4D0D"
            fontFamily="Chango"
            sx={{
              textShadow: `
        2px 2px 0 white, 
        -2px -2px 0 white, 
        2px -2px 0 white, 
        -2px 2px 0 white,
        3px 3px 8px rgba(0, 0, 0, 0.5)
      `,
            }}>
                  My Assets
                </Typography>
              </Button>
            </NextLink>
          </Box>
          {loggedIn && (
            <Button
              onClick={() => {
                assetlayerClient.logoutUser();
                setLoggedIn(false);
              }}
              sx={{
                borderRadius: 1,
                py: "0.25em",
                "&:hover": { backgroundColor: "rgba(155,155,155,0.1)" },
              }}
            >
              <Typography variant="subtitle1" color="#FF4D0D"
            fontFamily="Chango"
            sx={{
              textShadow: `
        2px 2px 0 white, 
        -2px -2px 0 white, 
        2px -2px 0 white, 
        -2px 2px 0 white,
        3px 3px 8px rgba(0, 0, 0, 0.5)
      `,
            }}>
                  Logout
                </Typography>
            </Button>
          )}

          {user && (
            <Box
              component={ButtonBase}
              onClick={handleOpenAccountPopover}
              ref={accountRef}
              sx={{
                alignItems: "center",
                display: "flex",
                px: "1rem",
              }}
            >
              <Avatar
                sx={{
                  height: 50,
                  width: 50,
                }}
                src={user.avatarUrl}
              >
                <UserCircleIcon fontSize="small" />
              </Avatar>
            </Box>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  );}
};
