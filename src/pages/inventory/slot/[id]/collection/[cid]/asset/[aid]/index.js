import NextLink from 'next/link';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { Button, Box, Breadcrumbs, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Grid, IconButton, Link, TextField, Typography } from '@mui/material';
import { MainLayout } from 'src/components/main-layout';
import axios from 'axios';
import { AssetDetailDisplay } from 'src/components/DisplayAsset/AssetDetailDisplay';
import CollectionDetailsInfos from 'src/components/DisplayAsset/CollectionDetailsInfos';
import { parseBasicErrorClient } from 'src/_api_/auth-api';
import { styled } from '@mui/system';
import CloseIcon from "@mui/icons-material/Close";
import { useAuth } from 'src/hooks/use-auth';
import LoginButton from 'src/components/home/login-button';
import { useAssetLayer } from 'src/contexts/assetlayer-context.js'; // Import the hook






const CenteredImage = styled('img')({display: 'block', marginLeft: 'auto', maxWidth: '200px', marginRight: 'auto', width: '50%'});
const slotButtonStyle = { color: 'blue', border: '1px solid blue', fontSize: '1vw' };

const loading = <> <CenteredImage src="/static/loader.gif" alt="placeholder" /> </>;

const InventoryAssetDetailPage = ()=>{
  const router = useRouter();
  const [app, setApp] = useState(null);
  const [sort, setSort] = useState("maximum");
  //const [assetSort, setAssetSort] = useState("ascending");
  const [chosenCollection, setChosenCollection] = useState(null);
  const [chosenSlot, setChosenSlot] = useState(null);
  const [chosenAsset, setChosenAsset] = useState(null);

  const [slotId, setSlotId] = useState(null);
  const [collectionId, setCollectionId] = useState(null);
  const [assetId, setAssetId] = useState(null);
  const { assetlayerClient, loggedIn, setLoggedIn } = useAssetLayer(); // Use the hook to get the client and loggedIn state
  const [user, setUser] = useState(null);

  const getApp = async () => {
    const appObject = (await axios.post('/api/app/info', { }));
    return appObject.data.body.app;
  }
  
  const getSlot = async (slotId) => { // just used for testing
    if (slotId.length > 10) {
      const slotsObject = (await axios.post('/api/slot/info', { slotId }));
      return slotsObject.data.body.slot;
    }
  }
  
  
  const getCollection = async (collection, sortFunction) => {
    if (collection.length > 10) {
      const {result: collectionsObject} = await assetlayerClient.collections.safe.getCollections({collectionIds: [collection]});
      //const collectionsObject = (await axios.post('/api/collection/info', { collectionId: collection, idOnly: false, includeDeactivated: false }));
      return collectionsObject[0];
    }
  }
  
  const getAsset = async (assetId) => {
    if (assetId) {
      const {result: assetObject} = await assetlayerClient.assets.safe.getAssets({assetIds: [assetId]});
      console.log(assetObject);
      return assetObject[0];
    } 
    
  }
  
  function removeAssetSubpath(url) {
    const regex = /\/asset\/[0-9a-fA-F]+/;
    return url.replace(regex, '');
  }
  
  const getUser = async () => {
    const {result: user} = await assetlayerClient.users.safe.getUser();
    return user;
  }
  
  const getIsLoggedIn = async () => {
    const loggedIn = await assetlayerClient.initialize();
    return loggedIn;
  }

  function MyModal(props) {
    const [open, setOpen] = useState(false);
    const [input, setInput] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    const handleClickOpen = () => {
      setSuccess(false);
      setError("");
      setOpen(true);
    };

    const handleClose = () => {
      if (success) {
        router.push(removeAssetSubpath(router.asPath));
      } else {
        setOpen(false);
      }
    };

    const handleInputChange = (e) => {
      setInput(e.target.value);
    };

    const handleSubmit = async () => {
      try {
        const {result: response} = await assetlayerClient.assets.safe.sendAsset({assetId: props.assetId, receiver: input});
        
        console.log(response);
        /*console.log(response.status);
        if (response.status === 200) {
          setSuccess(true);
        }*/
      } catch (err) {
        if (err.response.data.error === "invalid: recipientHandle") {
          setError("Invalid handle. Please try again.");
        } else if (err.response.data.error === "permissions: denied"){
          setError("This app does not have permission to transfer this Asset.");
        } else {
          setError("An unknown error occurred.");
        }
      }
    };

    return (
      <div>
        <Button
          sx={{ color: "blue", border: "1px solid blue", mt: "10px" }}
          onClick={handleClickOpen}
        >
          Send as Gift
        </Button>
        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>
            <IconButton
              edge="end"
              color="inherit"
              onClick={handleClose}
              aria-label="close"
            >
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent>
            <DialogContentText>
              {success ? "Success!" : "Please enter recipient's handle."}
            </DialogContentText>
            {success ? (
              <></>
            ) : (
              <TextField
                autoFocus
                margin="dense"
                id="name"
                label="Handle"
                type="text"
                fullWidth
                variant="outlined"
                onChange={handleInputChange}
                error={!!error}
                helperText={error}
              />
            )}
          </DialogContent>
          {success ? (
            <></>
          ) : (
            <DialogActions>
              <Button
                sx={{ color: "blue", border: "1px solid blue" }}
                onClick={handleSubmit}
              >
                Submit
              </Button>
            </DialogActions>
          )}
        </Dialog>
      </div>
    );
  }
  
  useEffect(() => {
    if (router.isReady) {
      setSlotId(router.asPath.split("/")[3]);
      setCollectionId(router.asPath.split("/")[5]);
      setAssetId(router.asPath.split("/")[7]);
    }
  }, [router.isReady]);

  useEffect(() => {
    if (slotId) {
      getSlot(slotId)
        .then((slot) => {
          setChosenSlot(slot);
        })
        .catch((e) => {
          const error = parseBasicErrorClient(e);
          console.log('setting error: ', error.message);
        });
    }
  }, [slotId]);

  useEffect(() => {
    if (collectionId) {
      getCollection(collectionId, sort)
        .then((collection) => {
          setChosenCollection(collection);
        })
        .catch((e) => {
          const error = parseBasicErrorClient(e);
          console.log('setting error: ', error.message);
        });
    }
  }, [collectionId]);

  useEffect(() => {
    if (assetId && loggedIn) {
      getAsset(assetId)
        .then((asset) => {
          setChosenAsset(asset);
        })
        .catch((e) => {
          const error = parseBasicErrorClient(e);
          console.log('setting error: ', error.message);
        });
    }
  }, [assetId, loggedIn]);

  useEffect(() => {
    getApp()
      .then((app) => {
        setApp(app);
      })
      .catch((e) => {
        const error = parseBasicErrorClient(e);
        console.log('setting error: ', error.message);
      });
  }, []);

  useEffect(() => {
    getIsLoggedIn()
      .then((isLoggedIn) => {
        setLoggedIn(isLoggedIn)
      })
      .catch(e => { 
        const error = parseBasicErrorClient(e);
        console.log('setting error: ', error.message);
      });
  }, []);

  useEffect(() => {
    if(loggedIn){
      getUser()
      .then((user) => {
        setUser(user)
      })
      .catch(e => { 
        const error = parseBasicErrorClient(e);
        console.log('setting error: ', error.message);
      });
    }
  }, [loggedIn]);
  
  if (!loggedIn) return <LoginButton />;
  if (!(chosenCollection && chosenSlot && chosenAsset && app)) return loading;
    
  return (
    <Box sx={{ backgroundColor: 'none', py: 5 }}>
      <Box sx={{
        width: '95%',
        alignSelf: 'stretch',
        marginLeft: "auto",
        marginRight: "auto",
        py: 1,
        px: {xs:2, sm:5},
        backgroundColor: 'none'
      }}>
        <Grid container spacing={2} minWidth="320px">
          <Grid item xs={12}>
            <Breadcrumbs aria-label="breadcrumb">
              <NextLink underline="hover" color="inherit" href="/inventory">
                App
              </NextLink>
              <NextLink underline="hover" color="inherit" href={`/inventory/slot/${slotId}`}>
                Slot
              </NextLink>
              <NextLink underline="hover" color="inherit" href={`/inventory/slot/${slotId}/collection/${collectionId}`}>
                Collection
              </NextLink>
              <Typography color="text.primary">
                Asset
              </Typography>
            </Breadcrumbs>
          </Grid>
          <Grid item container xs={12} justifyContent='flex-start' sx={{ backgroundColor: "none" }}>
            <Grid item xs={12}>
              <Typography variant="h3" sx={{ lineHeight: '40px' }}>
                {chosenCollection.collectionName} #{chosenAsset.serial}
              </Typography>
              <MyModal assetId={chosenAsset.assetId}/>
            </Grid>
            <Grid item xs={12}>
              <CollectionDetailsInfos
                creator={chosenCollection.handle}
                appName={app.appName}
                slotName={chosenSlot.slotName}
                totalSupply={chosenCollection.maximum}
                collectionName={chosenCollection.collectionName}
                type={chosenCollection.type}
                assetLocation={chosenAsset.location}
              />
            </Grid>
            <Grid item container xs={12} sx={{ my: '2rem' }}>
              <AssetDetailDisplay asset={chosenAsset}/>
            </Grid>
          </Grid>
        </Grid>
      </Box>
    </Box>
  )
}

