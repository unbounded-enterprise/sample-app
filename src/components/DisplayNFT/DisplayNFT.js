import React, { useCallback, useEffect, useState, useRef } from "react";
import * as PIXI from 'pixi.js';
import * as PIXISPINE from 'pixi-spine';
import axios from 'axios';
import { TextureAtlas } from 'pixi-spine';
import { Box } from '@mui/material';
import SpineDisplay from "./MediaTypes/SpineDisplay";
import DisplayImage from "./MediaTypes/ImageDisplay";
import AudioDisplay from "./MediaTypes/AudioDisplay";
import useUpdatedRef from "./hooks/useUpdateRef";
import VideoDisplay from "./MediaTypes/VideoDisplay";

DisplayNFT.defaultProps = {
    expression: 'Menu View',
    nftSizePercentage: 75,
    onSpineLoaded: null,
    onAudioLoaded: null,
    onVideoLoaded: null,
    onAppLoaded: null,
    width: undefined,
    height: undefined,
    soundBackground: 'Menu View',
};

/**
 * DisplayNFT Component
 * 
 * This component displays NFTs using Spine, Image, and Audio displays.
 * 
 * Props:
 * - assetlayerNFTs: An array of NFT objects to be displayed (from Assetlayer API responses).
 *                   The possibility for more than one NFT here is mostly for not having a different canvas for several spines.
 * - expression: The expression to be parsed from the NFTs. Default is 'Menu View'.
 * - nftSizePercentage: The size of the NFTs as a percentage of the parent container's size. Default is 75.
 * - onSpineLoaded: A callback function that is called when a Spine object is loaded. This function should accept two parameters: the Spine object and the NFT ID.
 * - onAudioLoaded: A callback function that is called when an audio file is loaded. The function should accept one parameter, the url the audio file.
 * - onVideoLoaded: A callback function that is called when a video file is loaded. The function should accept one parameter, the url of the video file.
 * - onAppLoaded: A callback function that is called when the PIXI application is loaded.
 * - width: The width of the component. If not provided, the component will take up 100% of the parent's width.
 * - height: The height of the component. If not provided, the component will take up 100% of the parent's height.
 *   (the height of video and audio expressions will be sized by the aspect ratio of the content (backgroundImage / videofile)
 * - soundBackground: By default this loads the Menu View expression of each nft as the background for Sound Expressions, you can pass an image url here to be used instead. Default is 'Menu View'.
 */
