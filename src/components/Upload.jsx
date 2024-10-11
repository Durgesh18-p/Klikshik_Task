/* eslint-disable react/prop-types */
import { useState, useRef } from "react";
import {
  Box,
  Button,
  LinearProgress,
  Typography,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";

const Upload = ({ onUpload }) => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploadProgress, setUploadProgress] = useState({});
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [error, setError] = useState("");
  const [pausedFiles, setPausedFiles] = useState(new Set());
  const [isUploading, setIsUploading] = useState(false);

  const validFileTypes = ["image/png", "image/jpeg", "image/jpg"];
  const chunkSize = 1024 * 1024;
  const fileReaders = useRef({});

  const handleFileSelect = (event) => {
    const files = Array.from(event.target.files);
    const validFiles = files.filter((file) =>
      validFileTypes.includes(file.type)
    );

    if (validFiles.length !== files.length) {
      setError("Some files were not valid images (PNG, JPG, JPEG)");
    } else {
      setError("");
    }

    setSelectedFiles(validFiles);
  };

  const uploadFile = (file, start = 0) => {
    const reader = new FileReader();
    fileReaders.current[file.name] = reader;

    const chunk = file.slice(start, start + chunkSize);

    const totalUploadTime = 5000;
    const chunkDuration = totalUploadTime / Math.ceil(file.size / chunkSize);

    setTimeout(() => {
      reader.onloadstart = () => {
        setUploadProgress((prev) => ({
          ...prev,
          [file.name]: { progress: (start / file.size) * 100, paused: false },
        }));
      };

      reader.onprogress = (e) => {
        if (e.lengthComputable) {
          const progress = Math.round(((start + e.loaded) / file.size) * 100);
          setUploadProgress((prev) => ({
            ...prev,
            [file.name]: { progress, paused: false },
          }));
        }
      };

      reader.onloadend = () => {
        if (!pausedFiles.has(file.name)) {
          const newStart = start + chunkSize;
          if (newStart < file.size) {
            uploadFile(file, newStart);
          } else {
            const uploadedImageUrl = URL.createObjectURL(file);
            setUploadedFiles((prevFiles) => [
              ...prevFiles,
              { name: file.name, url: uploadedImageUrl },
            ]);
            onUpload([{ name: file.name, url: uploadedImageUrl }]);
            setIsUploading(false);
          }
        }
      };

      reader.readAsDataURL(chunk);
    }, chunkDuration);
  };

  const handleUpload = () => {
    setIsUploading(true);
    selectedFiles.forEach((file) => {
      if (!pausedFiles.has(file.name)) {
        uploadFile(file);
      }
    });
  };

  const handlePause = (fileName) => {
    pausedFiles.add(fileName);
    setPausedFiles(new Set(pausedFiles));
    if (fileReaders.current[fileName]) {
      fileReaders.current[fileName].abort();
    }
  };

  const handleResume = (fileName) => {
    pausedFiles.delete(fileName);
    setPausedFiles(new Set(pausedFiles));
    const progress = uploadProgress[fileName]?.progress || 0;
    const start = Math.round(
      (progress / 100) *
        selectedFiles.find((file) => file.name === fileName).size
    );
    uploadFile(
      selectedFiles.find((file) => file.name === fileName),
      start
    );
  };

  return (
    <Box>
      <input
        accept="image/*"
        style={{ display: "none" }}
        id="file-input"
        type="file"
        multiple
        onChange={handleFileSelect}
      />
      <label htmlFor="file-input">
        <Button
          variant="contained"
          component="span"
          sx={{
            bgcolor: "#ffc107",
            color: "#0f0f0f",
            borderRadius: "50px",
            mt: 2,
            mr: 2,
          }}
          disabled={isUploading}
        >
          Select Files
        </Button>
      </label>

      {error && (
        <Typography variant="body2" color="error" sx={{ mt: 2 }}>
          {error}
        </Typography>
      )}

      <Button
        variant="contained"
        onClick={handleUpload}
        disabled={selectedFiles.length === 0 || error !== "" || isUploading}
        sx={{
          bgcolor: "#ffc107",
          color: "#0f0f0f",
          borderRadius: "50px",
          mt: 2,
        }}
      >
        Upload
      </Button>

      <List sx={{ mt: 4 }}>
        {selectedFiles.map((file) => (
          <ListItem key={file.name}>
            <ListItemText primary={file.name} />
            <LinearProgress
              variant="determinate"
              value={uploadProgress[file.name]?.progress || 0}
              sx={{ width: "50%", mr: 2 }}
            />

            <Button
              onClick={() => handlePause(file.name)}
              sx={{ mr: 1 }}
              disabled={
                uploadProgress[file.name]?.progress === 100 ||
                pausedFiles.has(file.name)
              }
            >
              Pause
            </Button>
            <Button
              onClick={() => handleResume(file.name)}
              disabled={
                !pausedFiles.has(file.name) ||
                uploadProgress[file.name]?.progress === 100
              }
            >
              Resume
            </Button>
          </ListItem>
        ))}
      </List>

      <Typography variant="h6" sx={{ mt: 4, color: "#001b33" }}>
        Uploaded Files
      </Typography>
      <List>
        {uploadedFiles.map((file) => (
          <ListItem
            key={`${file.name}-${file.url}`}
            sx={{ bgcolor: "#f3f2f1", borderRadius: "8px", mb: 2 }}
          >
            <img
              src={file.url}
              alt={file.name}
              style={{
                width: "100px",
                height: "100px",
                marginRight: "10px",
                borderRadius: "8px",
              }}
            />
            <ListItemText primary={file.name} sx={{ color: "#0f0f0f" }} />
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default Upload;
