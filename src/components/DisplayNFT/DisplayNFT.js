import React, { useCallback, useEffect, useState, useRef } from "react";
import * as PIXI from 'pixi.js';
import * as PIXISPINE from 'pixi-spine';
import axios from 'axios';
import { TextureAtlas } from 'pixi-spine';
import { Box } from '@mui/material';
import SpineDisplay from "./MediaTypes/SpineDisplay";
import DisplayImage from "./MediaTypes/ImageDisplay";
import AudioDisplay from "./MediaTypes/AudioDisplay";

// Helper Functions

/**
 * Get the expression value from the given expression values array.
 * @param {Array} expressionValues
 * @param {string} expressionName
 * @param {string} expressionAttributeName
 * @returns {*} The expression value or undefined.
 */
export function getExpressionValue(expressionValues, expressionName, expressionAttributeName) {
    const expressionValue = expressionValues?.find((expressionVal) => expressionVal?.expression?.expressionName === expressionName && expressionVal?.expressionAttribute?.expressionAttributeName === expressionAttributeName)?.value
    return expressionValue;
}

export function getExpressionValuesForAllNFTs(nftArray, expressionName, expressionAttributeName) {
    const expressionMap = new Map();

    if (!nftArray) {
        return expressionMap;
    }

    nftArray.forEach((nft) => {
        const expressionValue = getExpressionValue(nft?.expressionValues, expressionName, expressionAttributeName);
        expressionMap.set(nft.nftId, expressionValue);
    });

    return expressionMap;
}



/**
 * Parse the NFT and return the parsed JSON, Atlas, PNG, and Image Expression values.
 * @param {Object} nft The NFT object.
 * @param {string} expression The expression to parse.
 * @returns {Object} An object containing the parsed JSON, Atlas, PNG, and Image Expression values or parsed Audio File.
 */
export function parseNFT(nft, expression) {
    if (!nft) {
        return { parsedJson: null, parsedAtlas: null, parsedPng: null, parsedImageExpression: null, parsedAudioExpression: null}
    }
    const expressionValues = nft.expressionValues || [];

    const parsedJson = getExpressionValue(expressionValues, expression, "JSON");
    const parsedAtlas = getExpressionValue(expressionValues, expression, "Atlas");
    const parsedPng = getExpressionValue(expressionValues, expression, "PNG");
    const parsedImageExpression = getExpressionValue(expressionValues, expression, "Image");
    const parsedAudioExpression = getExpressionValue(expressionValues, expression, "Audio");

    return { 
        parsedJson: parsedJson || null, 
        parsedAtlas: parsedAtlas || null,
        parsedPng: parsedPng || null, 
        parsedImageExpression: parsedImageExpression || null,
        parsedAudioExpression: parsedAudioExpression || null,
    };
}

/**
 * Set a new slot image for the given spine.
 * @param {PIXISPINE.Spine} spine The spine object.
 * @param {string} slotName The slot name.
 * @param {PIXI.Texture} texture The texture object.
 */
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

  export function getSlotSize(spine, slotName) {
    const slot = spine.slotContainers[spine.skeleton.findSlotIndex(slotName)];
    const attachment = slot.children[0].attachment;
    return {width: attachment.width, height: attachment.height};
  }

  /**
 * Play the animation for the given spine.
 * @param {string} animationName The animation name.
 * @param {PIXISPINE.Spine} spine The spine object.
 * @param {boolean} looped Whether the animation should loop or not.
 */
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

/**
 * Play a sequence of animations for the given spine.
 * @param {Array<string>} animationSequence An array of animation names.
 * @param {PIXISPINE.Spine} spine The spine object.
 * @param {Array<function>} onStartCallbacks An optional array of callbacks to be called at the start of each animation.
 * @param {Array<function>} onEndCallbacks An optional array of callbacks to be called at the end of each animation.
 * @param {boolean} loopLastAnimation Whether the last animation should loop or not.
 */
export function playAnimationSequence(
    animationSequence,
    spine,
    onStartCallbacks = [],
    onEndCallbacks = [],
    loopLastAnimation = false
  ) {
    if (!spine || !Array.isArray(animationSequence) || animationSequence.length === 0) {
      return;
    }
  
    let delay = 0.0;
   
    animationSequence.forEach((animationName, index) => {
      const loop = loopLastAnimation && index === animationSequence.length - 1;
  
      if (spine.state?.hasAnimation(animationName)) {
        const trackEntry = index===0?spine.state.setAnimation(0, animationName, loop):spine.state.addAnimation(0, animationName, loop, 0);
  
        if (onEndCallbacks[index]) {
            trackEntry.listener = { 
                end: ()=>{ if (onEndCallbacks[index]) onEndCallbacks[index]()},
                start: ()=>{
                    if (onStartCallbacks[index]) {
                          onStartCallbacks[index]();
                      }
                }
            }
          trackEntry.onComplete = () => {
            onEndCallbacks[index]();
          };
        }
      } else {
        console.log('animation not found');
      }
    });
  }
  

