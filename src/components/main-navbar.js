import NextLink from "next/link";
import { useRef, useState } from "react";
import {
  AppBar,
  Avatar,
  Box,
  Button,
  ButtonBase,
  Container,
  Drawer,
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
  { label: "My Stuff", value: "assetsMenuItem", href: "/assets" },
];

export const MenuDrawer = (props) => {
  const { open, onClose, items } = props;

  return (
    <Drawer anchor="left" open={open} onClose={onClose}>
      <Box
        sx={{
          width: 200, // Set the width of the drawer
          top: 72, // Set top to the height of the AppBar
          position: 'relative', // Ensure position is relative
        }}
        role="presentation"
        onClick={onClose}
        onKeyDown={onClose}
      >
        {items.map((item) =>
          item.href ? (
            <NextLink key={item.value} href={item.href} passHref legacyBehavior>
              <MenuItem>
                <Typography
                variant="subtitle1"
                color="#FF4D0D"
                fontFamily="Chango"
                sx={{
                  textShadow: `
                    2px 2px 0 white, 
                    -2px -2px 0 white, 
                    2px -2px 0 white, 
                    -2px 2px 0 white,
                    3px 3px 8px rgba(0, 0, 0, 0.5)
                  `,
                }}
              >
                  {item.label}
                </Typography>
              </MenuItem>
            </NextLink>
          ) : (
            <MenuItem key={item.value}>{item.label}</MenuItem>
          )
        )}
      </Box>
    </Drawer>
  );
};

export const MainNavbar = (props) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [accountPopoverOpen, setAccountPopoverOpen] = useState(false);
  const menuRef = useRef(null);
  const accountRef = useRef(null);
  const { loggedIn, handleUserLogin, unityOn, user, assetlayerClient } =
    useAssetLayer();

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
        <MenuDrawer open={menuOpen} onClose={handleCloseMenu} items={menuItems} />

        <AccountPopover
          anchorEl={accountRef.current}
          onClose={handleCloseAccountPopover}
          open={accountPopoverOpen}
        />
        <Container maxWidth="lg">
          <Toolbar disableGutters sx={{ minHeight: 64 }}>
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
            <NextLink href="/" passHref>
              <ButtonBase
                sx={{
                  "&:hover": {
                    backgroundColor: "rgba(155,155,155,0.1)", // This is the hover effect
                  },
                }}
              >
                <img
                  src="static/Rolltopia Logo Just Text.png"
                  alt="logo"
                  style={{ height: "50px" }}
                  sx={{ pt: 1, display: { md: "inline", sx: "none" } }}
                />
              </ButtonBase>
            </NextLink>

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
                  <Typography
                    variant="subtitle1"
                    color="#FF4D0D"
                    fontFamily="Chango"
                    sx={{
                      textShadow: `
        2px 2px 0 white, 
        -2px -2px 0 white, 
        2px -2px 0 white, 
        -2px 2px 0 white,
        3px 3px 8px rgba(0, 0, 0, 0.5)
      `,
                    }}
                  >
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
                  <Typography
                    variant="subtitle1"
                    color="#FF4D0D"
                    fontFamily="Chango"
                    sx={{
                      textShadow: `
        2px 2px 0 white, 
        -2px -2px 0 white, 
        2px -2px 0 white, 
        -2px 2px 0 white,
        3px 3px 8px rgba(0, 0, 0, 0.5)
      `,
                    }}
                  >
                    Shop
                  </Typography>
                </Button>
              </NextLink>
              <NextLink href="/assets" passHref legacyBehavior>
                <Button
                  sx={{
                    borderRadius: 1,
                    py: "0.25em",
                    "&:hover": { backgroundColor: "rgba(155,155,155,0.1)" },
                  }}
                >
                  <Typography
                    variant="subtitle1"
                    color="#FF4D0D"
                    fontFamily="Chango"
                    sx={{
                      textShadow: `
        2px 2px 0 white, 
        -2px -2px 0 white, 
        2px -2px 0 white, 
        -2px 2px 0 white,
        3px 3px 8px rgba(0, 0, 0, 0.5)
      `,
                    }}
                  >
                    My Stuff
                  </Typography>
                </Button>
              </NextLink>
            </Box>
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
                  src={"/static/Avatar.png"}
                >
                  <UserCircleIcon fontSize="small" />
                </Avatar>
              </Box>
            )}
          </Toolbar>
        </Container>
      </AppBar>
    );
  }
};
