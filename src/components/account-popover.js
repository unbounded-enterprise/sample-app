import { useRouter } from "next/router";
import PropTypes from "prop-types";
import {
  Box,
  MenuItem,
  Popover,
  Typography,
  Avatar,
  Divider,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { useAuth } from "../hooks/use-auth";
import toast from "react-hot-toast";
import LogoutIcon from "@mui/icons-material/Logout";
import { UserCircle as UserCircleIcon } from "../icons/user-circle";
import { useAssetLayer } from "src/contexts/assetlayer-context.js";

export const AccountPopover = (props) => {
  const { anchorEl, onClose, open, ...other } = props;
  const { loggedIn, handleUserLogin, unityOn, user, assetlayerClient } =
    useAssetLayer();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      onClose?.();
      await assetlayerClient.logoutUser();
      handleUserLogin(false);
      router.push("/").catch(console.error);
    } catch (err) {
      console.error(err);
      toast.error("Unable to logout.");
    }
  };

  if (!user?.handle) return <></>;

  return (
    <Popover
      anchorEl={anchorEl}
      anchorOrigin={{
        horizontal: "right",
        vertical: "bottom",
      }}
      transformOrigin={{
        horizontal: "right", // Added this
        vertical: "top", // Added this
      }}
      keepMounted
      onClose={onClose}
      open={!!open}
      PaperProps={{
        sx: {
          width: 300,
          boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.25)", // Drop shadow for the Popover
        },
      }}
      transitionDuration={0}
      variant="outlined"
      {...other}
    >
      <Box
        sx={{
          alignItems: "center",
          p: 2,
          display: "flex",
          flexDirection: "column", // Change direction to column for vertical stacking
          justifyContent: "center", // Center content vertically
        }}
      >
        <Typography variant="body1" fontFamily="Chango" textAlign="center">
          {user.handle}
        </Typography>
        <Typography
          color="textSecondary"
          variant="body2"
          fontFamily="Chango"
          textAlign="center"
        >
          {/* If you have any additional user details, you can display them here */}
        </Typography>
      </Box>
      <Divider />
      <Box
        sx={{
          my: 1,
          display: "flex", // Added this
          justifyContent: "center", // Added this
        }}
      >
        <MenuItem
          onClick={handleLogout}
          sx={{
            position: "relative", // This ensures the ::before pseudo-element is positioned relative to the MenuItem
            justifyContent: "center", // Center the content horizontally
            backgroundColor: "#1F3465", // Blue gradient background
            borderRadius: "10px", // Rounded edges
            color: "white",
            width: "80%",
            border: "1px solid white",
            boxShadow: "0 3px 5px 2px rgba(255, 105, 135, .3)", // Drop-shadow
            "&:hover": {
              backgroundColor: "#1F3465", // Ensure the background color remains consistent on hover
            },
            "&:hover::before": {
              // Use the ::before pseudo-element for the overlay
              content: '""',
              position: "absolute",
              top: 0,
              right: 0,
              bottom: 0,
              left: 0,
              backgroundColor: "rgba(255, 255, 255, 0.1)", // 10% white overlay
              zIndex: 0, // Ensure the overlay is below the content of the MenuItem
            },
            "& > *": {
              // This targets all direct children of the MenuItem
              zIndex: 1, // This ensures the content of the MenuItem is rendered above the ::before pseudo-element
            },
          }}
        >
          <ListItemText
            primary={
              <Typography
                variant="body1"
                fontFamily="Chango"
                textAlign="center"
              >
                Sign Out
              </Typography>
            }
          />
        </MenuItem>
      </Box>
    </Popover>
  );
};

AccountPopover.propTypes = {
  anchorEl: PropTypes.any,
  onClose: PropTypes.func,
  open: PropTypes.bool.isRequired,
};
