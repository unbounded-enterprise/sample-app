import React, { useCallback, useEffect, useState, useMemo, useRef } from "react";
import * as PIXI from 'pixi.js';
import { Box } from '@mui/material';
import useUpdatedRef from "../hooks/useUpdateRef";

/**
    Utility function 'debounce'
    Delays function execution until after 'delay' milliseconds have elapsed since the last time it was invoked.
    Used here to optimize performance during window resizing.
*/
function debounce(fn, delay) {
  let timer;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), delay);
  };
}

/**
 * SpineDisplay Component
 * 
 * This component is designed to handle and display a list of Spine animations using the PIXI.js library. It offers
 * the following functionalities:
 * 
 * 1. Dynamic Resizing: The component can dynamically adjust the size of the canvas according to its parent container.
 *    This means that it responds to changes in the size of the parent container by adjusting the canvas size accordingly.
 * 
 * 2. Spine Animation Adjustment: The component takes into consideration the available space within the canvas and the
 *    number of spine animations provided to calculate and adjust the size and position of each spine animation. 
 * 
 *    The size of each spine animation is determined by the 'nftSizePercentage' prop, which defines the percentage of the 
 *    container space that the spine animation should occupy. The default value is 75%, meaning that the spine animation 
 *    will take up 75% of the available container space. 
 * 
 *    The position of each spine animation in the canvas is calculated by evenly distributing them across the canvas width. 
 *    If there is only one spine animation, it is positioned in the center of the canvas.
 * 
 * 3. Fallback to Container Size: If no 'width' or 'height' prop is provided, the component defaults to using the size 
 *    of the parent container. This ensures that the canvas will always have an appropriate size, even if explicit dimensions
 *    are not provided.
 * 
 * Callbacks:
 * 
 * 4. onAppLoaded: This is a callback function that is triggered after the PIXI Application is initialized. It allows the parent 
 *    component to access and interact with the created PIXI Application directly. This could be used for extending the 
 *    functionality of the SpineDisplay component, or for any operations that require direct access to the PIXI Application.
 * 
 * 5. onResizeComplete: This callback function is triggered once the spine animations have been resized and placed in the 
 *    canvas accordingly. This callback could be used to execute additional operations after the resizing is done, such as 
 *    performing other layout calculations or triggering animations. For example, it could be used to ensure that other 
 *    UI elements are positioned correctly in relation to the resized spine animations.
 *
 * @param {object} props The properties object.
 * @param {Array} props.spines The list of spine animations to be displayed.
 * @param {number} [props.nftSizePercentage=75] The percentage of the container space that the spine animation should occupy.
 * @param {string | number | undefined} [props.width] Width of the canvas. If not provided, the width of the parent container is used.
 * @param {string | number | undefined} [props.height] Height of the canvas. If not provided, the height of the parent container is used.
 * @param {function | undefined} [props.onAppLoaded] Callback function triggered after the PIXI Application is initialized. It receives the PIXI Application as an argument.
 * @param {function | undefined} [props.onResizeComplete] Callback function triggered once the spine animations have been resized and placed in the canvas accordingly.
 */
