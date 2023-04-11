import React, {useCallback, useEffect, useState, useRef } from "react";
import * as PIXI from 'pixi.js';
import * as PIXISPINE from 'pixi-spine';
import axios from 'axios';
import { TextureAtlas } from 'pixi-spine';
import { Box, Stack } from '@mui/material';
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



export default function DisplayNFT({ 
    assetlayerNFT,  // the nft you receive from assetlayer requests
    expression = 'Menu View',  // choose the expression(Name) that should be displayed
    nftSizePercentage = 75, // value from 0-100 to choose how much of the container the nft spine should fill. It will be size of height or width depending on spine ratios and container ratios, default is 75 to leave some space for your animations to be inside of the canvas
    onSpineLoaded = (spine)=>{console.log('spine: ', spine)}, // (spine)=>void will be called once the spine is loaded and have the spine as parameter, use the spine i.e. to call animations manually
    onAudioLoaded = (audioFile) => { console.log('audio file: ', audioFile)}, // will be called if the expression chosen is containing an audioFile
    width = undefined, // if width is not set, it will be the width of the container
    height = undefined, // if height is not set, the canvas will have the size of the width and be squared
    soundBackground='Menu View' // you can choose a background to be displayed for the sound play button, by default it will be the menu view expression, set this to null to not have a background
}) { 

    const containerParent = useRef();

    const [spineJson, setSpineJson] = useState(null);
    const [spineAtlas, setSpineAtlas]  = useState(null);
    const [spinePng, setSpinePng] = useState(null);
    const [imageExpression, setImageExpression] = useState(null);
    const [audioFile, setAudioFile] = useState(null);
    const [resources, setResources] = useState({});

    const [spine, setSpine] = useState(null);



    

    useEffect(()=>{
        const { parsedJson, parsedAtlas, parsedPng, parsedImageExpression, parsedAudioExpression } = parseNFT(assetlayerNFT, expression);

            setSpineJson(parsedJson); 
            setSpineAtlas(parsedAtlas);
            setSpinePng(parsedPng); 
            setImageExpression(parsedImageExpression); 
            setAudioFile( parsedAudioExpression);
        
    }, [assetlayerNFT, expression])

    function resourcesLoaded (resources) {
        console.log('loaded, ', resources);
        setResources(resources);
        const nftSpine = new PIXISPINE.Spine(resources[(assetlayerNFT.nftId + expression)].spineData);
        if (nftSpine) {
            setSpine(nftSpine);
        }
        }

    async function getTextureAtlas(url, imageUrl) {
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

    useEffect(()=>{
        if (spinePng && spineAtlas && spineJson) {
            loadPixiNFT();
        } else {
            onSpineLoaded(null);
        }
    },[spinePng, spineAtlas, spineJson])

    useEffect(()=>{
        if (onAudioLoaded) {
            onAudioLoaded(audioFile);
        }
    }, [audioFile])

    async function loadPixiNFT() {
        // now load json skeleton
        if(!resources || !resources[(assetlayerNFT.nftId + expression)]) {
            const atlas = await getTextureAtlas(spineAtlas, spinePng);

            if (!resources) {
                setResources({});
            }
            resources[assetlayerNFT.nftId + expression] = await PIXI.Assets.load({ src: spineJson, data: { spineAtlas: atlas }}); 
            resourcesLoaded(resources);
        } else {
            resourcesLoaded(resources);
        }
    
  
    }

    useEffect(()=>{
        if (spine && onSpineLoaded) {
            onSpineLoaded(spine);
        }
    } ,[spine]);

        return (
           <>
            
            <Box ref={containerParent} sx={{width: width?width:'100%', height: height?height:(width?width:'100%'), position: 'relative'}}>
                {(imageExpression) ?
                        <DisplayImage src={imageExpression}/>
                    :
                    <>
                    {spine && <>
                        <SpineDisplay spines={[spine]} nftSizePercentage={nftSizePercentage} />
                    </>}
                    </>
             }
             {audioFile && <AudioDisplay src={audioFile} backgroundImage={soundBackground==='Menu View'?getExpressionValue(assetlayerNFT.expressionValues, 'Menu View', 'Image'):soundBackground}/>}
            </Box>
           </>
    )
}
