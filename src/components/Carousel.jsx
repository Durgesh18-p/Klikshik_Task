/* eslint-disable react/prop-types */
import { useState } from "react";
import {
  Box,
  Grid,
  ImageList,
  ImageListItem,
  Button,
  IconButton,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

const Carousel = ({ images }) => {
  const [selectedIndex, setSelectedIndex] = useState(0);

  if (images.length === 0) {
    return <div>No images uploaded yet.</div>;
  }

  const handleNext = () => {
    setSelectedIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const handlePrev = () => {
    setSelectedIndex(
      (prevIndex) => (prevIndex - 1 + images.length) % images.length
    );
  };

  return (
    <Box>
      <Grid container justifyContent="center" alignItems="center">
        <IconButton onClick={handlePrev} color="primary">
          <ArrowBackIcon />
        </IconButton>
        <img
          src={images[selectedIndex].url}
          alt={images[selectedIndex].name}
          style={{ maxHeight: "350px", maxWidth: "100%", objectFit: "contain" }}
        />
        <IconButton onClick={handleNext} color="primary">
          <ArrowForwardIcon />
        </IconButton>
      </Grid>
      <ImageList
        cols={Math.min(5, images.length)} // Limit to 5 columns or less if fewer images
        rowHeight={100}
        sx={{ mt: 2, display: "flex", justifyContent: "center" }}
      >
        {images.map((image, index) => (
          <ImageListItem key={image.url} sx={{ maxWidth: 100 }}>
            <Button onClick={() => setSelectedIndex(index)}>
              <img
                src={image.url}
                alt={image.name}
                style={{
                  cursor: "pointer",
                  width: "100%",
                  height: "auto",
                  border:
                    selectedIndex === index ? "2px solid #1976d2" : "none",
                }}
              />
            </Button>
          </ImageListItem>
        ))}
      </ImageList>
    </Box>
  );
};

export default Carousel;
