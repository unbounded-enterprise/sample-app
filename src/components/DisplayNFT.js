import React, {useCallback, useEffect, useState, useRef } from "react";
import * as PIXI from 'pixi.js';
import * as PIXISPINE from 'pixi-spine';
import { Spine } from 'pixi-spine';
import { Button, Box, Grid, Stack, Typography } from '@mui/material';



export function getExpressionValue(expressionValues, expressionName, expressionAttributeName) {
    const expressionValue = expressionValues?.find((expressionVal) => expressionVal?.expression?.expressionName === expressionName && expressionVal?.expressionAttribute?.expressionAttributeName === expressionAttributeName)?.value
    return expressionValue;
}

export function parseNFT(nft, expression) {
    if (!nft) {
        return { parsedJson: null, parsedAtlas: null, parsedPng: null, parsedImageExpression: null}
    }
    const parsedImageExpression = getExpressionValue(nft.expressionValues || [], expression, 'Image');
    if (parsedImageExpression) {
        return { parsedJson: null, parsedAtlas: null, parsedPng: null, parsedImageExpression };
    }
    const parsedJson = getExpressionValue(nft.expressionValues || [], expression, 'JSON');
    const parsedAtlas = getExpressionValue(nft.expressionValues || [], expression, 'Atlas');
    const parsedImage = getExpressionValue(nft.expressionValues || [], expression, 'PNG');
    return { 
        parsedJson, 
        parsedAtlas,
        parsedImage, 
        parsedImageExpression,
    };
}

export function setNewSlotImage(spine, slotName, texture) {
    if(!texture) {
      spine.hackTextureBySlotName(slotName, PIXI.Texture.EMPTY);
      return;
    }
    if(texture.baseTexture) {
      spine.hackTextureBySlotName(slotName, texture);
    } else {
      const baseTex = new PIXI.BaseTexture(texture);
      const tex = new PIXI.Texture(baseTex);
      spine.hackTextureBySlotName(slotName, tex);
    }
  }

export function playAnimation(animationName, spine, looped= true) {
    if (!spine || !animationName) {
        return;
    }
    if (spine.state?.hasAnimation(animationName)) {
        spine.state.setAnimation(0, animationName, looped);
        spine.state.timeScale = 1;
    } else {
        console.log('animation not found');
    }
}