export default function DisplayNFT({
    assetlayerNFTs,
    expression = 'Menu View',
    nftSizePercentage = 75,
    onSpineLoaded,
    onAudioLoaded,
    onVideoLoaded,
    onAppLoaded,
    width = undefined,
    height = undefined,
    soundBackground = 'Menu View',
}) {
    // useRef hook to keep track of the parent container
    const containerParent = useRef();

    // useRef hooks to keep track of the callback functions and prevent unnecessary re-renders
    const onSpineLoadedRef = useUpdatedRef(onSpineLoaded);
    const onAudioLoadedRef = useUpdatedRef(onAudioLoaded);
    const onVideoLoadedRef = useUpdatedRef(onVideoLoaded);

    // useRef hook to keep track of the assetlayerNFTs prop and prevent unnecessary re-renders
    const assetlayerNFTsRef = useUpdatedRef(assetlayerNFTs);

    // combined state to only trigger rerenders once
    // the Maps have nftIds as keys and the parsed value of the expression as the value.
    const [nftData, setNftData] = useState({
        spineJsonMap: new Map(),
        spineAtlasMap: new Map(),
        spinePngMap: new Map(),
        imageExpressionsMap: new Map(),
        audioFilesMap: new Map(),
        videoFilesMap: new Map(),
    });

    // combined state to prevent onSpineLoaded to be called twice on assetlayerNFTs change.
    const [nftSpines, setNftSpines] = useState({ assetlayerNFTs: [], spines: [] }); 

    // useState hooks to manage the state of the audio files and image expressions parsed from the NFT
    const [audioFilesArray, setAudioFilesArray] = useState([]);
    const [imageExpressionsArray, setImageExpressionsArray] = useState([]);
    const [videoExpressionsArray, setVideoExpressionsArray] = useState([]);

    // This state keeps track of the backgroundImages that should be displayed on your sound expression nfts.
    // The backgroundImages state is a Map where the key is the NFT ID and the value is the URL of the background image for that NFT.
    // background images here loaded are really the Menu View Expression of the nfts.
    const [backgroundImages, setBackgroundImages] = useState(new Map());


    // keeps track if the resize done within the SpineDisplay Component has happened yet
    const [resizeComplete, setResizeComplete] = useState(false);


    // This function loads a Pixi.js Spine object from the provided atlas, PNG, and JSON files.
    // It uses the useCallback hook to memoize the function and prevent unnecessary re-renders.
    const loadPixiNFT = useCallback(async (spineAtlas, spinePng, spineJson) => {
        // If any of the required files are missing, the function returns early.
        if (!spineAtlas || !spinePng || !spineJson) {
            return;
        }

        // The function calls getTextureAtlas to load the texture atlas from the provided atlas and PNG files.
        const atlas = await getTextureAtlas(spineAtlas, spinePng);

        // The function then loads the Spine data from the provided JSON file, using the loaded texture atlas.
        const spineData = (await PIXI.Assets.load({ src: spineJson, data: { spineAtlas: atlas } })).spineData;

        // Finally, the function creates a new Pixi.js Spine object from the loaded Spine data and returns it.
        const spine = new PIXISPINE.Spine(spineData);
        return spine;
    }, []);


    const onResizeComplete = useCallback(() => {
        setResizeComplete(true);
    }, [])

    /**
     * this useEffect hook is responsible for parsing the NFT data whenever the assetlayerNFTs prop or the expression prop changes. 
     * It parses the NFTs into different Maps for each type of data (Spine JSON, Spine atlas, Spine PNG, image expressions, and audio files), 
     * and updates the nftData state with these Maps. 
     * It also sets the resizeComplete state to false because the new spine files will be resized again by the SpineDisplay component.
     */
    useEffect(() => {
        // It first checks if assetlayerNFTs is an array, if it has at least one item, and if all items are not null.
        if (Array.isArray(assetlayerNFTs) && assetlayerNFTs.length > 0 && assetlayerNFTs.every((nft) => nft !== null)) {
            // If the check passes, it initializes new Maps for each type of data that will be parsed from the NFTs.
            const newSpineJsonMap = new Map();
            const newSpineAtlasMap = new Map();
            const newSpinePngMap = new Map();
            const newImageExpressionsMap = new Map();
            const newAudioFilesMap = new Map();
            const newVideoFilesMap = new Map();

            // It then loops over each NFT in assetlayerNFTs.
            assetlayerNFTs.forEach(nft => {
                // If the NFT is null, it skips to the next iteration.
                if (!nft) {
                    return;
                }
                // It parses the NFT receiving the values for the given expression.
                const { parsedJson, parsedAtlas, parsedPng, parsedImageExpression, parsedAudioExpression, parsedVideoExpression } = parseNFT(nft, expression);

                // It adds the parsed data to the corresponding Maps, using the NFT ID as the key.
                newSpineJsonMap.set(nft.nftId, parsedJson);
                newSpineAtlasMap.set(nft.nftId, parsedAtlas);
                newSpinePngMap.set(nft.nftId, parsedPng);
                newImageExpressionsMap.set(nft.nftId, parsedImageExpression);
                newAudioFilesMap.set(nft.nftId, parsedAudioExpression);
                newVideoFilesMap.set(nft.nftId, parsedVideoExpression);
            });

            // It updates the nftData state with the new Maps. Changing this will trigger further processing of the new AssetlayerNfts
            setNftData({
                spineJsonMap: newSpineJsonMap,
                spineAtlasMap: newSpineAtlasMap,
                spinePngMap: newSpinePngMap,
                imageExpressionsMap: newImageExpressionsMap,
                audioFilesMap: newAudioFilesMap,
                videoFilesMap: newVideoFilesMap,
            })

            // It sets the resizeComplete state to false, indicating that the component needs to be resized.
            setResizeComplete(false);
        }
    }, [assetlayerNFTs, expression]); 

    /**
     * This function is used to load a texture atlas from a given URL and image URL.
     * The callback function resolves the promise with the created TextureAtlas instance.
     * 
     * Arguments:
     * - url: The URL of the atlas data.
     * - imageUrl: The URL of the image texture.
     * 
     * Returns:
     * A promise that resolves with the created TextureAtlas instance.
     */
    async function getTextureAtlas(url, imageUrl) {
        // Check if the URLs are valid.
        if (!url || url === '' || !imageUrl || imageUrl === '') {
            return;
        }
        // Fetch the raw atlas data from the URL.
        const rawAtlas = (await axios.get(url)).data;

        // Return a new promise that resolves with the created TextureAtlas instance.
        return new Promise((res, rej) => {
            // Define the texture loader function.
            const textureLoader = (path, loaderFunction) => {
                // Load the texture from the image URL and pass it to the loader function provided by TextureAtlas.
                PIXI.Assets.load(imageUrl).then((texLoaded) => {
                    loaderFunction(texLoaded);
                    return texLoaded;
                })
            };

            // Define the callback function.
            const atlasLoadedCallback = (createdAtlas) => {
                // Resolve the promise with the created TextureAtlas instance.
                res(createdAtlas);
            };

            // Create a new TextureAtlas instance with the raw atlas data, the texture loader function, and the callback function.
            new TextureAtlas(rawAtlas, textureLoader, atlasLoadedCallback);
        });
    }

    /**
         * This useEffect hook is responsible for loading the Spine objects for each NFT and storing them in the nftSpines state. 
         * It also handles the case where the necessary data for creating the Spine objects is not available, in which case it calls the onSpineLoaded callback with null.
         */
    useEffect(() => {
        if (!assetlayerNFTsRef.current) {
            return;
        }

        // Function to load the Spine objects for each NFT.
        async function loadPixiNfts() {
            // create array that the created spines will be added to
            const newSpines = [];

            // iterate over all nfts, load the spines for them and add them to newSpines
            for (const nft of assetlayerNFTsRef.current) {
                if (!nft?.nftId) {
                    continue;
                }
                const { nftId } = nft;

                // get the needed spine files for the correct spine from the nftData
                const spineAtlas = nftData.spineAtlasMap.get(nftId);
                const spinePng = nftData.spinePngMap.get(nftId);
                const spineJson = nftData.spineJsonMap.get(nftId);

                // If all necessary data is available, load the Spine object and add it to the newSpines array.
                if (spineAtlas && spinePng && spineJson) {
                    newSpines.push((await loadPixiNFT(spineAtlas, spinePng, spineJson)));
                }
            }
            // Update the nftSpines state with the new Spine objects and the current NFTs.
            // updating the nftSpines will trigger the further handling in other useEffects
            setNftSpines({ assetlayerNFTs: assetlayerNFTsRef.current, spines: newSpines });
        }

        // If all necessary data maps in the nftData state have at least one entry, load the Spine objects.
        // Otherwise, call the onSpineLoaded callback with null.
        if (nftData?.spinePngMap.size > 0 && nftData?.spineAtlasMap.size > 0 && nftData?.spineJsonMap.size > 0) {
            loadPixiNfts();
        } else {
            if (onSpineLoadedRef.current) {
                onSpineLoadedRef.current(null);
            }
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [nftData, loadPixiNFT]);



    /**
     * This useEffect hook is responsible for loading the audio files for each NFT and storing them in the audioFilesArray state. 
     * It also sets the background images for the sound expressions and calls the onAudioLoaded callback for each loaded audio file.
     */
    useEffect(() => {
        // If there are audio files in the nftData state
        if (nftData.audioFilesMap.size > 0) {
            // Convert the audioFilesMap to an array and store it in the audioFilesArray state. (to .map them in the jsx part)
            setAudioFilesArray(Array.from(nftData?.audioFilesMap));

            // Get the background images (Menu View Expressions) for the sound expressions.
            const backgroundImages = getExpressionValuesForAllNFTs(assetlayerNFTsRef.current, 'Menu View', 'Image');

            // Store the background images in the backgroundImages state.
            setBackgroundImages(backgroundImages);

            if (onAudioLoadedRef.current) {
                // For each audio file in the audioFilesMap...
                nftData.audioFilesMap.forEach((audioFile, nftId) => {
                    // Call the onAudioLoaded callback with the audio file and the NFT ID.
                    onAudioLoadedRef.current(audioFile, nftId);
                });
            }
        }
    // ESLint doesn't know that assetlayerNFTsRef and onAudioLoadedRef are ref objects.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [nftData?.audioFilesMap]);

    /**
     * This useEffect hook is responsible for loading the video files for each NFT and storing them in the videoFilesArray state. 
     */
    useEffect(() => {
        // If there are video files in the nftData state
        if (nftData.videoFilesMap.size > 0) {
            // Convert the videoFilesMap to an array and store it in the videoFilesArray state. (to .map them in the jsx part)
            setVideoExpressionsArray(Array.from(nftData?.videoFilesMap));

            if (onVideoLoadedRef.current) {
                // For each video file in the videoFilesMap...
                nftData.videoFilesMap.forEach((videoFile, nftId) => {
                    // Call the onVideoLoaded callback with the audio file and the NFT ID.
                    onVideoLoadedRef.current(videoFile, nftId);
                });
            }
        }
    // ESLint doesn't know that assetlayerNFTsRef and onVideoLoadedRef are ref objects.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [nftData?.videoFilesMap]);


    /**
     * This useEffect hook is responsible for updating the imageExpressionsArray state whenever the nftData state changes (and that is changed if you change the assetlayerNFTs)
     * It converts the imageExpressionsMap from the nftData state to an array and stores it in the imageExpressionsArray state.
     * The array is used to later map it out in the JSX part
     */
    useEffect(() => {
        // Convert the imageExpressionsMap to an array and store it in the imageExpressionsArray state.
        // If the imageExpressionsMap is not defined, an empty array is used instead.
        setImageExpressionsArray(Array.from(nftData?.imageExpressionsMap || []));
    }, [nftData]);

    
    /**
     * This useEffect hook is responsible for calling the onSpineLoaded callback for each loaded Spine object once the resizing is complete.
     * It also resets the resizeComplete state to false after all callbacks have been called.
     */
    useEffect(() => {
        // This should only run once if assetlayerNFTs change, and once all spines are correctly loaded and resized
        if (resizeComplete && Array.isArray(nftSpines.spines) && nftSpines.spines.length > 0 && nftSpines.spines.length === nftSpines.assetlayerNFTs.length && onSpineLoadedRef.current) {
            // Loop over each spine in the spines array.
            nftSpines.spines.forEach((spine, index) => {
                // Get the NFT ID for the current spine.
                const nftId = nftSpines.assetlayerNFTs[index]?.nftId;
                // Call the onSpineLoaded callback with the current spine and NFT ID.
                onSpineLoadedRef.current(spine, nftId);
            });
            // Reset the resizeComplete state to false.
            setResizeComplete(false);
        }
    // ESLint doesn't know that onSpineLoaded is a ref object.
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
                {videoExpressionsArray.map(([nftId, videoSrc]) => {
                    return (
                        videoSrc && 
                            <VideoDisplay 
                                key={`audio-display-${nftId}`} 
                                url='https://asset-api-files-bucket.s3.amazonaws.com/3a1b20b0-95a3-4477-bdd0-297a311dbfaf.mp4' 
                            />
                    );
                })}
          
            </Box>
        </>
    );
}

// Helper Functions

/**
 * This function retrieves the value of a specific expression attribute from an array of expression values.
 * 
 * Arguments:
 * - expressionValues: An array of expression values.
 * - expressionName: The name of the expression to find.
 * - expressionAttributeName: The name of the attribute to find.
 * 
 * Returns: The value of the expression attribute, or undefined if not found.
 */
export function getExpressionValue(expressionValues, expressionName, expressionAttributeName) {
    const expressionValue = expressionValues?.find((expressionVal) => expressionVal?.expression?.expressionName === expressionName && expressionVal?.expressionAttribute?.expressionAttributeName === expressionAttributeName)?.value
    return expressionValue;
}

/**
 * This function retrieves the values of a specific expression attribute for all NFTs in an array.
 * 
 * Arguments:
 * - nftArray: An array of NFTs.
 * - expressionName: The name of the expression to find.
 * - expressionAttributeName: The name of the attribute to find.
 * 
 * Returns: A map where the keys are the NFT IDs and the values are the expression attribute values.
 */
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
 * This function parses an NFT and retrieves the values of specific expression attributes.
 * 
 * Arguments:
 * - nft: The NFT to parse.
 * - expression: The expression to parse.
 * 
 * Returns: An object containing the parsed JSON, Atlas, PNG, Image, and Audio expression values.
 */
export function parseNFT(nft, expression) {
    if (!nft) {
        return { parsedJson: null, parsedAtlas: null, parsedPng: null, parsedImageExpression: null, parsedAudioExpression: null, parsedVideoExpression: null }
    }
    const expressionValues = nft.expressionValues || [];

    const parsedJson = getExpressionValue(expressionValues, expression, "JSON");
    const parsedAtlas = getExpressionValue(expressionValues, expression, "Atlas");
    const parsedPng = getExpressionValue(expressionValues, expression, "PNG");
    const parsedImageExpression = getExpressionValue(expressionValues, expression, "Image");
    const parsedAudioExpression = getExpressionValue(expressionValues, expression, "Audio");
    const parsedVideoExpression = getExpressionValue(expressionValues, expression, "Video");

    return {
        parsedJson: parsedJson || null,
        parsedAtlas: parsedAtlas || null,
        parsedPng: parsedPng || null,
        parsedImageExpression: parsedImageExpression || null,
        parsedAudioExpression: parsedAudioExpression || null,
        parsedVideoExpression: parsedVideoExpression || null,
    };
}

/**
 * This function sets a new image for a specific slot in a Spine object.
 * 
 * Arguments:
 * - spine: The Spine object.
 * - slotName: The name of the slot.
 * - texture: The new texture to set.
 */
export function setNewSlotImage(spine, slotName, texture) {
    if (!texture) {
        spine.hackTextureBySlotName(slotName, PIXI.Texture.EMPTY);
        return;
    }
    if (texture.baseTexture) {
        spine.hackTextureBySlotName(slotName, texture);
    } else {
        const baseTex = new PIXI.BaseTexture(texture);
        const tex = new PIXI.Texture(baseTex);
        spine.hackTextureBySlotName(slotName, tex);
    }
}

/**
 * This function retrieves the size of a specific slot in a Spine object.
 * 
 * Arguments:
 * - spine: The Spine object.
 * - slotName: The name of the slot.
 * 
 * Returns:
 * An object containing the width and height of the slot.
 */
export function getSlotSize(spine, slotName) {
    const slot = spine.slotContainers[spine.skeleton.findSlotIndex(slotName)];
    const attachment = slot.children[0].attachment;
    return { width: attachment.width, height: attachment.height };
}

/**
 * This function plays a specific animation in a Spine object.
 * 
 * Arguments:
 * - animationName: The name of the animation to play.
 * - spine: The Spine object.
 * - looped: Whether the animation should loop or not.
 */
export function playAnimation(animationName, spine, looped = true) {
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
 * This function plays a sequence of animations in a Spine object.
 * 
 * Arguments:
 * - animationSequence: An array of animation names.
 * - spine: The Spine object.
 * - onStartCallbacks: An array of callbacks to be called at the start of each animation.
 * - onEndCallbacks: An array of callbacks to be called at the end of each animation.
 * - loopLastAnimation: Whether the last animation should loop or not.
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
    animationSequence.forEach((animationName, index) => {
        const loop = loopLastAnimation && index === animationSequence.length - 1;

        if (spine.state?.hasAnimation(animationName)) {
            const trackEntry = index === 0 ? spine.state.setAnimation(0, animationName, loop) : spine.state.addAnimation(0, animationName, loop, 0);

            if (onEndCallbacks[index]) {
                trackEntry.listener = {
                    end: () => { if (onEndCallbacks[index]) onEndCallbacks[index]() },
                    start: () => {
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

/**
 * This function draws a Spine object to a canvas.
 * 
 * Arguments:
 * - ctx: The 2D rendering context for the drawing surface of a canvas.
 * - spine: The Spine object.
 * - app: The PIXI application.
 * - resizeCanvas: Whether to resize the canvas to fit the Spine object.
 */
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
 * This function extracts the names of all animations in a Spine object.
 * 
 * Arguments:
 * - spine: The Spine object.
 * 
 * Returns:
 * An array of animation names.
 */
export function parseAnimations(spine) {
    try {
        const spineData = spine.spineData;
        const parsedAnimations = [];
        spineData.animations.forEach((animation) => {
            parsedAnimations.push(animation.name);
        })
        return parsedAnimations;
    } catch (e) {
        console.log('animation parsing error: ', + e.message)
        return [];
    }

}

