# File Storage System

A simple file storage and retrieval system built with AWS integration. Supports uploading, listing, and downloading files.

> 🚀 **Deployed URL (For Testing Only)**:  
> [https://file-storage-system-seven.vercel.app/](https://file-storage-system-seven.vercel.app/)  
> ⚠️ *Use this only for testing purposes. Hosted on AWS – usage may incur charges.*

---

## 🛠️ Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/Samanvith20/File-Storage-System.git
   cd File-Storage-System
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create a `.env` file**
   Copy the `.env.example` and update with your AWS credentials.

4. **Run the app locally**
   ```bash
   npm start
   ```

---

## 📄 API Documentation

### Upload File  
`POST /api/files/upload`  
**Description**: Uploads a file to S3  
**Body**: `multipart/form-data` with field `file`  
**Response**:
```json
{
  "message": "File uploaded successfully",
  "fileUrl": "https://bucket.s3.amazonaws.com/filename"
}
```

---

### List Files  
`GET /api/files/get-files`  
**Description**: Lists all uploaded files  
**Response**:
```json
[
  "filename1.txt",
  "filename2.png"
]
```

---

### Delete File  
`DELETE /api/files/delete-file/[fileId]`  
**Description**: Deletes the specified file  

---

## 🔐 Auth API Documentation

### Register  
`POST /api/auth/register`  
**Description**: Register a new user  
**Body**:
```json
{
  "username": "user1",
  "password": "securePassword"
}
```

---

### Login  
`POST /api/auth/login`  
**Description**: Log in and receive access and refresh tokens  
**Body**:
```json
{
  "username": "user1",
  "password": "securePassword"
}
```

**Response**:
```json
{
  "accessToken": "JWT_ACCESS_TOKEN",
  "refreshToken": "JWT_REFRESH_TOKEN"
}
```

---

### Refresh Token  
`POST /api/auth/refresh`  
**Description**: Get a new access token using the refresh token  
**Body**:
```json
{
  "refreshToken": "JWT_REFRESH_TOKEN"
}
```

**Response**:
```json
{
  "accessToken": "NEW_ACCESS_TOKEN"
}
```

---

### Validate Token  
`POST /api/auth/validate-token`  
**Description**: Validate a JWT access token  
**Body**:
```json
{
  "token": "JWT_ACCESS_TOKEN"
}
```

**Response**:
```json
{
  "valid": true
}
```

---

### Logout  
`POST /api/auth/logout`  
**Description**: Logout user and invalidate refresh token  
**Body**:
```json
{
  "refreshToken": "JWT_REFRESH_TOKEN"
}
```

**Response**:
```json
{
  "message": "User logged out successfully"
}
```

---

## 📦 .env.example

```env
ACCESS_SECRET=
REFRESH_SECRET=
ACCESS_TOKEN_EXPIRY=
REFRESH_TOKEN_EXPIRY=

MONGODB_URI=
MY_AWS_ACCESS_KEY=
MY_AWS_S3_SECRET_KEY=
MY_AWS_REGION= 
MY_BUCKET_NAME=
```

---

## ✅ Notes

- Make sure your AWS S3 bucket is public or has appropriate CORS policies set.
- Don't share or expose your AWS credentials.
- Deployed version is for limited usage and testing only – AWS charges apply.