export default function SpineDisplay({ 
  spines = [],
  nftSizePercentage = 75,
  width = undefined,
  height = undefined,
  onAppLoaded = undefined,
  onResizeComplete = undefined,
}) { 

  // The canvas dimensions state is stored and managed using useState to work with the real size as well as trigger updates on change.
  const [canvasDimension, setCanvasDimension] = useState({ canvasWidth: 0, canvasHeight: 0 });

  // Refs are used to access the containers and callback functions within the component in an up to date state without triggering rerenders
  const container = useRef();
  const containerParent = useRef();
  const onResizeCompleteRef = useUpdatedRef(onResizeComplete);
  const canvasDimensionRef = useUpdatedRef(canvasDimension);
  const onAppLoadedRef = useUpdatedRef(onAppLoaded);
  const appRef = useRef();

  // Setup the PIXI application when the component is mounted
  useEffect(() => {
    // If there are no spines, exit the function.
    if (!spines || spines.length === 0) {
      return;
    }
    // If there's no PIXI application yet, create a new one. Should only be done once.
    if (!appRef.current) {
      const RESOLUTION = window.devicePixelRatio > 1 ? 2 : 1;
      const newView = document.createElement('canvas');
      newView.width = containerParent?.current?.clientWidth || 800;
      newView.height = containerParent?.current?.clientHeight || 800;
      const newApp = new PIXI.Application({ 
        view: newView, 
        backgroundAlpha: 0, 
        width: containerParent?.current?.clientWidth || 800, 
        height: containerParent?.current?.clientHeight || 800, 
        antialias: true, 
        autoDensity: true, 
        roundPixels: true,  
        resolution: RESOLUTION, 
        resizeTo: containerParent.current 
      });
      appRef.current = newApp;
      if (onAppLoadedRef.current) {
        onAppLoadedRef.current(appRef.current);
      }
    }
  // ESLint doesn't know that onAppLoadedRef is a ref object.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [spines]);

  // Handle the resizing of the PIXI canvas
  const handleResize = useCallback(() => {    
    // Exit the function  early if needed parts are not ready yet. 
    if (!appRef.current) {
      return;
    }
    const { view } = appRef.current;
    if (!view) {
      return;
    }

    // Exit the function if a fixed size has been defined by the user.
    // Resizing in this case is handled by width and height adjustment applied on the container and during app creation.
    if (width) {
      return;
    }
    const parent = containerParent.current;
    if (!parent) {
      return;
    }
    // Set the app to resize according to the parent container and perform the resize
    appRef.current.resizeTo = parent;
    appRef.current.resize();

    // Update the canvas dimensions based on the new size of the view, adjusted for the renderer's resolution. (with on mobile devices might be twice the size on screen)
    setCanvasDimension({ 
      canvasWidth: appRef.current.view?.width / appRef.current.renderer.resolution, 
      canvasHeight: appRef.current.view?.height / appRef.current.renderer.resolution
    }); 
  }, [width]);

  // Debounce the handleResize function to improve performance
  const debouncedHandleResize = useMemo(() => debounce(handleResize, 200), [handleResize]);

  // Add event listeners for window resizing and cleanup on component unmount
  useEffect(() => {
    window.addEventListener("resize", debouncedHandleResize);
    return () => {
      window.removeEventListener("resize", debouncedHandleResize);
    };
  }, [debouncedHandleResize]);

  useEffect(()=>{
    debouncedHandleResize();
  }, [debouncedHandleResize]);

  // Helper function to clear all child nodes from a container
  function clearContainer(container) {
    if (!container) {
      return;
    }
    for (let i = 0; i < container.children.length; i++) {
      container.removeChild(container.children[i]);
    }
  }

  // On changes to the PIXI application, clear the container and append the PIXI view
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
  }, [handleResize]);

  // The adjustSizeOfSpine function takes in an array of spines, a spine Object, and an index.
  // This function is designed to adjust the size and position of each Spine in the canvas based on the available space and the number of spines.
  const adjustSizeOfSpine = useCallback((spines, spineToAdjust, index) => {
      if (!spineToAdjust || !canvasDimension.canvasHeight || !canvasDimension.canvasWidth) {
        return;
      }
      // Calculate the width available for each spine based on the canvas width and the nftSizePercentage.
      const availableWidth = (canvasDimension.canvasWidth * (nftSizePercentage || 100) * 0.01) / spines.length;

      // Calculate the aspect ratios of the spine and the canvas.
      const ratioFull = (spineToAdjust.width * spines.length) / spineToAdjust.height;
      const ratio = spineToAdjust.width / spineToAdjust.height;
      const canvasRatio = canvasDimension.canvasWidth / canvasDimension.canvasHeight;

      // Adjust the width and height of the spine based on the comparison of ratios.
      if (ratioFull < canvasRatio) {
        spineToAdjust.height = canvasDimension.canvasHeight * nftSizePercentage * 0.01;
        spineToAdjust.width = ratio * spineToAdjust.height;
      } else {
        spineToAdjust.width = availableWidth;
        spineToAdjust.height = spineToAdjust.width / ratio;
      }
      
      // Calculate the total width of all spines and the remaining canvas width after placing all spines.
      const totalWidthOfSpines = spineToAdjust.width * spines.length;
      const remainingCanvasWidth = canvasDimension.canvasWidth - totalWidthOfSpines;
      
      // Calculate the spacing based on the remaining canvas width and the number of gaps between spines.
      const spacing = remainingCanvasWidth / (spines.length + 1);
      
      // Adjust the starting x position and subtract half of the width of a single spine to center the spine around this position.
      const startX = spacing;

      // If there's only one spine, center it in the canvas. Otherwise, distribute the spines evenly across the canvas.
      if (spines.length === 1) {
        spineToAdjust.x = canvasDimension.canvasWidth / 2;
      } else {
        spineToAdjust.x = startX + spacing * index + spineToAdjust.width * index + spineToAdjust.width / 2;
      }

      // Center the spine vertically in the canvas.
      spineToAdjust.y = (canvasDimension.canvasHeight / 2) + spineToAdjust.height / 2;
  }, [canvasDimension.canvasHeight, canvasDimension.canvasWidth, nftSizePercentage]);

  // This useEffect hook is responsible for the update of the spines. 
  // It executes when there's a change in the 'spines' array or the 'adjustSizeOfSpine' function.
  useEffect(() => {
    // Only calculate once everything is ready
    if (!appRef.current || !appRef.current.stage || !spines || spines.length === 0 || !canvasDimensionRef.current.canvasWidth || !canvasDimensionRef.current.canvasHeight) {
      return;
    }

    // The clearStage function is used to remove all current children from the stage, preparing it for the new spines.
    function clearStage() {
      for (let i = appRef.current.stage.children.length - 1; i >= 0; i--) {	
        appRef.current.stage.removeChild(appRef.current.stage.children[i]);
      };
    }

    // The stage is cleared using the clearStage function.
    clearStage();

    // For each spine in the 'spines' array, the adjustSizeOfSpine function is executed and the spine is added to the stage.
    spines.forEach((spine, index) => {
      if (!spine) {
        return;
      }

      // The adjustSizeOfSpine function is used to adjust the size and positioning of the spine.
      adjustSizeOfSpine(spines, spine, index);

      // The spine is then added to the stage of the PIXI application.
      appRef.current.stage.addChild(spine); 
    }); 

    // If the onResizeCompleteRef function exists, it is executed. 
    // This can be used to run additional operations once the resizing of the spines is done.
    if (onResizeCompleteRef.current) {
      onResizeCompleteRef.current();
    }
  // ESLint doesn't know that onResizeCompleteRef and canvasDimensionRef are ref objects.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [spines, adjustSizeOfSpine]);

  return (
    <>
      <Box ref={containerParent} sx={{width: width?width:'100%', height: height?height:(width?width:'100%'), position: 'relative'}}>
        <Box 
          sx={{
            width: width?width:'100%', 
            height: height?height:(width?width:containerParent.current?.clientHeight)
          }} 
          ref={container}
        />
      </Box>
    </>
  );
}
