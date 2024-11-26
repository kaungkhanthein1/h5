# H5 Frontend Deployment Document

## Node Version: 20.9.0 LTS
## 1. Project Link
[https://github.com/dfios/dyls-h5-frontend](https://github.com/dfios/dyls-h5-frontend)

## 2. Deployment Branch (Production Branch)
**Branch:** `develop`

## 3. Configure Environment File
Ensure the following environment variables are set in the `.env` file:

```env
REACT_APP_API_URL=""
REACT_APP_PUBLIC_KEY=""
REACT_APP_SIGN_KEY=""
REACT_APP_AES_KEY=""
REACT_APP_AES_IV=""

# Notes:
# REACT_APP_API_URL is a combination of the server address, port, and API version (api/v1). 
# Example: REACT_APP_API_URL="https://cc3e497d.qdhgtch.com:2345/api/v1"

# Deployment Script:
# Run the following commands to deploy:
# npm install
# npm run build