export const drawSpineToCanvas = (ctx, spine, app, resizeCanvas = true) => {
    if (!spine || !ctx || !app) {
      return;
    }
  
    const texture = app.renderer.generateTexture(spine);
    const pixelData = app.renderer.plugins.extract.pixels(texture);
  
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = texture.width;
    tempCanvas.height = texture.height;
    const tempCtx = tempCanvas.getContext('2d');
    const imageData = tempCtx.createImageData(texture.width, texture.height);
    imageData.data.set(pixelData);
  
    if (resizeCanvas) {
      ctx.canvas.width = texture.width < texture.height ? texture.width : texture.height;
      ctx.canvas.height = texture.width < texture.height ? texture.width : texture.height;
      ctx.putImageData(imageData, 0, -texture.height * 0.1);
    } else {
      ctx.putImageData(imageData, -38, -40);
    }
  };
  


/**
 * This function takes a Spine object as an input and extracts its animations.
 * @param {Object} spine - The Spine object containing the animations data.
 * @returns {Array} - An array of animation names or an empty array if an error occurs.
 */
export function parseAnimations(spine) {
    try {
        const spineData = spine.spineData;
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


DisplayNFT.defaultProps = {
    expression: 'Menu View',
    nftSizePercentage: 75,
    onSpineLoaded: null,
    onAudioLoaded: null,
    onAppLoaded: null,
    width: undefined,
    height: undefined,
    soundBackground: 'Menu View',
  };

export default function DisplayNFT({ 
    assetlayerNFTs,
    expression = 'Menu View',
    nftSizePercentage = 75,
    onSpineLoaded, // this function that gets called when the spine is ready should accept 2 parameters, spine and nftId.  Please make sure that the passed functions do not rerender (use useCallback i.e.)
    onAudioLoaded, // please make sure that the passed functions do not rerender (use useCallback i.e.)
    onAppLoaded,  // please make sure that the passed functions do not rerender (use useCallback i.e.)
    width = undefined,
    height = undefined,
    soundBackground = 'Menu View',
}) { 
    const containerParent = useRef();
    const onSpineLoadedRef = useRef(onSpineLoaded);

    const [nftData, setNftData] = useState({
        spineJsonMap: new Map(),
        spineAtlasMap: new Map(),
        spinePngMap: new Map(),
        imageExpressionsMap: new Map(),
        audioFilesMap: new Map(),
      });

    const [nftSpines, setNftSpines] = useState({ assetlayerNFTs: [], spines: [] }); // combined state to prevent onSpineLoaded to be called twice on assetlayerNFTs change.
    const [audioFilesArray, setAudioFilesArray] = useState([]);
    const [imageExpressionsArray, setImageExpressionsArray] = useState([]);
    const [backgroundImages, setBackgroundImages] = useState(new Map());


    const [resizeComplete, setResizeComplete] = useState(false);

    const assetlayerNFTsRef = useRef(assetlayerNFTs);

    useEffect(()=>{
        if (assetlayerNFTs) {
            assetlayerNFTsRef.current = assetlayerNFTs;
        }
      }, [assetlayerNFTs])

    useEffect(()=>{
        onSpineLoadedRef.current = onSpineLoaded;
    }, [onSpineLoaded])
    
    const loadPixiNFT = useCallback(async (spineAtlas, spinePng, spineJson) => {
        if (!spineAtlas || !spinePng || !spineJson) {
            return;
        }
        const atlas = await getTextureAtlas(spineAtlas, spinePng);
        const spineData = (await PIXI.Assets.load({ src: spineJson, data: { spineAtlas: atlas }})).spineData;
        const spine = new PIXISPINE.Spine(spineData);
        return spine;
    }, []);

    const onResizeComplete = useCallback(()=>{
        setResizeComplete(true);
    }, [])

    useEffect(() => {
        if (Array.isArray(assetlayerNFTs) && assetlayerNFTs.length > 0 && assetlayerNFTs.every((nft) => nft !== null)) {
            const newSpineJsonMap = new Map();
            const newSpineAtlasMap = new Map();
            const newSpinePngMap = new Map();
            const newImageExpressionsMap = new Map();
            const newAudioFilesMap = new Map();

            assetlayerNFTs.forEach(nft => {
                if (!nft) {
                    return;
                }
                const { parsedJson, parsedAtlas, parsedPng, parsedImageExpression, parsedAudioExpression } = parseNFT(nft, expression);

                newSpineJsonMap.set(nft.nftId, parsedJson);
                newSpineAtlasMap.set(nft.nftId, parsedAtlas);
                newSpinePngMap.set(nft.nftId, parsedPng);

                newImageExpressionsMap.set(nft.nftId, parsedImageExpression);
                newAudioFilesMap.set(nft.nftId, parsedAudioExpression);
            });

            setNftData({
                spineJsonMap: newSpineJsonMap,
                spineAtlasMap: newSpineAtlasMap,
                spinePngMap: newSpinePngMap,
                imageExpressionsMap: newImageExpressionsMap,
                audioFilesMap: newAudioFilesMap,
              })
            setResizeComplete(false);
        }
    }, [assetlayerNFTs, expression]);

    async function getTextureAtlas(url, imageUrl) {
        if (!url || url === '' || !imageUrl || imageUrl === '') {
            return; 
        }
        const rawAtlas = (await axios.get(url)).data;
        return new Promise((res, rej)=>{
            
            const textureLoader = (path, loaderFunction) => {
                PIXI.Assets.load(imageUrl).then((texLoaded)=>{
                    loaderFunction(texLoaded);
                    return texLoaded;
                })
            };
    
            const atlasLoadedCallback = (createdAtlas) => {
                res(createdAtlas);
            };
            new TextureAtlas(rawAtlas, textureLoader, atlasLoadedCallback);
        });
    }

    useEffect(() => {
        if (!assetlayerNFTsRef.current) {
            return;
        }
        async function loadPixiNfts() {
            const newSpines = [];
            for (const nft of assetlayerNFTsRef.current) {
                if (!nft?.nftId) {
                    continue;
                }
                const { nftId } = nft;
                const spineAtlas = nftData.spineAtlasMap.get(nftId);
                const spinePng = nftData.spinePngMap.get(nftId);
                const spineJson = nftData.spineJsonMap.get(nftId);
                if (spineAtlas && spinePng && spineJson) {
                    newSpines.push((await loadPixiNFT(spineAtlas, spinePng, spineJson)));
                }

            }
            setNftSpines({ assetlayerNFTs: assetlayerNFTsRef.current, spines: newSpines });
        }
        if (nftData?.spinePngMap.size > 0 && nftData?.spineAtlasMap.size > 0 && nftData?.spineJsonMap.size > 0) {
            loadPixiNfts();
        } else {
            if (onSpineLoadedRef.current) {
                onSpineLoadedRef.current(null);
            }
        }
    }, [nftData, loadPixiNFT]);

    useEffect(() => {
        if (nftData.audioFilesMap.size > 0 && onAudioLoaded) {
            setAudioFilesArray(Array.from(nftData?.audioFilesMap));
            const backgroundImages = getExpressionValuesForAllNFTs(assetlayerNFTsRef.current, 'Menu View', 'Image');
            setBackgroundImages(backgroundImages);
            nftData.audioFilesMap.forEach((audioFile, nftId) => {
                onAudioLoaded(audioFile, nftId);
            });
        }
    }, [nftData?.audioFilesMap, onAudioLoaded]);

    useEffect(() => {
        setImageExpressionsArray(Array.from(nftData?.imageExpressionsMap || []));
    }, [nftData]);
    
    
    useEffect(() => {
        if (resizeComplete && Array.isArray(nftSpines.spines) && nftSpines.spines.length > 0 &&  nftSpines.spines.length === nftSpines.assetlayerNFTs.length && onSpineLoadedRef.current) {
            nftSpines.spines.forEach((spine, index) => {
            });
            nftSpines.spines.forEach((spine, index) => {
                const nftId = nftSpines.assetlayerNFTs[index]?.nftId;
            onSpineLoadedRef.current(spine, nftId);
          });
          setResizeComplete(false);
        }
      }, [nftSpines, resizeComplete]);

    return (
        <>
            <Box
                ref={containerParent}
                sx={{
                    width: width ? width : '100%',
                    height: height ? height : (width ? width : '100%'),
                    position: 'relative',
                }}
            >
                {nftSpines?.spines?.length > 0 && <SpineDisplay spines={nftSpines.spines} nftSizePercentage={nftSizePercentage} onAppLoaded={onAppLoaded} onResizeComplete={onResizeComplete} />}
                {imageExpressionsArray.length > 0 && (
                    <>
                        {imageExpressionsArray.map(([nftId, imgExpression]) => (
                            imgExpression && <DisplayImage key={`display-image-${nftId}`} src={imgExpression} />
                        ))}
                    </>
                )}

                {audioFilesArray.map(([nftId, audioSrc]) => {
                return (
                    audioSrc && (
                        <AudioDisplay
                            key={`audio-display-${nftId}`}
                            src={audioSrc}
                            backgroundImage={
                                soundBackground === 'Menu View'
                                    ? backgroundImages.get(nftId)
                                    : soundBackground
                            }
                        />
                    )
                );
            })}

            </Box>
        </>
    );
}
