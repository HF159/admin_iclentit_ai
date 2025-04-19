// Add this script to your index.html to debug manifest issues
console.log('DEBUG: Application starting');
window.addEventListener('load', function() {
  console.log('DEBUG: Window loaded');
  console.log('DEBUG: Document readyState:', document.readyState);
  console.log('DEBUG: Root element:', document.getElementById('root'));
  
  // Check if manifest loaded
  const manifestLink = document.querySelector('link[rel="manifest"]');
  console.log('DEBUG: Manifest link found:', !!manifestLink);
  if (manifestLink) {
    console.log('DEBUG: Manifest href:', manifestLink.href);
    
    // Try to fetch the manifest
    fetch(manifestLink.href)
      .then(response => {
        console.log('DEBUG: Manifest fetch status:', response.status);
        return response.json();
      })
      .then(data => {
        console.log('DEBUG: Manifest content:', data);
      })
      .catch(error => {
        console.error('DEBUG: Error fetching manifest:', error);
      });
  }
});