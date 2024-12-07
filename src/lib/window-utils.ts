export const openLinkedInWindow = (searchUrl: string) => {
  const width = Math.floor(window.screen.width * 0.5);
  const height = Math.floor(window.screen.height * 0.8);
  
  const left = 0; // Position at the left edge
  const top = Math.floor((window.screen.height - height) / 2);

  const windowFeatures = `width=${width},height=${height},left=${left},top=${top},menubar=no,toolbar=no,location=yes,status=no`;
  
  window.open(searchUrl, 'linkedInWindow', windowFeatures);
};