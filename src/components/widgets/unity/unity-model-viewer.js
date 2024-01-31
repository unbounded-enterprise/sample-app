import { useEffect, useState, useRef } from 'react';
import { rk } from '../../../utils/random-key';

const isLocal = (typeof window !== 'undefined') && window.location.host === "localhost:3000";

function forcedMouseReleaseOnExit(event) {
  const iframe = event.target;
  const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;

  const releaseEvent = iframeDoc.createEvent('MouseEvents');
  releaseEvent.initMouseEvent('mouseup', true, true, window,
    1, event.screenX, event.screenY, event.clientX, event.clientY,
    false, false, false, false, 0, null);
  iframeDoc.body.dispatchEvent(releaseEvent);
}

function sendToIFrame(iframe, data) {
  if (iframe && iframe.contentWindow) {
    iframe.contentWindow.postMessage(data, "*");
  }
}

export const UnityModelViewer = ({ src, unityBackground }) => {
  const [instanceId, ] = useState(rk());
  const [iframeId, ] = useState("unity-webgl-model-viewer-iframe-" + instanceId);
  const [iframeUrl, ] = useState("unity/Viewer/index.html"/*?instanceId=" + instanceId*/);
  const isInitialMount = useRef(true);

  useEffect(() => {
    if (isLocal && isInitialMount.current) {
      isInitialMount.current = false;
    } 
    else {
      const iframe = document.getElementById(iframeId);

      function handleUnityMessage(event) {
        if (typeof event.data === 'object') {
          switch (event.data.type) {
            case "unity-webgl-model-viewer-loaded": {
              sendToIFrame(iframe, { type: "InitializeUnityModelViewer", src, background: unityBackground });
              break;
            }
          }
        }
      }

      iframe.addEventListener("mouseleave", forcedMouseReleaseOnExit);
      iframe.contentWindow.addEventListener("message", handleUnityMessage);

      return () => {
        iframe.removeEventListener("mouseleave", forcedMouseReleaseOnExit);
        iframe.contentWindow.removeEventListener("message", handleUnityMessage);
      };
    }
  }, []);

  return (
    <iframe
      id={iframeId}
      src={iframeUrl}
      style={{
        position: "relative",
        dispaly: "flex",
        top: 0,
        left: 0,
        zIndex: 999,
        width: "100%",
        height: "100%",
        border: "none",
      }}
      title="Unity WebGL Model Viewer"
      allowFullScreen
    />
  );
}