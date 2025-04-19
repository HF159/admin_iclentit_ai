#!/bin/bash

# Create project directory
mkdir -p ai-admin-panel
cd ai-admin-panel

# Create public directory
mkdir -p public
touch public/index.html
touch public/favicon.ico

# Create src directory and its subdirectories
mkdir -p src/assets
mkdir -p src/components/common
mkdir -p src/components/layout
mkdir -p src/components/analytics
mkdir -p src/components/chat
mkdir -p src/components/feedback
mkdir -p src/components/settings
mkdir -p src/context
mkdir -p src/hooks
mkdir -p src/pages/Login
mkdir -p src/pages/Dashboard
mkdir -p src/pages/ChatHistory
mkdir -p src/pages/Feedback
mkdir -p src/pages/Settings
mkdir -p src/services
mkdir -p src/styles
mkdir -p src/utils

# Create base files
touch src/App.js
touch src/index.js
touch .gitignore
touch package.json
touch README.md

# Create component files
touch src/components/common/Button.js
touch src/components/layout/Sidebar.js
touch src/components/layout/Header.js

# Create context files
touch src/context/AuthContext.js

# Create hook files
touch src/hooks/useApiData.js

# Create page files
touch src/pages/Login/Login.js
touch src/pages/Dashboard/Dashboard.js
touch src/pages/ChatHistory/ChatHistory.js
touch src/pages/Feedback/Feedback.js
touch src/pages/Settings/Settings.js

# Create service files
touch src/services/apiClient.js
touch src/services/auth.js

# Create style files
touch src/styles/global.css

echo "Project structure has been created successfully!"