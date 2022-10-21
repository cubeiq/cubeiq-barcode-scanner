!function(){
/*!
 * @georapbox/capture-photo-element
 * A custom element that implements the MediaDevices.getUserMedia() method of the MediaDevices interface to capture a photo in the browser.
 *
 * @version v1.3.1
 * @author George Raptis <georapbox@gmail.com>
 * @homepage https://github.com/georapbox/capture-photo-element#readme
 * @repository git+https://github.com/georapbox/capture-photo-element.git
 * @license MIT
 */
const t=document.createElement("template");t.innerHTML='\n  <style>\n    :host {\n      all: initial;\n      display: block;\n      box-sizing: border-box;\n    }\n    :host *,\n    :host *::before,\n    :host *::after {\n      box-sizing: inherit;\n    }\n    :host video {\n      display: block;\n    }\n    :host #output:empty {\n      display: none;\n    }\n    [hidden] {\n      display: none !important;\n    }\n  </style>\n  <video part="video" playsinline></video>\n  <canvas hidden></canvas>\n  <div part="actions-container">\n    <slot name="capture-button">\n      <button part="capture-button" type="button"><slot name="capture-button-content">Capture photo</slot></button>\n    </slot>\n    <slot name="facing-mode-button"><button part="facing-mode-button" type="button"><slot name="facing-mode-button-content">Toggle facing mode</slot></button></slot>\n  </div>\n  <div part="output-container" id="output"></div>\n';class e extends HTMLElement{connectedCallback(){if(this._connected=!0,this._canvasElement=this.shadowRoot.querySelector("canvas"),this._outputElement=this.shadowRoot.getElementById("output"),this._videoElement=this.shadowRoot.querySelector("video"),this._videoElement&&this._videoElement.addEventListener("loadedmetadata",this._onVideoLoadedMetaData),this._captureButtonSlot=this.shadowRoot.querySelector('slot[name="capture-button"]'),this._captureButtonSlot&&this._captureButtonSlot.addEventListener("slotchange",this._onCaptureButtonSlotChange),this._captureButton=this._getCaptureButton(),this._captureButton&&this._captureButton.addEventListener("click",this._onCapturePhotoButtonClick),this._facingModeButtonSlot=this.shadowRoot.querySelector('slot[name="facing-mode-button"]'),this._facingModeButtonSlot&&this._facingModeButtonSlot.addEventListener("slotchange",this._onFacingModeButtonSlotChange),this._facingModeButton=this._getFacingModeButton(),this._facingModeButton&&(this._supportedConstraints.facingMode?this._facingModeButton.addEventListener("click",this._onFacingModeButtonClick):this._facingModeButton.hidden=!0),this._upgradeProperty("outputDisabled"),this._upgradeProperty("facingMode"),this._upgradeProperty("cameraResolution"),this._upgradeProperty("zoom"),!e.isSupported())return this.dispatchEvent(new CustomEvent("capture-photo:error",{bubbles:!0,composed:!0,detail:{error:{name:"NotSupportedError",message:"Not supported"}}}));this._requestGetUserMedia()}disconnectedCallback(){this._stopVideoStreaming(),this._facingModeButton&&this._facingModeButton.removeEventListener("click",this._onFacingModeButtonClick),this._captureButton&&this._captureButton.removeEventListener("click",this._onCapturePhotoButtonClick),this._videoElement&&this._videoElement.removeEventListener("canplay",this._onVideoLoadedMetaData),this._captureButtonSlot&&this._captureButtonSlot.removeEventListener("slotchange",this._onCaptureButtonSlotChange),this._facingModeButtonSlot&&this._facingModeButtonSlot.removeEventListener("slotchange",this._onFacingModeButtonSlotChange)}attributeChangedCallback(t,e,o){this._connected&&("output-disabled"===t&&this._emptyOutputElement(),"facing-mode"===t&&this._supportedConstraints.facingMode&&e!==o&&(this._stopVideoStreaming(),this._requestGetUserMedia(),this.dispatchEvent(new CustomEvent("capture-photo:facing-mode-change",{bubbles:!0,composed:!0,detail:{facingMode:o}}))),"camera-resolution"===t&&e!==o&&(this._stopVideoStreaming(),this._requestGetUserMedia(),this.dispatchEvent(new CustomEvent("capture-photo:camera-resolution-change",{bubbles:!0,composed:!0,detail:{cameraResolution:o}}))),"zoom"===t&&e!==o&&(this._applyZoom(this.zoom),this.dispatchEvent(new CustomEvent("capture-photo:zoom-change",{bubbles:!0,composed:!0,detail:{zoom:this.zoom}}))))}static get observedAttributes(){return["output-disabled","facing-mode","camera-resolution","zoom"]}get outputDisabled(){return this.hasAttribute("output-disabled")}set outputDisabled(t){t?this.setAttribute("output-disabled",""):this.removeAttribute("output-disabled")}get facingMode(){return this.getAttribute("facing-mode")}set facingMode(t){this.setAttribute("facing-mode",t)}get cameraResolution(){return this.getAttribute("camera-resolution")}set cameraResolution(t){this.setAttribute("camera-resolution",t)}get zoom(){return Number(this.getAttribute("zoom"))||null}set zoom(t){const e=Number(t)||0;this.setAttribute("zoom",e>0?Math.floor(e):0)}get loading(){return this.hasAttribute("loading")}_stopVideoStreaming(){if(!this._videoElement||!this._stream)return;const[t]=this._stream.getVideoTracks();t&&t.stop(),this._videoElement.srcObject=null,this._stream=null}_requestGetUserMedia(){if(!e.isSupported())return;this.setAttribute("loading","");const t={video:{facingMode:{ideal:this.facingMode||"user"}},audio:!1};if("string"==typeof this.cameraResolution){const[e,o]=this.cameraResolution.split("x");t.video.width=e,t.video.height=o}navigator.mediaDevices.getUserMedia(t).then((t=>{this._videoElement.srcObject=t,this._stream=t,this._applyZoom(this.zoom)})).catch((t=>{this.dispatchEvent(new CustomEvent("capture-photo:error",{bubbles:!0,composed:!0,detail:{error:t}}))})).finally((()=>{this.removeAttribute("loading")}))}capture(){if(!this.loading)try{const t=this._canvasElement.getContext("2d"),e=this._videoElement.videoWidth,o=this._videoElement.videoHeight;this._canvasElement.width=e,this._canvasElement.height=o,t.drawImage(this._videoElement,0,0,e,o);const n=this._canvasElement.toDataURL("image/png");if("string"==typeof n&&n.includes("data:image")){if(!this.outputDisabled){const t=new Image;t.src=n,t.width=e,t.height=o,t.part="output-image",this._emptyOutputElement(),this._outputElement&&this._outputElement.appendChild(t)}this.dispatchEvent(new CustomEvent("capture-photo:success",{bubbles:!0,composed:!0,detail:{dataURI:n,width:e,height:o}}))}}catch(t){this.dispatchEvent(new CustomEvent("capture-photo:error",{bubbles:!0,composed:!0,detail:{error:t}}))}}_onFacingModeButtonClick(t){t.preventDefault(),this.loading||(this.facingMode="user"!==this.facingMode&&this.facingMode?"user":"environment")}_onCapturePhotoButtonClick(t){t.preventDefault(),this.capture()}_onVideoLoadedMetaData(t){const e=t.target;e.play().then((()=>{this.dispatchEvent(new CustomEvent("capture-photo:video-play",{bubbles:!0,composed:!0,detail:{video:e}}))})).catch((t=>{this.dispatchEvent(new CustomEvent("capture-photo:error",{bubbles:!0,composed:!0,detail:{error:t}}))})).finally((()=>{this.removeAttribute("loading")}))}_emptyOutputElement(){this._outputElement&&Array.from(this._outputElement.childNodes).forEach((t=>t.remove()))}_applyZoom(t){if(!this._stream||!t)return;const[e]=this._stream.getVideoTracks();if("function"!=typeof e.getCapabilities||"function"!=typeof e.getSettings)return;const o=e.getCapabilities();var n,i,a;"zoom"in e.getSettings()&&e.applyConstraints({advanced:[{zoom:(n=Number(t),i=o.zoom.min,a=o.zoom.max,Number.isNaN(i)&&(i=0),Number.isNaN(a)&&(a=0),Math.min(Math.max(n,Math.min(i,a)),Math.max(i,a)))}]})}_onCaptureButtonSlotChange(t){t.target&&"capture-button"===t.target.name&&(this._captureButton&&this._captureButton.removeEventListener("click",this._onCapturePhotoButtonClick),this._captureButton=this._getCaptureButton(),this._captureButton&&(this._captureButton.addEventListener("click",this._onCapturePhotoButtonClick),"BUTTON"===this._captureButton.nodeName||this._captureButton.hasAttribute("role")||this._captureButton.setAttribute("role","button")))}_onFacingModeButtonSlotChange(t){t.target&&"facing-mode-button"===t.target.name&&(this._facingModeButton&&this._facingModeButton.removeEventListener("click",this._onFacingModeButtonClick),this._facingModeButton=this._getFacingModeButton(),this._facingModeButton&&(this._facingModeButton.addEventListener("click",this._onFacingModeButtonClick),"BUTTON"===this._facingModeButton.nodeName||this._facingModeButton.hasAttribute("role")||this._facingModeButton.setAttribute("role","button")))}_getFacingModeButton(){return this._facingModeButtonSlot?this._facingModeButtonSlot.assignedElements({flatten:!0}).find((t=>"BUTTON"===t.nodeName||"facing-mode-button"===t.getAttribute("slot"))):null}_getCaptureButton(){return this._captureButtonSlot?this._captureButtonSlot.assignedElements({flatten:!0}).find((t=>"BUTTON"===t.nodeName||"capture-button"===t.getAttribute("slot"))):null}_upgradeProperty(t){if(Object.prototype.hasOwnProperty.call(this,t)){const e=this[t];delete this[t],this[t]=e}}static isSupported(){return Boolean(navigator.mediaDevices&&navigator.mediaDevices.getUserMedia)}static defineCustomElement(t="capture-photo"){"undefined"==typeof window||window.customElements.get(t)||window.customElements.define(t,e)}constructor(){super(),this._connected=!1,this._supportedConstraints=e.isSupported()?navigator.mediaDevices.getSupportedConstraints():{},this.shadowRoot||(this.attachShadow({mode:"open"}),this.shadowRoot.appendChild(t.content.cloneNode(!0))),this._onFacingModeButtonClick=this._onFacingModeButtonClick.bind(this),this._onCapturePhotoButtonClick=this._onCapturePhotoButtonClick.bind(this),this._onVideoLoadedMetaData=this._onVideoLoadedMetaData.bind(this),this._onCaptureButtonSlotChange=this._onCaptureButtonSlotChange.bind(this),this._onFacingModeButtonSlotChange=this._onFacingModeButtonSlotChange.bind(this)}}const o=document.getElementById("toastContainer"),n=t=>{const e=t.currentTarget;e.removeEventListener("click",n),o.removeChild(e.parentNode)},i=(t="",e="info")=>{["info","warning","danger"].includes(e)||(e="info");const i=`\n    ${t}\n    <button type="button" class="close" data-dismiss="alert" aria-label="Close">\n      <span aria-hidden="true">&times;</span>\n    </button>\n  `,a=document.createElement("div");a.className=`alert alert-${e} alert-dismissible text-break mb-2 fade`,a.innerHTML=i,a.querySelector("button").addEventListener("click",n),o.appendChild(a),setTimeout((()=>a.classList.add("show")),100)};!async function(){const t=["image/jpg","image/jpeg","image/png","image/apng","image/gif","image/webp","image/avif"],o=document.querySelector("capture-photo"),n=document.getElementById("cameraResults"),a=document.getElementById("fileResults"),s=document.querySelector(".scanning"),r=document.getElementById("scanBtn"),d=document.getElementById("scanMethod"),u=document.getElementById("fileInput"),c=document.getElementById("dropzone"),h=document.getElementById("cameraView"),l=document.getElementById("fileView");let p,m=!1,g=!0;if(!("BarcodeDetector"in window))return h.hidden=!0,l.hidden=!0,d.hidden=!0,void i("BarcodeDetector API is not supported by your browser.","danger");u.accept=t.join(","),document.addEventListener("capture-photo:error",(t=>{o.hidden=!0,d.querySelector('option[value="cameraView"]').remove(),d.querySelector('option[value="fileView"]').selected=!0,d.dispatchEvent(new Event("change"));const e=t.detail.error;if("NotFoundError"===e.name)return;const n="NotAllowedError"===e.name?"Permission to use webcam was denied. Reload the page to give appropriate permissions to webcam.":e.message;i(n,"danger")})),o.addEventListener("capture-photo:video-play",(()=>{m||h.hidden||(s.hidden=!1,g=!0,B()),m=!0})),e.defineCustomElement();const _=o.shadowRoot.querySelector("video"),v=new window.BarcodeDetector({formats:await window.BarcodeDetector.getSupportedFormats()});function b(t){t.querySelectorAll(".results__item").forEach((t=>t.remove()))}function f(t,e){if(!t)return;let o;try{new URL(t),o=document.createElement("a"),o.href=t,o.setAttribute("target","_blank"),o.setAttribute("rel","noreferrer noopener")}catch(t){o=document.createElement("span")}o.className="results__item",o.textContent=t,e.appendChild(o)}function E(t){return new Promise(((e,o)=>{v.detect(t).then((t=>{Array.isArray(t)&&t.length>0?e(t[0]):o({message:"Could not detect barcode from provided source."})})).catch((t=>{o(t)}))}))}async function B(){try{const t=await E(_);return window.cancelAnimationFrame(p),b(n),f(t.rawValue,n),s.hidden=!0,void(r.hidden=!1)}catch(t){}g&&(p=window.requestAnimationFrame(B))}function y(t){const e=new Image,o=new FileReader;o.addEventListener("load",(t=>{const o=t.target.result;e.addEventListener("load",(async()=>{try{const t=await E(e);b(a),f(t.rawValue,a)}catch(t){b(a),f("-",a)}})),e.src=o,c.querySelectorAll("img").forEach((t=>t.remove())),c.prepend(e)})),t&&o.readAsDataURL(t)}r.addEventListener("click",(()=>{s.hidden=!1,r.hidden=!0,b(n),B()})),d.addEventListener("change",(t=>{const e=t.target.value;[h,l].forEach((t=>{t.hidden=t.id!==e}))})),u.addEventListener("change",(t=>{y(t.target.files[0])})),c.addEventListener("dragover",(t=>{t.stopPropagation(),t.preventDefault(),t.dataTransfer.dropEffect="copy"})),c.addEventListener("drop",(e=>{e.stopPropagation(),e.preventDefault();const o=e.dataTransfer.files,[n]=o;n&&t.includes(n.type)&&(u.value=u.defaultValue,y(n))}))}()}();
//# sourceMappingURL=index.1e1b3971.js.map
