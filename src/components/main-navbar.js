import NextLink from "next/link";
import { useRef, useState, useEffect } from "react";
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
import axios from "axios";

const menuItems = [
  { label: "NFT Explorer", value: "explorerMenuItem", href: "/explorer" },
  { label: "My NFTs", value: "nftsMenuItem", href: "/inventory" },
  { label: "Marketplace", value: "marketMenuItem", href: "/marketplace" },
  { label: "Store", value: "storeMenuItem", href: "/store" },
  { label: "Docs", value: "docsMenuItem", href: "https://docs.assetlayer.com" },
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
  const [appId, setAppId] = useState(null);
  const menuRef = useRef(null);
  const accountRef = useRef(null);
  const { user } = useAuth();
  const { loggedIn, handleUserLogin, assetlayerClient } = useAssetLayer();

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

  const getAppId = async () => {
    try {
      // Make a GET request to your API endpoint
      const response = await axios.get("/api/app/appId");
      console.log("App ID:", response.data.appId);
      return response.data.appId;
    } catch (error) {
      console.error("Error fetching appId:", error);
    }
  };

  useEffect(() => {
    getAppId().then((appId) => {
      setAppId(appId);
    });
  }, []);

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
            <Logo sx={{ pt: 1, display: { md: "inline", xs: "none" } }} />
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
            <NextLink href="/explorer" passHref legacyBehavior>
              <Button
                sx={{
                  borderRadius: 1,
                  py: "0.25em",
                  "&:hover": { backgroundColor: "rgba(155,155,155,0.1)" },
                }}
              >
                <Typography color="textSecondary" variant="subtitle2">
                  Explorer
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
                <Typography color="textSecondary" variant="subtitle2">
                  My Assets
                </Typography>
              </Button>
            </NextLink>
            <NextLink
              href={"https://www.assetlayer.com/market/browse/" + appId}
              passHref
              legacyBehavior
            >
              <a
                target="_blank"
                rel="noopener noreferrer"
                style={{ textDecoration: "none" }}
              >
                <Button
                  sx={{
                    borderRadius: 1,
                    py: "0.25em",
                    "&:hover": { backgroundColor: "rgba(155,155,155,0.1)" },
                  }}
                >
                  <Typography color="textSecondary" variant="subtitle2">
                    Marketplace
                  </Typography>
                </Button>
              </a>
            </NextLink>

            <NextLink href="/play" passHref legacyBehavior>
              <Button
                sx={{
                  borderRadius: 1,
                  py: "0.25em",
                  "&:hover": { backgroundColor: "rgba(155,155,155,0.1)" },
                }}
              >
                <Typography color="textSecondary" variant="subtitle2">
                  Play
                </Typography>
              </Button>
            </NextLink>
            <NextLink
              href="https://docs.assetlayer.com"
              passHref
              legacyBehavior
            >
              <Button
                sx={{
                  borderRadius: 1,
                  py: "0.25em",
                  "&:hover": { backgroundColor: "rgba(155,155,155,0.1)" },
                }}
              >
                <Typography color="textSecondary" variant="subtitle2">
                  Docs
                </Typography>
              </Button>
            </NextLink>
          </Box>
          {loggedIn && (
            <Button
              onClick={() => {
                assetlayerClient.logoutUser();
                handleUserLogin(false);
              }}
              sx={{
                borderRadius: 1,
                py: "0.25em",
                "&:hover": { backgroundColor: "rgba(155,155,155,0.1)" },
              }}
            >
              <Typography color="textSecondary" variant="subtitle2">
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
  );
};
