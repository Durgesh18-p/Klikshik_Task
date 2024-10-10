import { useState } from "react";
import { Box, Container, Typography } from "@mui/material";
import Carousel from "./components/Carousel";
import Upload from "./components/Upload";

function App() {
  const [uploadedImages, setUploadedImages] = useState([]);

  const handleImageUpload = (newImages) => {
    setUploadedImages((prevImages) => [...prevImages, ...newImages]);
  };

  return (
    <Container>
      <Box textAlign="center" my={4} mx={4}>
        <Typography variant="h4" sx={{ mb: 2 }}>
          Image Carousel
        </Typography>
        <Carousel images={uploadedImages} />
      </Box>

      <Box textAlign="center" my={4} mx={4} sx={{ mb: 2 }}>
        <Typography variant="h4">Image Upload</Typography>
        <Upload onUpload={handleImageUpload} />
      </Box>
    </Container>
  );
}

export default App;