InventoryAssetDetailPage.getLayout = (page) => (
  <MainLayout>
    { page }
  </MainLayout>
);

export default InventoryAssetDetailPage;

const getApp = async () => {
  const appObject = (await axios.post('/api/app/info', { }));
  return appObject.data.body.app;
}

const getSlot = async (slotId) => { // just used for testing
  if (slotId.length > 10) {
    const slotsObject = (await axios.post('/api/slot/info', { slotId }));
    return slotsObject.data.body.slot;
  }
}


const getCollection = async (collection, sortFunction) => {
  if (collection.length > 10) {
    const {result: collectionsObject} = await assetlayerClient.collections.safe.getCollections({collectionIds: [collection]});
    //const collectionsObject = (await axios.post('/api/collection/info', { collectionId: collection, idOnly: false, includeDeactivated: false }));
    return collectionsObject[0];
  }
}

const getAsset = async (assetId) => {
  if (assetId) {
    const {result: assetObject} = await assetlayerClient.assets.safe.getAssets({assetIds: [assetId]});
    console.log(assetObject);
    return assetObject[0];
  } 
  
}

function removeAssetSubpath(url) {
  const regex = /\/asset\/[0-9a-fA-F]+/;
  return url.replace(regex, '');
}

const getUser = async () => {
  const {result: user} = await assetlayerClient.users.safe.getUser();
  return user;
}

const getIsLoggedIn = async () => {
  const loggedIn = await assetlayerClient.initialize();
  return loggedIn;
}