export default function DisplayNFT({ 
    assetlayerNFT,  // the nft you receive from assetlayer requests
    expression = 'Menu View',  // choose the expression(Name) that should be displayed
    defaultAnimation = 'idle', // animation name that will be played loop on start, leave undefined to not animate at start.
    showAnimations = false,  // displays buttons on the left or right of the container that can trigger the animations of the chosen expression of your nft
    animationAlign = 'right',  // 'right' or 'left' or 'top' to choose if the animationbuttosn should be displayed right or left or on the top of the container. If top is chosen, options will be aligned in a row, if left or right, it will be aligned as a columnn
    nftSizePercentage = 75, // value from 0-100 to choose how much of the container the nft spine should fill. It will be size of height or width depending on spine ratios and container ratios, default is 75 to leave some space for your animations to be inside of the canvas
    onLoaded = (spine)=>{console.log('spine: ', spine)}, // (spine)=>void will be called once the spine is loaded and have the spine as parameter, use the spine i.e. to call animations manually
    width = undefined, // the width of the canvas (nft might be smaller depending on nftSizePercentage you set), if width is not set, it will be the width of the container
    height = undefined, // the height of the canvas, if height is not set, the canvas will have the size of the width and be squared
}) { 

    const container = useRef();
    const animationContainer = useRef();
    const containerParent = useRef();

    const [app, setApp] = useState(null);
    const [nftLoaded, setNftLoaded] = useState(false);

    const [spineJson, setSpineJson] = useState(null);
    const [spineAtlas, setSpineAtlas]  = useState(null);
    const [spinePng, setSpinePng] = useState(null);
    const [imageExpression, setImageExpression] = useState(null);

    const [spine, setSpine] = useState(null);

    const [animations, setAnimations] = useState([]);
    const [animationButtons, setAnimationButtons] = useState(null);
    const [currentAnimation, setCurrentAnimation] = useState(null);

    const [canvasWidth, setCanvasWidth] = useState(width?width:800);
    const [canvasHeight, setCanvasHeight] = useState(height?height:(width?width:800));

    const [displayRatio, setDisplayRatio] = useState(1);



    

    useEffect(()=>{
        const { parsedJson, parsedAtlas, parsedImage, parsedImageExpression } = parseNFT(assetlayerNFT, expression);
        if (parsedJson) {
            // setSpineJson('jsonNamehere.json'); // setting this do a local copy of any nfts, they are not nft specific, only the image is
            if (expression === 'Three Quarter View') { // this is a temporary fix until the right atlas is reuploaded to all dogs
                setSpineJson('/static/dd.json');
            } else {
                setSpineJson(parsedJson); // using the parse Atlas from the nft.
            }
        }
        if (parsedAtlas) {
            // setSpineAtlas('atlasNamehere.atlas');  // setting this do a local copy of any nfts, they are not nft specific, only the image is
            if (expression === 'Three Quarter View') { // this is a temporary fix until the right atlas is reuploaded to all dogs
                setSpineAtlas('/static/dd.atlas');
            } else {
                setSpineAtlas(parsedAtlas); // using the parse Atlas from the nft.
            }
            
        }
        if (parsedImage) {
            setSpinePng(parsedImage); 
        }

        setImageExpression(parsedImageExpression);
    

    }, [assetlayerNFT, expression])


    useEffect(()=>{
        if (imageExpression) {
            setApp(null);
            setNftLoaded(false);
            return;
        }
        if (!app) {
            setNftLoaded(false);
            setApp(new PIXI.Application({ forceCanvas: true, backgroundAlpha: 0, width: containerParent?.current?.clientWidth || 800, height: containerParent?.current?.clientHeight || 800  }))  
        }
    }, [imageExpression])

    const handleResize = useCallback(() =>{
        if (!app) {
            return;
          }
          const { view } = app;
          if (!view) {
            return;
          }
        if (width) {
            return;
        }
        const parent = containerParent.current;
        if (!parent) {
            return;
        }
        parent.height = parent.width;
        app.resizeTo = parent;
        app.resize();
        setCanvasWidth(app.view?.width); // will trigger resize of spine in useEffect
        setCanvasHeight(app.view?.height);
    }, [app, container.current, height, width]);

    useEffect(()=>{
        // window.removeEventListener('resize', handleResize);
        if (imageExpression) {
            return;
        }
        handleResize();

      }, [handleResize, expression]);


    useEffect(()=>{
        setNftLoaded(false);
    }, [spineJson, spineAtlas, spinePng])

    function clearContainer(container) {
        // removes all children from a container
        if (!container) {
            return;
        }
        for (let i = 0; i < container.children.length; i++) {
            // remove the child element
             container.removeChild(container.children[i]);
         }
    }

    useEffect(()=>{
        if (!app) {
            clearContainer(container?.current);
            return;
          }
          const { view } = app;
          if (!view) {
            return;
          }
        if (container.current) {
            container.current.appendChild(app.view);
            handleResize();
        }
    }, [app, container.current])


    const adjustSizeOfSpine = useCallback((externalSpine)  => {
        const spineToAdjust = externalSpine?externalSpine:spine; // passing an external spine is optional
        if (!spineToAdjust || !canvasHeight || !canvasWidth) {
            return;
        }
        const ratio = spineToAdjust.width / spineToAdjust.height;
        const canvasRatio = canvasWidth / canvasHeight;

        if (ratio < canvasRatio) { 
            spineToAdjust.height = canvasHeight * (nftSizePercentage || 75) * 0.01; //leaving space for animations to not go over the container 
            spineToAdjust.width = ratio * spineToAdjust.height;
        } else {
            spineToAdjust.width = canvasWidth * (nftSizePercentage || 75) * 0.01; //leaving space for animations to not go over the container 
            spineToAdjust.height = spineToAdjust.width / ratio;
        }
        spineToAdjust.x = (canvasWidth/ 2);
        spineToAdjust.y = (canvasHeight / 2) + spineToAdjust.height / 2;
    }, [spine, canvasHeight, canvasWidth]);

    useEffect(()=>{
        adjustSizeOfSpine();
    }, [adjustSizeOfSpine])

    useEffect(()=>{
        if (!app) {
            return;
          }
          const { view } = app;
          if (!view) {
            return;
          }
        if (!imageExpression) {
            if (!nftLoaded && spineJson && spineAtlas && spinePng) {
                loadPixiNFT();
            }
            
        }
    }, [app, spineJson, spineAtlas, spinePng, nftLoaded, expression])

    useEffect(()=>{
        if(animations && animations.length > 0) {
            const fontSize = {xs: animationAlign==='top'?'1.5vh':'1.7vw', lg: '12px'};
            const animationButtons = 
            <Grid container direction={animationAlign==='top'?'column':'row'} sx={{height: '100%', overflow: 'auto'}}>
                {animationAlign!=='top' && <Grid item xs={12}><Typography sx={{fontSize}}>Animations: </Typography></Grid>}
                {animations.map((animation) =>
                    <React.Fragment key={animation}>
                        <Grid item xs={12} sx={{padding: 1}}>
                            <Button variant='contained' sx={{color: 'black', fontSize, width: '100%'}} onClick={()=>{setCurrentAnimation(animation)}}>{animation}</Button>
                        </Grid>
                    </React.Fragment>)
                }
            </Grid>
            
            setAnimationButtons(animationButtons);
        }
    }, [animations, canvasWidth, animationAlign])

    useEffect(()=>{
        playAnimation(currentAnimation, spine, true);
    }, [currentAnimation, spine])


    function clearStage() {
        for (let i = app.stage.children.length - 1; i >= 0; i--) {	
            app.stage.removeChild(app.stage.children[i]);
        };
    }
    
    function parseAnimations(spineData) {
        try {
            const parsedAnimations = [];
            spineData.animations.forEach((animation)=>{
                parsedAnimations.push(animation.name);
            })
            return parsedAnimations;
        } catch(e) {
            console.log('animation parsing error: ', + e.message)
            return [];
        }
        
    }

    function resourcesLoaded (loader, resources) {
        const nftSpine = new PIXISPINE.Spine(resources[(assetlayerNFT.nftId + expression)].spineData);
        if (nftSpine) {
            adjustSizeOfSpine(nftSpine);
            app.stage.addChild(nftSpine); 
            setAnimations(parseAnimations(nftSpine.spineData));
            setNftLoaded(true);
            setSpine(nftSpine);
            setCurrentAnimation(defaultAnimation);
        }
        }

    async function loadPixiNFT() {
        if (!app || !spinePng) {
            return;
        }
        clearStage();
        const texture = await PIXI.Texture.fromURL(spinePng);
        let spineLoaderOptions = { metadata: { 
                    spineAtlasFile: spineAtlas,
                    image: texture }}; 
        // now load json skeleton
        if(!app.loader.resources[(assetlayerNFT.nftId + expression)]) {
            app.loader.add((assetlayerNFT.nftId + expression), spineJson , spineLoaderOptions);
            app.loader.load(resourcesLoaded);
        } else {
            resourcesLoaded(app.loader, app.loader.resources);
        }
    
  
    }

    useEffect(()=>{
        if (nftLoaded && spine) {
            onLoaded(spine);
        }
    } ,[nftLoaded, spine]);

    useEffect(()=>{
        if (containerParent?.current?.clientHeight && containerParent?.current?.clientWidth) {
            setDisplayRatio(containerParent.current.clientWidth / containerParent.current.clientHeight);
        } else {
            setDisplayRatio(null); 
        }
    }, [containerParent.current?.clientWidth, container.current?.clientHeight])


        return (
           <>
           {showAnimations && !imageExpression && 
            <Box ref={animationContainer} 
                sx={{
                    position: 'absolute', 
                    zIndex: 1,
                    top: 0, 
                    left: animationAlign === 'left'?{xs: '0vw', lg: '0px'}:undefined, 
                    right: animationAlign === 'right'?{xs: '0vw', lg: '0px'}:undefined, 
                    top: animationAlign === 'top'?{xs: '0vw', lg: '0px'}:undefined, 
                    width: {xs: animationAlign === 'top'?container.current?.offsetWidth || 0:'20vw', lg: '200px'}, 
                    height: animationAlign==='top'?'7vh':container.current?.offsetHeight || 0,
                }}
                    
            >
                {animationButtons}
            </Box>}
            

            <Box ref={containerParent} sx={{width: width?width:'100%', height: height?height:(width?width:'100%'), position: 'relative'}}>
                {(imageExpression) ?
                    <Stack alignItems='center'>
                        <img 
                            src={imageExpression} 
                            alt='Menu View' 
                            style={{
                                width: displayRatio && displayRatio < 1? undefined:'100', 
                                height: displayRatio && displayRatio < 1? '100%':undefined}} />
                    </Stack>
                    :
                    
                    <Box 
                        sx={{
                            width: width?width:'100%', 
                            height: height?height:(width?width:containerParent.current?.clientHeight)
                            }} 
                            ref={container}>
                    </Box>
             }
            </Box>
           </>
    )
}
