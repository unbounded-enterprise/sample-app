import React, {useCallback, useEffect, useState, useMemo, useRef } from "react";
import * as PIXI from 'pixi.js';
import { Box } from '@mui/material';

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
    onAppLoaded = undefined, // callback as a way to access the created PIXI App
    onResizeComplete = undefined, // callback that gets called once the spines received have been resized to the size they will get displayed
}) { 
    const container = useRef();
    const containerParent = useRef();
    const onResizeCompleteRef = useRef();
    const canvasDimensionRef = useRef();

    const appRef = useRef();
    const [canvasDimension, setCanvasDimension] = useState({ canvasWidth: 0, canvasHeight: 0 })

    useEffect(()=> {
      onResizeCompleteRef.current = onResizeComplete;
    }, [onResizeComplete])

    useEffect(() => {
      if (!spines || spines.length === 0) {
        return;
      }
      if (!appRef.current) {
        const newApp = new PIXI.Application({ backgroundAlpha: 0, width: containerParent?.current?.clientWidth || 800, height: containerParent?.current?.clientHeight || 800  });
        appRef.current = newApp;
        if (onAppLoaded) {
          onAppLoaded(appRef.current);
        }
      }
      
      
    }, [onAppLoaded, spines]);

    const handleResize = useCallback(() =>{     
        if (!appRef.current) {
            return;
          }
          const { view } = appRef.current;
          if (!view) {
            return;
          }
        if (width) { // user has chosen fixed size, not resizing. Sizing is done by with and height adjustment being appRef.currentlied on the container and during appRef.current creation.
            return;
        }
        const parent = containerParent.current;
        if (!parent) {
            return;
        }
        appRef.current.resizeTo = parent;
        appRef.current.resize();
        setCanvasDimension( { canvasWidth: appRef.current.view?.width , canvasHeight: appRef.current.view?.height }); 
    }, [width]);

    const debouncedHandleResize = useMemo(() => debounce(handleResize, 200), [handleResize]);


    useEffect(() => {
        window.addEventListener("resize", debouncedHandleResize);
        return () => {
          window.removeEventListener("resize", debouncedHandleResize);
        };
      }, [debouncedHandleResize]);

    useEffect(()=>{
     
      debouncedHandleResize();

      }, [debouncedHandleResize]);


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
        if (!appRef.current) {
            clearContainer(container?.current);
            return;
          }
          const { view } = appRef.current;
          if (!view) {
            return;
          }
        if (container.current) {
            container.current.appendChild(appRef.current.view);
            handleResize();
        }
    }, [handleResize])


    const adjustSizeOfSpine = useCallback(
      (spines, externalSpine, index) => {
        const spineToAdjust = externalSpine;
        if (!spineToAdjust || !canvasDimension.canvasHeight || !canvasDimension.canvasWidth) {
          return;
        }
    
        const availableWidth = (canvasDimension.canvasWidth * (nftSizePercentage || 100) * 0.01) / spines.length;
        const ratioFull = (spineToAdjust.width * spines.length) / spineToAdjust.height;
        const ratio = spineToAdjust.width / spineToAdjust.height;
        const canvasRatio = canvasDimension.canvasWidth / canvasDimension.canvasHeight;
    
        if (ratioFull < canvasRatio) {
          spineToAdjust.height = canvasDimension.canvasHeight * nftSizePercentage * 0.01;
          spineToAdjust.width = ratio * spineToAdjust.height;
        } else {
          spineToAdjust.width = availableWidth;
          spineToAdjust.height = spineToAdjust.width / ratio;
        }
    
        // Calculate the total width of spines
        const totalWidthOfSpines = spineToAdjust.width * spines.length;
        // Calculate the remaining canvas width after placing all spines
        const remainingCanvasWidth = canvasDimension.canvasWidth - totalWidthOfSpines;
    
        // Calculate the spacing based on the remaining canvas width and the number of gaps between spines
        const spacing = remainingCanvasWidth / (spines.length + 1);
    
        // Adjust the starting x position and subtract half of the width of a single spine
        const startX = spacing;
    
        if (spines.length === 1) {
          spineToAdjust.x = canvasDimension.canvasWidth / 2;
        } else {
          spineToAdjust.x = startX + spacing * index + spineToAdjust.width * index + spineToAdjust.width / 2;
        }
    
        spineToAdjust.y = (canvasDimension.canvasHeight / 2) + spineToAdjust.height / 2;
      },
      [canvasDimension.canvasHeight, canvasDimension.canvasWidth, nftSizePercentage]
    );
    

    useEffect(()=>{
      canvasDimensionRef.current = canvasDimension;
    }, [canvasDimension])


    useEffect(()=>{
        if (!appRef.current || !appRef.current.stage || !spines || spines.length === 0 || !canvasDimensionRef.current.canvasWidth || !canvasDimensionRef.current.canvasHeight) {
            return;
        }
        function clearStage() {
          for (let i = appRef.current.stage.children.length - 1; i >= 0; i--) {	
              appRef.current.stage.removeChild(appRef.current.stage.children[i]);
          };
        }
        clearStage();
        spines.forEach((spine, index)=>{
            if(!spine) {
              return;
            }
            adjustSizeOfSpine(spines, spine, index);
            appRef.current.stage.addChild(spine); 
        }); 
        if (onResizeCompleteRef.current) {
          onResizeCompleteRef.current();
        }
        
    }, [spines, adjustSizeOfSpine])


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
