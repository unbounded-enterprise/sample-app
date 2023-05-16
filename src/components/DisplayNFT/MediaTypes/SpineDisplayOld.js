import React, {useCallback, useEffect, useState, useRef } from "react";
import * as PIXI from 'pixi.js';
import { Button, Box, Grid, Stack, Typography } from '@mui/material';

/*
    utility functions
*/

function debounce(fn, delay) {
    let timer;
    return function (...args) {
      clearTimeout(timer);
      timer = setTimeout(() => fn.apply(this, args), delay);
    };
  }

  

/*
    Here's a high-level overview of what the component does:

        Initializes a new PIXI.Application with a transparent background when the component is mounted.
        Adds a resize handler to adjust the canvas size according to its parent container and updates the state accordingly.
        Clears the PIXI container and adds the PIXI view to it when necessary.
        Adjusts the size and position of the spine animations in the canvas based on the available space and the number of spines provided.
        Renders the spine animations in the PIXI canvas.
 */
export default function SpineDisplay({ 
    spines = [], // an array of spines which should be displayed
    nftSizePercentage = 75, // value from 0-100 to choose how much of the container the nft spine should fill. It will be size of height or width depending on spine ratios and container ratios, default is 75 to leave some space for your animations to be inside of the canvas
    width = undefined, // if width is not set, it will be the width of the container
    height = undefined, // if height is not set, the canvas will have the size of the width and be squared
}) { 

    const container = useRef();
    const containerParent = useRef();

    const [app, setApp] = useState(null);

    const [canvasWidth, setCanvasWidth] = useState(width?width:800);
    const [canvasHeight, setCanvasHeight] = useState(height?height:(width?width:800));

    const [displayRatio, setDisplayRatio] = useState(1);


    useEffect(()=>{
        if (!app) {
            setApp(new PIXI.Application({ backgroundAlpha: 0, width: containerParent?.current?.clientWidth || 800, height: containerParent?.current?.clientHeight || 800  }))  
        }
    }, [])

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

    const debouncedHandleResize = debounce(handleResize, 200);

    useEffect(() => {
        window.addEventListener("resize", debouncedHandleResize);
        return () => {
          window.removeEventListener("resize", debouncedHandleResize);
        };
      }, [debouncedHandleResize]);

    useEffect(()=>{
        handleResize();

      }, [handleResize]);


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


    const adjustSizeOfSpine = useCallback(
        (externalSpine, index) => {
          const spineToAdjust = externalSpine ? externalSpine : spine; // passing an external spine is optional
          if (!spineToAdjust || !canvasHeight || !canvasWidth) {
            return;
          }
      
          const ratio = spineToAdjust.width / spineToAdjust.height;
          const canvasRatio = canvasWidth / canvasHeight;
      
          const availableWidth = (canvasWidth * (nftSizePercentage || 75) * 0.01) / spines.length;
          const spacing = availableWidth / (spines.length + 1);
      
          if (ratio < canvasRatio) {
            spineToAdjust.height = canvasHeight * (nftSizePercentage || 75) * 0.01;
            spineToAdjust.width = ratio * spineToAdjust.height;
          } else {
            spineToAdjust.width = availableWidth;
            spineToAdjust.height = spineToAdjust.width / ratio;
          }
      
          if (spines.length === 1) {
            spineToAdjust.x = canvasWidth / 2;
          } else {
            spineToAdjust.x = spacing * (index + 1) + spineToAdjust.width * index + spineToAdjust.width / 2;
          }
          
          spineToAdjust.y = (canvasHeight / 2) + spineToAdjust.height / 2;
        },
        [spines, canvasHeight, canvasWidth]
      );
      

    useEffect(()=>{
        if (!app || !app.stage || !spines || spines.length === 0) {
            return;
        }
        clearStage();
        spines.forEach((spine, index)=>{
            adjustSizeOfSpine(spine, index);
            app.stage.addChild(spine); 
        })
        
    }, [adjustSizeOfSpine])

    function clearStage() {
        for (let i = app.stage.children.length - 1; i >= 0; i--) {	
            app.stage.removeChild(app.stage.children[i]);
        };
    }

    useEffect(()=>{
        if (containerParent?.current?.clientHeight && containerParent?.current?.clientWidth) {
            setDisplayRatio(containerParent.current.clientWidth / containerParent.current.clientHeight);
        } else {
            setDisplayRatio(null); 
        }
    }, [containerParent.current?.clientWidth, container.current?.clientHeight])


        return (
           <>
            <Box ref={containerParent} sx={{width: width?width:'100%', height: height?height:(width?width:'100%'), position: 'relative'}}>
                    <Box 
                        sx={{
                            width: width?width:'100%', 
                            height: height?height:(width?width:containerParent.current?.clientHeight)
                            }} 
                            ref={container}>
                    </Box>
            </Box>
           </>
    )
}
